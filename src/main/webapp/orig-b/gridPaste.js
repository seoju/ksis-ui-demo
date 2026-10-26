// ✅ 중장기 매출 [데이터 입력] 탭 그리드용 붙여넣기(Ctrl+V) 및 키보드 탐색(Tab) 처리 스크립트.
//
// ✅ 현재 화면에 실제로 렌더링된 데이터 행 수를 기준으로 붙여넣기 행 수를
// 비교한다. 과거에 data-expected-rows 값이 1060으로 남아 있어 실제 1099행
// 표에서도 잘못된 행 수 불일치 팝업이 발생하던 문제를 방지한다.
//
// ✅ paste-catcher textarea를 사용하여 일반 <td>를 한 번 클릭한 뒤에도
// Ctrl+V가 안정적으로 동작하도록 한다.

window.gridPasteInterop = {
    register: function (tableId, dotNetRef) {
        var table = document.getElementById(tableId);

        if (!table) {
            console.warn("gridPasteInterop.register: table not found -> " + tableId);
            return;
        }

        table._dotNetRef = dotNetRef;

        var catcher = document.getElementById(tableId + "PasteCatcher");

        logDebug(
            table,
            "register() 호출됨. pasteRegistered=" +
            table.dataset.pasteRegistered +
            ", keyNavRegistered=" +
            table.dataset.keyNavRegistered +
            ", catcherFound=" +
            (!!catcher)
        );

        if (table.dataset.pasteRegistered !== "true") {
            table.dataset.pasteRegistered = "true";
            registerPasteListener(table);
            logDebug(table, "paste 리스너 등록 완료.");
        }

        if (table.dataset.keyNavRegistered !== "true") {
            table.dataset.keyNavRegistered = "true";
            registerTabNavigationListener(table);
            logDebug(table, "tab 탐색 리스너 등록 완료.");
        }
    },

    // ✅ 셀을 클릭했을 때 숨겨진 textarea에 현재 셀 좌표를 기록하고
    // 실제 포커스를 textarea로 이동한다.
    selectCell: function (tableId, row, col) {
        var table = document.getElementById(tableId);
        var catcher = document.getElementById(tableId + "PasteCatcher");

        logDebug(
            table,
            "selectCell 호출됨. row=" +
            row +
            ", col=" +
            col +
            ", catcherFound=" +
            (!!catcher)
        );

        if (!catcher) {
            return;
        }

        catcher.dataset.row = row;
        catcher.dataset.col = col;
        catcher.value = "";

        try {
            catcher.focus({ preventScroll: true });
        }
        catch (e) {
            catcher.focus();
        }

        setTimeout(function () {
            var focusedNow = describeActive();
            var success = document.activeElement === catcher;

            logDebug(
                table,
                "selectCell focus 결과 확인 → success=" +
                success +
                ", activeElement=" +
                focusedNow
            );
        }, 0);
    }
};


function logDebug(table, message) {
    console.log("[gridPaste] " + message);
}


function describeActive() {
    var el = document.activeElement;

    if (!el) {
        return "null";
    }

    var row = el.dataset ? el.dataset.row : undefined;
    var col = el.dataset ? el.dataset.col : undefined;

    return el.tagName +
        "#" +
        (el.id || "(no-id)") +
        " class=[" +
        (el.className || "") +
        "] data-row=" +
        row +
        " data-col=" +
        col;
}


// ✅ 현재 화면에 실제로 렌더링된 일반 데이터 행 수를 계산한다.
// 자동 합산 행과 사용자 입력 행에는 total-row 클래스가 있으므로 제외한다.
// 이 값을 사용하면 과거의 오래된 data-expected-rows 속성을 읽지 않는다.
function getActualDataRowCount(table) {
    if (!table || !table.tBodies || table.tBodies.length === 0) {
        return 0;
    }

    var body = table.tBodies[0];

    var dataRows = body.querySelectorAll(
        "tr:not(.total-row)"
    );

    return dataRows.length;
}


