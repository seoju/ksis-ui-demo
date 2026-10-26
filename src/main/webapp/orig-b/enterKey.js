// ✅ [2026-09-21] 엔터 = 실행. 어느 화면에서든 Enter 키를 누르면 그 화면(또는 열려 있는 모달)의
//    "기본 실행 버튼"이 눌린 것과 똑같이 동작한다.
//
//  사용 방법 (Razor 쪽):
//    - 실행/조회 버튼에 data-enter-action 속성만 붙이면 된다.   예) <button data-enter-action ...>검색</button>
//    - 화면(main.app-content) 또는 모달(.write-modal-box) 안에서 그 속성이 붙은 첫 번째 버튼이 대상이다.
//      모달이 열려 있으면 모달 안의 버튼만 대상이 된다(뒤에 있는 화면의 버튼은 눌리지 않는다).
//    - 특정 입력칸에서만 Enter를 막고 싶으면 그 입력칸(또는 조상)에 data-enter-skip 을 붙인다.
//
//  동작 규칙:
//    - 한글 IME 조합 중(isComposing / keyCode 229)의 Enter는 무시한다(글자 확정용 Enter).
//    - textarea 안에서는 Enter가 줄바꿈이므로 Ctrl+Enter 만 실행으로 본다.
//    - 버튼/링크/select 위에서의 Enter는 브라우저 기본 동작(그 버튼 클릭)을 그대로 둔다.
//    - @bind(변경 이벤트) 방식 입력칸은 Enter 시점에 아직 값이 서버로 안 갔을 수 있으므로,
//      버튼을 누르기 전에 change 이벤트를 먼저 발생시켜 값이 먼저 전달되게 한다.
(function () {
    "use strict";

    function isComposing(e) {
        return e.isComposing === true || e.keyCode === 229;
    }

    // ✅ [2026-09-30] 숨겨 둔 화면(예: 미리 만들어 둔 K품번 기준 화면)의 모달·버튼은 대상에서 뺀다.
    //    display:none 이면 getClientRects 가 비고, visibility:hidden(조상에서 물려받음)이면 계산된 visibility 가 hidden 이다.
    //    offsetParent 는 position:fixed 모달에서도 null 이라 쓰지 않는다.
    function isShown(el) {
        if (!el || !el.getClientRects || el.getClientRects().length === 0) return false;
        try { return getComputedStyle(el).visibility !== "hidden"; } catch (e) { return true; }
    }

    // ✅ [2026-10-19] 숨은 탭 화면은 찾지 않는다: 업무 영역(main)은 보이는 화면만, 그 밖(머리글·좌측 메뉴·모달 등)은 전부.
    //    예전에는 Enter 마다 문서 전체를 찾아서 숨은 탭에 1만 행 표가 있으면 수십 ms 가 더 걸렸다(usageLog.js 도 같은 방식).
    function mainShownRoots(main) {
        var roots = [];
        for (var c = main.firstElementChild; c; c = c.nextElementSibling)
            if (!c.classList.contains("keepalive-hidden")) roots.push(c);
        return roots;
    }

    function shownRoots() {
        var main = document.querySelector("main.app-content");
        if (!main) return [document.body];
        var roots = mainShownRoots(main);
        for (var n = main; n !== document.body && n.parentElement; n = n.parentElement)
            for (var s = n.parentElement.firstElementChild; s; s = s.nextElementSibling)
                if (s !== n) roots.push(s);
        return roots;
    }

    /** roots 안에서 selector 에 맞는 요소(문서 순서). */
    function queryIn(roots, selector) {
        var list = [];
        roots.forEach(function (root) {
            if (root.matches && root.matches(selector)) list.push(root);
            Array.prototype.push.apply(list, root.querySelectorAll(selector));
        });
        return list.sort(function (a, b) { return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
    }

    function findScope(target) {
        // 입력칸이 모달 안에 있으면 그 모달, 아니면 가장 위에 떠 있는(보이는) 모달, 그것도 없으면 본문(main 의 보이는 화면).
        if (target && target.closest) {
            var own = target.closest(".write-modal-box");
            if (own) return [own];
        }
        var boxes = queryIn(shownRoots(), ".write-modal-box");
        for (var i = boxes.length - 1; i >= 0; i--) if (isShown(boxes[i])) return [boxes[i]];
        var main = document.querySelector("main.app-content");
        return main ? mainShownRoots(main) : [document.body];
    }

    function firstShownAction(scopes) {
        var list = queryIn(scopes, "button[data-enter-action], a[data-enter-action]");
        for (var i = 0; i < list.length; i++) if (isShown(list[i])) return list[i];
        return null;
    }

    document.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" || isComposing(e)) return;
        if (e.altKey || e.metaKey || e.shiftKey) return;

        var t = e.target;
        var tag = t && t.tagName ? t.tagName : "";

        if (tag === "TEXTAREA") {
            if (!e.ctrlKey) return; // 줄바꿈
        } else if (e.ctrlKey) {
            return;
        }

        if (tag === "BUTTON" || tag === "A" || tag === "SELECT") return;
        if (t && t.isContentEditable) return;
        if (t && t.closest && t.closest("[data-enter-skip]")) return;
        // ✅ [2026-10-02] 화면 탭: 숨은 탭 화면 안에 포커스가 남아 있으면(inert 이전 브라우저 등) 보이는 화면의 버튼을 누르지 않는다.
        if (t && t.closest && t.closest(".keepalive-hidden")) return;

        var scope = findScope(t);
        var btn = firstShownAction(scope);
        if (!btn || btn.disabled) return;

        // @bind 입력칸의 값이 클릭보다 먼저 서버에 닿도록 change를 먼저 보낸다.
        if (tag === "INPUT") {
            try { t.dispatchEvent(new Event("change", { bubbles: true })); } catch (err) { }
        }

        e.preventDefault();
        btn.click();
    }, true);
})();
