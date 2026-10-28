# 2단계 : 전체 틀 — 가로바 · KSIS-B 심볼 · 좌측 메뉴 · 화면 탭 · 본문

비교표 1~18번. 확정안: 탭 **3안**(가로바 위로 겹친 책갈피 탭) + 탭 바닥선 **1안**, 좌측 메뉴 **2안**(진한 메뉴) + 대분류 흔적 **2안**, KSIS-B 심볼 **1안**(초록), 그림자 **3안**, 메뉴 240px 고정, 내용 가운데.

양이 많으니 2-1 → 2-6 순서로 하고, 한 덩어리가 끝날 때마다 화면을 띄워 확인하는 것을 권합니다(사용자가 "2-3 까지만" 처럼 나눠 시켜도 됨).

## 완성 모습 (1920×1080)

| 파일 | 내용 |
|---|---|
| `img/step2-layout-home.png` | 첫 화면(탭 없음, 대분류 모두 접힘) |
| `img/step2-layout-tabs.png` | 탭 3개, 가운데 탭을 보는 중, 대분류 2개 펼침 |
| `img/step2-header-tabs-zoom.png` | 가로바 · 심볼 · 탭 부분 확대 |
| `img/step2-menu-parent-mark.png` | 보는 화면이 든 대분류를 접어도 흔적이 남음 |
| `img/step2-menu-collapsed.png` | ≡ 로 메뉴를 접은 모습(탭은 제자리) |

시연 프로그램에서 직접 보기: `http://localhost:8090/view/req-b/layout`

## 참고 파일 (D:\ksis-ui-demo)

- `src/main/webapp/ksis-ui/css/ksis-common.css` 의 "1. 레이아웃 · 메뉴 · 탭" 부분(`.k-shell` ~ `.k-main-home`) — **이 단계 CSS 의 원본**
- `src/main/webapp/ksis-ui/js/ksis-layout.js` — 탭 곡선 SVG(`TAB_EDGES`), 가로바 재기(`measureHead`), 탭 · 메뉴 동작
- `src/main/webapp/WEB-INF/views/req/layout.jsp` — 마크업 구조
- `src/main/webapp/ksis-ui/img/ksis-b-logo.png` — KSIS-B 심볼 그림
- `src/main/resources/requirements.json` 1~18번(`bNote` 포함)

## 이름 대응 (시연 프로그램 → KSIS-B)

KSIS-B 의 클래스 이름은 **그대로 두고**, 그 규칙의 내용만 시연 프로그램 값으로 바꿉니다.

| 시연 프로그램 | KSIS-B (orig-b/app.css 기준, 실제 코드에서 확인) |
|---|---|
| `.k-shell` | `.app-shell` |
| `.k-header` · `.k-header-left` | `.app-header` · `.header-left` |
| `.k-hamburger` | `.hamburger-btn` |
| `.k-logo` · `.k-logo-img` | `.app-logo` (안의 `.app-logo-acronym` · `.app-logo-fullname` 글자 → 그림으로 바꿈) |
| `.k-user-badge` | `.header-user-badge` (`.header-user-badge-wrap` 안) |
| (없음) | `.header-right` · `.header-tagline` · `.tagline-*` → **없앰** |
| `.k-body` · `.k-workspace` | `.app-body` · `.app-workspace` |
| `.k-sidebar` · `.k-menu` | `.app-sidebar` · `.sidebar-menu` |
| `.k-menu-group-header` · `.k-menu-toggle` · `.k-submenu` | `.sidebar-group-header` · `.sidebar-group-toggle` · `.sidebar-submenu` |
| `.k-menu-item` | `.app-sidebar a.sidebar-item.sidebar-subitem` |
| `.k-tabbar` · `.k-tab` · `.k-tab-title` · `.k-tab-close` | `.tab-bar` · `.tab-item` · `.tab-item-title` · `.tab-item-close` |
| `.k-content` · `.k-card` | `main.app-content` · `.card` |

---

## 2-1. 상단 가로바 [1번]

