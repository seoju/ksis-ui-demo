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

## 이 가지(plan-b)는 2안입니다

- `main` = **1차 검토본(1안)**. 상단 화면 탭이 B 서류철 모양(높이 20px, 글자 11px)입니다.
- `plan-b` = **2안**. 1안과 다른 점은 **비교표 14번 "탭 줄 위치와 모양" 하나**뿐입니다.
  - 탭 줄이 가로바에 걸쳐 앉지 않고, 가로바 아래 따로 선 40px 줄이 됩니다(A 연파랑 `#C3D1E5` / B 연초록 `#C4DFCF`).
  - 탭은 사내 다른 시스템의 책갈피 탭을 그대로 옮겼습니다. 곡선은 그 시스템의 탭 그림(`tab_sprite.png`)에서 픽셀 단위로 따 온 좌표를
    코드(SVG)로 그려, 그림 파일 없이 색을 바꿀 수 있습니다. 탭 하나가 세 부분입니다.
    ① 왼쪽 : 아래 발끝에서 S 곡선으로 올라가는 작은 영역 ② 가운데 : 글자 · ✕ 가 있는 직사각형(높이 32px, 글자 12px 굵게, 최대 200px)
    ③ 오른쪽 : 위 왼쪽에서 오른쪽 아래로 내려가는 곡선 + 옅은 그림자. ①③ 발끝 아래로 탭 줄 바탕색 선 1px 이 보입니다.
  - 탭이 2개 이상이면 왼쪽 탭의 ③ 이 오른쪽 탭의 ① 위에 겹칩니다(보는 탭은 맨 위).
  - 보는 탭은 흰 바탕(아래 본문과 이어짐) + 진한 글자, 안 보는 탭은 연한 바탕 + 회색 글자, 마우스 올린 탭은 옅은 주색 바탕.
    보는 탭 · 마우스 올린 탭은 왼쪽 곡선에도 옅은 그림자가 있습니다(원본 그림과 같음).
  - 고친 파일 : `ksis-common.css`(14번 탭 부분), `ksis-layout.js`(탭 왼쪽 · 오른쪽 곡선 SVG, 겹침 순서), `ksis-theme-a.css` · `ksis-theme-b.css`(탭 색 변수), `requirements.json`(14번 글).
- **3안**(탭 검토 화면에서 `?tabPlan=3`, `ksis-tabs-plan3.css`) : 2안 탭 모양 · 높이(32px)는 그대로 두고, 탭 줄을 진한 가로바 위로 겹쳐 올려
  업무 영역을 넓힙니다. 탭 위끝은 가로바 가운데 사번 문구 바로 아래까지 올라가고, 가로바 아래로 남는 연한 띠는 1920×1080 에서 8px 입니다
  (2안 40px → 3안 8px, 업무 영역 32px 늘어남. 화면이 낮으면 가로바도 낮아져 띠가 조금 두꺼워짐).
  좌측 메뉴를 접으면 시스템명과 겹치지 않게 시스템명 오른쪽부터 탭을 놓습니다(`ksis-layout.js` 가 가로바 왼쪽 폭 · 사번 문구 위치를 잼).
- **탭 검토 화면**(`/tabs`, 첫 화면의 [탭 검토] 카드) : 화면 탭을 안별로 한 화면에 나란히 봅니다.
  줄은 기존(지금 KSIS-A · KSIS-B 코드) · 1안(main 1차 검토본) · 2안 · 3안, 칸은 A · B 입니다.
  칸마다 실제 메인 틀을 실제 크기로 열고 좌측 메뉴를 눌러 탭을 몇 개 띄워 둡니다(보는 탭은 두 번째).
  위쪽에서 보기(2열 / 1열), 화면 폭, 열어 둘 탭 수(2 · 4 · 6 · 10 · 12개)를 바꿀 수 있습니다. 12개는 B 규칙(최대 10개, 오래 안 본 탭부터 닫힘) 시험용입니다.
  1안 · 3안 칸은 `?tabPlan=1` · `?tabPlan=3` 으로 `ksis-tabs-plan1.css` · `ksis-tabs-plan3.css`(검토용 파일)를 덧붙여 보여 줍니다.
