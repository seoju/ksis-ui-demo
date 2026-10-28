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
