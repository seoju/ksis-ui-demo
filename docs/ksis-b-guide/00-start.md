# 0. 시작 : 준비 + 첫 지시문

## 준비 (사람이 직접, 1번만)

KSIS-B 폴더(`D:\test`) **바깥**에 시연 프로그램을 참고용으로 받아 둡니다. KSIS-B 저장소에 섞이지 않게 하려는 것입니다.

1. VS Code 터미널(PowerShell)에서:
   ```
   git clone https://github.com/seoju/ksis-ui-demo.git D:\ksis-ui-demo
   ```
   - git 이 없으면 https://github.com/seoju/ksis-ui-demo 에서 [Code] → [Download ZIP] 을 받아 `D:\ksis-ui-demo` 에 풉니다(안에 바로 `src`, `docs`, `run` 폴더가 보이게).
   - 나중에 시연 프로그램이 바뀌면 `git -C D:\ksis-ui-demo pull` 로 새로 받습니다.
2. Claude Code 입력창에 아래를 쳐서 그 폴더도 읽을 수 있게 합니다.
   ```
   /add-dir D:\ksis-ui-demo
   ```
3. (권장) 시작 전에 KSIS-B 의 지금 상태를 git 에 커밋해 두면, 단계마다 잘못돼도 쉽게 되돌릴 수 있습니다. 첫 지시문이 이것도 확인합니다.

## 첫 지시문 (Claude Code 에 그대로 붙여 넣기)

```
KSIS-B 화면을 시연 프로그램 양식으로 단계별로 바꾸는 작업을 시작하려고 해. 오늘은 준비만 하고 코드는 아직 고치지 마.

참고 자료는 D:\ksis-ui-demo 에 있어(읽기만 하고 절대 고치지 마).
먼저 D:\ksis-ui-demo\docs\ksis-b-guide\README.md 를 읽어 줘.

1) CLAUDE.md 처리
   - 이 폴더(D:\test)의 README.md 는 읽기만 하고 절대 고치지 마.
   - D:\test\CLAUDE.md 가 있는지 확인해 줘(D:\test\.claude\CLAUDE.md, D:\test\CLAUDE.local.md 도 같이).
   - 있으면: 덮어쓰거나 기존 줄을 고치지 말고, D:\ksis-ui-demo\docs\ksis-b-guide\claude-md-append.md 의
     "붙일 내용" 단락을 파일 맨 끝에 덧붙일 계획만 먼저 보여 줘. 이미 "## KSIS UI 통일 작업" 단락이 있으면 또 붙이지 마.
     기존 CLAUDE.md 내용과 부딪히는 규칙이 있으면 알려 줘.
   - 없으면: D:\ksis-ui-demo\docs\ksis-b-guide\claude-md-new.md 의 "새 파일 내용" 으로 D:\test\CLAUDE.md 를 만들 계획을 보여 줘.
   - 어느 쪽이든 내가 "좋아" 하면 그때 써.

2) git 상태
   - git status 로 커밋 안 한 변경이 있는지 알려 줘(있어도 건드리지는 마).
   - 이 작업용 새 가지(예: ui-unify)를 만들지 물어봐 줘. 내가 하라고 하면 만들어.

3) 현황 조사 (고치지 말고 보고만)
   - wwwroot/app.css 의 :root 변수, App.razor 에서 CSS·JS 를 불러오는 곳,
     상단 가로바 · 시스템명 · 좌측 메뉴 · 화면 탭(TabBar) · 본문 카드가 있는 .razor 파일과 CSS 위치,
     버튼(.btn*) · 표(table.app-grid, .doc-list-grid, .compact-grid) · 검색 영역(.data-options.search-area) ·
     업무 팝업(.write-modal-*) · 알림(alert/confirm) 을 쓰는 곳의 개수를 표로 정리해 줘.
   - 지시서 01~04 를 훑어보고, KSIS-B 코드에서 지시서와 이름이 다르거나 찾을 수 없는 것이 있으면 목록으로 알려 줘.

여기까지 하고 멈춰. 답은 한글로.
```

## 그다음부터

단계마다 한 줄이면 됩니다. 앞 단계를 확인한 뒤에 다음 단계를 시킵니다.

```
D:\ksis-ui-demo\docs\ksis-b-guide\01-variables.md 대로 1단계 진행해 줘
```

```
D:\ksis-ui-demo\docs\ksis-b-guide\02-layout.md 대로 2단계 진행해 줘
```

한 단계가 길면 나눠서 시켜도 됩니다(예: `02-layout.md 의 2-3 탭만 해 줘`).
고칠 점이 보이면 그 자리에서 말로 고치게 하고, 다음 단계로 넘어가기 전에 커밋하게 하면 됩니다.
