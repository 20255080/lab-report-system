// BLESS Lab Timetable & Calendar
// 1st Semester 2026: March 2 - June 13
// Updated: 동그라미 마커 방식 (멤버별 고정 색상, 인원수만큼 표시)

const timetableData = {
    semesterStart: '2026-03-02',
    semesterEnd: '2026-06-13',
    
    paperRotation: [
        ['Lee Hye-bin (이혜빈)', 'Song Da-ye (송다예)', 'Kim Dong-woo (김동우)', 'Yoo Sung-il (유성일)', 'Saqib'],
        ['Minkee Cho (조민기)', 'Kim Su-jin (김수진)', 'Kim Dong-jin (김동진)', 'Song Da-ye (송다예)', 'Jo Yu-kyung (조유경)']
    ],
    paperStartDate: '2026-03-07',
    
    memberSchedules: {
        'Kim Dong-jin (김동진)': [
            { day: 'Tue', time: '09:00-10:15', course: 'Climate-Environment Modeling', code: '110-1107', prof: 'Prof. Myong-In Lee', room: '110-1107' },
            { day: 'Tue', time: '13:00-14:15', course: 'Wastewater Microbiology', code: '110-1105', prof: 'Prof. Changsoo Lee', room: '110-1105' },
            { day: 'Thu', time: '09:00-10:15', course: 'Climate-Environment Modeling', code: '110-1107', prof: 'Prof. Myong-In Lee', room: '110-1107' },
            { day: 'Thu', time: '13:00-14:15', course: 'Wastewater Microbiology', code: '110-1105', prof: 'Prof. Changsoo Lee', room: '110-1105' },
            { day: 'Mon', time: '16:00-17:15', course: 'Introduction to Environmental Analysis', code: '110-1009', prof: 'Prof. Sung-Deuk Choi', room: '110-1009' },
            { day: 'Wed', time: '16:00-17:15', course: 'Introduction to Environmental Analysis', code: '110-1009', prof: 'Prof. Sung-Deuk Choi', room: '110-1009' },
            { day: 'Thu', time: '16:00-17:15', course: 'Seminar', code: '110-1007', prof: 'Prof. Myong-In Lee', room: '110-1007' }
        ],
        'Kim Dong-woo (김동우)': [
            { day: 'Tue', time: '13:00-14:15', course: 'Wastewater Microbiology', code: '110-1105', prof: 'Prof. Changsoo Lee', room: '110-1105' },
            { day: 'Thu', time: '13:00-14:15', course: 'Wastewater Microbiology', code: '110-1105', prof: 'Prof. Changsoo Lee', room: '110-1105' }
        ],
        'Saqib': [
            { day: 'Mon', time: '10:30-11:45', course: 'Water Chemistry', code: '110-1105', prof: 'Prof. Young-Nam Kwon', room: '110-1105' },
            { day: 'Tue', time: '13:00-14:15', course: 'Wastewater Microbiology', code: '110-1105', prof: 'Prof. Changsoo Lee', room: '110-1105' },
            { day: 'Wed', time: '10:30-11:45', course: 'Water Chemistry', code: '110-1105', prof: 'Prof. Young-Nam Kwon', room: '110-1105' },
            { day: 'Thu', time: '13:00-14:15', course: 'Wastewater Microbiology', code: '110-1105', prof: 'Prof. Changsoo Lee', room: '110-1105' },
            { day: 'Mon', time: '16:00-17:15', course: 'Introduction to Environmental Analysis', code: '110-1009', prof: 'Prof. Sung-Deuk Choi', room: '110-1009' },
            { day: 'Wed', time: '16:00-17:15', course: 'Introduction to Environmental Analysis', code: '110-1009', prof: 'Prof. Sung-Deuk Choi', room: '110-1009' },
            { day: 'Thu', time: '16:00-17:15', course: 'Seminar', code: '110-1007', prof: 'Prof. Myong-In Lee', room: '110-1007' }
        ],
        'Kim Su-jin (김수진)': [
            { day: 'Tue', time: '14:30-17:15', course: 'Disaster Theory and Practice', code: '110-1009', prof: 'Prof. Jibum Chung', room: '110-1009' }
        ],
        'Jo Yu-kyung (조유경)': [
            { day: 'Tue', time: '14:30-17:15', course: 'Disaster Theory and Practice', code: '110-1009', prof: 'Prof. Jibum Chung', room: '110-1009' },
            { day: 'Thu', time: '09:00-11:45', course: 'Theory of Planning', code: '110-1014', prof: 'Prof. Gihyoug Cho', room: '110-1014' }
        ]
    },
    
    weeklySchedule: {
        1: [
            { time: '10:30-11:45', name: 'Water Chemistry', code: '110-1105', professor: 'Prof. Young-Nam Kwon', room: '110-1105', students: ['Saqib'], duration: 75 },
            { time: '16:00-17:15', name: 'Introduction to Environmental Analysis', code: '110-1009', professor: 'Prof. Sung-Deuk Choi', room: '110-1009', students: ['Kim Dong-jin (김동진)', 'Saqib'], duration: 75 }
        ],
        2: [
            { time: '09:00-10:15', name: 'Climate-Environment Modeling', code: '110-1107', professor: 'Prof. Myong-In Lee', room: '110-1107', students: ['Kim Dong-jin (김동진)'], duration: 75 },
            { time: '13:00-14:15', name: 'Wastewater Microbiology', code: '110-1105', professor: 'Prof. Changsoo Lee', room: '110-1105', students: ['Kim Dong-jin (김동진)', 'Kim Dong-woo (김동우)', 'Saqib'], duration: 75 },
            { time: '14:30-17:15', name: 'Disaster Theory and Practice', code: '110-1009', professor: 'Prof. Jibum Chung', room: '110-1009', students: ['Kim Su-jin (김수진)', 'Jo Yu-kyung (조유경)'], duration: 165 }
        ],
        3: [
            { time: '10:30-11:45', name: 'Water Chemistry', code: '110-1105', professor: 'Prof. Young-Nam Kwon', room: '110-1105', students: ['Saqib'], duration: 75 },
            { time: '16:00-17:15', name: 'Introduction to Environmental Analysis', code: '110-1009', professor: 'Prof. Sung-Deuk Choi', room: '110-1009', students: ['Kim Dong-jin (김동진)', 'Saqib'], duration: 75 }
        ],
        4: [
            { time: '09:00-10:15', name: 'Climate-Environment Modeling', code: '110-1107', professor: 'Prof. Myong-In Lee', room: '110-1107', students: ['Kim Dong-jin (김동진)'], duration: 75 },
            { time: '09:00-11:45', name: 'Theory of Planning', code: '110-1014', professor: 'Prof. Gihyoug Cho', room: '110-1014', students: ['Jo Yu-kyung (조유경)'], duration: 165 },
            { time: '13:00-14:15', name: 'Wastewater Microbiology', code: '110-1105', professor: 'Prof. Changsoo Lee', room: '110-1105', students: ['Kim Dong-jin (김동진)', 'Kim Dong-woo (김동우)', 'Saqib'], duration: 75 },
            { time: '16:00-17:15', name: 'Seminar', code: '110-1007', professor: 'Prof. Myong-In Lee', room: '110-1007', students: ['Kim Dong-jin (김동진)', 'Saqib'], duration: 75 }
        ]
    }
};

