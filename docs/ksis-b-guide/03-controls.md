# 3단계 : 버튼 · 표(그리드) · 검색 영역 · 입력칸 · 드롭다운 · 날짜 · 모드 버튼

비교표 19~42번. 3-1 → 3-6 순서로 합니다. 양이 많으니 덩어리마다 화면을 확인하며 나눠 해도 됩니다.
**3-4 페이지 넘기기**와 **3-5 드롭다운**은 여러 화면을 고치는 큰 일이라, 먼저 고칠 곳 목록을 보여 주고 허락받은 뒤 진행합니다.

## 완성 모습 (1920×1080)

| 파일 | 내용 | 시연 프로그램 주소 |
|---|---|---|
| `img/step3-buttons.png` | 버튼 종류 · 올림 · 누름 · 비활성 | `/view/req-b/buttons` |
| `img/step3-grid.png` | 문서형 표(40px) · 데이터형 표(32px) · 편집 칸 · 번호 페이지 | `/view/req-b/grid` |
| `img/step3-search.png` | 검색 영역 · 입력칸 · 드롭다운 · 날짜 · 모드 버튼 | `/view/req-b/search` |

마우스 올림 · 누름 · 펼친 목록 · 달력은 그림으로 다 못 보이므로 시연 프로그램(`http://localhost:8090`)을 띄워 직접 눌러 보며 맞춥니다.

## 참고 파일 (D:\ksis-ui-demo)

- `src/main/webapp/ksis-ui/css/ksis-common.css` 의 "4. 버튼", "5. 검색 영역 · 입력칸 · 드롭다운 · 날짜 · 모드 버튼", "6. 그리드" 부분
- `src/main/webapp/ksis-ui/js/ksis-select.js`(드롭다운 · 모드 버튼), `ksis-date.js`(날짜), `ksis-grid-pager.js`(번호 페이지), `ksis-grid-select.js` · `ksis-grid-paste.js` · `ksis-grid-resize.js`(그리드 — KSIS-B 코드를 옮긴 것)
- `src/main/webapp/WEB-INF/views/req/buttons.jsp` · `grid.jsp` · `search.jsp`
- `src/main/resources/requirements.json` 19~42번(`bNote` 포함)

---

## 3-1. 버튼 [19~27번]

### 공통 규격 [19번]

지금 `.btn`(여백 9px 18px · 14px 굵게 700 · 누르면 1px 아래로) 을 아래로 바꿉니다.

```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 66px;            /* 3글자 기준. 글자가 길면(예: 엑셀 다운) 글자만큼 늘어남 */
    height: 34px;
    padding: 0 10px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    transition: background-color .15s ease, color .15s ease, box-shadow .15s ease, transform .15s ease;
}
/* 지금 있는 .btn:active { transform: translateY(1px) } 는 없앰 */
.btn:focus { outline: none; }
.btn:focus-visible { outline: 2px solid var(--k-primary-hover); outline-offset: 2px; }
```
- 버튼 안 아이콘(돋보기 · 펜 · 휴지통 등)은 모든 곳에서 뺍니다. 글자는 가운데.
- `엑셀 다운로드` → `엑셀 다운` 으로 줄여 씁니다.
- 제목 줄 버튼을 30px 로 줄이던 `.list-toolbar .btn { height: 30px; padding: 0 14px; font-size: 13px; }` 는 없앱니다(제목 줄 버튼도 34px 규격).
- `.btn-sm` 을 쓰는 곳은 목록을 보여 주고 어떻게 할지 묻습니다(비교표에 없음).

### 종류별 색 [20~25번]

