# 1단계 : 공통 변수 (`wwwroot/app.css` `:root`)

## 목표

2~4단계에서 쓸 디자인 값을 `app.css` 맨 위 `:root` 에 **변수로만 먼저 넣습니다**.
이 단계에서는 화면이 **하나도 바뀌지 않아야** 합니다(변수를 만들기만 하고 아직 아무 데서도 안 씀).

## 참고 파일 (D:\ksis-ui-demo)

- `src/main/webapp/ksis-ui/css/ksis-theme-b.css` : B 색 변수 전부(이 파일 값이 기준)
- `src/main/webapp/ksis-ui/css/ksis-common.css` 맨 위 `:root` : A·B 공통 중립색 · 크기
- 비교 원본 B CSS 사본 : `src/main/webapp/orig-b/app.css` (KSIS_B 커밋 69ea7ee 시점)

## 할 일

### 1-1. 지금 있는 변수는 그대로 둔다

`--color-*`, `--radius-*`, `--gap-*`, `--ui-x`, `--ui-y`, `--sb-pad`, `--sb-font` 는 이름 · 값 모두 그대로 둡니다.
(지금 화면들이 쓰고 있어서, 값을 바꾸면 이 단계에서 화면이 바뀌어 버립니다. 필요한 값 변경은 2~4단계에서 쓰는 곳을 바꾸며 합니다.)

이미 같은 값인 것(참고, 새 변수와 같음):

| 지금 B 변수 | 값 | 새 변수 |
|---|---|---|
| `--color-primary` | #03C75A | `--k-primary` |
| `--color-primary-hover` | #02B350 | `--k-primary-hover` |
| `--color-primary-soft` | #E7F9EE | `--k-primary-soft` |
| `--color-text` / `-sub` / `-muted` | #222222 / #767676 / #A6A6A6 | `--k-text` / `--k-text-sub` / `--k-text-muted` |
| `--color-border` / `-strong` | #E5E8EB / #D8DCE1 | `--k-border` / `--k-border-strong` |
| `--color-header-row` / `-header-text` | #F7F8FA / #333333 | `--k-header-row` / `--k-text-header` |
| `--color-row-click` | #EAF9F0 | `--k-grid-row-hover` |
| `--color-border-soft-green` | #DCEFE3 | `--k-pop-line` |
| `--color-label-bg` / `-hover` | #EAF7EE / #DFF3E5 | `--k-pop-label-bg` / `--k-pop-label-hover` |
| `--ui-x` / `--ui-y` | 1920×1080 = 1 배율 | `--k-ui-x` / `--k-ui-y` (같은 식) |

### 1-2. `:root` 에 새 변수 묶음을 덧붙인다

`app.css` 첫 `:root { … }` 블록 **바로 아래**에 아래 블록을 그대로 넣습니다.
(시연 프로그램 `ksis-theme-b.css` 전체 + `ksis-common.css` `:root` 에서 글꼴을 뺀 것. 이름은 시연 프로그램과 같게 `--k-` 로 시작)

