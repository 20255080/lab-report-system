// Global state
let students = [];
let currentStudentId = '';
let currentWeeklyStudentId = '';
let currentDailyReportId = '';
let currentWeeklyReportId = '';

// Date utilities
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${formatDate(monday)} ~ ${formatDate(sunday)}`;
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Firebase student data
    await initializeStudents();
    
    // Set today's date
    const today = formatDate(new Date());
    document.getElementById('report-date').value = today;
    document.getElementById('weekly-date').value = today;
    document.getElementById('view-start-date').value = today;
    document.getElementById('view-end-date').value = today;

    // Load student list
    await loadStudents();

    // Tab switch event
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Student selection event
    document.getElementById('student-select').addEventListener('change', (e) => {
        currentStudentId = e.target.value;
        // Auto-fill if date is already selected
        const reportDate = document.getElementById('report-date').value;
        if (currentStudentId && reportDate) {
            const student = students.find(s => s.id === currentStudentId);
            if (student && typeof autoFillDailyReport !== 'undefined') {
                autoFillDailyReport(student.name, reportDate);
            }
        }
    });

    document.getElementById('weekly-student-select').addEventListener('change', (e) => {
        currentWeeklyStudentId = e.target.value;
    });
    
    // Date selection - auto-fill when changed
    document.getElementById('report-date').addEventListener('change', (e) => {
        const reportDate = e.target.value;
        if (currentStudentId && reportDate) {
            const student = students.find(s => s.id === currentStudentId);
            if (student && typeof autoFillDailyReport !== 'undefined') {
                autoFillDailyReport(student.name, reportDate);
            }
        }
    });

    // Update week information
    document.getElementById('weekly-date').addEventListener('change', (e) => {
        updateWeekInfo(e.target.value);
    });
    updateWeekInfo(today);

    // Save daily report
    document.getElementById('save-daily-btn').addEventListener('click', saveDailyReportFromForm);

    // Load today's report
    document.getElementById('load-today-btn').addEventListener('click', loadTodayReport);

    // Save weekly summary
    document.getElementById('save-weekly-btn').addEventListener('click', saveWeeklySummaryFromForm);

    // Load this week's summary
    document.getElementById('load-weekly-btn').addEventListener('click', loadThisWeekSummary);

    // Search button
    document.getElementById('search-btn').addEventListener('click', searchReports);
});

// 탭 전환
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-tab`).classList.add('active');
}

// Load student list
async function loadStudents() {
    try {
        students = await getStudents();

        const studentSelect = document.getElementById('student-select');
        const weeklyStudentSelect = document.getElementById('weekly-student-select');
        const viewStudentSelect = document.getElementById('view-student-select');

        students.forEach(student => {
            const option1 = document.createElement('option');
            option1.value = student.id;
            option1.textContent = student.name;
            studentSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = student.id;
            option2.textContent = student.name;
            weeklyStudentSelect.appendChild(option2);

            const option3 = document.createElement('option');
            option3.value = student.id;
            option3.textContent = student.name;
            viewStudentSelect.appendChild(option3);
        });
    } catch (error) {
        console.error('Failed to load student list:', error);
        showMessage('Unable to load student list.', 'error');
    }
}

// Update week information
function updateWeekInfo(dateStr) {
    if (!dateStr) return;
    const date = new Date(dateStr);
    const { year, week } = getWeekNumber(date);
    const range = getWeekRange(date);
    document.getElementById('week-info').textContent = `${year} Week ${week}: ${range}`;
}

// Save daily report (UI function)
async function saveDailyReportFromForm() {
    const studentId = document.getElementById('student-select').value;
    const reportDate = document.getElementById('report-date').value;
    let todayWork = document.getElementById('today-work').value.trim();
    const workHours = document.getElementById('work-hours').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!studentId || !reportDate) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Auto-fill work description if empty
    if (!todayWork && typeof getClassesForDate !== 'undefined') {
        const classes = getClassesForDate(reportDate);
        let autoWork = '';
        
        classes.forEach(cls => {
            if (cls.isPaperDay) {
                const presenters = cls.presenters || [];
                if (presenters.includes(student.name)) {
                    autoWork += `• 09:00-18:00 Progress Meeting (Presenter)\n`;
                }
            } else if (cls.students && cls.students.includes(student.name)) {
                autoWork += `• ${cls.time} ${cls.name} (${cls.room})\n`;
            }
        });
        
        if (autoWork) {
            todayWork = '【Classes】\n' + autoWork + '\n【Research & Lab Work】\n(Add your research work)';
        }
    }

    if (!todayWork || !workHours) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    try {
        const reportData = {
            student_id: studentId,
            student_name: student.name,
            report_date: reportDate,
            today_work: todayWork,
            work_hours: workHours,
            notes: notes
        };

        const result = await saveDailyReport(reportData);
        currentDailyReportId = result.id;
        
        showMessage('Report saved successfully.', 'success');
        clearDailyForm();
        await loadDailyFeedback(result.id);
        
        // Refresh calendar
        if (typeof renderCalendar === 'function') {
            await renderCalendar();
        }
    } catch (error) {
        console.error('Report save failed:', error);
        showMessage('Failed to save report.', 'error');
    }
}

