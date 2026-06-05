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
// TIMETABLE FUNCTIONS
// ══════════════════════════════════════════════════════════════
function renderTimetable(selectedMember = '') {
    const container = document.getElementById('timetable-display');
    if (!container) return;
    
    let html = '';
    
    if (selectedMember) {
        const schedule = timetableData.memberSchedules[selectedMember] || [];
        html += `<h3 style="margin-bottom: 15px;">${selectedMember}'s Schedule</h3>`;
        
        html += '<table class="member-schedule-table">';
        html += '<thead><tr><th>Day</th><th>Time</th><th>Course</th><th>Professor</th><th>Room</th></tr></thead>';
        html += '<tbody>';
        schedule.forEach(cls => {
            html += `<tr><td>${cls.day}</td><td>${cls.time}</td><td>${cls.course}</td><td>${cls.prof}</td><td>${cls.room}</td></tr>`;
        });
        html += '</tbody></table>';
        
        html += '<div class="schedule-card-list">';
        schedule.forEach(cls => {
            html += `<div class="schedule-card">
                <span class="schedule-card-day">${cls.day}</span>
                <div class="schedule-card-time">${cls.time}</div>
                <div class="schedule-card-course">${cls.course}</div>
                <div class="schedule-card-details">👤 ${cls.prof}<br>📍 ${cls.room}</div>
            </div>`;
        });
        html += '</div>';
    } else {
        html += '<div class="timetable-image-style">';
        html += '<div class="timetable-scroll-hint">좌우로 스크롤하여 전체 시간표를 확인하세요</div>';
        html += '<div class="timetable-title"><h3>BLESS Timetable</h3><p>1<sup>st</sup> Semester, 2026</p></div>';
        html += '<table class="timetable-classic">';
        html += '<thead><tr><th class="period-header">2026-1st semester</th><th>Mon</th><th>Tue</th><th>Wed</th><th colspan="2">Thu</th></tr></thead>';
        html += '<tbody>';
        
        html += '<tr><td class="period-cell">1교시<br>(09:00-10:15)</td>';
        html += '<td class="timetable-day-cell"></td>';
        html += '<td class="timetable-day-cell"><span class="student yellow">동진</span><br>Climate-<br>Environment<br>Modeling<br><small>110-1107<br>Prof. Myong-In Lee</small></td>';
        html += '<td class="timetable-day-cell"></td>';
        html += '<td class="timetable-day-cell"><span class="student yellow">동진</span><br>Climate-<br>Environment<br>Modeling<br><small>110-1107<br>Prof. Myong-In Lee</small></td>';
        html += '<td rowspan="2" class="merged-cell timetable-day-cell"><span class="student purple">유경</span><br>Theory of<br>Planning<br><small>110-1014<br>Prof. Gihyoug Cho</small></td></tr>';
        
        html += '<tr><td class="period-cell">2교시<br>(10:30-11:45)</td>';
        html += '<td class="timetable-day-cell"><span class="student blue">Saqib</span><br>Water Chemistry<br><small>110-1105<br>Prof. Young-Nam<br>Kwon</small></td>';
        html += '<td class="timetable-day-cell"></td>';
        html += '<td class="timetable-day-cell"><span class="student blue">Saqib</span><br>Water Chemistry<br><small>110-1105<br>Prof. Young-Nam<br>Kwon</small></td>';
        html += '<td class="timetable-day-cell"></td></tr>';
        
        html += '<tr><td class="period-cell">3교시<br>(13:00-14:15)</td>';
        html += '<td class="timetable-day-cell"></td>';
        html += '<td class="timetable-day-cell"><span class="student yellow">동진</span> <span class="student green">동우</span><br><span class="student blue">Saqib</span><br>Wastewater<br>Microbiology<br><small>110-1105<br>Prof. Changsoo Lee</small></td>';
        html += '<td class="timetable-day-cell"></td>';
        html += '<td colspan="2" class="timetable-day-cell"><span class="student yellow">동진</span> <span class="student green">동우</span><br><span class="student blue">Saqib</span><br>Wastewater<br>Microbiology<br><small>110-1105<br>Prof. Changsoo Lee</small></td></tr>';
        
        html += '<tr><td class="period-cell">4교시<br>(14:30-15:45)</td>';
        html += '<td class="timetable-day-cell"></td>';
        html += '<td rowspan="2" class="merged-cell merged-vertical timetable-day-cell"><span class="student pink">수진</span> <span class="student purple">유경</span><br>Disaster Theory<br>and Practice<br><small>110-1009<br>Prof. Jibum Chung</small></td>';
        html += '<td class="timetable-day-cell"></td>';
        html += '<td colspan="2" class="timetable-day-cell"></td></tr>';
        
        html += '<tr><td class="period-cell">5교시<br>(16:00-17:15)</td>';
        html += '<td class="timetable-day-cell"><span class="student yellow">동진</span> <span class="student blue">Saqib</span><br>Introduction to<br>Environmental<br>Analysis<br><small>110-1009<br>Prof. Sung-Deuk Choi</small></td>';
        html += '<td class="timetable-day-cell"><span class="student yellow">동진</span> <span class="student blue">Saqib</span><br>Introduction to<br>Environmental<br>Analysis<br><small>110-1009<br>Prof. Sung-Deuk Choi</small></td>';
        html += '<td colspan="2" class="timetable-day-cell"><span class="student yellow">동진</span> <span class="student blue">Saqib</span><br>Seminar<br><small>110-1007<br>Prof. Myong-In Lee</small></td></tr>';
        
        html += '</tbody></table></div>';
    }
    
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
// renderCalendar() — 동그라미 마커 방식 (핵심 업데이트)
// ══════════════════════════════════════════════════════════════
async function renderCalendar() {
    loadStoredEvents();
    
    const container = document.getElementById('monthly-calendar');
    if (!container) return;

    // 이번 달 제출 현황 로드
    const submissions  = await loadMonthSubmissions(currentYear, currentMonth);
    const totalStudents = cachedStudentOrder.length || 9;

    const monthNames = ['January','February','March','April','May','June',
                        'July','August','September','October','November','December'];
    
    let html = `
    <div class="calendar-nav">
        <button class="nav-btn-calendar" onclick="previousMonth()">◀ Previous Month</button>
        <h3 class="calendar-month-title">${monthNames[currentMonth]} ${currentYear}</h3>
        <button class="nav-btn-calendar" onclick="nextMonth()">Next Month ▶</button>
    </div>
    <div class="work-calendar-grid">`;
    
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
        html += `<div class="work-weekday">${d}</div>`;
    });
    
    const firstDay    = new Date(currentYear, currentMonth, 1);
    const lastDay     = new Date(currentYear, currentMonth + 1, 0);
    const startDay    = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const semStart    = new Date(timetableData.semesterStart);
    const semEnd      = new Date(timetableData.semesterEnd);
    const todayObj    = new Date();
    const todayStr    = `${todayObj.getFullYear()}-${String(todayObj.getMonth()+1).padStart(2,'0')}-${String(todayObj.getDate()).padStart(2,'0')}`;
    
    for (let i = 0; i < startDay; i++) {
        html += '<div class="work-calendar-cell empty"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date    = new Date(currentYear, currentMonth, day);
        const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const inSemester = date >= semStart && date <= semEnd;
        const isToday    = dateStr === todayStr;
        
        // ── 제출 동그라미 ──────────────────────────────────────
        const submittedIds = submissions[dateStr] || [];
        const colors = submittedIds.map(id => {
            const idx = cachedStudentOrder.indexOf(id);
            return idx >= 0 ? MEMBER_COLORS[idx % MEMBER_COLORS.length] : '#999';
        });
        const allDone = colors.length >= totalStudents && totalStudents > 0;
        const dotHTML = buildDotHTML(colors, allDone);
        
        // 로컬 이벤트
        const events     = calendarEvents[dateStr] || [];
        const eventCount = events.length;
        
        let cellClass = `work-calendar-cell clickable-cell${isToday ? ' today-cell' : ''}${!inSemester ? ' out-semester' : ''}${allDone ? ' all-done-cell' : ''}`;
        
        html += `<div class="${cellClass}" onclick="showDatePanel('${dateStr}')">`;
        html += `<div class="work-day-number">${day}</div>`;
        
        // 동그라미 표시
        if (dotHTML) html += dotHTML;
        
        // 로컬 이벤트 미리보기
        if (eventCount > 0) {
            html += '<div class="event-preview">';
            const title = events[0].title.length > 10 ? events[0].title.substring(0,10)+'…' : events[0].title;
            html += `<div class="preview-item">${events[0].time ? `<span class="preview-time">${events[0].time.substring(0,5)}</span> ` : ''}<span class="preview-title">${title}</span></div>`;
            if (eventCount > 1) html += `<div class="preview-more">+${eventCount-1}</div>`;
            html += '</div>';
        }
        
        html += '</div>';
    }
    
    html += '</div>';
    
    // ── 범례: 멤버별 색상 ─────────────────────────────────────
    html += '<div style="padding:8px 12px 6px;display:flex;flex-wrap:wrap;gap:5px 10px;background:#fff;border-top:1px solid #eee;">';
    MEMBER_COLORS.forEach((color, i) => {
        html += `<span style="display:inline-flex;align-items:center;gap:3px;font-size:11px;color:#555;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};"></span>
            ${STUDENT_SHORT_NAMES[i] || 'STU00'+(i+1)}
        </span>`;
    });
    html += '</div>';
    
    // ── 제출 현황 패널 + 이벤트 폼 ───────────────────────────
    html += `
    <div class="event-form-section">
        <div class="event-form-header">
            <h3 id="selected-date-display">날짜를 선택하세요</h3>
        </div>
        
        <div id="submission-status-area" style="display:none;padding:10px 14px;background:#fafafa;border-bottom:1px solid #eee;"></div>
        
        <div id="event-list-area" class="event-list-area" style="display: none;">
            <h4>Existing Events</h4>
            <div id="events-display"></div>
        </div>
        
        <div class="event-input-form">
            <button class="btn-add-event" onclick="toggleEventForm()">+ Add Event</button>
            
            <div id="event-form-fields" class="event-form-fields" style="display: none;">
                <div class="form-row">
                    <label>Event Title *</label>
                    <input type="text" id="event-title" placeholder="e.g., Team Meeting, Seminar, etc." />
                </div>
                <div class="form-row">
                    <label>Time</label>
                    <input type="time" id="event-time" />
                </div>
                <div class="form-row">
                    <label>Author / Organizer *</label>
                    <input type="text" id="event-author" placeholder="e.g., Kim Su-jin, Prof. Bae, etc." />
                </div>
                <div class="form-row">
                    <label>Location</label>
                    <input type="text" id="event-location" placeholder="e.g., Meeting Room A, Online, etc." />
                </div>
                <div class="form-row">
                    <label>Participants</label>
                    <input type="text" id="event-participants" placeholder="e.g., Prof. Bae, Research Team, etc." />
                </div>
                <div class="form-row">
                    <label>Description</label>
                    <textarea id="event-description" placeholder="Enter event details..." rows="4"></textarea>
                </div>
                <div class="form-buttons">
                    <button class="btn-save-event" onclick="saveEvent()">Save</button>
                    <button class="btn-cancel-event" onclick="cancelEventForm()">Cancel</button>
                </div>
            </div>
        </div>
    </div>`;
    
    container.innerHTML = html;
}