function registerPasteListener(table) {
    var container = table.parentElement || table;
    var CHUNK_ROW_SIZE = 80;

    logDebug(
        table,
        "registerPasteListener: container=" +
        (container.className || container.tagName)
    );

    container.addEventListener("paste", function (e) {
        logDebug(
            table,
            "paste 이벤트 발생. activeElement=" +
            describeActive()
        );

        var active = document.activeElement;

        // ✅ [2026-10-02] 화면 탭: 숨은 탭 화면의 표에는 붙여넣지 않는다.
        if (container.closest && container.closest(".keepalive-hidden")) {
            return;
        }

        if (!active || !container.contains(active)) {
            logDebug(
                table,
                "paste 무시됨: 현재 포커스된 요소가 그리드 컨테이너 안에 없음."
            );
            return;
        }

        if (
            active.dataset.row === undefined ||
            active.dataset.col === undefined
        ) {
            logDebug(
                table,
                "paste 무시됨: 포커스된 요소에 data-row/data-col이 없음."
            );
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        var clipboardData = e.clipboardData || window.clipboardData;

        if (!clipboardData) {
            logDebug(
                table,
                "paste 중단: clipboardData를 가져올 수 없음."
            );
            return;
        }

        var text = clipboardData.getData("text");

        logDebug(
            table,
            "클립보드 텍스트 길이=" +
            (text ? text.length : 0)
        );

        if (!text) {
            logDebug(
                table,
                "paste 중단: 클립보드 텍스트가 비어있음."
            );
            return;
        }

        var startRow = parseInt(active.dataset.row, 10);
        var startCol = parseInt(active.dataset.col, 10);

        if (isNaN(startRow) || isNaN(startCol)) {
            logDebug(
                table,
                "paste 중단: startRow/startCol 파싱 실패."
            );
            return;
        }

        var lines = text
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .split("\n");

        if (
            lines.length > 0 &&
            lines[lines.length - 1] === ""
        ) {
            lines.pop();
        }

        if (lines.length === 0) {
            logDebug(
                table,
                "paste 중단: 줄 분리 결과가 0개."
            );
            return;
        }

        // ✅ 핵심 수정
        // table.dataset.expectedRows 값은 과거 표의 행 수가 남아있을 수 있으므로
        // 사용하지 않는다. 현재 DOM에 실제로 렌더링된 데이터 행 수를 계산한다.
        var actualDataRows = getActualDataRowCount(table);

        logDebug(
            table,
            "현재 실제 데이터 행 수=" +
            actualDataRows +
            ", 붙여넣기 행 수=" +
            lines.length +
            ", startRow=" +
            startRow
        );

        // ✅ 1행 이하 붙여넣기는 기존처럼 일반 셀 수정으로 처리한다.
        // 여러 행을 붙여넣는 경우에만 전체 행 수를 비교한다.
        // ✅ [2026-10-13] data-skip-row-check 가 붙은 표(수주잔고 데이터 입력)는 비교하지 않는다 —
        //    몇 행만 붙여넣는 일이 흔한 표라, 넘친 부분은 그 화면이 글로 알린다.
        // ✅ [2026-10-19] 표 전체를 붙여넣을 때(첫 행부터)만 비교한다 — 중장기 매출에서 [행 추가]로 늘린 1~2행에
        //    붙여넣을 때 확인 창이 뜨지 않게(사용자 규칙: 팝업은 최후의 경우에만).
        if (
            table.dataset.skipRowCheck !== "true" &&
            startRow === 0 &&
            actualDataRows > 0 &&
            lines.length > 1 &&
            lines.length !== actualDataRows
        ) {
            var proceed = window.confirm(
                "현재 표의 실제 데이터 행 수는 " +
                actualDataRows +
                "행입니다.\n" +
                "붙여넣으려는 데이터는 " +
                lines.length +
                "행입니다.\n\n" +
                "그대로 진행하시겠습니까?"
            );

            logDebug(
                table,
                "행 수 불일치 확인 결과: " +
                proceed
            );

            if (!proceed) {
                logDebug(
                    table,
                    "사용자가 취소하여 붙여넣기를 중단합니다."
                );
                return;
            }
        }

        logDebug(
            table,
            "paste 처리 시작. startRow=" +
            startRow +
            ", startCol=" +
            startCol +
            ", 줄 수=" +
            lines.length
        );

        sendChunks(
            table,
            startRow,
            startCol,
            lines,
            0,
            CHUNK_ROW_SIZE
        );
    }, false);


    function sendChunks(
        table,
        startRow,
        startCol,
        lines,
        offset,
        chunkSize
    ) {
        if (offset >= lines.length) {
            logDebug(
                table,
                "sendChunks 전체 완료. 총 줄 수=" +
                lines.length
            );
            return;
        }

        var chunkLines = lines.slice(
            offset,
            offset + chunkSize
        );

        var chunkText = chunkLines.join("\n");

        var isLastChunk =
            (offset + chunkSize) >= lines.length;

        logDebug(
            table,
            "sendChunks 전송. offset=" +
            offset +
            ", 줄 수=" +
            chunkLines.length +
            ", isLastChunk=" +
            isLastChunk
        );

        if (!table._dotNetRef) {
            logDebug(
                table,
                "sendChunks 중단: DotNetObjectReference가 없습니다."
            );
            return;
        }

        table._dotNetRef.invokeMethodAsync(
            "OnPasteData",
            startRow + offset,
            startCol,
            chunkText,
            isLastChunk
        )
            .then(function () {
                logDebug(
                    table,
                    "OnPasteData 호출 성공. offset=" +
                    offset
                );

                sendChunks(
                    table,
                    startRow,
                    startCol,
                    lines,
                    offset + chunkSize,
                    chunkSize
                );
            })
            .catch(function (err) {
                console.error(
                    "gridPasteInterop: OnPasteData 호출 실패",
                    err
                );

                logDebug(
                    table,
                    "OnPasteData 호출 실패!! offset=" +
                    offset +
                    ", error=" +
                    err
                );
            });
    }
}


function registerTabNavigationListener(table) {
    table.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") {
            return;
        }

        // ✅ [2026-10-02] 화면 탭: 숨은 탭 화면의 표는 Tab 이동을 가로채지 않는다.
        if (table.closest && table.closest(".keepalive-hidden")) {
            return;
        }

        var target = e.target;

        if (
            !target ||
            !target.classList ||
            !target.classList.contains("grid-cell-input")
        ) {
            return;
        }

        if (
            target.dataset.row === undefined ||
            target.dataset.col === undefined
        ) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        var row = parseInt(target.dataset.row, 10);
        var col = parseInt(target.dataset.col, 10);

        if (isNaN(row) || isNaN(col)) {
            return;
        }

        if (!table._dotNetRef) {
            return;
        }

        table._dotNetRef.invokeMethodAsync(
            "OnTabKeyPressed",
            row,
            col,
            e.shiftKey
        )
            .catch(function (err) {
                console.error(
                    "gridPasteInterop: OnTabKeyPressed 호출 실패",
                    err
                );
            });
    }, true);
}