// Initialize to current date
const today = new Date();
let currentYear  = today.getFullYear();
let currentMonth = today.getMonth();

// ══════════════════════════════════════════════════════════════
// 멤버별 고정 색상 (STU001~STU009 순서)
// ══════════════════════════════════════════════════════════════
const MEMBER_COLORS = [
    '#3498db', // STU001 Minkee Cho (조민기)
    '#27ae60', // STU002 Lee Hye-bin (이혜빈)
    '#e74c3c', // STU003 Yoo Sung-il (유성일)
    '#9b59b6', // STU004 Kim Su-jin (김수진)
    '#f39c12', // STU005 Kim Dong-woo (김동우)
    '#1abc9c', // STU006 Song Da-ye (송다예)
    '#e67e22', // STU007 Kim Dong-jin (김동진)
    '#2980b9', // STU008 Saqib
    '#8e44ad', // STU009 Jo Yu-kyung (조유경)
];

const STUDENT_SHORT_NAMES = [
    '조민기', '이혜빈', '유성일', '김수진', '김동우',
    '송다예', '김동진', 'Saqib', '조유경'
];

// 캐시: { "YYYY-MM": { "YYYY-MM-DD": ["STU001", ...] } }
let submissionCache    = {};
let cachedStudentOrder = []; // Firestore에서 가져온 학생 순서 (id 배열)