// Load today's report
async function loadTodayReport() {
    const studentId = document.getElementById('student-select').value;
    const reportDate = document.getElementById('report-date').value;

    if (!studentId || !reportDate) {
        showMessage('Please select a member and date.', 'error');
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
            showMessage('Report loaded successfully.', 'success');
            await loadDailyFeedback(report.id);
        } else {
            // No existing report - auto-fill with today's classes
            if (typeof getClassesForDate !== 'undefined') {
                autoFillDailyReport(student.name, reportDate);
            } else {
                showMessage('No report found for this date.', 'error');
            }
        }
    } catch (error) {
        console.error('Failed to load report:', error);
        showMessage('Unable to load report.', 'error');
    }
}

// Auto-fill daily report with class schedule
function autoFillDailyReport(studentName, dateStr) {
    if (typeof getClassesForDate === 'undefined') return;
    
    const classes = getClassesForDate(dateStr);
    let workDescription = '';
    let totalMinutes = 0;
    
    // Get classes for this student
    const studentClasses = [];
    let isPaperDay = false;
    
    classes.forEach(cls => {
        if (cls.isPaperDay) {
            // Check if this student is presenting this week
            const presenters = cls.presenters || [];
            if (presenters.includes(studentName)) {
                isPaperDay = true;
                // Paper day: just add 1 hour placeholder
                studentClasses.push({
                    time: '',
                    name: 'Progress Meeting',
                    duration: 60 // 1 hour
                });
                totalMinutes += 60;
            }
            // If not a presenter, don't add anything (no paper day for this student)
        } else if (cls.students && cls.students.includes(studentName)) {
            studentClasses.push({
                time: cls.time,
                name: `${cls.name} (${cls.room})`,
                duration: cls.duration
            });
            totalMinutes += cls.duration;
        }
    });
    
    if (isPaperDay) {
        // Friday - Paper day
        workDescription = '【Progress Meeting】\n• \n\n【Daily Work】\n• \n• \n• ';
    } else if (studentClasses.length > 0) {
        // Regular class day
        workDescription = '【Classes】\n';
        studentClasses.forEach(cls => {
            if (cls.time) {
                workDescription += `• ${cls.time} ${cls.name}\n`;
            }
        });
        workDescription += '\n【Daily Work】\n';
        workDescription += '• \n• \n• ';
    } else {
        // No classes
        workDescription = '【Daily Work】\n• \n• \n• ';
    }
    
    document.getElementById('today-work').value = workDescription;
    
    // Convert minutes to hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const classTime = minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    
    if (isPaperDay) {
        document.getElementById('work-hours').value = `${classTime} (progress meeting) + ___ (daily work)`;
    } else if (totalMinutes > 0) {
        document.getElementById('work-hours').value = `${classTime} (classes) + ___ (daily work)`;
    } else {
        document.getElementById('work-hours').value = '___ (daily work)';
    }
    
    showMessage(`Auto-filled with ${studentClasses.length} class(es). Please add your daily work.`, 'success');
}

// Save weekly summary (UI function)
async function saveWeeklySummaryFromForm() {
    const studentId = document.getElementById('weekly-student-select').value;
    const dateStr = document.getElementById('weekly-date').value;
    const summary = document.getElementById('weekly-summary').value.trim();

    if (!studentId || !dateStr || !summary) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const date = new Date(dateStr);
    const { year, week } = getWeekNumber(date);
    const weekRange = getWeekRange(date);

    try {
        const summaryData = {
            student_id: studentId,
            student_name: student.name,
            year: year,
            week: week,
            week_range: weekRange,
            summary: summary,
            attachments: [] // 첨부 파일 정보
        };

        const result = await saveWeeklySummary(summaryData);
        currentWeeklyReportId = result.id;
        
        showMessage('Weekly work saved successfully.', 'success');
        document.getElementById('weekly-summary').value = '';
        await loadWeeklyFeedback(result.id);
        
        // Refresh calendar
        if (typeof renderCalendar === 'function') {
            await renderCalendar();
        }
    } catch (error) {
        console.error('Failed to save weekly work:', error);
        showMessage('Failed to save weekly work.', 'error');
    }
}

