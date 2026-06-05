// =====================================================================
// BLESS Lab Report System — main-firebase.js
// Flutter 앱과 동일한 기능: 탭·서브탭 전환, 보고서 CRUD,
// 피드백 CRUD, 전체 조회, 토스트 메시지
// =====================================================================

// ── 전역 상태 ──────────────────────────────────────────────────────
let students = [];
let currentStudentId = '';
let currentWeeklyStudentId = '';
let currentDailyReportId = '';
let currentWeeklyReportId = '';
let currentSubTab = 'daily';   // 'daily' | 'weekly'
let toastTimer = null;

// ── 날짜 유틸 ──────────────────────────────────────────────────────
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return { year: d.getUTCFullYear(), week: weekNo };
}

function getWeekRange(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${formatDate(monday)} ~ ${formatDate(sunday)}`;
}

// ── 토스트 메시지 ──────────────────────────────────────────────────
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast toast-${type} show`;

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// showMessage는 showToast의 별칭 (하위 호환)
function showMessage(text, type) {
    showToast(text, type === 'error' ? 'error' : 'success');
}

// ── 탭 전환 ──────────────────────────────────────────────────────
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-${tab}`);
    });

    // 캘린더 탭 진입 시 렌더링
    if (tab === 'calendar' && typeof renderCalendar === 'function') {
        renderCalendar();
    }
    // 시간표 탭 진입 시 렌더링
    if (tab === 'timetable' && typeof renderTimetable === 'function') {
        renderTimetable('');
    }
}

// ── 서브탭 전환 (일일 / 주간) ─────────────────────────────────────
function switchSubTab(subTab) {
    currentSubTab = subTab;

    document.getElementById('subtab-daily-btn').classList.toggle('active', subTab === 'daily');
    document.getElementById('subtab-weekly-btn').classList.toggle('active', subTab === 'weekly');
    document.getElementById('subtab-daily').classList.toggle('active', subTab === 'daily');
    document.getElementById('subtab-weekly').classList.toggle('active', subTab === 'weekly');
}

// ── onViewTypeChange (조회 유형 변경 시 날짜 필터 표시 여부) ─────
function onViewTypeChange() {
    const viewType = document.getElementById('view-type').value;
    const dateRow = document.getElementById('date-filter-row');
    if (dateRow) {
        dateRow.style.display = viewType === 'daily' ? '' : 'none';
    }
}

// ── 초기화 ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await initializeStudents();

    const today = formatDate(new Date());
    const ids = ['report-date', 'weekly-date', 'view-start-date', 'view-end-date'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = today;
    });

    await loadStudents();

    // 이름 선택 → 기존 보고서 자동 조회
    const studentSelect = document.getElementById('student-select');
    if (studentSelect) {
        studentSelect.addEventListener('change', (e) => {
            currentStudentId = e.target.value;
            const reportDate = document.getElementById('report-date').value;
            if (currentStudentId && reportDate) {
                const student = students.find(s => s.id === currentStudentId);
                if (student && typeof autoFillDailyReport !== 'undefined') {
                    autoFillDailyReport(student.name, reportDate);
                }
            }
        });
    }

    const weeklyStudentSelect = document.getElementById('weekly-student-select');
    if (weeklyStudentSelect) {
        weeklyStudentSelect.addEventListener('change', (e) => {
            currentWeeklyStudentId = e.target.value;
        });
    }

    // 날짜 변경 시 자동 채우기
    const reportDateEl = document.getElementById('report-date');
    if (reportDateEl) {
        reportDateEl.addEventListener('change', (e) => {
            if (currentStudentId) {
                const student = students.find(s => s.id === currentStudentId);
                if (student && typeof autoFillDailyReport !== 'undefined') {
                    autoFillDailyReport(student.name, e.target.value);
                }
            }
        });
    }

    // 주간 날짜 변경 시 주차 정보 갱신
    const weeklyDateEl = document.getElementById('weekly-date');
    if (weeklyDateEl) {
        weeklyDateEl.addEventListener('change', (e) => updateWeekInfo(e.target.value));
    }
    updateWeekInfo(today);
});

// ── 학생 목록 로드 ─────────────────────────────────────────────
async function loadStudents() {
    try {
        students = await getStudents();

        const selects = {
            'student-select': students,
            'weekly-student-select': students,
            'view-student-select': students,
            'member-filter': students
        };

        Object.entries(selects).forEach(([id, list]) => {
            const el = document.getElementById(id);
            if (!el) return;
            // 기존 옵션 유지 (첫 번째 "선택하세요" / "전체 보기" 등)
            const firstOption = el.options[0];
            el.innerHTML = '';
            if (firstOption) el.appendChild(firstOption);

            list.forEach(student => {
                const opt = document.createElement('option');
                opt.value = student.id;
                opt.textContent = student.name;
                el.appendChild(opt);
            });
        });

        // 시간표 멤버 필터 갱신 (timetable.js가 있을 경우)
        if (typeof renderTimetable === 'function') {
            // 딜레이 없이 호출 시 timetable 데이터가 없을 수 있으므로 defer
            setTimeout(() => renderTimetable(''), 100);
        }
    } catch (error) {
        console.error('학생 목록 로드 실패:', error);
        showToast('구성원 목록을 불러오지 못했습니다.', 'error');
    }
}

// ── 주차 정보 갱신 ────────────────────────────────────────────
function updateWeekInfo(dateStr) {
    if (!dateStr) return;
    const date = new Date(dateStr);
    const { year, week } = getWeekNumber(date);
    const range = getWeekRange(date);
    const el = document.getElementById('week-info');
    if (el) el.textContent = `${year}년 ${week}주차: ${range}`;
}

// ── 일일 보고서 저장 ──────────────────────────────────────────
async function saveDailyReportFromForm() {
    const studentId = document.getElementById('student-select').value;
    const reportDate = document.getElementById('report-date').value;
    let todayWork = document.getElementById('today-work').value.trim();
    const workHours = document.getElementById('work-hours').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!studentId || !reportDate) {
        showToast('이름과 날짜를 선택해주세요.', 'error');
        return;
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // 업무 내용 자동 채우기 (비어있을 때)
    if (!todayWork && typeof getClassesForDate !== 'undefined') {
        const classes = getClassesForDate(reportDate);
        let autoWork = '';
        classes.forEach(cls => {
            if (cls.isPaperDay) {
                if ((cls.presenters || []).includes(student.name)) {
                    autoWork += `• 09:00-18:00 Progress Meeting (Presenter)\n`;
                }
            } else if (cls.students && cls.students.includes(student.name)) {
                autoWork += `• ${cls.time} ${cls.name} (${cls.room})\n`;
            }
        });
        if (autoWork) {
            todayWork = '【수업】\n' + autoWork + '\n【연구 및 실험】\n(연구 내용을 입력하세요)';
        }
    }

    if (!todayWork || !workHours) {
        showToast('업무 내용과 소요 시간을 입력해주세요.', 'error');
        return;
    }

    try {
        const result = await saveDailyReport({
            student_id: studentId,
            student_name: student.name,
            report_date: reportDate,
            today_work: todayWork,
            work_hours: workHours,
            notes: notes
        });
        currentDailyReportId = result.id;
        showToast('보고서가 저장되었습니다.');
        clearDailyForm();
        await loadDailyFeedback(result.id);
        if (typeof renderCalendar === 'function') await renderCalendar();
    } catch (error) {
        console.error('보고서 저장 실패:', error);
        showToast('저장에 실패했습니다.', 'error');
    }
}

// ── 오늘 보고서 불러오기 ─────────────────────────────────────
async function loadTodayReport() {
    const studentId = document.getElementById('student-select').value;
    const reportDate = document.getElementById('report-date').value;

    if (!studentId || !reportDate) {
        showToast('이름과 날짜를 선택해주세요.', 'error');
        return;
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    try {
        const report = await getDailyReportById(studentId, reportDate);
        if (report) {
            currentDailyReportId = report.id;
            document.getElementById('today-work').value = report.today_work || '';
            document.getElementById('work-hours').value = report.work_hours || '';
            document.getElementById('notes').value = report.notes || '';
            showToast('보고서를 불러왔습니다.');
            await loadDailyFeedback(report.id);
        } else {
            if (typeof autoFillDailyReport !== 'undefined') {
                autoFillDailyReport(student.name, reportDate);
            } else {
                showToast('해당 날짜의 보고서가 없습니다.', 'error');
            }
        }
    } catch (error) {
        console.error('보고서 불러오기 실패:', error);
        showToast('보고서를 불러오지 못했습니다.', 'error');
    }
}

// ── 일일 보고서 자동 채우기 (시간표 연동) ─────────────────────
function autoFillDailyReport(studentName, dateStr) {
    if (typeof getClassesForDate === 'undefined') return;

    const classes = getClassesForDate(dateStr);
    let workDescription = '';
    let totalMinutes = 0;
    const studentClasses = [];
    let isPaperDay = false;

    classes.forEach(cls => {
        if (cls.isPaperDay) {
            if ((cls.presenters || []).includes(studentName)) {
                isPaperDay = true;
                studentClasses.push({ time: '', name: 'Progress Meeting', duration: 60 });
                totalMinutes += 60;
            }
        } else if (cls.students && cls.students.includes(studentName)) {
            studentClasses.push({ time: cls.time, name: `${cls.name} (${cls.room})`, duration: cls.duration });
            totalMinutes += cls.duration;
        }
    });

    if (isPaperDay) {
        workDescription = '【Progress Meeting】\n• \n\n【일일 업무】\n• \n• \n• ';
    } else if (studentClasses.length > 0) {
        workDescription = '【수업】\n';
        studentClasses.forEach(cls => {
            if (cls.time) workDescription += `• ${cls.time} ${cls.name}\n`;
        });
        workDescription += '\n【일일 업무】\n• \n• \n• ';
    } else {
        workDescription = '【일일 업무】\n• \n• \n• ';
    }

    document.getElementById('today-work').value = workDescription;

    const h = Math.floor(totalMinutes / 60);
    const min = totalMinutes % 60;
    const classTime = min > 0 ? `${h}h ${min}min` : `${h}h`;

    if (isPaperDay) {
        document.getElementById('work-hours').value = `${classTime} (진행 미팅) + ___ (일일 업무)`;
    } else if (totalMinutes > 0) {
        document.getElementById('work-hours').value = `${classTime} (수업) + ___ (일일 업무)`;
    } else {
        document.getElementById('work-hours').value = '___ (일일 업무)';
    }

    showToast(`수업 ${studentClasses.length}개 자동 입력됨. 업무 내용을 추가해주세요.`);
}

// ── 주간 보고서 저장 ──────────────────────────────────────────
async function saveWeeklySummaryFromForm() {
    const studentId = document.getElementById('weekly-student-select').value;
    const dateStr = document.getElementById('weekly-date').value;
    const summary = document.getElementById('weekly-summary').value.trim();

    if (!studentId || !dateStr || !summary) {
        showToast('이름, 날짜, 주간 업무 내용을 모두 입력해주세요.', 'error');
        return;
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const date = new Date(dateStr);
    const { year, week } = getWeekNumber(date);
    const weekRange = getWeekRange(date);

    try {
        const result = await saveWeeklySummary({
            student_id: studentId,
            student_name: student.name,
            year: year,
            week: week,
            week_range: weekRange,
            summary: summary,
            attachments: []
        });
        currentWeeklyReportId = result.id;
        showToast('주간 보고서가 저장되었습니다.');
        document.getElementById('weekly-summary').value = '';
        await loadWeeklyFeedback(result.id);
        if (typeof renderCalendar === 'function') await renderCalendar();
    } catch (error) {
        console.error('주간 보고서 저장 실패:', error);
        showToast('저장에 실패했습니다.', 'error');
    }
}

// ── 이번 주 보고서 불러오기 ───────────────────────────────────
async function loadThisWeekSummary() {
    const studentId = document.getElementById('weekly-student-select').value;
    const dateStr = document.getElementById('weekly-date').value;

    if (!studentId || !dateStr) {
        showToast('이름과 날짜를 선택해주세요.', 'error');
        return;
    }

    const date = new Date(dateStr);
    const { year, week } = getWeekNumber(date);

    try {
        const summary = await getWeeklySummaryById(studentId, year, week);
        if (summary) {
            currentWeeklyReportId = summary.id;
            document.getElementById('weekly-summary').value = summary.summary || '';
            showToast('주간 보고서를 불러왔습니다.');
            await loadWeeklyFeedback(summary.id);
        } else {
            showToast('해당 주차의 보고서가 없습니다.', 'error');
        }
    } catch (error) {
        console.error('주간 보고서 불러오기 실패:', error);
        showToast('보고서를 불러오지 못했습니다.', 'error');
    }
}

// ── 전체 조회 검색 ─────────────────────────────────────────────
async function searchReports() {
    const studentId = document.getElementById('view-student-select').value;
    const viewType = document.getElementById('view-type').value;
    const startDate = document.getElementById('view-start-date').value;
    const endDate = document.getElementById('view-end-date').value;

    const container = document.getElementById('results-container');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">⏳</div>
            <div class="empty-text">검색 중...</div>
        </div>`;

    try {
        if (viewType === 'daily') {
            await searchDailyReports(studentId, startDate, endDate, container);
        } else {
            await searchWeeklySummaries(studentId, container);
        }
    } catch (error) {
        console.error('검색 실패:', error);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <div class="empty-text">검색에 실패했습니다.</div>
            </div>`;
    }
}

// ── 일일 보고서 검색 결과 렌더링 ──────────────────────────────
async function searchDailyReports(studentId, startDate, endDate, container) {
    let reports = await getDailyReports(studentId, startDate, endDate);

    if (reports.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <div class="empty-text">조회 결과가 없습니다.</div>
            </div>`;
        return;
    }

    // 피드백 병렬 로드
    try {
        await Promise.all(reports.map(async (report) => {
            report.feedbacks = await getFeedbacksByReportId(report.id, 'daily').catch(() => []);
        }));
    } catch (e) { /* 피드백 로드 실패해도 보고서는 표시 */ }

    let html = '';
    reports.forEach(report => {
        const feedbacks = report.feedbacks || [];
        const nameInitial = getNameInitial(report.student_name);
        const avatarColor = getMemberColor(report.student_name);
        const safeId = report.id.replace(/['"/]/g, '');

        html += `
        <div class="result-card card daily-card">
            <div class="daily-card-top" onclick="toggleDailyBody('${safeId}')">
                <div class="weekly-avatar" style="background:${avatarColor}">${nameInitial}</div>
                <div class="weekly-info">
                    <div class="weekly-name">${escapeHtml(report.student_name)}</div>
                    <div class="weekly-week">${report.report_date}</div>
                </div>
                <div class="daily-hours">⏱ ${escapeHtml(report.work_hours || '-')}</div>
                <span class="weekly-toggle-icon" id="toggle-icon-${safeId}">▼</span>
            </div>
            <div class="weekly-body" id="weekly-body-${safeId}">
                <div class="result-section">
                    <div class="result-label">업무 내용</div>
                    <pre class="result-pre">${escapeHtml(report.today_work || '')}</pre>
                </div>
                ${report.notes ? `
                <div class="result-section">
                    <div class="result-label">비고</div>
                    <pre class="result-pre">${escapeHtml(report.notes)}</pre>
                </div>` : ''}
                ${renderFeedbackBlock(feedbacks, report.id, 'daily', report.student_name, report.report_date)}
            </div>
        </div>`;
    });

    container.innerHTML = html;

    // 첫 번째 카드 자동 펼치기
    if (reports.length > 0) {
        const firstId = reports[0].id.replace(/['"/]/g, '');
        toggleDailyBody(firstId);
    }
}

// 일일 카드 펼치기/접기
function toggleDailyBody(id) {
    const body = document.getElementById(`weekly-body-${id}`);
    const icon = document.getElementById(`toggle-icon-${id}`);
    if (!body) return;
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    if (icon) icon.textContent = isOpen ? '▼' : '▲';
}

// ── 주간 요약 검색 결과 렌더링 ────────────────────────────────
async function searchWeeklySummaries(studentId, container) {
    let summaries = await getWeeklySummaries(studentId);

    if (summaries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <div class="empty-text">조회 결과가 없습니다.</div>
            </div>`;
        return;
    }

    try {
        await Promise.all(summaries.map(async (s) => {
            s.feedbacks = await getFeedbacksByReportId(s.id, 'weekly').catch(() => []);
        }));
    } catch (e) { /* skip */ }

    // Flutter 앱과 동일한 카드형 레이아웃
    let html = '';
    summaries.forEach(summary => {
        const feedbacks = summary.feedbacks || [];
        const nameInitial = getNameInitial(summary.student_name);
        const avatarColor = getMemberColor(summary.student_name);
        const safeId = summary.id.replace(/['"/]/g, '');

        html += `
        <div class="result-card card weekly-card">
            <!-- 카드 헤더: 아바타 + 이름 + 주차/날짜 -->
            <div class="weekly-card-top" onclick="toggleWeeklyBody('${safeId}')">
                <div class="weekly-avatar" style="background:${avatarColor}">${nameInitial}</div>
                <div class="weekly-info">
                    <div class="weekly-name">${escapeHtml(summary.student_name)}</div>
                    <div class="weekly-week">${summary.year}년 제${summary.week}주</div>
                </div>
                <div class="weekly-range">
                    <div class="weekly-range-start">${(summary.week_range || '').split('~')[0] || ''}</div>
                    <div class="weekly-range-sep">~</div>
                    <div class="weekly-range-end">${(summary.week_range || '').split('~')[1] || ''}</div>
                </div>
                <span class="weekly-toggle-icon" id="toggle-icon-${safeId}">▼</span>
            </div>
            <!-- 펼쳐지는 본문 -->
            <div class="weekly-body" id="weekly-body-${safeId}">
                <div class="result-section">
                    <div class="result-label">주간 업무 요약</div>
                    <pre class="result-pre">${escapeHtml(summary.summary || '(내용 없음)')}</pre>
                </div>
                ${renderFeedbackBlock(feedbacks, summary.id, 'weekly', summary.student_name, `${summary.year}년 ${summary.week}주차`)}
            </div>
        </div>`;
    });

    container.innerHTML = html;

    // 첫 번째 카드 자동 펼치기
    if (summaries.length > 0) {
        const firstId = summaries[0].id.replace(/['"/]/g, '');
        toggleWeeklyBody(firstId);
    }
}

// 주간 카드 펼치기/접기
function toggleWeeklyBody(id) {
    const body = document.getElementById(`weekly-body-${id}`);
    const icon = document.getElementById(`toggle-icon-${id}`);
    if (!body) return;
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    if (icon) icon.textContent = isOpen ? '▼' : '▲';
}

// 멤버별 아바타 이니셜
function getNameInitial(name) {
    if (!name) return '?';
    // 한글 성씨 추출 (괄호 안 한글 우선)
    const korMatch = name.match(/[가-힣]/);
    if (korMatch) return korMatch[0];
    return name.trim()[0].toUpperCase();
}

// 멤버별 고정 색상 (Flutter 앱 MEMBER_COLORS와 동일)
const MEMBER_COLOR_MAP = {
    'Minkee Cho (조민기)': '#3498db',
    'Lee Hye-bin (이혜빈)': '#27ae60',
    'Yoo Sung-il (유성일)': '#e74c3c',
    'Kim Su-jin (김수진)': '#9b59b6',
    'Kim Dong-woo (김동우)': '#f39c12',
    'Song Da-ye (송다예)': '#1abc9c',
    'Kim Dong-jin (김동진)': '#e67e22',
    'Saqib': '#2980b9',
    'Jo Yu-kyung (조유경)': '#8e44ad'
};

function getMemberColor(name) {
    return MEMBER_COLOR_MAP[name] || '#95a5a6';
}

// ── 피드백 블록 HTML 생성 ─────────────────────────────────────
function renderFeedbackBlock(feedbacks, reportId, reportType, studentName, dateInfo) {
    const safeStudent = escapeHtml(studentName);
    const safeDate = escapeHtml(dateInfo);
    const safeId = reportId.replace(/['"]/g, '');

    let fbHtml = '';
    if (feedbacks.length > 0) {
        fbHtml = feedbacks.map(fb => {
            const safeFbId = (fb.id || '').replace(/['"]/g, '');
            return `
            <div class="feedback-item" id="fbi-${safeFbId}">
                <div class="feedback-item-header">
                    <span class="feedback-author">💬 ${escapeHtml(fb.feedback_by || '')}</span>
                    <span class="feedback-date">${escapeHtml(String(fb.feedback_date || ''))}</span>
                    <button class="btn-icon-del" onclick="deleteFeedbackItem('${safeFbId}', '${safeId}', '${reportType}')" title="삭제">✕</button>
                </div>
                <div class="feedback-content-text">${escapeHtml(fb.feedback_content || '')}</div>
            </div>`;
        }).join('');
    } else {
        fbHtml = `<div class="feedback-empty">아직 피드백이 없습니다.</div>`;
    }

    return `
    <div class="feedback-area" id="fb-area-${safeId}">
        <div class="feedback-header">
            <span class="feedback-icon">💬</span>
            <span class="feedback-title">교수님 피드백 (${feedbacks.length})</span>
            <button class="btn-feedback-toggle" onclick="toggleFeedbackForm('${safeId}', '${reportType}', '${safeStudent}', '${safeDate}')">
                + 피드백 작성
            </button>
        </div>
        <div class="feedback-list" id="fb-list-${safeId}">${fbHtml}</div>
        <div class="feedback-form" id="fb-form-${safeId}" style="display:none;">
            <input type="text" class="form-input feedback-author-input" id="fb-author-${safeId}"
                placeholder="작성자 이름" value="배효관 교수님">
            <textarea class="form-textarea feedback-text-input" id="fb-text-${safeId}"
                rows="3" placeholder="피드백 내용을 입력해주세요"></textarea>
            <div class="feedback-form-actions">
                <button class="btn btn-primary btn-sm" onclick="saveFeedbackItem('${safeId}', '${reportType}', '${safeStudent}')">저장</button>
                <button class="btn btn-secondary btn-sm" onclick="toggleFeedbackForm('${safeId}', '${reportType}', '${safeStudent}', '${safeDate}')">취소</button>
            </div>
        </div>
    </div>`;
}

// ── 피드백 폼 토글 ────────────────────────────────────────────
function toggleFeedbackForm(reportId, reportType, studentName, dateInfo) {
    const form = document.getElementById(`fb-form-${reportId}`);
    if (!form) return;
    const isVisible = form.style.display !== 'none';
    form.style.display = isVisible ? 'none' : 'block';
}

// ── 피드백 저장 ───────────────────────────────────────────────
async function saveFeedbackItem(reportId, reportType, studentName) {
    const authorEl = document.getElementById(`fb-author-${reportId}`);
    const textEl = document.getElementById(`fb-text-${reportId}`);

    if (!authorEl || !textEl) return;

    const author = authorEl.value.trim();
    const content = textEl.value.trim();

    if (!author || !content) {
        showToast('작성자와 피드백 내용을 입력해주세요.', 'error');
        return;
    }

    try {
        const student = students.find(s => s.name === studentName);
        const studentId = student ? student.id : '';

        await saveFeedback({
            report_id: reportId,
            report_type: reportType,
            student_id: studentId,
            student_name: studentName,
            feedback_content: content,
            feedback_by: author,
            feedback_date: formatDate(new Date()) + ' ' + new Date().toLocaleTimeString('ko-KR')
        });

        showToast('피드백이 저장되었습니다.');
        textEl.value = '';

        // 폼 숨기고 목록 갱신
        document.getElementById(`fb-form-${reportId}`).style.display = 'none';
        await refreshFeedbackList(reportId, reportType);
    } catch (error) {
        console.error('피드백 저장 실패:', error);
        showToast('피드백 저장에 실패했습니다.', 'error');
    }
}

// ── 피드백 삭제 ───────────────────────────────────────────────
async function deleteFeedbackItem(feedbackId, reportId, reportType) {
    if (!confirm('이 피드백을 삭제하시겠습니까?')) return;

    try {
        await db.collection('feedbacks').doc(feedbackId).delete();
        showToast('피드백이 삭제되었습니다.');
        await refreshFeedbackList(reportId, reportType);
    } catch (error) {
        console.error('피드백 삭제 실패:', error);
        showToast('삭제에 실패했습니다.', 'error');
    }
}

// ── 피드백 목록 갱신 ──────────────────────────────────────────
async function refreshFeedbackList(reportId, reportType) {
    const listEl = document.getElementById(`fb-list-${reportId}`);
    const titleEl = document.querySelector(`#fb-area-${reportId} .feedback-title`);
    if (!listEl) return;

    const feedbacks = await getFeedbacksByReportId(reportId, reportType).catch(() => []);

    if (titleEl) titleEl.textContent = `교수님 피드백 (${feedbacks.length})`;

    if (feedbacks.length === 0) {
        listEl.innerHTML = `<div class="feedback-empty">아직 피드백이 없습니다.</div>`;
        return;
    }

    listEl.innerHTML = feedbacks.map(fb => {
        const safeFbId = (fb.id || '').replace(/['"]/g, '');
        return `
        <div class="feedback-item" id="fbi-${safeFbId}">
            <div class="feedback-item-header">
                <span class="feedback-author">💬 ${escapeHtml(fb.feedback_by || '')}</span>
                <span class="feedback-date">${escapeHtml(String(fb.feedback_date || ''))}</span>
                <button class="btn-icon-del" onclick="deleteFeedbackItem('${safeFbId}', '${reportId}', '${reportType}')" title="삭제">✕</button>
            </div>
            <div class="feedback-content-text">${escapeHtml(fb.feedback_content || '')}</div>
        </div>`;
    }).join('');
}

// ── 보고서 제출 탭 피드백 로드 ────────────────────────────────
async function loadDailyFeedback(reportId) {
    if (!reportId) return;
    const area = document.getElementById('daily-feedback-area');
    const list = document.getElementById('daily-feedback-list');
    if (!area || !list) return;

    try {
        const feedbacks = await getFeedbacksByReportId(reportId, 'daily');
        if (feedbacks.length === 0) {
            area.style.display = 'none';
            return;
        }
        area.style.display = 'block';
        list.innerHTML = feedbacks.map(fb => `
            <div class="feedback-item">
                <div class="feedback-item-header">
                    <span class="feedback-author">💬 ${escapeHtml(fb.feedback_by || '')}</span>
                    <span class="feedback-date">${escapeHtml(String(fb.feedback_date || ''))}</span>
                </div>
                <div class="feedback-content-text">${escapeHtml(fb.feedback_content || '')}</div>
            </div>`).join('');
    } catch (error) {
        console.error('일일 피드백 로드 실패:', error);
    }
}

async function loadWeeklyFeedback(reportId) {
    if (!reportId) return;
    const area = document.getElementById('weekly-feedback-area');
    const list = document.getElementById('weekly-feedback-list');
    if (!area || !list) return;

    try {
        const feedbacks = await getFeedbacksByReportId(reportId, 'weekly');
        if (feedbacks.length === 0) {
            area.style.display = 'none';
            return;
        }
        area.style.display = 'block';
        list.innerHTML = feedbacks.map(fb => `
            <div class="feedback-item">
                <div class="feedback-item-header">
                    <span class="feedback-author">💬 ${escapeHtml(fb.feedback_by || '')}</span>
                    <span class="feedback-date">${escapeHtml(String(fb.feedback_date || ''))}</span>
                </div>
                <div class="feedback-content-text">${escapeHtml(fb.feedback_content || '')}</div>
            </div>`).join('');
    } catch (error) {
        console.error('주간 피드백 로드 실패:', error);
    }
}

// ── 폼 초기화 ─────────────────────────────────────────────────
function clearDailyForm() {
    ['today-work', 'work-hours', 'notes'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const area = document.getElementById('daily-feedback-area');
    if (area) area.style.display = 'none';
}

// ── 유틸 ──────────────────────────────────────────────────────
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 하위 호환 별칭
function showFeedbackForm(reportId, reportType, studentName, dateInfo) {
    toggleFeedbackForm(reportId, reportType, studentName, dateInfo);
}
function deleteFeedback(feedbackId, reportId) {
    deleteFeedbackItem(feedbackId, reportId, 'daily');
}
function saveFeedbackToDb(reportId, reportType, studentName) {
    saveFeedbackItem(reportId, reportType, studentName);
}
