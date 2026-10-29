# 시연 프로그램 변경 기록 (KSIS-B 에 따라 반영할 것)

지시서(01~04)는 시연 프로그램 main `398cfd5` 화면을 기준으로 썼습니다.
그 뒤 시연 프로그램이 바뀌면 **여기에 항목을 하나씩 덧붙이고, 해당 단계 지시서 본문도 같이 고쳐** 늘 최신으로 둡니다.

## 따라가는 방법

1. 시연 프로그램을 새로 받습니다 : `git -C D:\ksis-ui-demo pull`
2. KSIS-B 의 Claude Code 에 한 줄로 시킵니다 :
   ```
   D:\ksis-ui-demo\docs\ksis-b-guide\changes.md 의 새 항목 반영해 줘
   ```
   - **이미 끝낸 단계**에 걸린 항목만 KSIS-B 에 고쳐 넣으면 됩니다.
   - **아직 안 한 단계**에 걸린 항목은 따로 할 필요가 없습니다. 그 단계 지시서 본문이 이미 고쳐져 있어서 그 단계를 진행할 때 같이 들어갑니다.
   - **지금 하고 있는 단계**에 걸린 항목은 그 단계를 마무리하기 전에 같이 반영합니다.
   - KSIS-B 쪽 커밋 메시지에 항목 번호(예 : `C-001`)를 넣어 두면 어디까지 반영했는지 알기 쉽습니다.

## 항목 양식

```
### C-000 · 날짜 · 시연 프로그램 커밋 · 한 줄 제목
- 요구사항 : 비교표 몇 번
- 단계 : 02-layout.md 의 2-3 (본문도 고쳐 둠)
- KSIS-B 에 적용할 것 : 정확한 값 · 동작
- 참고 파일 : ksis-common.css 의 어느 규칙 / ksis-theme-b.css 의 어느 변수 / ksis-layout.js …
- 해당 : A·B 모두 / A 만(KSIS-B 는 할 일 없음)
```

## 항목

(`398cfd5` 뒤의 `ca65ac8` 은 시연 프로그램 첫 화면의 빌드 시각 · `run.bat` 만 바꿔 KSIS-B 화면과 상관없습니다.)

