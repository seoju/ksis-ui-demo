# KSIS UI 통일 시연 (ksis-ui-demo)

KSIS A·B 비교표(49행)의 결론을 **코드로 전달**하기 위한 작은 Spring Boot + JSP 프로그램입니다.
화면 영역마다 네 칸을 나란히 보여 줍니다.

| 칸 | 내용 | 만든 방법 |
|---|---|---|
| ① KSIS-A 원래 화면 | 지금 KSIS-A 모양·동작 | KSIS_A 저장소의 CSS·JS 복사본(`/orig-a/`)과 같은 클래스의 마크업 |
| ② KSIS-B 원래 화면 | 지금 KSIS-B 모양·동작 | KSIS_B 저장소의 `app.css`·`wwwroot/*.js` 복사본(`/orig-b/`)과 Razor 가 그리는 것과 같은 마크업 |
| ③ KSIS-A 요구사항 | 비교표 결론을 A 색(파랑)으로 | 공통 CSS·JS + `ksis-theme-a.css` |
| ④ KSIS-B 요구사항 | 비교표 결론을 B 색(초록)으로 | 공통 CSS·JS + `ksis-theme-b.css` |

③과 ④는 **같은 JSP, 같은 `ksis-common.css`, 같은 JS** 를 쓰고 색 테마 파일 한 줄만 다릅니다.
색 말고 다른 것은 아래 "③·④ 예외" 세 가지뿐입니다.

## 실행

### 가장 쉬운 방법(코드 빌드 없이, 인터넷 없이)

1. Java 17 이상(JDK)을 설치합니다. cmd 에서 `java -version` 이 17 이상이면 됩니다.
   없으면 https://adoptium.net/temurin/releases/?version=17&os=windows 에서 JDK .msi 를 받아 설치합니다(설치 중 "Add to PATH" · "Set JAVA_HOME" 켜기).
2. `run` 폴더의 `run.bat` 을 두 번 누릅니다. 약 15초 뒤 브라우저가 http://localhost:8090 으로 열립니다. 까만 창을 닫으면 꺼집니다.
   (`run/ksis-ui-demo.war` 는 이 코드를 미리 빌드해 둔 것입니다. 코드를 고치면 `./mvnw package` 로 다시 만든 `target/ksis-ui-demo.war` 를 복사합니다.)
3. 새로 받은 war 를 띄웠는지는 첫 화면 제목 아래 **빌드 시각(한국 시간)** 으로 확인합니다. 이전 데모 창이 아직 열려 있으면 8090 포트가 막혀 새 war 가 뜨지 못하고 브라우저에는 옛 화면이 보입니다. 이때 `run.bat` 이 `[!] Port 8090 is already in use` 를 띄우니 이전 까만 창을 닫거나(안 보이면 작업 관리자에서 Java 끝내기) 다시 실행합니다.
   CSS · JS · 그림은 브라우저가 매번 바뀌었는지 묻게 해 두어(`Cache-Control: no-cache`) 새 war 를 띄우면 새로고침만으로 바뀐 모습이 보입니다.

### 코드에서 바로 실행

JDK 17 이 있으면 됩니다(KSIS-A 와 같은 Spring Boot 3.4 · JSP · JSTL 구성).

```bash
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run
```

브라우저에서 http://localhost:8090 을 엽니다.

- `/summary` : 0번 비교표 및 요구사항 요약. 49행 전체를 영역별로 묶어 요약 · A 원래 · B 원래 · 요구사항 전체를 한 표로 보여 줍니다(오른쪽 위 [요약만 보기])
- `/compare/{영역}` : 네 칸 비교 + 그 영역의 비교표 행(A 원래 · B 원래 · 요구사항 · B 메모)
  - 영역 : `layout`(1~18번) · `buttons`(19~27) · `grid`(28~37) · `search`(38~42) · `popup`(43) · `dialog`(44) · `text`(45~49)
  - 위쪽 [보기]에서 2×2 / 한 줄 / 한 칸씩, [화면 폭]에서 1920 · 1600 · 1366px 가상 화면 또는 "칸 크기 그대로"를 고릅니다.