// 현재 월의 제출 현황 Firestore 로드
async function loadMonthSubmissions(year, month) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    if (submissionCache[key]) return submissionCache[key];

    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay   = new Date(year, month + 1, 0).getDate();
    const endDate   = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    try {
        // 학생 순서 캐시 (최초 1회)
        if (cachedStudentOrder.length === 0) {
            const snap = await db.collection('students').orderBy('id').get();
            cachedStudentOrder = snap.docs.map(d => d.id);
        }

        // 해당 월 보고서 조회
        const snapshot = await db.collection('daily_reports')
            .where('report_date', '>=', startDate)
            .where('report_date', '<=', endDate)
            .get();

        const raw = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.report_date;
            const sid  = data.student_id;
            if (!date || !sid) return;
            if (!raw[date]) raw[date] = new Set();
            raw[date].add(sid);
        });

        // 학생 등록 순서대로 정렬
        const final = {};
        Object.keys(raw).forEach(date => {
            final[date] = cachedStudentOrder.filter(id => raw[date].has(id));
        });

        submissionCache[key] = final;
        return final;
    } catch (err) {
        console.error('제출 현황 로드 실패:', err);
        return {};
    }
}

// 동그라미 HTML 생성
function buildDotHTML(colors, allDone) {
    if (!colors || colors.length === 0) return '';
    const dotSize  = 7;
    const gap      = 2;
    const maxPerRow = 5;

    let html = '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;margin-top:2px;">';
    for (let i = 0; i < colors.length && i < maxPerRow * 2; i += maxPerRow) {
        const row = colors.slice(i, i + maxPerRow);
        html += '<div style="display:flex;gap:' + gap + 'px;">';
        row.forEach(c => {
            html += `<span style="display:inline-block;width:${dotSize}px;height:${dotSize}px;border-radius:50%;background:${c};${allDone ? 'box-shadow:0 0 0 1px rgba(255,255,255,0.7);' : ''}"></span>`;
        });
        html += '</div>';
    }
    html += '</div>';
    return html;
}

// ══════════════════════════════════════════════════════════════
// TIMETABLE FUNCTIONS  (Flutter 앱 리스트형 스타일)
// ══════════════════════════════════════════════════════════════

// 요일 표시 한글 매핑
const DAY_KO_MAP = { Mon:'월', Tue:'화', Wed:'수', Thu:'목', Fri:'금' };
// 요일 순서 (정렬용)
const DAY_ORDER  = { Mon:1, Tue:2, Wed:3, Thu:4, Fri:5 };