- **좌측 메뉴 색 검토 화면**(`/sidebar`, 첫 화면의 [좌측 메뉴 색 검토] 카드) : 좌측 세로 메뉴(대메뉴 · 소메뉴) 색을
  A 줄 · B 줄로 기존 · 지금 요구사항 · 후보 3칸씩 나란히 봅니다. 오른쪽에서 후보(흰색 한 색, 연회색 한 색, 진한 메뉴 등)를 고르거나
  바탕 위 · 아래, 글자, 마우스 올림, 펼친 대메뉴 · 선택 소메뉴 색을 직접 바꾸면 후보 칸에 바로 입혀지고, 고른 값이 글로 나옵니다.
  메뉴 색은 `ksis-common.css` 의 `--k-menu-*` 변수로 바꿀 수 있게 했습니다(값을 안 주면 지금 요구사항 색 그대로).
- **더미 소메뉴** : 탭을 10개 넘게 열어 볼 수 있게 대메뉴마다 소메뉴를 5~9개로 늘렸습니다(모두 33개, 화면 내용은 같은 예시).
- 받는 법 : GitHub 에서 가지를 `plan-b` 로 바꾼 뒤 Code → Download ZIP.

## 실행

### 가장 쉬운 방법(코드 빌드 없이, 인터넷 없이)

1. Java 17 이상(JDK)을 설치합니다. cmd 에서 `java -version` 이 17 이상이면 됩니다.
   없으면 https://adoptium.net/temurin/releases/?version=17&os=windows 에서 JDK .msi 를 받아 설치합니다(설치 중 "Add to PATH" · "Set JAVA_HOME" 켜기).
2. `run` 폴더의 `run.bat` 을 두 번 누릅니다. 약 15초 뒤 브라우저가 http://localhost:8090 으로 열립니다. 까만 창을 닫으면 꺼집니다.
   (`run/ksis-ui-demo.war` 는 이 코드를 미리 빌드해 둔 것입니다. 코드를 고치면 `./mvnw package` 로 다시 만든 `target/ksis-ui-demo.war` 를 복사합니다.)

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
5. **1·2번 가로바** : 오른쪽 위 문구·아이콘은 뺐습니다. 빌드 버전은 KSIS-A 만 빼고 KSIS-B 는 지금처럼 보입니다(시연은 1234-5678). 브라우저 창 제목은 "KSIS-A 영업정보시스템"으로 고정(7번).
6. **41번 날짜** : `yyyyMMdd` · `yyyy-MM-dd` · `yyyy.MM.dd` · `yyyy/MM/dd` 를 모두 받아 칸을 떠나면 `yyyy-MM-dd` 로 보이고, 서버 값은 `yyyyMMdd`(`input.dataset.value`). 달력 버튼은 `tabindex="-1"` 이라 Tab 이 다음 날짜칸으로 갑니다. 맨 앞 날짜처럼 달력이 화면 왼쪽 밖으로 나가면 왼쪽 맞춤으로 엽니다.
7. **33번 KSIS-B 메모(데이터형 32px 유지)** : `table.k-grid.k-grid-dense` 로 두 테마 모두에 넣었습니다(쓸지 말지는 화면에서 고름).
8. **37번 편집 칸** : 테두리 색은 주색(A 파랑 / B 초록), 바탕 연노랑, 틀리면 빨강.
9. **B 색 중 비교표에 값이 없는 것** : 누름 `#019F46`, 수정 버튼 테두리 `#9FEAC0`, 수정 누름 `#D2F5E2`, 탭 바탕 `#BCDDCB` 는 B 초록에서 같은 비율로 만들었습니다. A 탭 바탕 `#C1CBE0` 도 같은 방식입니다.
10. **글꼴** : 아직 정하지 않아 `--k-font: sans-serif` 로 두었습니다(`ksis-common.css` 맨 위 한 줄).

## ③·④ 예외(색 말고 다른 것)

- 시스템 이름 글자 : "영업정보시스템(KSIS-A) · Advanced" / "영업정보시스템(KSIS-B) · Bridge 1234-5678"(2번 B 메모: B 는 지금처럼 빌드버전 표시, 시연은 예시 번호)
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
  guide/SampleData.java          시연용 표 · 메뉴 데이터
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