- `/view/{칸}/{영역}` : 한 칸만 새 창으로(칸 = `orig-a` · `orig-b` · `req-a` · `req-b`). 비교 화면 각 칸의 [새 창 ↗]과 같습니다.
- 팝업·알림·드롭다운·달력은 처음에 펼친 모양으로 열립니다. 주소 끝에 `#closed` 를 붙이면 닫힌 채로 엽니다.

war 로 만들려면 `./mvnw package` → `target/ksis-ui-demo.war`.

## KSIS-A 에 옮길 파일

옮길 것은 `src/main/webapp/ksis-ui/` 아래 파일과 `WEB-INF/views/req/` 의 마크업 예시입니다.
새 클래스 이름은 모두 `k-` 로 시작해서 지금 화면의 클래스와 겹치지 않습니다(그리드의 `app-grid` · `pn-*` · `col-resizer` 는 KSIS-B JS 가 쓰는 이름이라 그대로 둠).

| 파일 | 비교표 | 설명 |
|---|---|---|
| `ksis-ui/css/ksis-theme-a.css` | 색 전부 | **색만** 있는 파일. A 는 이 파일, B 는 `ksis-theme-b.css` |
| `ksis-ui/css/ksis-common.css` | 1~49 | 공통 규칙(크기·간격·모양). 테마 파일 **다음에** 넣습니다 |
| `ksis-ui/js/ksis-layout.js` | 1~18 | 상단 가로바 · 좌측 메뉴 · 화면 탭. `ksis.layout.init({ open(path, title, viewEl) })` |
| `ksis-ui/img/ksis-a-logo.png` | 2 | 가로바 왼쪽 KSIS-A 심볼(흰 바탕을 따낸 투명 PNG). 'A' 아래에 영문 줄(Kefico Sales Information System - Advanced)을 넣어 옆으로 긴 그림. 진한 가로바용으로 남색 글자는 흰색, '- Advanced' 는 밝은 파랑. 원래 색 · 원래 배치(영문 줄이 심볼 아래)인 누끼 원본은 `ksis-a-symbol.png` |
| `ksis-ui/img/ksis-b-logo.png` | 2 | 가로바 왼쪽 KSIS-B 심볼. A 심볼과 같은 틀 · 글꼴 · 크기로 'KSIS-B' + 'Kefico Sales Information System - Bridge'(영문 줄 글꼴 Montserrat Bold). 초록 계열 : 테두리 · '- Bridge' #A8E6BF, '-B' · 첫 막대 #03C75A |
| `ksis-ui/js/ksis-dialog.js` | 44 · 27 | `ksis.showAlert` / `ksis.showConfirm` — **`biz.showAlert` / `biz.showConfirm` 과 인자가 같습니다**(바꿔 끼우기) |
| `ksis-ui/js/ksis-modal.js` | 43 · 27 | `ksis.modal.open(id)` / `close(id)`. 머리줄 끌기, ✕ · Esc, 열면 주 버튼에 포커스 |
| `ksis-ui/js/ksis-select.js` | 40 · 42 | `select.k-select` → 둥근 펼침 목록. 모드 버튼 `.k-seg` |
| `ksis-ui/js/ksis-date.js` | 41 | `.k-date` 날짜칸 + 달력. `ksis.date.value(input)` = 서버로 보낼 `yyyyMMdd` |
| `ksis-ui/js/ksis-file.js` | 43 | `.k-file` 파일 업로드 : 끌어다 놓기 + 파일 선택, 목록(이름 · 크기 · ✕). `ksis.file.appendTo(el, formData)` 로 저장 |
| `ksis-ui/js/ksis-grid-select.js` | 28 · 29 · 30 | **KSIS-B `partNumberTools.js` 그대로**(칸 선택 · 방향키 · Ctrl+C). B 전용 부분만 뺌 |
| `ksis-ui/js/ksis-grid-paste.js` | 30 | **KSIS-B `gridPaste.js` 그대로**(입력 표 Ctrl+V · Tab). 확인 창만 `ksis.showConfirm` 으로 |
| `ksis-ui/js/ksis-grid-resize.js` | 31 | **KSIS-B `columnResize.js` 그대로**. 폭은 기억하지 않음(`register(table, null)`) |
| `ksis-ui/js/ksis-grid-pager.js` | 32 · 30 | 표 아래 번호 페이지(A Tabulator 와 같은 모양) + 붙여넣기 연결(`ksisGrid.pasteTarget`) |

