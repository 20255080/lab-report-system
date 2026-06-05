# 웹사이트 업데이트 파일

## 적용 방법

### 1. timetable.js
기존 `js/timetable.js`를 이 파일로 교체하세요.

변경 내용:
- 캘린더에 멤버별 고정 색상 동그라미 표시 (인원수만큼)
- 날짜 클릭 시 제출 현황 패널 (제출자/미제출자 표시)
- 9명 멤버 색상 범례 표시

### 2. calendar_addon.css
기존 `css/style.css` **맨 끝에** 이 내용을 추가하세요.

### 배포
```bash
firebase deploy --only hosting
```