// Load this week's summary
async function loadThisWeekSummary() {
    const studentId = document.getElementById('weekly-student-select').value;
    const dateStr = document.getElementById('weekly-date').value;

    if (!studentId || !dateStr) {
        showMessage('Please select a member and date.', 'error');
        return;
    }

    const date = new Date(dateStr);
    const { year, week } = getWeekNumber(date);

    try {
        const summary = await getWeeklySummaryById(studentId, year, week);

        if (summary) {
            currentWeeklyReportId = summary.id;
            document.getElementById('weekly-summary').value = summary.summary || '';
            showMessage('Weekly work loaded successfully.', 'success');
            await loadWeeklyFeedback(summary.id);
        } else {
            showMessage('No work report found for this week.', 'error');
        }
    } catch (error) {
        console.error('Failed to load weekly summary:', error);
        showMessage('Unable to load weekly summary.', 'error');
    }
}

// Search reports
async function searchReports() {
    const studentId = document.getElementById('view-student-select').value;
    const viewType = document.getElementById('view-type').value;
    const startDate = document.getElementById('view-start-date').value;
    const endDate = document.getElementById('view-end-date').value;

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '<div class="loading">Searching...</div>';

    try {
        if (viewType === 'daily') {
            await searchDailyReports(studentId, startDate, endDate, resultsContainer);
        } else {
            await searchWeeklySummaries(studentId, resultsContainer);
        }
    } catch (error) {
        console.error('Search failed:', error);
        resultsContainer.innerHTML = '<div class="message error">Search failed.</div>';
    }
}