// ── 날짜 패널 표시 (제출 현황 포함) ──────────────────────────
async function showDatePanel(dateStr) {
    selectedDate = dateStr;
    
    const [y, m, d]   = dateStr.split('-').map(Number);
    const formattedDate = new Date(y, m-1, d).toLocaleDateString('ko-KR', {
        year:'numeric', month:'long', day:'numeric'
    });
    
    const dateDisplay = document.getElementById('selected-date-display');
    if (dateDisplay) dateDisplay.textContent = formattedDate;
    
    // ── 제출 현황 패널 ──────────────────────────────────────
    const statusArea = document.getElementById('submission-status-area');
    if (statusArea) {
        const key          = `${y}-${String(m).padStart(2,'0')}`;
        const submissions  = submissionCache[key] || {};
        const submittedIds = submissions[dateStr] || [];
        const total        = cachedStudentOrder.length || 9;
        const doneCount    = submittedIds.length;
        const allDone      = doneCount >= total && total > 0;
        
        const notYetNames = cachedStudentOrder
            .filter(id => !submittedIds.includes(id))
            .map(id => {
                const idx = cachedStudentOrder.indexOf(id);
                return STUDENT_SHORT_NAMES[idx] || id;
            });
        
        let statusHTML = `<div style="margin-bottom:8px;">
            <span style="font-weight:bold;font-size:13px;color:${allDone ? '#27ae60' : '#e67e22'};">
                ${allDone ? '✅ 전원 제출 완료' : '⏳ 제출 현황'} (${doneCount}/${total})
            </span>
        </div>`;
        
        statusHTML += '<div style="display:flex;flex-wrap:wrap;gap:5px;">';
        cachedStudentOrder.forEach((id, idx) => {
            const color = MEMBER_COLORS[idx % MEMBER_COLORS.length];
            const name  = STUDENT_SHORT_NAMES[idx] || id;
            const done  = submittedIds.includes(id);
            statusHTML += `<span style="
                display:inline-flex;align-items:center;gap:4px;
                padding:3px 8px;border-radius:12px;font-size:11px;font-weight:600;
                background:${done ? color+'20' : '#f0f0f0'};
                border:1px solid ${done ? color+'60' : '#ddd'};
                color:${done ? color : '#aaa'};">
                <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${done ? color : '#ccc'};"></span>
                ${name} ${done ? '✓' : '–'}
            </span>`;
        });
        statusHTML += '</div>';
        
        if (notYetNames.length > 0) {
            statusHTML += `<div style="margin-top:6px;font-size:11px;color:#e74c3c;font-weight:500;">
                미제출: ${notYetNames.join(', ')}
            </div>`;
        }
        
        statusArea.innerHTML = statusHTML;
        statusArea.style.display = 'block';
    }
    
    // ── 로컬 이벤트 ──────────────────────────────────────────
    const events       = calendarEvents[dateStr] || [];
    const eventListArea = document.getElementById('event-list-area');
    const eventsDisplay = document.getElementById('events-display');
    
    if (eventListArea && eventsDisplay) {
        if (events.length === 0) {
            eventListArea.style.display = 'none';
        } else {
            eventListArea.style.display = 'block';
            let eventsHtml = '';
            events.forEach((event, idx) => {
                eventsHtml += `
                <div class="event-card">
                    <div class="event-card-header">
                        <strong>${event.time || 'All day'}</strong>
                        <button class="btn-delete-small" onclick="deleteEvent(${idx})">Delete</button>
                    </div>
                    <div class="event-card-title">${event.title}</div>
                    ${event.author      ? `<div class="event-card-info">✍️ ${event.author}</div>` : ''}
                    ${event.location    ? `<div class="event-card-info">📍 ${event.location}</div>` : ''}
                    ${event.participants? `<div class="event-card-info">👥 ${event.participants}</div>` : ''}
                    ${event.description ? `<div class="event-card-desc">${event.description}</div>` : ''}
                </div>`;
            });
            eventsDisplay.innerHTML = eventsHtml;
        }
    }
}