```css
/* =====================================================================
   KSIS UI 통일 변수 (2026-10 A·B 디자인 통일, 시연 프로그램 ksis-ui-demo 와 같은 이름 · 값)
   - 주 색 계열 = ksis-theme-b.css, 중립색 · 크기 = ksis-common.css :root
   - 글꼴은 아직 미정이라 지금 KSIS-B 글꼴(Pretendard)을 그대로 쓴다
   ===================================================================== */
:root {
    /* 주 색 (B 초록) */
    --k-primary: #03C75A;
    --k-primary-hover: #02B350;
    --k-primary-press: #019F46;
    --k-primary-shadow: rgba(3, 199, 90, .25);
    --k-primary-shadow-hover: rgba(3, 199, 90, .35);
    --k-primary-soft: #E7F9EE;
    --k-primary-tint-strong: rgba(3, 199, 90, .15);
    --k-primary-deep: #1F7A44;

    /* 상단 가로바 */
    --k-topbar: #006B35;
    --k-topbar-hamburger-hover: #D6F5E3;

    /* 좌측 메뉴 (2안 진한 메뉴 + 그라데이션 3안 Trello 다크 보드식, C-008) */
    --k-menu-grad-start: #275235;
    --k-menu-grad-end: #153921;
    --k-menu-text: #E6F4EB;
    --k-menu-hover-bg: rgba(255, 255, 255, .12);
    --k-menu-line: rgba(255, 255, 255, .35);      /* [8번] 대분류 이름 오른쪽 가로선 (C-005) */
    --k-menu-parent-bg: rgba(3, 199, 90, .5);

    /* 화면 탭 (3안) */
    --k-tab-bg: #E4F1E9;
    --k-tab-hover-bg: #E3F7EA;
    --k-tab-active-bg: #FFFFFF;
    --k-tab-text: #9F9F9F;
    --k-tab-active-text: #323232;

    /* 수정 버튼 */
    --k-edit-border: #9FEAC0;
    --k-edit-press: #D2F5E2;

    /* 표 */
    --k-grid-row-hover: #EAF9F0;

    /* 업무 팝업 */
    --k-pop-label-bg: #EAF7EE;
    --k-pop-label-text: #2F5E43;
    --k-pop-line: #DCEFE3;
    --k-pop-label-hover: #DFF3E5;
    --k-pop-value-hover: #FAFEFB;

    /* 글자 색 [45번] */
    --k-text-title: #1B1D1F;
    --k-text: #222222;
    --k-text-sub: #767676;
    --k-text-muted: #A6A6A6;
    --k-text-header: #333333;   /* 표 머리글 [34번] */
    --k-text-label: #555555;    /* 검색 라벨 [38번] */

    /* 바탕 · 선 */
    --k-surface: #FFFFFF;
    --k-search-bg: #F7F8FA;
    --k-header-row: #F7F8FA;
    --k-border: #E5E8EB;
    --k-border-strong: #D8DCE1;
    --k-list-border: #DCDEE0;

    /* 보조 · 취소 버튼 [23번] */
    --k-ghost-bg: #F4F4F5;
    --k-ghost-text: #3F3F46;
    --k-ghost-border: #E4E4E7;
    --k-ghost-hover-bg: #E4E4E7;
    --k-ghost-hover-text: #18181B;
    --k-ghost-press-bg: #D4D4D8;

    /* 삭제 버튼 [22번] */
    --k-danger-bg: #FFF0F0;
    --k-danger-text: #E53E3E;
    --k-danger-border: #FECACA;
    --k-danger-hover-bg: #FEE2E2;
    --k-danger-press-bg: #FED1D2;

    /* 엑셀식 활성 칸 · 선택 영역 [28번] */
    --k-cell-cursor: #217346;
    --k-cell-sel-bg: #FFF1B8;
    --k-cell-sel-line: #F5C400;

    /* 편집 칸 [37번] */
    --k-edit-cell-bg: #FFFFF8;
    --k-invalid: #E53E3E;
    --k-invalid-bg: #FFF0F0;

    /* 팝업 · 알림 [43·44번] */
    --k-overlay: rgba(0, 0, 0, .45);
    --k-pop-shadow: 0 12px 40px rgba(0, 0, 0, .25);
    --k-pop-footer-bg: #ECEEF1;
    --k-dialog-question: #F0A020;

    /* 간격 [48번] */
    --k-gap-v: 12px;
    --k-gap-h: 6px;

    /* 화면 크기 배율 : KSIS-B 에 이미 있는 것과 같은 식 */
    --k-ui-x: var(--ui-x);
    --k-ui-y: var(--ui-y);
    --k-sb-pad: var(--sb-pad);
    --k-sb-font: var(--sb-font);

    /* 틀 [3·6·14·47번] */
    --k-sidebar-w: 240px;
    --k-tab-h: 32px;
    --k-content-start-x: 8px;
    --k-card-pad-x: 24px;
    --k-search-pad-x: 16px;
}
```

주의:
- `--ui-x` · `--ui-y` · `--sb-pad` · `--sb-font` 는 `app.css` 뒤쪽(화면 배율 부분)의 `:root` 에 있습니다. CSS 변수는 순서와 상관없이 이어지므로 위 블록을 앞에 둬도 됩니다. 혹시 이름이 다르게 바뀌어 있으면 알려 주세요.
- 탭 위치 계산용 변수(`--k-tab-rise`, `--k-tab-x`)는 2단계에서 탭을 바꿀 때 넣습니다.
- `wwwroot/cost-calc/costcalc.css`(원가계산) 는 이번 작업 범위가 아닙니다. 건드리지 않습니다.

## 확인 방법

1. 앱을 실행해 메인 · 아무 목록 화면 · 작성 팝업 하나를 열어 봅니다. **전과 똑같아야 합니다.**
2. 브라우저 개발자 도구(F12) → Elements 에서 `<html>` 을 고르고 Styles 아래 `:root` 에 `--k-primary: #03C75A` 등이 보이면 됩니다.
3. `app.css` 에서 이번에 바뀐 줄이 위 블록 하나뿐인지 `git diff --stat` 으로 확인합니다.

## 여기서 멈추고 확인받기

Claude Code 는 여기서 멈추고 아래를 보고합니다.
- 넣은 위치(줄 번호)와 `git diff --stat`
- 1-1 표와 다르게 KSIS-B 값이 달랐던 변수가 있었는지
- 커밋할지 물어보기(예: `UI 통일 1단계 : 공통 변수 추가`)