`includeCSS.jsp` / `includeJS.jsp` 에 넣는 순서는 `WEB-INF/views/req/_head.jspf` 와 같습니다.

```jsp
<link rel="stylesheet" href="<c:url value='/ksis-ui/css/ksis-theme-a.css'/>">
<link rel="stylesheet" href="<c:url value='/ksis-ui/css/ksis-common.css'/>">
<script src="<c:url value='/ksis-ui/js/ksis-dialog.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-modal.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-select.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-date.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-file.js'/>"></script>
<%-- 그리드 화면 --%>
<script src="<c:url value='/ksis-ui/js/ksis-grid-select.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-grid-paste.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-grid-resize.js'/>"></script>
<script src="<c:url value='/ksis-ui/js/ksis-grid-pager.js'/>"></script>
```

### 그리드에 대해

KSIS-B 그리드 기능(칸 선택 · 키보드 · 복사 · 붙여넣기 · 열 폭)은 `<table>` 을 대상으로 합니다.
Tabulator 는 `<div>` 로 그리기 때문에 이 기능이 붙지 않습니다. 그래서 요구사항 화면의 목록은
`<table class="k-grid app-grid">` + `ksisGrid.pager(...)` 로 그렸습니다(`WEB-INF/views/req/grid.jsp`).
서버 페이지로 쓸 때는 지금 쪽의 행만 서버에서 그려 `<tbody>` 를 바꾸고, 번호 줄만 `ksis-grid-pager.js` 를 참고해 그리면 됩니다.

## 요구사항을 이렇게 읽었습니다(확인 필요)

비교표 문장이 두 가지로 읽힐 수 있는 곳은 아래처럼 만들었습니다. 다르면 알려 주세요.