- 높이 `calc(45 * var(--ui-y))` (지금과 같음). 바탕 `var(--k-topbar)` = #006B35 (지금과 같음).
- 안쪽 여백 `0 calc(24 * var(--ui-y)) 0 calc(15 * var(--ui-y))` → ≡ 버튼이 화면 왼쪽 끝과 심볼 네모 왼쪽 끝의 **가운데**(왼쪽 15px = ≡ 와 심볼 사이 15px).
- `.header-left` 간격 `calc(15 * var(--ui-y))` (지금 18).
- ≡ 버튼: 22×16 · 줄 두께 2 (× 세로 배율), 흰색, 올리면 `var(--k-topbar-hamburger-hover)` — 지금과 같음.
- 가운데 사번 문구: 지금 B 그대로(`K123456 일반 담당자` 처럼 사번 + 문구 1개, 10.7px × 세로 배율, 굵기 600, 위 6px × 세로 배율).
- **오른쪽 안내 문구 · 아이콘(.header-right, .header-tagline) 을 마크업과 CSS 에서 모두 없앱니다.** `@media (max-width: 860px)` 의 숨김 규칙도 없앱니다.
  - [10번] 대분류를 누르면 이 문구가 바뀌던 코드도 같이 없앱니다(대분류는 펼치기 · 접기만).
- 쌓는 순서와 그림자(그림자 3안):
  ```css
  .app-header {
      position: relative;
      z-index: 10;
      justify-content: flex-start;          /* 오른쪽 덩어리가 없어짐 */
      padding: 0 calc(24 * var(--ui-y)) 0 calc(15 * var(--ui-y));
      background: var(--k-topbar);
      box-shadow: 0 1px 2px rgba(0, 0, 0, .25), 0 2px 6px rgba(0, 0, 0, .38);
      /* 그림자는 가로바 아래끝 ~ 업무 영역 위끝 사이(1920×1080 에서 8px)까지만. 책갈피 탭 아래로는 비치면 안 됨 */
      clip-path: inset(0 0 calc(-1 * (var(--k-tab-h) - var(--k-tab-rise))) 0);
  }
  ```
  쌓는 순서(아래 → 위): 업무 영역 → 좌측 메뉴(z 5) → 가로바(z 10) → 탭 줄(z 20).
- 확인할 것: 가로바 아래 KDOCS 로그인 경고(`.kdocs-login-alert-header`)가 사번 문구 아래에 뜨는 경우가 있으면, 탭이 그 위를 덮게 됩니다. **어떻게 할지 사용자에게 물어봅니다**(마음대로 옮기지 않음).

## 2-2. KSIS-B 시스템 심볼 [2번] (B 심볼 1안)

- `D:\ksis-ui-demo\src\main\webapp\ksis-ui\img\ksis-b-logo.png` 를 KSIS-B 의 그림 폴더(예: `wwwroot/images/`)로 복사합니다(982×158 투명 PNG).
- `.app-logo` 안의 글자(`영업정보시스템(KSIS-B)` · `Kefico Sales Information System · Bridge 빌드버전`)를 그림 하나로 바꿉니다.
  ```html
  <div class="app-logo" title="처음 화면으로 이동" @onclick="...지금 있는 처리 그대로...">
      <img class="app-logo-img" src="images/ksis-b-logo.png" alt="KSIS-B">
  </div>
  ```
  - 누르면 탭을 모두 닫고 메인 화면 — **지금 동작 그대로**.
  - 빌드 버전 글자가 화면에서 사라집니다. 빌드 버전을 어디에 남길지(예: 그림의 마우스 올림 글 `title`) 사용자에게 물어봅니다.
- CSS:
  ```css
  .app-logo {
      display: flex;
      align-items: center;
      height: calc(42 * var(--ui-y));
      min-width: calc(275.4 * var(--ui-y));   /* 자리 폭은 KSIS-A 그림 폭과 같게 → A·B 탭 위치가 같음 */
      margin-top: calc(2 * var(--ui-y));      /* 심볼 본체 위 여백 2.5px 유지, 늘어난 2px 는 아래로 */
      cursor: pointer;
      user-select: none;
  }
  .app-logo-img { display: block; height: 100%; width: auto; -webkit-user-drag: none; }
  ```
  `.app-logo-acronym` · `.app-logo-fullname` 규칙(화면 배율 부분에 있는 것 포함)은 쓰는 곳이 없어지면 지웁니다.
- 1920×1080 에서 그림 크기 261×42, 위치 x 52 · y 2.5.

## 2-3. 좌측 메뉴 [3·4·8·9·11·12·13번] (메뉴 2안 + 대분류 흔적 2안)