function renderTimetable(selectedMember = '') {
    const container = document.getElementById('timetable-display');
    if (!container) return;

    // ── 시간대별 수업 목록 수집 ──────────────────────────────────
    // { "09:00-10:15": [ { day, course, members:[...], prof, room }, ... ] }
    const timeGroups = {};

    if (selectedMember) {
        // 특정 멤버 시간표
        const schedule = timetableData.memberSchedules[selectedMember] || [];
        schedule.forEach(cls => {
            if (!timeGroups[cls.time]) timeGroups[cls.time] = [];
            timeGroups[cls.time].push({
                day: cls.day,
                course: cls.course,
                members: [selectedMember],
                prof: cls.prof,
                room: cls.room
            });
        });
    } else {
        // 전체 시간표: memberSchedules 전체 순회
        Object.entries(timetableData.memberSchedules).forEach(([memberName, sched]) => {
            sched.forEach(cls => {
                if (!timeGroups[cls.time]) timeGroups[cls.time] = [];
                // 같은 시간대+요일+수업 항목 합치기
                const existing = timeGroups[cls.time].find(
                    e => e.day === cls.day && e.course === cls.course
                );
                if (existing) {
                    if (!existing.members.includes(memberName)) existing.members.push(memberName);
                } else {
                    timeGroups[cls.time].push({
                        day: cls.day,
                        course: cls.course,
                        members: [memberName],
                        prof: cls.prof,
                        room: cls.room
                    });
                }
            });
        });
    }

    // 시간대 정렬 (오름차순)
    const sortedTimes = Object.keys(timeGroups).sort();

    // 단축 이름 변환
    function shortName(full) {
        const SHORT = {
            'Kim Dong-jin (김동진)': '김동진',
            'Kim Dong-woo (김동우)': '김동우',
            'Saqib':                 'Saqib',
            'Kim Su-jin (김수진)':   '김수진',
            'Jo Yu-kyung (조유경)':  '조유경',
            'Minkee Cho (조민기)':   '조민기',
            'Lee Hye-bin (이혜빈)':  '이혜빈',
            'Yoo Sung-il (유성일)':  '유성일',
            'Song Da-ye (송다예)':   '송다예',
        };
        return SHORT[full] || full;
    }

    // ── HTML 생성 ─────────────────────────────────────────────
    let html = '';

    if (sortedTimes.length === 0) {
        html = '<div style="padding:32px 16px;text-align:center;color:#95a5a6;font-size:.9rem;">등록된 수업이 없습니다.</div>';
        container.innerHTML = html;
        return;
    }

    sortedTimes.forEach(time => {
        // 시간 그룹 헤더 (Flutter: 다크 네이비 배경)
        html += `<div class="tt-time-header">${time}</div>`;

        // 해당 시간대 수업들 — 요일 순서로 정렬
        const items = timeGroups[time].sort(
            (a, b) => (DAY_ORDER[a.day] || 9) - (DAY_ORDER[b.day] || 9)
        );

        items.forEach(item => {
            const dayKo = DAY_KO_MAP[item.day] || item.day;
            const memberText = item.members.map(shortName).join(', ');

            html += `<div class="tt-class-item">
                <span class="tt-day-badge tt-day-${item.day}">${dayKo}</span>
                <div class="tt-class-info">
                    <div class="tt-class-members">${memberText} - ${item.course}</div>
                </div>
            </div>`;
        });
    });

    container.innerHTML = html;
}

function populateMemberFilter() {
    const select = document.getElementById('member-filter');
    if (!select) return;
    
    while (select.options.length > 1) select.remove(1);
    
    Object.keys(timetableData.memberSchedules).forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        select.appendChild(option);
    });
    
    select.addEventListener('change', (e) => renderTimetable(e.target.value));
}

// ══════════════════════════════════════════════════════════════
// CALENDAR FUNCTIONS
// ══════════════════════════════════════════════════════════════
function previousMonth() {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; }
    else { currentMonth--; }
    renderCalendar();
}

function nextMonth() {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; }
    else { currentMonth++; }
    renderCalendar();
}

function getClassesForDate(dateStr) {
    const date     = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const semStart  = new Date(timetableData.semesterStart);
    const semEnd    = new Date(timetableData.semesterEnd);
    
    if (date < semStart || date > semEnd) return [];
    
    if (dayOfWeek === 5) {
        return [{ isPaperDay: true, time: '', name: 'Progress Meeting', duration: 60,
                  presenters: getPaperPresenters(dateStr), students: ['ALL'] }];
    }
    
    const classes    = [];
    const dayClasses = timetableData.weeklySchedule[dayOfWeek] || [];
    dayClasses.forEach(cls => {
        classes.push({ time: cls.time, name: cls.name, code: cls.code,
                       duration: cls.duration, students: cls.students,
                       professor: cls.professor, room: cls.room });
    });
    return classes;
}

function getPaperPresenters(dateStr) {
    const startDate     = new Date(timetableData.paperStartDate);
    const targetDate    = new Date(dateStr);
    const diffTime      = targetDate - startDate;
    const diffDays      = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeksSince    = Math.floor(diffDays / 7);
    const rotationIndex = weeksSince % timetableData.paperRotation.length;
    return timetableData.paperRotation[rotationIndex];
}

