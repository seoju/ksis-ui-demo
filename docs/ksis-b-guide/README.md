# KSIS-B 화면 통일 지시서 (Claude Code 용)

KSIS-B(C# Blazor) 화면을 시연 프로그램(이 저장소 main)의 **④ B 요구사항** 모양으로 단계별로 바꾸기 위한 지시서 묶음입니다.
회사 PC의 VS Code 에서 KSIS-B 폴더(`D:\test`)를 연 Claude Code 에게 한 단계씩 넘겨 주는 용도입니다.

## 들어 있는 파일

| 파일 | 내용 | 언제 |
|---|---|---|
| [00-start.md](00-start.md) | 준비(참고용 시연 프로그램 받기) + Claude Code 에 붙여 넣을 **첫 지시문** | 맨 처음 1번 |
| [claude-md-append.md](claude-md-append.md) | `D:\test\CLAUDE.md` 가 **이미 있을 때** 맨 끝에 붙일 단락 | 첫 지시문이 알아서 씀 |
| [claude-md-new.md](claude-md-new.md) | `CLAUDE.md` 가 **없을 때** 새로 만들 파일 초안 | 첫 지시문이 알아서 씀 |
| [01-variables.md](01-variables.md) | 1단계 : 공통 변수(`app.css` `:root`) | |
| [02-layout.md](02-layout.md) | 2단계 : 가로바 · KSIS-B 심볼 · 화면 탭 · 좌측 메뉴 · 본문 틀 | |
| [03-controls.md](03-controls.md) | 3단계 : 버튼 · 표(그리드) · 검색 영역 · 입력칸 · 드롭다운 · 날짜 · 모드 버튼 | |
| [04-popup-etc.md](04-popup-etc.md) | 4단계 : 업무 팝업 · 파일 업로드 · 알림/확인 창 · 포커스 · 글자 · 제목 · 간격 | |
| `img/` | 단계별 완성 모습(시연 프로그램 ④ B 요구사항, 1920×1080 캡처) | |
| [changes.md](changes.md) | 지시서를 쓴 뒤 시연 프로그램이 바뀐 기록(항목 C-001 …) — KSIS-B 에 따라 반영할 것 | `pull` 할 때마다 |

## 진행 방법

1. [00-start.md](00-start.md) 의 준비를 하고, 첫 지시문을 Claude Code 에 붙여 넣습니다.
   - `README.md` 는 건드리지 않습니다.
   - `CLAUDE.md` 는 덮어쓰지 않습니다. 이미 있으면 맨 끝에 짧은 단락 하나만 붙이고, 없으면 새로 만듭니다. 어느 쪽이든 먼저 보여 주고 허락받은 뒤 씁니다.
2. 그다음부터는 단계마다 한 줄로 시킵니다.
   `D:\ksis-ui-demo\docs\ksis-b-guide\01-variables.md 대로 1단계 진행해 줘`
3. 단계마다 끝에 **"여기서 멈추고 확인받기"** 가 있습니다. Claude Code 가 바꾼 내용과 확인할 화면을 알려 주면, 직접 화면을 보고 괜찮으면 다음 단계로 넘어갑니다.
4. 시연 프로그램을 같이 띄워 두고 비교하면 편합니다(`D:\ksis-ui-demo\run\run.bat` → 브라우저 `http://localhost:8090` → ④ B 요구사항).
5. 시연 프로그램이 바뀌면 `git -C D:\ksis-ui-demo pull` 뒤 `changes.md 의 새 항목 반영해 줘` 로 따라갑니다. 진행 중인 단계를 멈출 필요는 없습니다. 단계 지시서 본문도 같이 고쳐 두므로, 아직 안 한 단계는 그대로 진행하면 됩니다.

## 기준

- 값의 기준은 시연 프로그램 main 의 세 파일입니다.
  - `src/main/webapp/ksis-ui/css/ksis-theme-b.css` : B 색(초록 계열)
  - `src/main/webapp/ksis-ui/css/ksis-common.css` : A·B 공통 모양(크기 · 모서리 · 간격 · 동작에 딸린 CSS)
  - `src/main/resources/requirements.json` : 비교표 49행의 요구사항 글(`aRequirement` = 공통 요구, `bNote` = KSIS-B 메모)
- 지시서의 값과 위 파일이 다르면 **위 파일이 맞습니다**(지시서는 2026-10-28 main `398cfd5` 기준으로 썼고, 그 뒤 바뀐 것은 [changes.md](changes.md) 에 적고 본문도 고칩니다).
- 글꼴은 아직 정하지 않았습니다. KSIS-B 의 지금 글꼴(Pretendard)을 그대로 둡니다.