// Search daily reports
async function searchDailyReports(studentId, startDate, endDate, container) {
    try {
        let reports = await getDailyReports(studentId, startDate, endDate);

        if (reports.length === 0) {
            container.innerHTML = '<div class="no-data">조회 결과가 없습니다.</div>';
            return;
        }

        // Fetch feedback for each report
        try {
            for (let report of reports) {
                const feedbacks = await getFeedbacksByReportId(report.id, 'daily');
                report.feedbacks = feedbacks || [];
            }
        } catch (fbError) {
            console.warn('Failed to load feedback:', fbError);
            // Show feedback failed to load but still show reports
        }

        // Display as table
        let html = '<table class="report-table"><thead><tr>';
        html += '<th>Date</th><th>Name</th><th>Work Description</th><th>Hours</th><th>Notes</th><th>Feedback</th>';
        html += '</tr></thead><tbody>';

        reports.forEach(report => {
            html += '<tr>';
            html += `<td>${report.report_date}</td>`;
            html += `<td>${report.student_name}</td>`;
            html += `<td><pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${report.today_work || ''}</pre></td>`;
            html += `<td>${report.work_hours || '-'}</td>`;
            html += `<td><pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${report.notes || '-'}</pre></td>`;
            html += '<td>';
            
            // Show feedback count
            const feedbackCount = (report.feedbacks && report.feedbacks.length) || 0;
            
            if (feedbackCount > 0) {
                html += `<div style="margin-bottom: 8px; padding: 10px; background: #e8f5e9; border-radius: 4px; border-left: 4px solid #4caf50;">`;
                html += `<strong style="color: #2e7d32;">💬 Feedback: ${feedbackCount}</strong>`;
                html += `<div style="margin-top: 8px;">`;
                
                report.feedbacks.forEach((fb, idx) => {
                    html += `<div style="background: white; padding: 8px; margin-top: ${idx > 0 ? '8px' : '0'}; border-radius: 4px; border: 1px solid #ddd; position: relative;">`;
                    html += `<button onclick="deleteFeedback('${fb.id}', '${report.id}')" style="position: absolute; top: 8px; right: 8px; background: #f44336; color: white; border: none; border-radius: 3px; padding: 4px 8px; cursor: pointer; font-size: 0.85em;">Delete</button>`;
                    html += `<div style="font-weight: 600; color: #1976d2; margin-bottom: 4px; padding-right: 50px;">${fb.feedback_by}</div>`;
                    html += `<div style="color: #424242;">${fb.feedback_content}</div>`;
                    html += `<div style="font-size: 0.85em; color: #9e9e9e; margin-top: 4px;">${new Date(fb.feedback_date).toLocaleString('en-US')}</div>`;
                    html += `</div>`;
                });
                
                html += `</div></div>`;
            } else {
                html += `<div style="color: #9e9e9e; font-size: 0.9em; margin-bottom: 8px;">💬 No Feedback</div>`;
            }
            
            html += `<button class="btn btn-feedback" onclick="showFeedbackForm('${report.id}', 'daily', '${report.student_name}', '${report.report_date}')">Write Feedback</button>`;
            html += '</td>';
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Search failed:', error);
        container.innerHTML = '<div class="message error">Search failed: ' + error.message + '</div>';
    }
}

// Search weekly summaries
async function searchWeeklySummaries(studentId, container) {
    try {
        const summaries = await getWeeklySummaries(studentId);

        if (summaries.length === 0) {
            container.innerHTML = '<div class="no-data">조회 결과가 없습니다.</div>';
            return;
        }

        // Fetch feedback for each summary
        try {
            for (let summary of summaries) {
                const feedbacks = await getFeedbacksByReportId(summary.id, 'weekly');
                summary.feedbacks = feedbacks || [];
            }
        } catch (fbError) {
            console.warn('Failed to load feedback:', fbError);
            // Show feedback failed to load but still show summaries
        }

        // Display as table
        let html = '<table class="report-table"><thead><tr>';
        html += '<th>Name</th><th>Year</th><th>Week</th><th>Period</th><th>Weekly Work Summary</th><th>Feedback</th>';
        html += '</tr></thead><tbody>';

        summaries.forEach(summary => {
            html += '<tr>';
            html += `<td>${summary.student_name}</td>`;
            html += `<td>${summary.year}</td>`;
            html += `<td>${summary.week}W</td>`;
            html += `<td>${summary.week_range}</td>`;
            html += `<td><pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${summary.summary || ''}</pre></td>`;
            html += '<td>';
            
            // Show feedback count
            const feedbackCount = (summary.feedbacks && summary.feedbacks.length) || 0;
            
            if (feedbackCount > 0) {
                html += `<div style="margin-bottom: 8px; padding: 10px; background: #e8f5e9; border-radius: 4px; border-left: 4px solid #4caf50;">`;
                html += `<strong style="color: #2e7d32;">💬 Feedback: ${feedbackCount}</strong>`;
                html += `<div style="margin-top: 8px;">`;
                
                summary.feedbacks.forEach((fb, idx) => {
                    html += `<div style="background: white; padding: 8px; margin-top: ${idx > 0 ? '8px' : '0'}; border-radius: 4px; border: 1px solid #ddd; position: relative;">`;
                    html += `<button onclick="deleteFeedback('${fb.id}', '${summary.id}')" style="position: absolute; top: 8px; right: 8px; background: #f44336; color: white; border: none; border-radius: 3px; padding: 4px 8px; cursor: pointer; font-size: 0.85em;">Delete</button>`;
                    html += `<div style="font-weight: 600; color: #1976d2; margin-bottom: 4px; padding-right: 50px;">${fb.feedback_by}</div>`;
                    html += `<div style="color: #424242;">${fb.feedback_content}</div>`;
                    html += `<div style="font-size: 0.85em; color: #9e9e9e; margin-top: 4px;">${new Date(fb.feedback_date).toLocaleString('en-US')}</div>`;
                    html += `</div>`;
                });
                
                html += `</div></div>`;
            } else {
                html += `<div style="color: #9e9e9e; font-size: 0.9em; margin-bottom: 8px;">💬 No Feedback</div>`;
            }
            
            html += `<button class="btn btn-feedback" onclick="showFeedbackForm('${summary.id}', 'weekly', '${summary.student_name}', '${summary.week_range}')">Write Feedback</button>`;
            html += '</td>';
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Search failed:', error);
        container.innerHTML = '<div class="message error">Search failed: ' + error.message + '</div>';
    }
}

// Clear daily form
function clearDailyForm() {
    document.getElementById('today-work').value = '';
    document.getElementById('work-hours').value = '';
    document.getElementById('notes').value = '';
}

// Show message
function showMessage(text, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;

    const activeTab = document.querySelector('.tab-content.active');
    const firstSection = activeTab.querySelector('.form-section');
    firstSection.insertBefore(message, firstSection.firstChild);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Load daily report feedback
async function loadDailyFeedback(reportId) {
    if (!reportId) return;
    
    try {
        const feedbacks = await getFeedbacksByReportId(reportId, 'daily');
        
        const container = document.getElementById('daily-feedback-container');
        const content = document.getElementById('daily-feedback-content');
        
        if (feedbacks.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        let html = '';
        feedbacks.forEach(fb => {
            html += '<div class="feedback-item">';
            html += `<div class="feedback-meta"><span>By: ${fb.feedback_by}</span><span>${fb.feedback_date}</span></div>`;
            html += `<div class="feedback-text">${fb.feedback_content}</div>`;
            html += '</div>';
        });
        
        content.innerHTML = html;
        container.style.display = 'block';
    } catch (error) {
        console.error('피드백 로드 실패:', error);
    }
}

// Load weekly summary feedback
async function loadWeeklyFeedback(reportId) {
    if (!reportId) return;
    
    try {
        const feedbacks = await getFeedbacksByReportId(reportId, 'weekly');
        
        const container = document.getElementById('weekly-feedback-container');
        const content = document.getElementById('weekly-feedback-content');
        
        if (feedbacks.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        let html = '';
        feedbacks.forEach(fb => {
            html += '<div class="feedback-item">';
            html += `<div class="feedback-meta"><span>By: ${fb.feedback_by}</span><span>${fb.feedback_date}</span></div>`;
            html += `<div class="feedback-text">${fb.feedback_content}</div>`;
            html += '</div>';
        });
        
        content.innerHTML = html;
        container.style.display = 'block';
    } catch (error) {
        console.error('피드백 로드 실패:', error);
    }
}

// Show feedback form
function showFeedbackForm(reportId, reportType, studentName, dateInfo) {
    const resultsContainer = document.getElementById('results-container');
    
    const formHtml = `
        <div class="feedback-form" id="feedback-form-${reportId}">
            <h4>${studentName} - ${dateInfo} Write Feedback</h4>
            <input type="text" id="feedback-author-${reportId}" placeholder="Author Name" value="Prof. Hyokwan Bae (배효관)" />
            <textarea id="feedback-text-${reportId}" placeholder="Enter feedback content"></textarea>
            <div class="feedback-actions">
                <button class="btn btn-feedback" onclick="saveFeedbackToDb('${reportId}', '${reportType}', '${studentName}')">Save Feedback</button>
                <button class="btn btn-cancel" onclick="closeFeedbackForm('${reportId}')">Cancel</button>
            </div>
        </div>
    `;
    
    // Remove existing form if any
    const existingForm = document.getElementById(`feedback-form-${reportId}`);
    if (existingForm) {
        existingForm.remove();
    } else {
        // Add new form
        resultsContainer.insertAdjacentHTML('afterbegin', formHtml);
    }
}

// Close feedback form
function closeFeedbackForm(reportId) {
    const form = document.getElementById(`feedback-form-${reportId}`);
    if (form) {
        form.remove();
    }
}

// Save feedback
async function saveFeedbackToDb(reportId, reportType, studentName) {
    const author = document.getElementById(`feedback-author-${reportId}`).value.trim();
    const content = document.getElementById(`feedback-text-${reportId}`).value.trim();
    
    if (!author || !content) {
        alert('Please enter both author and feedback content.');
        return;
    }
    
    try {
        // Find student ID
        const student = students.find(s => s.name === studentName);
        const studentId = student ? student.id : '';
        
        const feedbackData = {
            report_id: reportId,
            report_type: reportType,
            student_id: studentId,
            student_name: studentName,
            feedback_content: content,
            feedback_by: author,
            feedback_date: formatDate(new Date()) + ' ' + new Date().toLocaleTimeString('en-US')
        };
        
        await saveFeedback(feedbackData);
        alert('Feedback saved successfully.');
        closeFeedbackForm(reportId);
    } catch (error) {
        console.error('Failed to save feedback:', error);
        alert('Failed to save feedback.');
    }
}

// Delete feedback
async function deleteFeedback(feedbackId, reportId) {
    if (!confirm('Are you sure you want to delete this feedback?')) {
        return;
    }
    
    try {
        await db.collection('feedbacks').doc(feedbackId).delete();
        alert('Feedback deleted successfully.');
        
        // Click search button again (refresh)
        document.getElementById('search-btn').click();
    } catch (error) {
        console.error('Failed to delete feedback:', error);
        alert('Failed to delete feedback.');
    }
}