### C-001 · 2026-10-28 · 커밋 메시지가 `C-001` 로 시작하는 커밋 · 대분류를 접으면 흔적 없앰
- 요구사항 : 비교표 11번(선택·마우스 올림 색) — 대분류 흔적 2안 보완
- 단계 : 02-layout.md 의 2-3 (본문 · 확인 표 · 완성 그림 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 보는 화면이 든 대분류의 흔적(`.has-active`, #03C75A 50% 바탕 + 흰 굵은 글자)은 **그 대분류를 펼쳐 둔 동안만** 보입니다.
  - 대분류를 접으면 흔적이 없어져 다른 접힌 대분류와 똑같이 보입니다(바탕 없음, 굵기 500, 올리면 보통 올림 색 흰색 12%). 다시 펼치면 흔적이 다시 보입니다.
  - 고칠 곳은 CSS 한 군데 : `.sidebar-group-header.has-active` 와 `:hover` 규칙의 선택자를 `.sidebar-group-header.expanded.has-active` · `.sidebar-group-header.expanded.has-active:hover` 로 바꿉니다. `has-active` 클래스를 붙이는 코드는 그대로 둡니다(접어도 붙어 있음).
  - 확인 : 소메뉴 하나를 열고 → 그 대분류에 흔적 보임 → 그 대분류를 접음 → 흔적 없음 → 다시 펼침 → 흔적 보임.
- 참고 파일 : `ksis-common.css` 의 `.k-menu-group-header.expanded.has-active` 규칙, `img/step2-menu-parent-mark.png` · `img/step2-menu-parent-folded.png`
- 해당 : A·B 모두

### C-002 · 2026-10-28 · 커밋 메시지가 `C-002~C-007` 로 시작하는 커밋 · ≡ 세 줄을 화면 픽셀에 맞춰 그림
- 요구사항 : 비교표 4번(좌측 메뉴 접기)
- 단계 : 02-layout.md 의 2-1(≡ 버튼 CSS) · 2-4 (2) 가로바 재기 JS(`snapHamburger`) · 2-6 확인 표 (본문 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 지금 ≡ 는 줄 두께 `calc(2 * var(--ui-y))` 라 창 크기 · Edge 확대 비율에 따라 1.75px 같은 소수점이 되고, 세 줄이 화면 픽셀에 다르게 걸려 한 줄만 굵거나 흐려 보입니다(깨져 보임).
  - `.hamburger-btn` : `justify-content: center; align-items: flex-start; gap: var(--k-ham-gap, calc(5 * var(--ui-y)));`, `span` : `flex: 0 0 auto; width: var(--k-ham-w, 100%); height: var(--k-ham-line, calc(2 * var(--ui-y)));`
  - `ksisLayout.measureHead` 에서 `snapHamburger()` 를 부르고(줄 두께 = 높이의 1/8, 두께 · 간격 · 폭을 화면 픽셀 정수 개로 반올림해 `--k-ham-line` · `--k-ham-gap` · `--k-ham-w` 로 넣음), `--k-px`(= 1 / devicePixelRatio px)도 같이 넣습니다. 창 크기 · 확대 비율 · 모니터가 바뀔 때마다 다시 잽니다. 코드는 2-4 (2) 그대로 옮기면 됩니다.
  - 확인 : 창 높이를 여러 번 바꾸고 Ctrl + 휠로 확대 비율을 90 · 110 · 125 · 150% 로 바꿔도 세 줄이 같은 두께 · 같은 간격.
- 참고 파일 : `ksis-common.css` 의 `.k-hamburger` 규칙, `ksis-layout.js` 의 `measureHead` · `snapHamburger` · `watchDpr`
- 해당 : A·B 모두

### C-003 · 2026-10-28 · 같은 커밋 · 좌측 메뉴 줄 높이 70%
- 요구사항 : 비교표 11번(선택 · 마우스 올림 색) — 줄 높이
- 단계 : 02-layout.md 의 2-3 "줄 높이" (본문 · 완성 그림 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 대분류 · 소메뉴 한 줄 높이 = 38.9px 의 70% = **27.2px**(1920 폭 기준, `--sb-pad` · `--sb-font` 배율 그대로). 글자 크기 · 좌우 여백 · 줄 사이 간격은 그대로.
  - `.sidebar-menu { --k-menu-row-h: calc(.7 * (20 * var(--sb-pad) + 18.9 * var(--sb-font))); }`
  - `.sidebar-group-header` : `height: var(--k-menu-row-h); padding: 0 calc(12 * var(--sb-pad)) 0 calc(14 * var(--sb-pad));`
  - `.app-sidebar .sidebar-item`(세 선택자 모두) : `height: var(--k-menu-row-h); padding-top: 0; padding-bottom: 0; line-height: var(--k-menu-row-h);`
- 참고 파일 : `ksis-common.css` 의 `.k-menu`(`--k-menu-row-h`) · `.k-menu-group-header` · `.k-menu-item`
- 해당 : A·B 모두

### C-004 · 2026-10-28 · 같은 커밋 · 좌측 메뉴 마우스 휠 스크롤(스크롤바 없음)
- 요구사항 : 비교표 9번(대분류를 열 때 다른 대분류)
- 단계 : 02-layout.md 의 2-3 "바탕 · 그림자" CSS · "[9번] 휠 스크롤" (본문 · 그림 `img/step2-menu-scroll.png` 추가)
- KSIS-B 에 적용할 것 :
  - 대분류를 많이 펼쳐 메뉴가 화면 아래로 넘치면 메뉴 위에서 마우스 휠로 위아래로 굴러가게. 세로 스크롤바는 그리지 않음.
  - `.app-sidebar` : `overflow: hidden` → `overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none;` + `.app-sidebar::-webkit-scrollbar { display: none; }`
  - 확인 : 대분류를 모두 펼치고 메뉴 위에서 휠 → 메뉴만 굴러가 마지막 소메뉴 아래 여백까지 보임, 업무 화면은 안 움직임, 스크롤바 안 보임.
- 참고 파일 : `ksis-common.css` 의 `.k-sidebar` · `.k-sidebar::-webkit-scrollbar`
- 해당 : A·B 모두

### C-005 · 2026-10-28 · 같은 커밋 · 대분류 이름 오른쪽 가로선
- 요구사항 : 비교표 8번(단계와 표시)
- 단계 : 01-variables.md(`--k-menu-line` 추가) · 02-layout.md 의 2-3 "대분류 가로선" (본문 · 그림 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 테마 변수 `--k-menu-line: rgba(255, 255, 255, .35);`
  - `.sidebar-group-header::after { content: ""; flex: 1 1 auto; min-width: calc(8 * var(--sb-pad)); height: var(--k-px, 1px); margin-left: calc(4 * var(--sb-pad)); background: var(--k-menu-line); }` → 이름 끝 10px 뒤부터 줄 오른쪽 끝 12px 앞까지(오른쪽 여백 12px 는 C-003 의 padding). 이름이 길면 선이 짧아짐.
  - 두께 `--k-px` 는 C-002 의 JS 가 줍니다(화면 픽셀 1개).
- 참고 파일 : `ksis-common.css` 의 `.k-menu-group-header::after`, `ksis-theme-b.css` 의 `--k-menu-line`
- 해당 : A·B 모두

### C-006 · 2026-10-28 · 같은 커밋 · 날짜 달력 버튼을 입력칸 안으로
- 요구사항 : 비교표 41번(날짜 입력)
- 단계 : 03-controls.md 의 3-6 (본문 · `img/step3-search.png` 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 입력칸 폭 · 높이는 그대로, 달력 버튼만 32 → 20px(모서리 6, 아이콘 13px)로 줄여 입력칸 안 오른쪽 끝(테두리와 4px)에 넣음. 글자는 버튼 앞까지(오른쪽 안쪽 여백 26px).
  - `.date-input-wrap { position: relative; }`, `.date-input-wrap .text-input { padding-right: 26px; }`, `.date-picker-btn { position: absolute; top: 50%; right: 5px; width: 20px; height: 20px; margin-top: -10px; border-radius: 6px; }`, `.date-picker-btn svg { width: 13px; height: 13px; }`
- 참고 파일 : `ksis-common.css` 의 `.k-date` · `.k-date .k-input` · `.k-date-btn`
- 해당 : A·B 모두

### C-007 · 2026-10-28 · 같은 커밋 · 검색 영역 간격 두 가지(6px / 12px)
- 요구사항 : 비교표 38번(검색 영역) · 48번(간격)
- 단계 : 03-controls.md 의 3-2 (본문 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 같은 것끼리 6px(라벨 ↔ 그 입력칸, 날짜 ~ 날짜, [검색] ↔ [해제]), 다른 것끼리 12px(입력칸 → 다음 라벨, 모드 버튼 → 라벨, 마지막 입력칸 → [검색]).
  - `.search-area .data-options-left > label:not(:first-child), .search-area .data-options-left > :not(.btn) + .btn { margin-left: 6px; }` (기본 gap 6px + 6px). 라벨에 직접 쓴 `margin-left:10px` 는 지움.
- 참고 파일 : `ksis-common.css` 의 `.k-search > label:not(:first-child)` 규칙
- 해당 : A·B 모두

### C-008 · 2026-10-28 · 커밋 메시지가 `C-008` 로 시작하는 커밋 · 좌측 메뉴 바탕 그라데이션을 Trello 다크 보드식으로
- 요구사항 : 비교표 11번(선택 · 마우스 올림 색) — 메뉴 바탕
- 단계 : 01-variables.md(`--k-menu-grad-start/end`) · 02-layout.md 의 2-3 "바탕 · 그림자" CSS · 2-6 확인 표 (본문 · 완성 그림 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 사용자가 대기업 화면 3곳(SAP Fiori · Spotify · Trello)의 그라데이션 시안 중 **3안 Trello(Atlassian) 다크 보드식**을 골랐습니다 : 같은 색 두 단계를 135° 대각선으로, 왼쪽 위가 조금 밝고 오른쪽 아래가 어둡게.
  - 테마 변수 : `--k-menu-grad-start: #275235; --k-menu-grad-end: #153921;` (지금 #338B53 / #3A9259 를 바꿈. 가로바 #006B35 보다 채도를 낮춘 짙은 초록)
  - `.app-sidebar` 의 `background: linear-gradient(to bottom right, …)` → `linear-gradient(135deg, var(--k-menu-grad-start) 0%, var(--k-menu-grad-end) 100%)` (방향도 `135deg` 로)
  - 글자 #E6F4EB · 올림 흰 12% · 선택 #03C75A 채움 · 대분류 흔적 50% · 가로선 흰 35% 는 그대로. 메뉴 그림자도 그대로.
  - 확인 : 1920×1080 에서 메뉴 왼쪽 위가 #275235, 오른쪽 아래가 #153921 에 가깝고, 흰 글자 · 초록 선택 줄이 또렷한지.
- 참고 파일 : `ksis-theme-b.css` 의 `--k-menu-grad-start/end`, `ksis-common.css` 의 `.k-sidebar background`
- 해당 : A·B 모두 (A 는 #223661 → #152341)

### C-009 · 2026-10-28 · 커밋 메시지가 `C-009` 로 시작하는 커밋 · 좌측 메뉴 글자 · 여백을 창 너비와 무관하게 고정
- 요구사항 : 비교표 3번(좌측 메뉴 폭)
- 단계 : 01-variables.md 1-1 (주의 글) · 02-layout.md 2-3 "폭 [3번]" · 2-6 확인 표 (본문 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - `app.css` 화면 배율 부분 `:root` 에서 `--sb-pad: clamp(0.5px, calc(100vw / 1920), 1px);` → `--sb-pad: 1px;`, `--sb-font: clamp(0.8px, calc(100vw / 1344), 1px);` → `--sb-font: 1px;`
  - 이유 : 메뉴 폭이 240px 고정(2단계)이 된 뒤에도 이 두 배율 변수 때문에 창 폭 1920px 아래에서 안쪽 여백 · 줄 높이가, 1344px 아래에서 글자(최소 10.8px)가 줄고 있었습니다. 폭이 안 줄면 글자 · 여백도 줄 이유가 없습니다.
  - 두 변수는 좌측 메뉴 규칙(`.app-sidebar` 안 여백 · 글자 · 줄 높이 · 토글 폭)에서만 쓰므로 다른 화면에는 영향이 없습니다. `calc(N * var(--sb-pad))` 식은 그대로 둬도 Npx 가 됩니다.
  - 확인 : 창 폭을 1000px 까지 좁혀도 소메뉴 글자 13.5px · 줄 높이 27.2px · 메뉴 안쪽 여백 16px/12px · 소메뉴 들여쓰기 48px 그대로. 가로바 · 탭(`--ui-y` 배율)은 이번 항목과 무관.
- 참고 파일 : `ksis-common.css` 의 `--k-sb-pad` · `--k-sb-font` (1px 고정, 예전 값은 주석에 남김)
- 해당 : A·B 모두

### C-010 · 2026-10-28 · 커밋 메시지가 `C-010` 로 시작하는 커밋 · 긴 소메뉴 이름이 잘리지 않게 안쪽 여백 · 들여쓰기 줄임
- 요구사항 : 비교표 3번(좌측 메뉴 폭)
- 단계 : 02-layout.md 2-3 "폭 [3번]" · 줄 높이 CSS 주석 · 2-6 확인 표 (본문 · 완성 그림 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 왜 : 폭 240px 에서 메뉴 안쪽 여백 12×2 · 소메뉴 들여쓰기 48 · 오른쪽 여백 14 를 빼면 "ㄴ + 이름" 자리가 154px 뿐이라 "K품번 기준 고객품번 조회"(155px) · "청구문서별 매출 실적 조회"(160px) 가 … 로 잘렸습니다(ㄴ 17px 별도). 사용자가 검토 1~3안 중 **1안(여백 · 들여쓰기 줄임, 폭 240 유지)** 을 골랐습니다.
  - `.sidebar-menu { padding: calc(16 * var(--sb-pad)) calc(8 * var(--sb-pad)); }` (좌우 12 → 8)
  - 소메뉴 `.sidebar-subitem { padding-left: calc(34 * var(--sb-pad)) !important; padding-right: calc(6 * var(--sb-pad)) !important; }` (왼쪽 48 → 34, 오른쪽 14 → 6)
  - 대분류 줄 `.sidebar-group-header` 의 좌우(14 / 12) · 글자 13.5px · 줄 높이 27.2px · 폭 240px 은 그대로. `…` 규칙(`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`)과 `title` 툴팁은 더 긴 이름을 위해 남겨 둡니다.
  - 확인 : 1920×1080 에서 "ㄴ" 의 왼쪽이 대분류 이름 시작선(메뉴 왼쪽 끝에서 42px)과 같은 x 에 있고, 소메뉴 줄 폭 224px · "ㄴ + 이름" 자리 184px, 소메뉴 33개 모두 … 없이 한 줄.
- 참고 파일 : `ksis-common.css` 의 `.k-menu padding` · `.k-menu-item padding`
- 해당 : A·B 모두

### C-011 · 2026-10-29 · 커밋 메시지가 `C-011~C-013` 로 시작하는 커밋 · 그리드 "N행 × N열 선택됨" 안내 삭제
- 요구사항 : 비교표 28번(클릭 · 선택) · 29번(키보드 이동 · 선택)
- 단계 : 03-controls.md 3-3 "동작" [28] · [29] (본문 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 표를 끌어서 선택하거나 Shift+방향키로 넓힐 때 화면 아래에 잠깐 뜨는 "N행 × N열 선택됨 · Ctrl+C 로 복사" 안내를 없앱니다(사용자 : 필요 없음).
  - `partNumberTools.js` : `finishDrag()` 끝의 `var rows = …, cols = …;` 와 `toast(rows + "행 × " + cols + "열 선택됨 · Ctrl+C 로 복사");` 를 지웁니다.
  - 같은 파일 키보드(keydown) 처리 끝의 `if (e.shiftKey) { var rows = 0; … toast(rows.toLocaleString() + "행 × " + cols + "열 선택됨 · Ctrl+C 로 복사"); }` 블록을 지웁니다.
  - 노란 선택 영역 · 활성 칸 테두리, Ctrl+C 때 "N행 복사됨 · 엑셀에 붙여넣기(Ctrl+V)" 안내 · "복사에 실패했습니다." 안내 · 사용 로그는 그대로 둡니다.
  - 확인 : 표를 끌어 5칸을 골라도, Shift+↓ 로 넓혀도 아래에 안내가 안 뜨고, Ctrl+C 를 누르면 "N행 복사됨" 만 뜸.
- 참고 파일 : `ksis-grid-select.js` 의 `finishDrag()` · keydown 처리(안내 지운 자리에 주석)
- 해당 : A·B 모두

### C-012 · 2026-10-29 · 커밋 메시지가 `C-011~C-013` 로 시작하는 커밋 · 표 안 가운데 정렬(숫자 칸만 오른쪽)
- 요구사항 : 비교표 35번(본문 칸)
- 단계 : 03-controls.md 3-3 "정렬 [35번]" (본문 · 완성 그림 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 표 안의 모든 칸은 가운데 정렬. **수량 · 금액 · 단가 · 가격처럼 숫자가 분명한 칸만 오른쪽**(`text-align: right; font-variant-numeric: tabular-nums;`).
  - 고객사 · 품목 · 이름 · 비고처럼 글자가 긴 칸에 걸린 왼쪽 정렬(CSS 규칙, `style="text-align:left"`, 왼쪽 정렬용 클래스)을 찾아 없앱니다. 품번 · 코드 · 날짜 · 담당자 · No 도 가운데.
  - 문서형 · 데이터형 표 모두 같은 규칙. 입력 표의 편집 칸(`input`)도 칸과 같은 정렬(숫자 칸만 오른쪽).
  - 팝업 안 "라벨 : 입력칸" 배치 표(도표가 아닌 것)는 해당 없음.
  - 여러 화면에 걸친 일이므로 **고칠 표 · 칸 목록을 먼저 보여 주고 허락받은 뒤** 진행합니다(숫자 칸인지 애매한 칸은 목록에 따로 표시).
  - 확인 : 표마다 숫자 칸 외에는 머리글과 본문 글자가 같은 가운데 줄에 섬.
- 참고 파일 : `ksis-common.css` 의 `table.k-grid td`(가운데) · `td.num`(오른쪽), `req/grid.jsp`
- 해당 : A·B 모두

### C-013 · 2026-10-29 · 커밋 메시지가 `C-011~C-013` 로 시작하는 커밋 · 대분류 줄 높이 35px 고정
- 요구사항 : 비교표 11번(선택 · 마우스 올림 색) — 줄 높이
- 단계 : 02-layout.md 2-3 "줄 높이" CSS · 2-6 확인 표 (본문 · 완성 그림 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - `.sidebar-group-header { height: var(--k-menu-row-h); }` → `height: calc(35 * var(--sb-pad));` (= 35px, C-009 로 `--sb-pad` 는 1px 고정)
  - 대분류는 접힘 · 펼침 · 흔적(`.has-active`) · 마우스 올림 모두 35px 로 늘 같습니다(나중에 아이콘이 들어갈 자리). 소메뉴 줄 27.2px · 글자 · 여백 · 가로선은 그대로.
  - 참고 : 선택한 대분류만 1.6배로 키우는 안을 검토했으나 사용자가 "커졌다 작아졌다 하는 게 좋지 않다"고 해서 넣지 않았습니다.
  - 확인 : 1920×1080 에서 대분류 줄 높이 35px, 소메뉴 줄 27.2px, 대분류를 누르거나 소메뉴를 열어도 대분류 높이가 바뀌지 않음.
- 참고 파일 : `ksis-common.css` 의 `.k-menu-group-header height`
- 해당 : A·B 모두

### C-014 · 2026-10-29 · 커밋 메시지가 `C-014~C-015` 로 시작하는 커밋 · 검색 영역 칸 폭을 날짜 칸 폭 118px 로 통일
- 요구사항 : 비교표 38번(검색 영역)
- 단계 : 03-controls.md 3-2 "칸 폭 118px 통일" (본문 · 완성 그림 고쳐 둠)
- KSIS-B 에 적용할 것 :
  - 검색 영역(`.search-area`) 안의 입력칸 · 드롭다운 · 품번 여러 개 칸 · 년월 칸을 모두 **118px** 로 맞춥니다. `app.css` 에 `.search-area .text-input, .search-area select.text-input, .search-area .pn-multi-wrap { width: 118px; }` 를 넣고, 아래 개별 폭은 지우거나 118 로 바꿉니다.
    - 중장기 매출 조회 등 문서 목록 검색줄 `DocListSearchBar.razor` : 문서 제목 260 · 작성자 140
    - 판매처/납품처/지급처 조회 `BusinessPartnerUpdate.razor` : SAP 고객번호 160 · 고객명 240
    - BOM 검색(사용처) `PartNumberUsageList.razor` : K품번 `Width="220"`
    - 청구문서별 매출 실적 조회 · 매출 수량 피벗 조회 `SalesPerformanceSearchBar.razor` : 년월 104 × 2 · BOM `Width="170"` · K품번 · 고객품번 `Width="150"`
    - K품번 기준 고객품번 조회 `PartNumberByKPartView.razor` · 고객품번 기준 K품번 조회 `PartNumberByCustomerPart.razor` : `Width="200"` × 2
    - 사용자 관리 `UserManagementPage.razor` : 검색 180 · 권한 드롭다운(`.um-select` 자동 폭, 검색 영역 안만)
    - 사용 로그 `UsageLogPage.razor` : 기간 `.ul-date` 104 × 2 · 사용자 96 · 종류 `.ul-select` 104 · 검색 130
  - `PartNumberMultiInput` · `BomUsageMultiInput` 의 `Width` 값이 칸 폭을 inline 으로 넣으면 위 CSS 보다 우선하므로 `Width="118"` 로 바꿉니다.
  - 좁은 창에서 입력칸만 84px 까지 줄어드는 규칙(`flex-shrink: 1; min-width: 84px`)은 그대로.
  - 위 목록 밖에도 검색 영역 칸이 있으면 같이 맞추고, 고친 곳을 목록으로 보고합니다.
  - 확인 : 1920×1080 에서 검색 영역의 모든 칸 폭이 118px, 품번 "39100-10000" 이 다 보임.
- 참고 파일 : `ksis-common.css` 의 `.k-search .k-input, .k-search .k-select-wrap { width: 118px; }`
- 해당 : A·B 모두

### C-015 · 2026-10-29 · 커밋 메시지가 `C-014~C-015` 로 시작하는 커밋 · 입력칸 · 드롭다운 안 회색 안내 글 삭제
- 요구사항 : 비교표 39번(입력칸) · 40번(드롭다운) · 45번(글자 색 — 흐림 #A6A6A6 은 칸 밖 글에만)
- 단계 : 03-controls.md 3-2 입력칸 · 3-5 드롭다운 (본문 고쳐 둠)
- KSIS-B 에 적용할 것 : 칸에 값이 없을 때 보이는 회색 글씨(`placeholder`)를 지웁니다(사용자 : 예쁘지 않다, 범위 = 도구 화면만 남김).
  - `SalesPerformanceSearchBar.razor` : 년월 칸 `placeholder="시작 년월"` · `placeholder="종료 년월"`
  - `BomUsageMultiInput.razor` : `[Parameter] public string Placeholder` 기본값 `"BOM 4열 붙여넣기"` → `""`
  - `SalesPerformanceQuantityByPart.razor` : 열 거르기 창 검색칸 `placeholder="검색"`
  - `DocumentDetail.razor` : 열별 검색칸 `placeholder="@h"`, 그리고 `app.css` 의 `.col-search-input::placeholder` · `.col-search-input:focus::placeholder` 규칙
  - 작성 창 날짜 칸 `placeholder="예: 2025-09-30 / 20250930 / 2025.09.30"` : `DocumentWrite.razor` · `OrderBacklogWrite.razor` · `SalesPerformanceWrite.razor` · `VehicleWrite.razor`
  - `SapAutoUploadModal.razor`(월별 매출 실적 → SAP 자동 올리기) : 년월 칸 2개 `placeholder="예: 202607 / 2026-07 / 2026.07"`
  - `OrderBacklogDetail.razor`(수주잔고 상세) : 옮길 수량 칸 `placeholder="0"`
  - **그대로 둠** : 도구 화면 `DispatchHelperPage.razor`(배차 도우미) · `ScreenCapturePage.razor`(화면 캡처) · `AutoClick.razor`(창 버튼 자동 클릭), 원가계산(`wwwroot/cost-calc`), 칸 밖 회색 문구(`.grid-placeholder-text` "조회 중입니다…" 등)
  - 드롭다운 : KSIS-B `<select>` 에는 회색 안내가 없습니다("전체" · "(선택 안 함)" 은 진짜 선택지 — 그대로). 3-5 에서 공통 드롭다운을 만들 때 안내 글 기능은 넣지 않고, 고르기 전엔 빈 상자로 둡니다.
  - 위 목록 밖에서 `placeholder` 를 찾으면(도구 화면 · 원가계산 제외) 같이 지우고 목록으로 보고합니다.
  - 확인 : 위 화면의 빈 칸에 회색 글씨가 안 보임.
- 참고 파일 : `ksis-select.js`(`data-empty`, 안내 글 없음), `ksis-common.css`(`::placeholder` · `.is-placeholder` 규칙 삭제)
- 해당 : A·B 모두