**폭 [3번]** : 240px 고정(화면 크기와 상관없음).
- `.app-sidebar { width: calc(340 * var(--ui-x)); min-width: fit-content; }` (화면 배율 부분) 를 `width: var(--k-sidebar-w)` 로 바꾸고 `min-width: fit-content` 를 없앱니다.
- 긴 소메뉴는 끝을 `…` 로 줄이고(`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`), 소메뉴 `<a>` 에 `title="전체 이름"` 을 넣어 마우스를 올리면 전체 이름이 보이게 합니다.
- 글자 13.5px × `--sb-font`, 여백 × `--sb-pad` 는 지금 그대로.

**바탕 · 그림자 [11번]**
```css
.app-sidebar {
    position: relative;
    z-index: 5;
    width: var(--k-sidebar-w);
    overflow: hidden;
    border-right: none;
    background: linear-gradient(to bottom right, var(--k-menu-grad-start) 0%, var(--k-menu-grad-end) 100%);  /* #338B53 → #3A9259 */
    box-shadow: 1px 0 3px rgba(0, 0, 0, .18), 4px 0 16px rgba(0, 0, 0, .30);
    transition: width .15s ease, box-shadow .15s ease;
}
.app-sidebar.collapsed { width: 0; min-width: 0; box-shadow: none; }   /* [4번] 접기 : 폭 0, 그림자도 없앰 */
```

**글자 · 상태 색 [11번]** — 지금의 `color: #4C4C4C !important`, `rgba(3,199,90,.10)`, `#E7F9EE` 들을 아래로 바꿉니다.

