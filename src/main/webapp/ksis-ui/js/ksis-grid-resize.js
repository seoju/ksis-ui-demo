// =====================================================================
//  KSIS 공통 그리드 : 열 폭 끌어 조절   [비교표 31번]
//  - KSIS-B wwwroot/columnResize.js 를 그대로 옮겼다(KSIS_B 69ea7ee).
//  - 비교표 결론 : 바꾼 폭은 기억하지 않는다 → register(table, null) 로 부른다(두 번째 인자 없이도 동작).
//  - 표에 <colgroup><col> 이 있어야 하고, 머리글 <th> 안에 <span class="col-resizer"></span> 를 둔다.
// =====================================================================
// ✅ [2026-09-23] 표 열 폭 드래그 조절.
//   - <th> 안의 .col-resizer(오른쪽 가장자리 손잡이)를 잡고 끌면 같은 순서의 <colgroup><col> 폭을 바로 바꾼다.
//   - 놓으면 .NET(OnColumnResized(열 번호, 폭))에 알려 폭을 기억한다(GridColumnWidthState: F5 후에도 유지, 재시작하면 초기화).
//   - Blazor 가 표를 다시 그려도 같은 <table> 요소면 한 번만 등록한다(dataset 표시).
(function () {
    var MIN_WIDTH = 24;

    window.columnResizeInterop = {
        register: function (table, dotnetRef) {
            if (!table || table.dataset.colResizeWired === "1") return;
            table.dataset.colResizeWired = "1";

            table.addEventListener("mousedown", function (e) {
                if (e.button !== 0) return;
                var handle = e.target && e.target.closest ? e.target.closest(".col-resizer") : null;
                if (!handle) return;
                var th = handle.closest("th");
                if (!th || !th.parentElement) return;

                var idx = Array.prototype.indexOf.call(th.parentElement.children, th);
                var cols = table.querySelectorAll("colgroup col");
                var col = cols[idx];
                if (!col) return;

                e.preventDefault();
                e.stopPropagation();

                var startX = e.clientX;
                var startW = th.getBoundingClientRect().width;
                table.classList.add("col-resizing");

                function widthAt(ev) {
                    return Math.max(MIN_WIDTH, Math.round(startW + (ev.clientX - startX)));
                }
                function onMove(ev) {
                    col.style.width = widthAt(ev) + "px";
                }
                function onUp(ev) {
                    document.removeEventListener("mousemove", onMove);
                    document.removeEventListener("mouseup", onUp);
                    table.classList.remove("col-resizing");
                    var w = widthAt(ev);
                    col.style.width = w + "px";
                    try { dotnetRef.invokeMethodAsync("OnColumnResized", idx, w); } catch (err) { }
                }
                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
            });
        }
    };
})();