function getStudentTimeRange(dateStr) {
    const classes      = getClassesForDate(dateStr);
    const studentTimes = {};
    
    classes.forEach(cls => {
        if (cls.isPaperDay) return;
        cls.students.forEach(student => {
            if (!studentTimes[student]) studentTimes[student] = { times: [], classes: [] };
            studentTimes[student].times.push(cls.time);
            studentTimes[student].classes.push({ name: cls.name, code: cls.code,
                professor: cls.professor, room: cls.room, time: cls.time });
        });
    });
    
    Object.keys(studentTimes).forEach(student => {
        const times      = studentTimes[student].times;
        if (times.length > 0) {
            const startTimes = times.map(t => t.split('-')[0]);
            const endTimes   = times.map(t => t.split('-')[1]);
            studentTimes[student].range = `${startTimes.sort()[0]}-${endTimes.sort()[endTimes.length-1]}`;
        }
    });
    return studentTimes;
}

function showDateDetail(dateStr) {
    const date      = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const classes   = getClassesForDate(dateStr);
    
    if (classes.length === 0) { alert('No classes on this date.'); return; }
    
    if (dayOfWeek === 5) {
        const presenters = classes[0].presenters.join(', ');
        alert(`📄 Progress Meeting Day\n\nPresenters:\n${presenters}`);
        return;
    }
    
    let detail         = `📅 ${dateStr}\n\n`;
    const studentTimes = getStudentTimeRange(dateStr);
    Object.keys(studentTimes).forEach(student => {
        const data = studentTimes[student];
        detail += `👤 ${student} (${data.range})\n`;
        data.classes.forEach(cls => {
            detail += `  • ${cls.time} ${cls.name}\n    ${cls.room} | ${cls.professor}\n`;
        });
        detail += '\n';
    });
    alert(detail.trim());
}