| 상태 | 대분류(`.sidebar-group-header`) | 소메뉴(`a.sidebar-item.sidebar-subitem`) |
|---|---|---|
| 평소 | 글자 `var(--k-menu-text)` #E6F4EB, 굵기 500, 바탕 없음 | 같음 |
| 마우스 올림 | 바탕 `var(--k-menu-hover-bg)`(흰색 12%) + 흰 글자 | 같음 |
| 펼친 대분류(`.expanded`) | **바탕 없음** + 흰 굵은 글자(700) | — |
| 보는 화면 소메뉴(`.active`) | — | 바탕 `var(--k-primary)` #03C75A + 흰 굵은 글자(700), 올려도 그대로 |
| 보는 화면이 든 대분류(새 `.has-active`) | 바탕 `var(--k-menu-parent-bg)`(#03C75A 50%) + 흰 굵은 글자(700), 올려도 그대로 | — |

- `.has-active` [대분류 흔적 2안] : 지금 보는 탭의 소메뉴가 든 대분류에 붙입니다. **대분류를 접어도 남고**, 다른 탭을 보면 그 탭의 대분류로 옮겨 가고, 심볼을 눌러 메인으로 가면 사라집니다. Blazor 에서는 메뉴를 그릴 때 "이 그룹 안에 지금 보는 경로가 있나" 로 클래스를 붙이면 됩니다.
- 소메뉴 앞 `ㄴ`, 대분류 앞 `＋`/`－`, 아이콘 없음 [8번] — 지금 그대로.
- 메뉴 검색 · 즐겨찾기 없음 [12·13번] — 지금 그대로.
- [9번] 대분류는 각자 따로 펼치고 접습니다(지금 그대로). 시연 프로그램은 펼친 대분류를 이 PC 에 기억합니다(`localStorage` 키 `ksis.menu.open`, 새로고침 뒤에도 그대로). KSIS-B 는 지금 기억하지 않으므로, 이 부분을 바꿀지는 **먼저 사용자에게 확인**합니다. 소메뉴 주소로 바로 들어오면 그 대분류만 펼치는 지금 동작은 유지.
- 미등록 사용자 흐림(`.app-sidebar.sidebar-locked`)은 그대로 둡니다.

## 2-4. 화면 탭 [14~18번] (탭 3안 + 바닥선 1안)

사내 다른 시스템의 책갈피 탭 모양을 그대로 옮긴 것입니다. 진한 가로바 위로 탭을 겹쳐 올려, 탭 줄이 세로 공간을 거의 차지하지 않습니다.

### (1) 변수 2개 추가 (`app.css` 의 `--k-` 블록에)

```css
/* 탭을 가로바 안으로 올리는 높이 = 가로바 높이 - 사번 문구 아래끝 - 1px (문구 아래끝은 JS 가 재서 --k-badge-bottom 으로 줌) */
--k-tab-rise: calc(45 * var(--k-ui-y) - var(--k-badge-bottom, calc(21 * var(--k-ui-y))) - 1px);
/* 첫 탭 자리(화면 왼쪽 끝에서) : 업무 영역 왼쪽 끝과 심볼 오른쪽 + 24px 중 더 오른쪽. 메뉴를 접든 펴든 같은 자리 */
--k-tab-x: max(calc(var(--k-sidebar-w) + var(--k-content-start-x) + 3.5px), calc(var(--k-header-left-w, 0px) + 24px));
```

### (2) 가로바 재기 JS

새 파일(예: `wwwroot/js/ksis-layout.js`)을 만들고 `App.razor` 에서 불러옵니다. 시연 프로그램 `ksis-layout.js` 의 `measureHead` 와 같은 일을 합니다.

```js
// [14번] 탭 위치 계산용 : 가로바 왼쪽 덩어리(≡ + 심볼) 오른쪽 끝, 가운데 사번 문구 아래끝을 재서 CSS 변수로 넣는다
window.ksisLayout = {
    measureHead: function () {
        var root = document.documentElement.style;
        var left = document.querySelector(".header-left");
        var badge = document.querySelector(".header-user-badge");
        if (left) root.setProperty("--k-header-left-w", Math.ceil(left.getBoundingClientRect().right) + "px");
        if (badge) root.setProperty("--k-badge-bottom", Math.ceil(badge.getBoundingClientRect().bottom) + "px");
    }
};
window.addEventListener("resize", function () { window.ksisLayout.measureHead(); });
window.addEventListener("load", function () { window.ksisLayout.measureHead(); });
```
- Blazor 는 화면을 나중에 그리므로, 가로바가 있는 레이아웃(MainLayout 등)의 `OnAfterRenderAsync(firstRender)` 에서 `ksisLayout.measureHead` 를 한 번 부릅니다. 글꼴이 늦게 들어오는 경우를 위해 `document.fonts.ready.then(...)` 에서도 한 번 더 불러도 좋습니다.
- 사번 문구 **글자 줄(.header-user-badge)** 만 잽니다(KDOCS 경고 등 아래 덩어리 말고).

### (3) 탭 마크업 (TabBar.razor)

탭 하나마다 왼쪽 · 오른쪽 곡선 SVG 2개를 넣고, 앞 탭이 위로 오게 `z-index` 를 줍니다(탭 개수 − 순서).

```razor
<div class="tab-item @(isActive ? "active" : "")" style="z-index:@(tabs.Count - i)" title="@tab.Title" @onclick="...">
    <svg class="k-tab-l" viewBox="0 0 40 70" aria-hidden="true"><path d="M40 8L30.05 8L30.05 8.5L27.55 9.5L25.06 11.5L23.12 14.5L22.05 17.5L21.79 20.5L21.79 54.5L21.47 57.5L20.68 60.5L19.22 63.5L17.68 65.5L13.68 68.5L11.18 69.5L11.18 70L40 70Z"/></svg>
    <svg class="k-tab-r" viewBox="50 0 70 70" aria-hidden="true"><path d="M50 8L55.96 8L55.96 8.5L60.65 11.5L62.65 14.5L89.76 65.5L91.65 67.5L95.62 69.5L95.62 70L50 70Z"/></svg>
    <span class="tab-item-title">@tab.Title</span>
    <button type="button" class="tab-item-close" title="탭 닫기" @onclick:stopPropagation="true" @onclick="...">✕</button>
</div>
```
SVG 좌표는 참고 시스템의 탭 그림에서 픽셀로 따 온 값이라 **한 글자도 바꾸지 않습니다**(시연 프로그램 `ksis-layout.js` 의 `TAB_EDGES` 와 같음).

### (4) 탭 CSS — 지금의 `.tab-bar` · `.tab-item` 규칙(서류철 `::before` 사다리꼴 포함)을 아래로 바꿈

```css
.tab-bar {
    position: relative;
    z-index: 20;
    flex: 0 0 auto;
    display: flex;
    align-items: flex-end;
    height: calc(var(--k-tab-h) + 4px);                 /* 탭 32px + 위 그림자 자리 4px */
    margin-top: calc(-1 * (var(--k-tab-rise) + 4px));   /* 가로바 안으로 올림 */
    margin-bottom: 0;
    padding: 0 0 0 calc(var(--k-tab-x) - var(--k-sidebar-w));  /* 업무 영역이 메뉴 폭만큼 오른쪽에서 시작하므로 그만큼 뺌 */
    overflow: hidden;
    background: transparent;                            /* 탭 줄은 칠하지 않음 : 가로바를 가리는 건 탭뿐 */
    pointer-events: none;                               /* 탭 사이 빈 곳은 가로바 클릭을 막지 않음 */
    transition: padding-left .15s ease;                 /* 메뉴 폭 바뀜과 같이 움직여 화면에서는 탭이 제자리 */
}
/* 메뉴를 접으면 업무 영역이 화면 왼쪽 끝부터라 --k-tab-x 그대로 */
.app-sidebar.collapsed + .app-workspace .tab-bar { padding-left: var(--k-tab-x); }

.tab-bar .tab-item {
    --k-tab-fill: var(--k-tab-bg);
    position: relative;
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 40px;
    max-width: 200px;
    height: var(--k-tab-h);
    margin: 0 15px 0 10px;      /* 탭 가운데끼리 25px */
    padding: 0 2px 0 4px;
    background: var(--k-tab-fill);
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    color: var(--k-tab-text);
    cursor: pointer;
    user-select: none;
    pointer-events: auto;
}
.tab-bar .k-tab-l,
.tab-bar .k-tab-r {
    position: absolute;
    top: -4px;
    height: 35px;              /* 곡선 31px(탭보다 1px 짧음 → 발끝 아래 흰 선) + 위 4px */
    overflow: visible;
    pointer-events: none;
}
.tab-bar .k-tab-l { left: -19px; width: 20px; }
.tab-bar .k-tab-r { right: -34px; width: 35px; filter: drop-shadow(2.5px -1px 1px rgba(0, 0, 0, .09)); }
.tab-bar .k-tab-l path,
.tab-bar .k-tab-r path { fill: var(--k-tab-fill); }
.tab-bar .tab-item:hover { --k-tab-fill: var(--k-tab-hover-bg); color: var(--k-text-title); }
.tab-bar .tab-item.active { --k-tab-fill: var(--k-tab-active-bg); z-index: 99 !important; color: var(--k-tab-active-text); }
/* [바닥선 1안] 안 보는 탭은 가운데도 아래 1px 비움 → 양쪽 곡선 발끝 아래 선과 바닥이 한 줄 */
.tab-bar .tab-item:not(.active) { background: linear-gradient(var(--k-tab-fill), var(--k-tab-fill)) 0 0 / 100% calc(100% - 1px) no-repeat; }
.tab-bar .tab-item:hover .k-tab-l,
.tab-bar .tab-item.active .k-tab-l { filter: drop-shadow(-3px -.5px 1px rgba(0, 0, 0, .09)); }
.tab-bar .tab-item-title { flex: 1 1 auto; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.tab-bar .tab-item-close {
    flex: 0 0 12px;
    width: 12px;
    height: 16px;
    padding: 0;
    border: none;
    border-radius: 3px;
    background: transparent;
    color: inherit;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    cursor: pointer;
}
.tab-bar .tab-item-close:hover { background: #D93025; color: #FFFFFF; }
```
- `--tabbar-h`, `--tabbar-drop`, `--tabbar-reserve-right` 는 쓰는 곳이 없어지면 지웁니다.
- `.app-sidebar.collapsed + .app-workspace` 는 메뉴와 업무 영역이 형제(같은 부모, 메뉴가 바로 앞)일 때만 맞습니다. KSIS-B 마크업이 다르면 접힘 상태를 바깥 요소 클래스로 주는 등 같은 결과가 나게 바꿉니다.
- `.app-workspace`, `.app-body` 에 `z-index` · `transform` · `filter` 를 주지 않습니다(탭 줄이 가로바 위로 올라오지 못함).

### (5) 탭 동작 [15~18번] — 대부분 지금 B 그대로

- [15] 탭을 누르면 떠날 때 상태 그대로 + 탭마다 스크롤 위치 기억 — 지금 그대로(`tabs.js`).
- [16] 이미 열린 화면을 소메뉴로 다시 누르면 처음 상태로 새로 만들고 탭을 맨 오른쪽으로 — 지금 그대로.
- [17] 최대 10개, 넘으면 가장 오래 안 본 탭을 안내 없이 닫음 — 지금 그대로.
- [18] 닫기: ✕, 심볼 클릭(전체 닫기 + 메인). 보던 탭을 닫으면 오른쪽 이웃(없으면 왼쪽), 하나도 없으면 메인. 우클릭 메뉴 · [전체 닫기] 버튼 없음.
  마우스 가운데(휠) 클릭으로 닫기는 지금 B 에 있는데 비교표에서 미정입니다. **그대로 두고** 보고 때 알려 줍니다.
- 탭이 없으면 탭 줄 자체가 없음 — 지금 그대로.

## 2-5. 본문 [5·6·7번]

- 탭 줄 아래 8px 띠가 흰색으로 보이게, 바깥 바탕을 흰색으로:
  `.app-shell { background: var(--k-surface); }` (지금 #F4F6F8 이라 띠가 회색으로 보임)
- [6번] 내용 가운데:
  ```css
  main.app-content { scrollbar-gutter: stable both-edges; background: var(--k-surface); }   /* 스크롤바 자리를 양쪽에 똑같이 */
  .card { padding: 18px var(--k-card-pad-x) 16px; }   /* 좌우 24px 같게 (지금 왼쪽은 --content-start-x 8px) */
  ```
  1920×1080 에서 검색 영역 · 표가 업무 영역 좌우 39px 씩(= 24 + 스크롤바 자리 15) 띄워 가운데.
- [5번] 가로바는 세로 배율, 메뉴는 240px 고정(여백 · 글자만 배율) — 위 2-1 · 2-3 으로 끝. 문서 목록 행 높이 예외(`@media (max-height: 1060px)`)는 3단계에서 정리합니다.
- [7번] 브라우저 창 제목은 탭에 따라 바꾸지 않고 **`KSIS-B 영업정보시스템`** 으로 고정합니다.

## 2-6. 확인 방법

1920×1080 전체 화면(F11) 또는 개발자 도구의 화면 크기 1920×1080 에서, 시연 프로그램 `http://localhost:8090/view/req-b/layout` 과 나란히 띄워 비교합니다.

| 볼 것 | 맞는 값 (1920×1080) |
|---|---|
| 가로바 | 높이 45, #006B35, 오른쪽 문구 · 아이콘 없음, 아래로 짧은 그림자 |
| ≡ 버튼 | x 15, 22×16 |
| 심볼 그림 | x 52 · y 2.5, 261×42 |
| 첫 탭(가운데 직사각형) | x 362, y 21, 높이 32 → 탭 32px 중 24px 가 가로바 안, 아래 흰 띠 8px |
| 탭 사이 | 직사각형끼리 25px, 왼쪽 탭의 오른쪽 곡선이 오른쪽 탭 위에 겹침, 보는 탭이 맨 위 |
| 보는 탭 | 흰 바탕, 글자 #323232, 아래 업무 영역과 선 없이 이어짐(그림자도 안 비침) |
| 안 보는 탭 | #E4F1E9, 글자 #9F9F9F, 바닥이 곡선 발끝과 한 줄(가운데만 튀어나오지 않음), 올리면 #E3F7EA |
| 좌측 메뉴 | 폭 240, #338B53 → #3A9259, 오른쪽으로 그림자, 경계선 없음 |
| 메뉴 상태 | 펼친 대분류 = 흰 굵은 글자(바탕 없음), 보는 소메뉴 = #03C75A 채움, 그 대분류 = 반투명 초록(접어도 남음) |
| ≡ 로 접기 | 0.15초에 폭 0, 탭은 **제자리**(x 362 그대로) |
| 본문 | 제목 줄 · 검색 영역이 x 279 부터, 오른쪽도 39px 남김 |
| 창 제목 | 탭을 바꿔도 `KSIS-B 영업정보시스템` |

창 크기를 바꿔 볼 것: 1366×768 노트북 크기에서 탭이 사번 문구를 가리지 않는지, 가로 스크롤이 생기지 않는지.

## 여기서 멈추고 확인받기

Claude Code 는 여기서 멈추고 아래를 보고합니다.
- 바꾼 파일 목록(`git diff --stat`)과 없앤 것(오른쪽 안내 문구, 대분류별 문구 바꾸기, 빌드 버전 글자 등)
- 물어볼 것: KDOCS 경고 위치, 빌드 버전 표시, 대분류 펼침 기억 여부, 휠 클릭 닫기
- 사용자가 화면을 보고 괜찮다고 하면 커밋할지 묻기(예: `UI 통일 2단계 : 가로바 · 심볼 · 탭 · 좌측 메뉴`)
