// Firestore 데이터베이스 헬퍼 함수들

// 컬렉션 참조
const studentsRef = db.collection('students');
const dailyReportsRef = db.collection('daily_reports');
const weeklySummariesRef = db.collection('weekly_summaries');
const feedbacksRef = db.collection('feedbacks');

// UUID 생성 함수
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 타임스탬프 생성
function getTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
}

// 학생 데이터 초기화
async function initializeStudents() {
    const snapshot = await studentsRef.get();
    
    // 학생 데이터가 없으면 초기 데이터 추가
    if (snapshot.empty) {
        const studentsData = [
            { id: "STU001", name: "Minkee Cho (조민기)", email: "minki@lab.ac.kr", status: "" },
            { id: "STU002", name: "Lee Hye-bin (이혜빈)", email: "hyebin@lab.ac.kr", status: "" },
            { id: "STU003", name: "Yoo Sung-il (유성일)", email: "seongil@lab.ac.kr", status: "" },
            { id: "STU004", name: "Kim Su-jin (김수진)", email: "sujin@lab.ac.kr", status: "" },
            { id: "STU005", name: "Kim Dong-woo (김동우)", email: "dongwoo@lab.ac.kr", status: "" },
            { id: "STU006", name: "Song Da-ye (송다예)", email: "daye@lab.ac.kr", status: "" },
            { id: "STU007", name: "Kim Dong-jin (김동진)", email: "dongjin@lab.ac.kr", status: "" },
            { id: "STU008", name: "Saqib", email: "saqib@lab.ac.kr", status: "" },
            { id: "STU009", name: "Jo Yu-kyung (조유경)", email: "yukyung@lab.ac.kr", status: "" }
        ];
        
        const batch = db.batch();
        studentsData.forEach(student => {
            const docRef = studentsRef.doc(student.id);
            batch.set(docRef, student);
        });
        await batch.commit();
        console.log('학생 데이터 초기화 완료');
    }
}

// Firestore CRUD 함수들

// 학생 목록 가져오기
async function getStudents() {
    const snapshot = await studentsRef.orderBy('id').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 일일 보고서 저장/수정
async function saveDailyReport(reportData) {
    // 기존 보고서 확인
    const querySnapshot = await dailyReportsRef
        .where('student_id', '==', reportData.student_id)
        .where('report_date', '==', reportData.report_date)
        .get();
    
    if (!querySnapshot.empty) {
        // 기존 보고서 수정
        const docId = querySnapshot.docs[0].id;
        await dailyReportsRef.doc(docId).update({
            ...reportData,
            updated_at: getTimestamp()
        });
        return { id: docId, ...reportData };
    } else {
        // 새 보고서 생성
        const docRef = dailyReportsRef.doc();
        await docRef.set({
            ...reportData,
            created_at: getTimestamp(),
            updated_at: getTimestamp()
        });
        return { id: docRef.id, ...reportData };
    }
}

// 일일 보고서 가져오기 (조건별)
async function getDailyReports(studentId = null, startDate = null, endDate = null) {
    let query = dailyReportsRef;
    
    // 특정 학생 조회
    if (studentId) {
        query = query.where('student_id', '==', studentId);
        const snapshot = await query.get();
        let reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // 클라이언트에서 날짜 필터링
        if (startDate) {
            reports = reports.filter(r => r.report_date >= startDate);
        }
        if (endDate) {
            reports = reports.filter(r => r.report_date <= endDate);
        }
        
        // 날짜순 정렬
        reports.sort((a, b) => b.report_date.localeCompare(a.report_date));
        return reports;
    }
    
    // 전체 조회 (날짜 범위)
    if (startDate) {
        query = query.where('report_date', '>=', startDate);
    }
    if (endDate) {
        query = query.where('report_date', '<=', endDate);
    }
    
    const snapshot = await query.orderBy('report_date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 특정 일일 보고서 가져오기
async function getDailyReportById(studentId, reportDate) {
    const querySnapshot = await dailyReportsRef
        .where('student_id', '==', studentId)
        .where('report_date', '==', reportDate)
        .get();
    
    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }
    return null;
}

// 주간 요약 저장/수정
async function saveWeeklySummary(summaryData) {
    // 기존 요약 확인
    const querySnapshot = await weeklySummariesRef
        .where('student_id', '==', summaryData.student_id)
        .where('year', '==', summaryData.year)
        .where('week', '==', summaryData.week)
        .get();
    
    if (!querySnapshot.empty) {
        // 기존 요약 수정
        const docId = querySnapshot.docs[0].id;
        await weeklySummariesRef.doc(docId).update({
            ...summaryData,
            updated_at: getTimestamp()
        });
        return { id: docId, ...summaryData };
    } else {
        // 새 요약 생성
        const docRef = weeklySummariesRef.doc();
        await docRef.set({
            ...summaryData,
            created_at: getTimestamp(),
            updated_at: getTimestamp()
        });
        return { id: docRef.id, ...summaryData };
    }
}

// 주간 요약 가져오기
async function getWeeklySummaries(studentId = null) {
    let query = weeklySummariesRef;
    
    if (studentId) {
        query = query.where('student_id', '==', studentId);
    }
    
    const snapshot = await query.get();
    const summaries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // 연도, 주차 역순 정렬
    summaries.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.week - a.week;
    });
    
    return summaries;
}

// 특정 주간 요약 가져오기
async function getWeeklySummaryById(studentId, year, week) {
    const querySnapshot = await weeklySummariesRef
        .where('student_id', '==', studentId)
        .where('year', '==', year)
        .where('week', '==', week)
        .get();
    
    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }
    return null;
}

// 피드백 저장
async function saveFeedback(feedbackData) {
    const docRef = feedbacksRef.doc();
    await docRef.set({
        ...feedbackData,
        created_at: getTimestamp()
    });
    return { id: docRef.id, ...feedbackData };
}

// 피드백 가져오기 (보고서 ID로)
async function getFeedbacksByReportId(reportId, reportType) {
    try {
        const snapshot = await feedbacksRef
            .where('report_id', '==', reportId)
            .where('report_type', '==', reportType)
            .get();
        
        // 클라이언트에서 정렬
        const feedbacks = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
        
        feedbacks.sort((a, b) => {
            const aTime = a.created_at || 0;
            const bTime = b.created_at || 0;
            return bTime - aTime;
        });
        
        return feedbacks;
    } catch (error) {
        console.error('피드백 조회 실패:', error);
        // 인덱스 에러면 report_id만으로 조회
        try {
            const snapshot = await feedbacksRef
                .where('report_id', '==', reportId)
                .get();
            
            const feedbacks = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(fb => fb.report_type === reportType);
            
            feedbacks.sort((a, b) => {
                const aTime = a.created_at || 0;
                const bTime = b.created_at || 0;
                return bTime - aTime;
            });
            
            return feedbacks;
        } catch (fallbackError) {
            console.error('피드백 조회 완전 실패:', fallbackError);
            return [];
        }
    }
}