let selectedDate  = '';
let calendarEvents = {};
let isFormVisible  = false;

function toggleEventForm() {
    const formFields = document.getElementById('event-form-fields');
    isFormVisible = !isFormVisible;
    formFields.style.display = isFormVisible ? 'block' : 'none';
    
    if (isFormVisible && !selectedDate) {
        alert('Please select a date first');
        formFields.style.display = 'none';
        isFormVisible = false;
    }
}

function cancelEventForm() {
    document.getElementById('event-form-fields').style.display = 'none';
    isFormVisible = false;
    clearEventForm();
}

function clearEventForm() {
    ['event-title','event-time','event-author','event-location','event-participants'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const desc = document.getElementById('event-description');
    if (desc) desc.value = '';
}

function saveEvent() {
    if (!selectedDate) { alert('Please select a date first'); return; }
    
    const title        = document.getElementById('event-title').value.trim();
    const time         = document.getElementById('event-time').value;
    const author       = document.getElementById('event-author').value.trim();
    const location     = document.getElementById('event-location').value.trim();
    const participants = document.getElementById('event-participants').value.trim();
    const description  = document.getElementById('event-description').value.trim();
    
    if (!title)  { alert('Please enter an event title'); return; }
    if (!author) { alert('Please enter the author/organizer name'); return; }
    
    if (!calendarEvents[selectedDate]) calendarEvents[selectedDate] = [];
    calendarEvents[selectedDate].push({ title, time, author, location, participants, description });
    
    try {
        localStorage.setItem('blesslab_calendar_events', JSON.stringify(calendarEvents));
    } catch (e) { console.error('Failed to save:', e); }
    
    cancelEventForm();
    showDatePanel(selectedDate);
    alert('✅ Event saved successfully!');
}

function deleteEvent(index) {
    if (confirm('Are you sure you want to delete this event?')) {
        calendarEvents[selectedDate].splice(index, 1);
        if (calendarEvents[selectedDate].length === 0) delete calendarEvents[selectedDate];
        
        try {
            localStorage.setItem('blesslab_calendar_events', JSON.stringify(calendarEvents));
        } catch (e) { console.error('Failed to save:', e); }
        
        showDatePanel(selectedDate);
        alert('✅ Event deleted');
    }
}

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