// ══════════════════════════════════════════════════════════════
// renderCalendar() — Flutter 앱 동일 스타일 (미제출 제거)
// ══════════════════════════════════════════════════════════════
async function renderCalendar() {
    loadStoredEvents();

    const container = document.getElementById('monthly-calendar');
    if (!container) return;

    // 이번 달 제출 현황 로드
    const submissions   = await loadMonthSubmissions(currentYear, currentMonth);
    const totalStudents = cachedStudentOrder.length || 9;

    const monthNames = ['January','February','March','April','May','June',
                        'July','August','September','October','November','December'];

    const todayObj = new Date();
    const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth()+1).padStart(2,'0')}-${String(todayObj.getDate()).padStart(2,'0')}`;

    // ── 캘린더 네비게이션 헤더 ───────────────────────────────────
    let html = `
    <div class="cal-nav">
        <button class="cal-nav-btn" onclick="previousMonth()">&#10094;</button>
        <span class="cal-month-title">${monthNames[currentMonth]} ${currentYear}</span>
        <button class="cal-nav-btn" onclick="nextMonth()">&#10095;</button>
    </div>`;

    // ── 요일 헤더 ─────────────────────────────────────────────
    html += '<div class="cal-grid">';
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
        html += `<div class="cal-dow">${d}</div>`;
    });

    // ── 날짜 셀 ───────────────────────────────────────────────
    const firstDay    = new Date(currentYear, currentMonth, 1);
    const lastDay     = new Date(currentYear, currentMonth + 1, 0);
    const startDay    = firstDay.getDay();     // 0=Sun
    const daysInMonth = lastDay.getDate();

    // 이전 달 빈칸 (other-month)
    const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        html += `<div class="cal-day other-month">
            <div class="cal-day-num">${prevLastDay - i}</div>
        </div>`;
    }

    // 이번 달 날짜
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const dow     = new Date(currentYear, currentMonth, day).getDay();
        const isToday = dateStr === todayStr;

        let dayClass = 'cal-day';
        if (isToday) dayClass += ' today';
        if (dow === 0) dayClass += ' sun';
        if (dow === 6) dayClass += ' sat';

        // 제출 동그라미 (멤버별 색상)
        const submittedIds = submissions[dateStr] || [];
        let dotsHtml = '';
        if (submittedIds.length > 0) {
            dotsHtml = '<div class="cal-dots">';
            submittedIds.forEach(id => {
                const idx   = cachedStudentOrder.indexOf(id);
                const color = idx >= 0 ? MEMBER_COLORS[idx % MEMBER_COLORS.length] : '#999';
                dotsHtml += `<span class="cal-dot" style="background:${color};"></span>`;
            });
            dotsHtml += '</div>';
        }

        html += `<div class="${dayClass}" onclick="showDatePanel('${dateStr}')">
            <div class="cal-day-num">${day}</div>
            ${dotsHtml}
        </div>`;
    }

    // 다음 달 빈칸 (other-month) — 마지막 행 채우기
    const endDay   = lastDay.getDay();
    const fillEnd  = endDay < 6 ? 6 - endDay : 0;
    for (let i = 1; i <= fillEnd; i++) {
        html += `<div class="cal-day other-month">
            <div class="cal-day-num">${i}</div>
        </div>`;
    }

    html += '</div>'; // .cal-grid

    // ── 범례 ─────────────────────────────────────────────────
    html += '<div class="cal-legend">';
    MEMBER_COLORS.forEach((color, i) => {
        html += `<div class="cal-legend-item">
            <span class="cal-legend-dot" style="background:${color};"></span>
            <span>${STUDENT_SHORT_NAMES[i] || 'STU00'+(i+1)}</span>
        </div>`;
    });
    html += '</div>';

    // ── 제출 현황 패널 (선택된 날짜, 미제출 표시 없음) ────────
    html += `
    <div class="cal-status-panel" id="cal-status-panel" style="display:none;">
        <div class="cal-status-title" id="cal-status-title"></div>
        <div class="cal-chips" id="cal-chips"></div>
    </div>`;

    // ── 날짜 상세 패널 ────────────────────────────────────────
    html += `
    <div class="cal-detail-panel" id="cal-detail-panel" style="display:none;">
        <div class="cal-detail-date" id="cal-detail-date"></div>
        <div id="cal-detail-content"></div>
    </div>`;

    container.innerHTML = html;
}

// ── 날짜 패널 표시 (Flutter 앱 스타일 — 미제출 표시 없음) ───────
async function showDatePanel(dateStr) {
    selectedDate = dateStr;

    const [y, m, d] = dateStr.split('-').map(Number);
    const formattedDate = new Date(y, m-1, d).toLocaleDateString('ko-KR', {
        year:'numeric', month:'long', day:'numeric'
    });

    // ── 제출 현황 패널: 제출자만 칩으로 표시 (미제출 목록 없음) ──
    const statusPanel = document.getElementById('cal-status-panel');
    const statusTitle = document.getElementById('cal-status-title');
    const chipsEl     = document.getElementById('cal-chips');

    if (statusPanel && statusTitle && chipsEl) {
        const key          = `${y}-${String(m).padStart(2,'0')}`;
        const submissions  = submissionCache[key] || {};
        const submittedIds = submissions[dateStr] || [];
        const total        = cachedStudentOrder.length || 9;
        const doneCount    = submittedIds.length;
        const allDone      = doneCount >= total && total > 0;

        const statusIcon = allDone ? '✅' : '🟡';
        statusTitle.innerHTML = `<span style="color:${allDone?'#27ae60':'#e67e22'}">${statusIcon} 제출 현황 (${doneCount}/${total})</span>`;

        // 제출자 칩 (미제출자는 흐린 칩으로만 표시, 미제출 텍스트 없음)
        let chipsHtml = '';
        cachedStudentOrder.forEach((id, idx) => {
            const color = MEMBER_COLORS[idx % MEMBER_COLORS.length];
            const name  = STUDENT_SHORT_NAMES[idx] || id;
            const done  = submittedIds.includes(id);
            chipsHtml += `<span class="cal-chip${done ? ' submitted' : ''}" style="${done ? '--chip-color:'+color : ''}">
                ${name}${done ? ' ✓' : ''}
            </span>`;
        });
        chipsEl.innerHTML = chipsHtml;
        statusPanel.style.display = 'block';
    }

    // ── 날짜 상세 패널: Firestore에서 보고서 불러오기 ──────────
    const detailPanel   = document.getElementById('cal-detail-panel');
    const detailDateEl  = document.getElementById('cal-detail-date');
    const detailContent = document.getElementById('cal-detail-content');

    if (detailPanel && detailDateEl && detailContent) {
        detailDateEl.textContent = formattedDate;

        detailContent.innerHTML = '<div style="padding:16px 0;text-align:center;color:#95a5a6;font-size:.85rem;">불러오는 중...</div>';
        detailPanel.style.display = 'block';

        try {
            const snapshot = await db.collection('daily_reports')
                .where('report_date', '==', dateStr)
                .get();

            if (snapshot.empty) {
                detailContent.innerHTML = `
                <div class="cal-no-report">
                    <div class="cal-no-report-icon">📋</div>
                    <div style="font-size:.82rem;margin-top:4px;color:#aaa;">${formattedDate}</div>
                    <div class="cal-no-report-text">제출된 보고서 없음</div>
                </div>`;
            } else {
                let reportsHtml = '';
                snapshot.forEach(doc => {
                    const data     = doc.data();
                    const name     = data.student_name || data.student_id || '알 수 없음';
                    const preview  = (data.today_work || '').substring(0, 80) + (data.today_work && data.today_work.length > 80 ? '…' : '');
                    const hours    = data.work_hours ? `⏱ ${data.work_hours}` : '';

                    // 멤버 색상 찾기
                    const sIdx  = STUDENT_SHORT_NAMES.findIndex(n => name.includes(n) || n.includes(name));
                    const color = sIdx >= 0 ? MEMBER_COLORS[sIdx] : '#3498db';

                    reportsHtml += `<div class="cal-report-item" style="border-left-color:${color};">
                        <div class="cal-report-name">${name} ${hours}</div>
                        ${preview ? `<div class="cal-report-preview">${preview}</div>` : ''}
                    </div>`;
                });
                detailContent.innerHTML = reportsHtml;
            }
        } catch (e) {
            detailContent.innerHTML = '<div style="padding:12px;color:#e74c3c;font-size:.82rem;">보고서 불러오기 실패</div>';
        }
    }
}

let selectedDate   = '';
let calendarEvents = {};
let isFormVisible  = false;

// 이벤트 폼 함수 (레거시 호환 — 현재 캘린더에서 미사용)
function toggleEventForm() {}
function cancelEventForm() {}
function clearEventForm() {
    ['event-title','event-time','event-author','event-location','event-participants'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const desc = document.getElementById('event-description');
    if (desc) desc.value = '';
}
function saveEvent() {}
function deleteEvent(index) {}

function loadStoredEvents() {
    try {
        const saved = localStorage.getItem('blesslab_calendar_events');
        if (saved) calendarEvents = JSON.parse(saved);
    } catch (e) { console.error('Failed to load events:', e); }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('timetable-display')) {
            populateMemberFilter();
            renderTimetable();
        }
        if (document.getElementById('monthly-calendar')) {
            renderCalendar();
        }
    });
} else {
    if (document.getElementById('timetable-display')) {
        populateMemberFilter();
        renderTimetable();
    }
    if (document.getElementById('monthly-calendar')) {
        renderCalendar();
    }
}

// 탭 클릭 시 새로고침
window.addEventListener('load', () => {
    const timetableTab = document.querySelector('[data-tab="timetable"]');
    if (timetableTab) {
        timetableTab.addEventListener('click', () => {
            setTimeout(() => { populateMemberFilter(); renderTimetable(); }, 100);
        });
    }
    const calendarTab = document.querySelector('[data-tab="calendar"]');
    if (calendarTab) {
        calendarTab.addEventListener('click', () => {
            setTimeout(renderCalendar, 100);
        });
    }
});

// ── 전체 시간표 한눈에 보기 ──────────────────────────────────────
// index.html 시간표 탭 내 "전체 보기" 버튼이 호출
function renderFullTimetable() {
    const container = document.getElementById('full-timetable-display');
    if (!container) return;

    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const DAY_KO  = { Mon: '월', Tue: '화', Wed: '수', Thu: '목', Fri: '금' };
    const PERIODS = [
        { label: '1교시', time: '09:00-10:15' },
        { label: '2교시', time: '10:30-11:45' },
        { label: '3교시', time: '13:00-14:15' },
        { label: '4교시', time: '14:30-15:45' },
        { label: '5교시', time: '16:00-17:15' },
    ];

    // 멤버 단축 이름 (표 안 표시용)
    const SHORT = {
        'Kim Dong-jin (김동진)':  '동진',
        'Kim Dong-woo (김동우)':  '동우',
        'Saqib':                  'Saqib',
        'Kim Su-jin (김수진)':    '수진',
        'Jo Yu-kyung (조유경)':   '유경',
        'Minkee Cho (조민기)':    '민기',
        'Lee Hye-bin (이혜빈)':   '혜빈',
        'Yoo Sung-il (유성일)':   '성일',
        'Song Da-ye (송다예)':    '다예',
    };

    // day × period → 수업 목록 맵 구성
    const cellMap = {};
    DAYS.forEach(d => PERIODS.forEach(p => { cellMap[`${d}_${p.time}`] = []; }));

    Object.entries(timetableData.memberSchedules).forEach(([memberName, sched]) => {
        sched.forEach(cls => {
            const key = `${cls.day}_${cls.time}`;
            if (cellMap[key] !== undefined) {
                cellMap[key].push({ member: memberName, course: cls.course, room: cls.room, prof: cls.prof });
            }
        });
    });

    // 헤더
    let html = `
    <div class="full-tt-wrap">
        <div class="full-tt-title">
            <h3>BLESS 전체 시간표</h3>
            <p>2026년 1학기 (3.2 ~ 6.13)</p>
        </div>
        <div class="full-tt-scroll">
        <table class="full-tt-table">
            <thead>
                <tr>
                    <th class="full-tt-period-hd">교시</th>
                    ${DAYS.map(d => `<th>${DAY_KO[d]} (${d})</th>`).join('')}
                </tr>
            </thead>
            <tbody>`;

    PERIODS.forEach(period => {
        html += `<tr>
            <td class="full-tt-period-cell">
                <div class="full-tt-period-name">${period.label}</div>
                <div class="full-tt-period-time">${period.time}</div>
            </td>`;

        DAYS.forEach(day => {
            const classes = cellMap[`${day}_${period.time}`] || [];
            if (classes.length === 0) {
                html += `<td class="full-tt-empty"></td>`;
            } else {
                html += `<td class="full-tt-cell">`;
                // 같은 강의인지 그룹화
                const grouped = {};
                classes.forEach(c => {
                    const key = c.course;
                    if (!grouped[key]) grouped[key] = { course: c.course, room: c.room, prof: c.prof, members: [] };
                    grouped[key].members.push(c.member);
                });
                Object.values(grouped).forEach(g => {
                    html += `<div class="full-tt-entry">`;
                    html += `<div class="full-tt-names">${g.members.map(m =>
                        `<span class="full-tt-badge" style="background:${getMemberColorSafe(m)}">${SHORT[m] || m}</span>`
                    ).join('')}</div>`;
                    html += `<div class="full-tt-course">${g.course}</div>`;
                    html += `<div class="full-tt-meta">${g.room} · ${g.prof}</div>`;
                    html += `</div>`;
                });
                html += `</td>`;
            }
        });
        html += `</tr>`;
    });

    html += `</tbody></table></div></div>`;
    container.innerHTML = html;
}

// 색상 맵 (main-firebase.js 로드 전일 수 있으므로 독립 사본)
function getMemberColorSafe(name) {
    const MAP = {
        'Kim Dong-jin (김동진)': '#e67e22',
        'Kim Dong-woo (김동우)': '#f39c12',
        'Saqib':                 '#2980b9',
        'Kim Su-jin (김수진)':   '#9b59b6',
        'Jo Yu-kyung (조유경)':  '#8e44ad',
        'Minkee Cho (조민기)':   '#3498db',
        'Lee Hye-bin (이혜빈)':  '#27ae60',
        'Yoo Sung-il (유성일)':  '#e74c3c',
        'Song Da-ye (송다예)':   '#1abc9c',
    };
    return MAP[name] || '#95a5a6';
}

// 전체 시간표 토글 (탭 내 버튼용)
function toggleFullTimetable() {
    const wrap = document.getElementById('full-timetable-section');
    const btn  = document.getElementById('btn-full-tt');
    if (!wrap) return;
    const isOpen = wrap.style.display !== 'none';
    if (isOpen) {
        wrap.style.display = 'none';
        if (btn) btn.textContent = '📊 전체 시간표 보기';
    } else {
        wrap.style.display = 'block';
        if (btn) btn.textContent = '📊 전체 시간표 닫기';
        renderFullTimetable();
    }
}
