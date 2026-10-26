// ✅ [2026-10-02] 화면 탭: 탭마다 세로/가로 스크롤 위치를 따로 기억한다.
// 모든 탭 화면이 같은 스크롤 영역(main.app-content)을 함께 쓰므로, 탭을 바꾸면 이전 탭의 위치를 그대로 두면 안 된다.
// - MainLayout 이 main 의 data-active-tab 에 "경로#초기화번호"를 넣는다(탭이 아닌 화면은 "").
// - 스크롤할 때마다 지금 키의 위치를 적어 둔다. 단, 탭이 막 바뀌어 data-active-tab 이 아직 restore 전의 키와 다르면
//   (보이는 화면이 바뀌며 브라우저가 스크롤을 잘라낸 것) 적지 않는다 → 이전 탭의 위치가 망가지지 않는다.
// - 탭이 바뀐 뒤 MainLayout 이 restore(키)를 부르면 기억해 둔 위치로 되돌린다(처음 보는 키는 맨 위).
window.tabScroll = (function () {
    var positions = {};
    var currentKey = null;
    var boundMain = null;

    function getMain() {
        return document.querySelector("main.app-content");
    }

    function bind(main) {
        if (boundMain === main) return;
        boundMain = main;
        main.addEventListener("scroll", function () {
            var key = main.getAttribute("data-active-tab") || "";
            if (key !== currentKey) return; // 탭 전환 중(restore 전)
            positions[key] = { top: main.scrollTop, left: main.scrollLeft };
        }, { passive: true });
    }

    return {
        restore: function (key) {
            var main = getMain();
            if (!main) return;
            bind(main);
            key = key || "";
            currentKey = key;
            var p = key === "" ? null : positions[key]; // 메인/상세 화면은 새로 만들어지므로 늘 맨 위
            main.scrollTop = p ? p.top : 0;
            main.scrollLeft = p ? p.left : 0;
        }
    };
})();