| 종류 | KSIS-B 클래스 | 평소 | 올림(0.15초) | 누르는 동안 |
|---|---|---|---|---|
| 주 버튼(작성 · 조회 · 신규 · 저장 · 확인) | `.btn-primary` | 바탕 #03C75A · 흰 글자 · 그림자 `0 2px 8px var(--k-primary-shadow)` | 바탕 #02B350 + **1px 떠오름** + 그림자 `0 4px 12px var(--k-primary-shadow-hover)` | 바탕 #019F46, 떠오름 풀림, 그림자 평소 크기 |
| 수정 | `.btn-edit` (지금 파란 채움 #2962E3) | **흰 바탕 · 글자 #03C75A · 테두리 `var(--k-edit-border)` #9FEAC0** | 바탕 #E7F9EE · 글자 #02B350 | 바탕 #D2F5E2 · 글자 #02B350 |
| 삭제 | `.btn-danger` (지금 빨간 채움 #E0392C) | **바탕 #FFF0F0 · 글자 #E53E3E · 테두리 1.5px #FECACA** | 바탕 #FEE2E2 | 바탕 #FED1D2 |
| 보조 · 취소 · 초기화 · 닫기 | `.btn-outline` | 바탕 #F4F4F5 · 글자 #3F3F46 · 테두리 #E4E4E7 | 바탕 #E4E4E7 · 글자 #18181B | 바탕 #D4D4D8 · 글자 #18181B |

- 떠오름은 주 버튼만. 수정 · 삭제 · 보조는 바탕만 진해집니다.
- 값은 모두 1단계 변수로 씁니다(`--k-primary*`, `--k-edit-*`, `--k-danger-*`, `--k-ghost-*`). CSS 원본은 시연 프로그램 `.k-btn-primary` · `.k-btn-edit` · `.k-btn-danger` · `.k-btn-ghost`.
- `.btn-secondary`(#3C8C64) · `.btn-blue`(#2962E3) · `.tab-btn` · `.tab-btn-mini` · 화면 구석 버튼(`.corner-*`) · `.docform-footer-btn` 은 비교표에 없습니다. **쓰는 곳 목록을 보여 주고 어느 종류로 바꿀지 묻습니다.**

### 비활성 [26번]

- 비활성 버튼은 되도록 쓰지 않습니다. 지금 `disabled` 를 쓰는 버튼 목록을 보고합니다(로직은 고치지 않음).
- 불가피하면 흐리게(40%) 대신 회색 보조 버튼 모양:
  ```css
  .btn:disabled, .btn:disabled:hover, .btn:disabled:active {
      opacity: 1;
      border-color: var(--k-ghost-border);
      background: var(--k-ghost-bg);
      color: var(--k-text-muted);
      box-shadow: none;
      transform: none;
      cursor: not-allowed;
  }
  ```

### Enter · 포커스 [27번]

팝업이 열릴 때 포커스 규칙은 4단계(팝업)에서 합니다. 지금 B 의 `enterKey.js`(Enter = 그 화면 기본 버튼)는 그대로 둡니다.

## 3-2. 검색 영역 [38번] · 입력칸 [39번]

검색 영역(`.data-options.search-area`):
- 회색 상자 #F7F8FA, 높이 46px 고정, 모서리 10px, 좌우 안쪽 16px, 테두리 · 그림자 없음, 아래 간격 12px — 지금과 거의 같음, 값만 확인.
- 항목 사이 기본 간격 **6px**(지금 8px : `.data-options`, `.data-options-left`, `.search-area-right` 의 `gap`).
- **간격 두 가지(C-007)** : 같은 것끼리는 6px 그대로, 다른 것끼리는 두 배 **12px**.
  - 6px : 라벨 ↔ 그 입력칸, 날짜 ~ 날짜(물결 양쪽), [검색] ↔ [해제]
  - 12px : 입력칸 → 다음 라벨, 모드 버튼 → 라벨, 마지막 입력칸(체크박스) → [검색]
  ```css
  /* 기본 간격 6px 에 라벨 · 첫 버튼 왼쪽 6px 를 더해 12px */
  .search-area .data-options-left > label:not(:first-child),
  .search-area .data-options-left > :not(.btn) + .btn { margin-left: 6px; }
  ```
  - 라벨에 직접 쓴 `style="margin-left:10px;"` 같은 값은 지우고 위 규칙 하나로 맞춥니다(SalesPerformanceSearchBar 등).
  - 라벨 + 칸을 `<div>` 로 묶은 검색 영역이 있으면, 묶음 안은 6px · 묶음 사이는 12px 이 되게 같은 뜻으로 맞춥니다(어디를 고쳤는지 목록으로 보고).
- 라벨 13px · 굵기 600 · #555555 (지금 그대로).
- 한 줄 고정, 좁아지면 라벨 · 버튼 · 모드 버튼은 그대로 두고 입력칸만 줄어듦(최소 84px, 날짜 칸은 줄이지 않음) — 지금 그대로.
- 순서: [모드 버튼] · 조건 · [검색] [해제] … (이전/다음은 3-4 를 따름).

검색 영역 안 버튼(19번 규격의 예외):
```css
.search-area .btn { min-width: 0; height: 30px; padding: 0 14px; font-size: 13px; font-weight: 700; }
```
- 2글자로: `[검색 해제]` → **`[해제]`**. 색 · 올림 · 누름은 3-1 과 같음.

입력칸(`.text-input`, 검색 영역 안):
- 높이 30px, 모서리 10px, 테두리 1px #D8DCE1, 흰 바탕, 글자 14px, 좌우 14px — 지금과 같음.
- 누르면(입력 중) 테두리 `var(--k-primary)` + `box-shadow: 0 0 0 3px var(--k-primary-soft)` — 지금 B 와 같은지 확인.
- 안내 글(placeholder) #A6A6A6, 틀린 값 테두리 #E53E3E.

## 3-3. 표(그리드) [28~31 · 33~37번]

KSIS-B 표는 두 가지로 나눠 다룹니다.
- **문서형 표**(1행 = 작성 문서 1개 : `.doc-list-grid`, 그리고 기본 `table.app-grid`) → 이번에 A 크기로 바꿈
- **데이터형 표**(1행 = 데이터 1건 : `.compact-grid`, `.kb-grid`, 청구문서별 · 피벗 등) → **32px · 12px 지금 그대로**(33번 B 메모)

문서형 · 기본 표:
```css
table.app-grid th {                 /* [34번] 머리글 : 크기 · 굵기 A, 색 · 선 B */
    padding: 10px 12px;
    font-size: 12.5px;
    font-weight: 600;
    background: var(--k-header-row);          /* #F7F8FA */
    color: var(--k-text-header);              /* #333333 */
    border: none;
    border-bottom: 2px solid var(--k-border-strong);   /* #D8DCE1 */
    text-align: center;
}
table.app-grid td {                 /* [33·35번] 본문 칸 */
    height: 40px;
    padding: 10px 12px;
    font-size: 12.5px;
    font-weight: 400;
    color: var(--k-text);                     /* #222222 */
    border: none;
    border-bottom: 1px solid var(--k-border); /* #E5E8EB */
    text-align: center;
}
```
- 문서형 행 높이 `--doc-row-height: 56px` → **40px**, 창 높이에 따라 45px 로 바꾸던 `@media (max-height: 1060px)` 는 없앱니다([5번] "행 개수 바꾸기는 신중히" → 고정).
  `.doc-list-grid tbody td { padding: 0 !important; }` 안쪽에 따로 그린 칸이 있으면, 칸 안 여백이 10px 12px 가 되게 맞춥니다.
- 줄무늬 없음 · 칸 사이 세로선 없음 · 흰 바탕 — 지금 그대로.
- 데이터형 표(`.compact-grid`): 머리글 7px 8px · 12px, 본문 32px · 12px 지금 그대로. 머리글 색 · 선만 위와 같은지 확인.

동작:
- [28] 칸 클릭 = 엑셀식 활성 칸(#217346 테두리), 끌면 노란 영역 — 지금 그대로.
- [29] 방향키 · Shift · Ctrl · Ctrl+Home/End · Esc — 지금 그대로.
- [30] Ctrl+C 탭 구분 복사, 입력 표 Ctrl+V 여러 행, Tab 칸 이동 — 지금 그대로.
- [31] 열 폭 조절 손잡이는 그대로, **폭을 기억하는 부분(F5 뒤 유지)은 없앱니다**(다시 그리면 처음 폭).
- [36] 행에 올리면 #EAF9F0 — 지금 그대로. 손가락 커서는 눌러서 무언가 열리는 행(`.row-clickable`) · 칸에만 — 지금 그대로.
- [37] 편집 중인 칸(`.grid-cell-input`) — 화면마다 다르던 것을 공통으로:
  ```css
  .grid-cell-input { height: 30px; padding: 0 6px; border: 1.5px solid transparent; border-radius: 4px; background: transparent; font-size: 12.5px; color: var(--k-text-title); outline: none; }
  .grid-cell-input:focus { border-color: var(--k-primary); background: var(--k-edit-cell-bg); }          /* 초록 1.5px + 연노랑 #FFFFF8 */
  .grid-cell-input.invalid, .invalid-cell .grid-cell-input { border-color: var(--k-invalid); background: var(--k-invalid-bg); }  /* 빨강 #E53E3E + #FFF0F0 */
  ```

## 3-4. 페이지 넘기기 [32번] — 먼저 범위 보고 · 허락받기

- **문서형 메뉴만**: 검색 영역 오른쪽의 [이전]/[다음] 세로 묶음(StackPager) 대신, 표 아래 번호 페이지 줄(A 방식)로 바꿉니다.
  - 모양: 시연 프로그램 `.k-pager`(위 선 1px #E5E8EB, 바탕 #F7F8FA, 여백 8px 14px, 12px). 왼쪽 "한 페이지 행 수" 선택, 가운데 번호 버튼(높이 26 · 최소 28 · 모서리 6, 보는 쪽 = 주 색 채움 + 흰 글자 + 그림자), 오른쪽 건수.
  - 동작 참고: `ksis-grid-pager.js`. KSIS-B 에서는 C# 쪽 페이지 처리로 만듭니다.
  - 비교표 메모: "페이지 전환은 아마 20개 ↔ 200개 모드 전환 버튼으로 바뀔 예정(추후 확정)". 그러니 한 페이지 행 수 선택은 최소한으로 만듭니다.
- **데이터형 메뉴**(1만 건을 한 화면에 띄우는 메뉴 등)는 해당 없음, 지금 그대로.
- 제목 줄 오른쪽 건수 상자 둘째 줄 `1~15 (페이지 1 / 3)` 은 그대로 둡니다.
- 진행 전: 문서형 메뉴 목록과 바꿀 파일을 먼저 보여 주고 허락받습니다.

## 3-5. 드롭다운 [40번] — 먼저 범위 보고 · 허락받기

지금은 브라우저 기본 `<select>`(약 16곳). 펼친 목록을 직접 그린 목록으로 바꿉니다. Blazor 에서는 공통 컴포넌트(예: `KSelect.razor`)로 만드는 것을 권합니다(JS 가 DOM 을 바꾸면 Blazor 와 부딪힘). 한 화면에 먼저 붙여 확인받고 나머지에 넓힙니다.

닫힌 상자(지금 B 와 같은 모양):
- 흰 바탕, 테두리 1px #D8DCE1, 모서리 10px, 오른쪽 꺾쇠 ▾(오른쪽 12px, 12px 크기, #767676), 안쪽 `0 32px 0 14px`.
- 검색 영역: 높이 30px · 글자 14px. 작성 팝업 안: 칸 폭 가득 · 글자 13px · 안쪽 6px 12px.
- 펼친 동안 · 포커스: 테두리 #03C75A + 바깥 3px #E7F9EE(입력칸과 같음).
- 안내 글은 닫힌 상자 안 흐린 글씨(#A6A6A6)로만. **더미 선택지 3개 삭제**: 수주잔고 그래프 작성 `(중장기 매출 문서를 골라주세요)` · `(가져올 수주잔고 문서를 골라주세요)`, 중장기 매출 작성 `(가져올 중장기 매출 문서를 골라주세요)`.

펼친 목록(B 와 다른 점 3가지):
```css
.k-select-list {
    position: absolute; z-index: 3000; top: calc(100% + 4px); left: 0; min-width: 100%;
    max-height: calc(var(--k-opt-h, 30px) * 10 + 2px);   /* 10줄까지, 넘으면 스크롤 */
    margin: 0; padding: 0;                               /* 위아래 여백 없음 → 첫 줄 · 끝 줄이 테두리에 딱 붙음 */
    overflow-y: auto; list-style: none;
    border: 1px solid var(--k-list-border);              /* #DCDEE0 */
    border-radius: 10px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .15);
}
.k-select-list li { height: var(--k-opt-h, 30px); line-height: var(--k-opt-h, 30px); padding: 0 12px; font-size: 13px; color: var(--k-text); white-space: nowrap; cursor: pointer; }
.k-select-list li.selected { font-weight: 700; }
.k-select-list li.hover { background: var(--k-primary); color: #FFFFFF; }   /* 올린 줄 · 방향키로 옮긴 줄 = 확인 버튼 색 */
```
- 선택지 한 줄 높이 = 닫힌 상자 높이(`--k-opt-h`, 검색 영역 30px). 둥근 모서리에 첫 줄 · 끝 줄 색이 아주 조금 가려지는 것은 **의도한 것**입니다.
- 키보드: ↓ · Enter · Space 펼침, ↑↓ 이동, Enter 고름, Esc · Tab 닫음. 바깥을 누르면 닫힘.
- 고른 값 · 바뀜 알림은 지금 `<select>` 와 같게(바인딩 · `@onchange` 가 그대로 동작해야 함).

## 3-6. 날짜 [41번] · 모드 버튼 [42번]

날짜 — KSIS-B 달력 방식 그대로(글자 칸 + 초록 달력 버튼, 버튼 아래 오른쪽에 작은 달력). 단 **달력 버튼을 입력칸 안 오른쪽 끝으로 옮깁니다(C-006)** :
- 입력칸 폭 · 높이는 바꾸지 않습니다. 버튼만 32 → **20px**(모서리 6px, 아이콘 13px)로 줄여 입력칸 오른쪽 테두리와 4px 띄워 넣고, 글자는 버튼 앞까지만(오른쪽 안쪽 여백 26px) → `2026-10-28` 이 버튼에 가리지 않습니다. 날짜 칸 전체 폭은 버튼 + 간격(40px)만큼 줄어듭니다.
  ```css
  .date-input-wrap { position: relative; }                 /* display:flex 는 그대로, gap 은 의미 없어짐 */
  .date-input-wrap .text-input { padding-right: 26px; }   /* 글자는 버튼 앞까지 */
  .date-picker-btn {
      position: absolute;
      top: 50%;
      right: 5px;              /* 테두리 1px + 4px */
      width: 20px;
      height: 20px;
      margin-top: -10px;
      border-radius: 6px;
  }
  .date-picker-btn svg { width: 13px; height: 13px; }      /* svg 의 width/height="16" 속성보다 CSS 가 우선 */
  ```
  - 달력(작은 창)은 지금처럼 날짜 칸 아래 오른쪽 맞춤 — 칸 폭이 줄어든 만큼 같이 따라옵니다.
  - 시연 프로그램 `/view/req-b/search` 의 매출 기간 · `/view/req-b/popup` 의 등록일과 나란히 보고 맞춥니다.

아래를 **새로 추가**:
- `yyyyMMdd` · `yyyy-MM-dd` · `yyyy.MM.dd` · `yyyy/MM/dd` 무엇을 넣어도 같은 날짜로 알아듣고, 칸을 떠나면 `yyyy-MM-dd` 로 보이게, 서버로 보낼 값은 `yyyyMMdd`.
- 그 달에 없는 일은 **그 달 마지막 날로** 바꿈(윤년: 4로 나누어떨어지면 윤년, 100 이면 평년, 400 이면 윤년). 월이 1~12 가 아니거나 일이 0 이면 틀린 날짜(빨간 테두리).
  확인 예: `2025-02-30 → 2025-02-28`, `2024-02-30 → 2024-02-29`, `2026-04-31 → 2026-04-30`, `2026-01-99 → 2026-01-31`, `2000-02-30 → 2000-02-29`, `2100-02-30 → 2100-02-28`, `2026-13-01 → 틀림`, `2026-05-00 → 틀림`.
- 달력 버튼은 Tab 이 멈추지 않게(`tabindex="-1"`) → 날짜 2개가 나란히 있으면 Tab 이 둘째 날짜 → 다음 칸으로.
- 달력 색: 머리 바탕 #E7F9EE, 제목 · 화살표 #1F7A44, 오늘 = 주 색 1px 테두리, 고른 날 = 주 색 채움 + 흰 굵은 글자. [지우기] [오늘].
- 원가계산(flatpickr)은 범위 밖, 건드리지 않음.

모드 버튼(`.seg-stack`) — 비교표 값이 지금 B 와 같습니다. 확인만:
- 2단: 각 19px · 최소 폭 58px · 11.5px 굵게, 평소 #E5E8EB / #6B6B6B, 올림 #D8DCE1 / #333333, 고른 쪽 #03C75A + 흰 글자, 한 번 클릭으로 바뀜.
- 3단: 14px · 10.5px. 4단(`.seg-n4`)은 비교표에 없음, 그대로.

## 확인 방법

1. 시연 프로그램 `/view/req-b/buttons` · `/grid` · `/search` 와 나란히 놓고 비교(1920×1080).
2. 버튼: 높이 34 · 최소 폭 66, 주 버튼만 올리면 1px 떠오름, 누르면 한 단계 더 진함, 수정 = 흰 바탕 초록 테두리, 삭제 = 연분홍, 취소 = 연회색. 검색 영역 버튼만 30px.
3. 표: 문서형 행 40px · 글자 12.5px, 머리글 12.5px/600, 데이터형은 32px 그대로. 열 폭을 바꾸고 F5 → 처음 폭.
4. 검색 영역: 같은 것끼리 6px · 다른 것끼리 12px(라벨 앞 · [검색] 앞), [해제] 2글자, 창을 좁혀도 한 줄.
5. 날짜: 달력 버튼(20px)이 입력칸 안 오른쪽 끝, `2026-10-28` 이 가리지 않음. 위 확인 예 8개를 직접 넣어 봄.
6. 드롭다운: 펼친 목록 모서리 둥글게 · 줄 높이 30 · 올린 줄 초록.

## 여기서 멈추고 확인받기

Claude Code 는 여기서 멈추고 아래를 보고합니다.
- 바꾼 파일 목록(`git diff --stat`), 바꾼 버튼 · 표 · 드롭다운 개수
- 물어볼 것: 비교표에 없는 버튼 종류(`.btn-secondary` · `.btn-blue` · `.btn-sm` · `.tab-btn` 등)를 어떻게 할지, disabled 버튼 목록
- 3-4 · 3-5 를 나눠 했다면 남은 화면 목록
- 커밋할지 묻기(예: `UI 통일 3단계 : 버튼 · 표 · 검색 영역 · 입력칸`)