1. **32번 ↔ 38번** : 32번은 "KSIS-A 상태 유지(표 아래 번호 페이지)", 38번 순서에는 "[이전/다음은 맨 오른쪽]"이 있습니다. 32번을 따라 표 아래 번호 페이지만 두고 검색 영역의 [이전]/[다음]은 뺐습니다.
2. **27번 Enter 키** : 팝업이 열릴 때 포커스만 넣었습니다(10/21 미팅 내용 정정). 작성창(43번)은 첫 번째 작성 항목, 알림 · 확인 창(44번)은 주 버튼(파랑 · 초록). KSIS-A 결재 화면은 결재자(중간 · 최종)가 열 때 확인창처럼 [승인]에 포커스 — `ksis.modal.open(id, { focus: "button" })`(KSIS-B 해당 없음). KSIS-B 의 `enterKey.js`(검색칸에서 Enter = [검색])는 넣지 않았습니다.
3. **17·18번 탭** : 최대 10개, 넘으면 가장 오래 안 본 탭을 안내 없이 닫음. 보던 탭을 닫으면 오른쪽 이웃(없으면 왼쪽), 하나도 없으면 메인. 우클릭 메뉴 · [전체닫기] · 가운데 버튼 닫기는 없습니다.
4. **9번 메뉴** : 대분류는 각자 따로 펼치고, 펼친 상태를 이 PC 에 기억합니다(`localStorage` 의 `ksis.menu.open`). 좌측 메뉴 접힘(4번)은 기억하지 않습니다.
5. **1·2번 가로바** : 오른쪽 위 문구·아이콘은 뺐습니다. 시스템 이름 글자 대신 KSIS-A 심볼 그림을 넣었습니다(가로바 안 위 여백 2.5px, 심볼 본체 높이 40px, 폭 약 275px). 영문 줄은 원래 그림처럼 'Kefico Sales Information System - Advanced' 로, 심볼 아래가 아니라 'A' 아래 빈 곳에 네모 쪽으로 조금 붙여 넣었고, 'A' 와 너무 붙지 않게 영문 줄만 2px 내렸습니다(그림 높이 42px, 가로바 아래끝까지 0.5px). ≡ 버튼은 화면 왼쪽 끝과 심볼 네모 왼쪽 끝의 가운데에 둡니다(왼쪽 여백 15px = ≡ 와 심볼 사이 15px). 진한 남색 가로바에서는 남색 글자가 안 보여 흰색으로, 작은 '- Advanced' 는 밝은 파랑으로 바꿨습니다. KSIS-B 는 같은 틀로 만든 'KSIS-B · Bridge' 심볼(초록 계열)이고, 'Bridge' 가 짧아 그림 폭은 약 261px 이지만 자리 폭은 A 와 같게 두어 탭 위치가 같습니다. 브라우저 창 제목은 "KSIS-A 영업정보시스템"으로 고정(7번).
6. **41번 날짜** : `yyyyMMdd` · `yyyy-MM-dd` · `yyyy.MM.dd` · `yyyy/MM/dd` 를 모두 받아 칸을 떠나면 `yyyy-MM-dd` 로 보이고, 서버 값은 `yyyyMMdd`(`input.dataset.value`). 달력 버튼은 `tabindex="-1"` 이라 Tab 이 다음 날짜칸으로 갑니다. 맨 앞 날짜처럼 달력이 화면 왼쪽 밖으로 나가면 왼쪽 맞춤으로 엽니다.
7. **33번 KSIS-B 메모(데이터형 32px 유지)** : `table.k-grid.k-grid-dense` 로 두 테마 모두에 넣었습니다(쓸지 말지는 화면에서 고름).
8. **37번 편집 칸** : 테두리 색은 주색(A 파랑 / B 초록), 바탕 연노랑, 틀리면 빨강.
9. **B 색 중 비교표에 값이 없는 것** : 누름 `#019F46`, 수정 버튼 테두리 `#9FEAC0`, 수정 누름 `#D2F5E2` 는 B 초록에서 같은 비율로 만들었습니다.
10. **글꼴** : 아직 정하지 않아 `--k-font: sans-serif` 로 두었습니다(`ksis-common.css` 맨 위 한 줄).
11. **10/27 확정(디자인 검토에서 고른 안)** : 탭은 3안(책갈피 탭을 진한 가로바 위로 겹쳐 올림, 탭 줄 바탕 흰색), 좌측 메뉴 색은 2안(진한 메뉴, 선택 = 주 색 채움 + 흰 글자). 10/28 그라데이션 검토에서 메뉴 바탕을 3안(Trello 다크 보드식)으로 바꿨습니다: 채도를 낮춘 짙은 색 두 단계를 135° 대각선으로(A #223661 → #152341, B #275235 → #153921, `--k-menu-grad-start/end`). 검토한 다른 안은 1안 SAP Fiori 런치패드식(세로로 진한 색 → 연한 색), 2안 Spotify 식(주 색이 위에서 시작해 아래로 #121212 에 녹아듦)이었습니다.
    - 3번 좌측 메뉴 폭 : 기존 KSIS-A 처럼 240px 고정(27인치 전체 화면 기준 이전 340px 의 약 70%). 긴 소메뉴는 끝을 … 로 줄이고 마우스를 올리면 전체 이름이 보입니다. 글자 · 안쪽 여백 · 줄 높이도 고정(10/28 C-009, 창을 좁혀도 줄지 않음).
    - 6번 내용 : 좌우 여백을 같게(24px) 하고 스크롤바 자리를 양쪽에 똑같이 비워, 검색 영역과 표가 업무 영역 가운데에 옵니다.
    - 47번 제목 : 첫 글자를 검색 영역 첫 글자(예: "고객사")와 같은 세로줄에 맞췄습니다(검색 영역 안쪽 여백 16px 만큼 들여 씀). 검색 영역이 없는 화면도 같은 들여쓰기입니다.
    - 11번 대분류 흔적 : 소분류를 고르면 그 소분류가 든 대분류도 메뉴 바탕과 주 색의 중간(주 색 50% 겹침, `--k-menu-parent-bg`) + 흰 굵은 글자로 표시합니다(`.k-menu-group-header.expanded.has-active`). 흔적은 그 대분류를 펼쳐 둔 동안만 보이고, 대분류를 접으면 안 보겠다는 뜻이라 흔적도 없어집니다(다시 펼치면 다시 보임).
    - 1 · 11번 그림자 : 가로바 아래(0 1px 2px 검정 25% + 0 2px 6px 검정 38%)와 좌측 메뉴 오른쪽(1px 0 3px 검정 18% + 4px 0 16px 검정 30%)에 그림자를 넣어 가로바 > 좌측 메뉴 > 업무 영역 순서로 떠 보이게 했습니다(기존 KSIS-A 의 메뉴 그림자처럼, 그림자 검토 3안). 탭은 가로바 위로 겹쳐 올라오므로 가로바보다 위에 그립니다. 책갈피 탭은 업무 영역과 그대로 이어져야 해서, 가로바 그림자는 `clip-path` 로 가로바 아래끝 ~ 업무 영역 윗끝(1920×1080 에서 8px)까지만 보이게 잘라 탭 아래로는 비치지 않습니다.
    - 14번 탭 바닥 : 탭 양쪽 곡선은 가운데보다 1px 짧아 발끝 아래로 흰 선이 1px 보입니다. 안 보는 탭(회색)은 가운데도 아래 1px 을 비워 바닥선을 한 줄로 맞췄습니다(가운데만 튀어나와 보이지 않게). 보는 탭(흰색)은 그대로 업무 영역과 이어집니다.
    - 14번 탭 자리 : 화면 기준으로 고정해 좌측 메뉴(≡)를 접든 펴든 탭이 움직이지 않습니다. 업무 영역 왼쪽 끝과 시스템 심볼 오른쪽 + 24px 중 더 오른쪽(`--k-tab-x`)이라 1920×1080 에서는 심볼 오른쪽 기준입니다. 그래서 6번의 "내용 시작선 = 첫 탭 왼쪽 끝"은 이제 맞지 않습니다.
12. **10/28 추가(A · B 공통)**
    - 4번 ≡ 버튼 : 그림이 아니라 줄 3개(`<span>`)로 그립니다. 창 크기 · Edge 확대 비율에 따라 줄 두께가 1.75px 처럼 소수점이 되면 줄마다 화면 픽셀에 다르게 걸려 한 줄만 굵어 보이므로, `ksis-layout.js` 의 `snapHamburger()` 가 줄 두께 · 간격 · 폭을 실제 화면 픽셀 정수 개로 맞춰 `--k-ham-line` · `--k-ham-gap` · `--k-ham-w` 로 줍니다(창 크기 · 확대 비율 · 모니터가 바뀔 때마다 다시 잼). 화면 픽셀 1개 크기는 `--k-px` 로 같이 줍니다.
    - 11번 메뉴 줄 높이 : 대분류 · 소메뉴 한 줄 높이를 38.9px 의 70% 인 27.2px 로 줄였습니다(`--k-menu-row-h`, 글자 크기 · 좌우 여백은 그대로).
    - 9번 메뉴 휠 스크롤 : 대분류를 많이 펼쳐 메뉴가 화면 아래로 넘치면 마우스 휠로 위아래로 굴립니다. 세로 스크롤바는 그리지 않습니다(`scrollbar-width: none` + `::-webkit-scrollbar`). 메뉴 끝에 닿아도 업무 화면은 같이 굴러가지 않습니다(`overscroll-behavior: contain`).
    - 8번 대분류 가로선 : 대분류 이름 오른쪽에 흰색 35% 가는 선(`::after`, 두께 `--k-px` = 화면 픽셀 1개, 색 `--k-menu-line`)을 이름 끝 10px 뒤부터 줄 오른쪽 끝 12px 앞까지 긋습니다. 이름이 길면 선이 짧아집니다.
    - 41번 날짜 : 달력 버튼을 입력칸 안 오른쪽 끝에 넣었습니다. 입력칸 118×30 은 그대로, 버튼만 30 → 20px(아이콘 13px, 모서리 6px), 오른쪽 테두리와 4px. 글자는 오른쪽 안쪽 여백 26px 앞까지라 `2026-10-28` 이 버튼에 가리지 않습니다. 날짜 칸 전체 폭이 152 → 118px 로 줄었고, 검색 영역에서는 줄어들지 않습니다.
    - 38 · 48번 검색 영역 간격 : 같은 것끼리(라벨 ↔ 그 입력칸, 날짜 ~ 날짜, [검색] ↔ [해제])는 6px 그대로, 다른 것끼리(입력칸 → 다음 라벨, 모드 버튼 → 라벨, 마지막 입력칸 → [검색])는 12px. 기본 간격 6px 에 라벨 · 첫 버튼 왼쪽 6px 를 더하는 방식이라 마크업은 그대로입니다.
    - 3번 메뉴 글자 · 여백 고정(C-009) : 메뉴 폭이 240px 고정인데도 안쪽 여백 · 줄 높이는 창 폭 1920px 아래에서, 글자는 1344px 아래에서(최소 10.8px) 줄고 있었습니다. 배율 변수 `--k-sb-pad` · `--k-sb-font` 를 1px 로 고정해 창을 1000px 까지 좁혀도 글자 13.5px · 줄 27.2px · 여백 16/12px 그대로입니다.

## ③·④ 예외(색 말고 다른 것)

- 시스템 심볼(2번) : A 는 KSIS-A 심볼 그림, B 는 아직 심볼이 없어 같은 크기의 빈 자리
- 상단 가로바 사번 옆 문구(1번) : A 는 문구 2개 "K123456 영업인원 - WG장", B 는 문구 1개 "K123456 일반 담당자"(B 는 조직도 정보 없이 사번으로 권한만 정해 직급을 모름)
- 결재자로 여는 작성창 시연(27번) : KSIS-A 만(B 는 결재 단계 없음)
- 업무 팝업의 전체 화면 버튼 ⛶ : KSIS-B 만(43번 B 메모 "지금 있는 전체 화면 버튼은 유지")

## 폴더

```
src/main/java/com/kefico/ksis/uidemo/
  UiDemoApplication.java         시작
  web/DemoController.java        주소 → JSP
  guide/DemoArea.java            영역 7개(비교표 행 범위)
  guide/Variant.java             칸 4개
  guide/RequirementCatalog.java  비교표 49행(resources/requirements.json)
  guide/SampleData.java          시연용 표 · 메뉴 데이터(탭을 10개 넘게 열어 보도록 더미 소메뉴를 넣어 모두 33개, 화면 내용은 같은 예시)
src/main/resources/requirements.json   비교표 내용(A 원래 · B 원래 · 요구사항 · B 메모)
src/main/webapp/
  ksis-ui/                       ★ KSIS-A 에 옮길 CSS · JS
  WEB-INF/views/req/             ★ ③④ 요구사항 화면(마크업 예시)
  WEB-INF/views/orig-a/ orig-b/  ①② 원래 화면(비교용)
  orig-a/ orig-b/                ①② 원래 CSS · JS 복사본(비교용, 옮기지 않음)
  WEB-INF/views/common/, demo/   비교 화면 틀(옮기지 않음)
```

원래 화면 복사본 기준 : KSIS_A `510b7d1`, KSIS_B `69ea7ee`.
KSIS-B 는 Blazor(C#)라 탭 · 쪽 넘김 · 붙여넣은 값 저장처럼 C# 이 하던 일은 ② 화면에서 짧은 JS 로 흉내 냈습니다(각 JSP 머리 주석에 적음).
