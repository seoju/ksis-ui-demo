// =====================================================================
//  KSIS 공통 그리드 : 칸 선택 · 엑셀식 키보드 이동 · Ctrl+C 복사   [비교표 28·29·30번]
//  - KSIS-B wwwroot/partNumberTools.js 의 1) · 1-b) 부분을 그대로 옮긴 것이다(KSIS_B 69ea7ee).
//    (B 전용인 2) 검색칸 여러 품번 붙여넣기, 3) 품번 메모 팝업 부분만 뺐다)
//    바꾼 곳은 한 군데 : 복사 안내 말풍선 글자("…품번 메모에 붙여넣기" → "엑셀에 붙여넣기").
//  - 대상 표 : <table class="app-grid"> (KSIS-B 와 같은 이름). 편집용 표(.data-grid)와 클릭해서 여는 목록(.doc-list-grid)은 제외.
//  - 활성 칸 · 선택 색은 ksis-common.css 의 td.pn-cell-cursor · td.pn-col-sel.
//  - Tabulator 는 <table> 이 아니라 <div> 로 그리므로 이 파일이 동작하지 않는다.
//    이 기능이 필요한 목록은 <table class="k-grid app-grid"> + ksis-grid-pager.js 로 그린다.
// =====================================================================
// ✅ 품번 다루기 도구.
//
//  1) 표 드래그 = 여러 칸(행×열) 선택, Ctrl+C 로 복사   (2026-09-21 개정)
//     조회 전용 표(app-grid)에서 마우스를 누른 채 다른 칸으로 움직이면 지나간 직사각형 영역이 노랗게 표시된다.
//     놓아도 선택은 그대로 남고, 사용자가 Ctrl+C 를 누르면 그때 탭 구분(엑셀/품번 메모 붙여넣기용)으로 복사된다.
//     - 예전처럼 드래그만 해도 바로 복사되던 동작은 없앴다(복사는 사용자가 직접 Ctrl+C).
//     - 세로(1열), 가로(1행), 여러 열 모두 가능하다.
//     - 클릭해서 문서를 여는 목록 표(.doc-list-grid)와 편집용 붙여넣기 표(.data-grid)는 제외한다.
//     - 품번 메모 그리드(.pn-scratch-grid, 셀이 input)도 같은 방식으로 드래그/복사할 수 있다.
//     - 체크박스/버튼/링크 위에서 시작한 드래그는 건드리지 않는다. 같은 칸 안에서는 브라우저 글자 선택 그대로다.
//     - 다른 곳을 클릭하거나 Esc 를 누르면 선택이 풀린다.
//
//  1-b) 엑셀식 키보드 이동/선택 (2026-09-30)
//     칸을 한 번 클릭하면 그 칸이 "활성 칸"(초록 테두리)이 되고, 다음 키가 엑셀처럼 동작한다.
//     - 방향키: 한 칸 이동 / Shift+방향키: 한 칸씩 선택 넓히기
//     - Ctrl+방향키: 데이터 끝까지 이동(엑셀과 같음 — 이어진 값의 끝, 빈 칸이면 다음 값이 있는 칸, 없으면 표 끝)
//     - Ctrl+Shift+방향키: 거기까지 선택 넓히기 / Ctrl+Home·Ctrl+End: 표 처음·마지막 칸(Shift 와 함께면 선택)
//     - 이동한 칸이 보이도록 표를 스크롤하고, 고정된 머리글(sticky thead/tfoot)에 가리지 않게 맞춘다.
//     - 입력칸(검색칸, 편집 칸)에 커서가 있을 때는 키를 가로채지 않는다. 대상은 화면에 그려진 행이다(페이지/표시 상한 안).
//     - 표 스크롤바를 끌어도 선택은 유지된다.
//
//  2) 검색칸 여러 품번 붙여넣기 감지(pnMultiPaste)
//  3) "품번 메모" 팝업 끌어서 옮기기 + 그리드 붙여넣기/키 이동 + 클립보드 복사
//     (2026-09-21: localStorage 보관은 없앴다. 내용은 접속 중에만 유지되고 새 실행/F5 에서 비워진다)
//
(function () {
    "use strict";

    var SEL_CLASS = "pn-col-sel";
    var CURSOR_CLASS = "pn-cell-cursor"; // 키보드 이동의 활성 칸(엑셀 선택 테두리)
    var TABLE_SELECTING_CLASS = "pn-col-selecting";
    var STORAGE_KEY = "ksisb.partNumberScratchpad.text"; // 예전 버전 값 삭제용

    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { }

    // ---------- 공통 ----------

    function isControl(el, stopAt) {
        while (el && el !== stopAt && el !== document.body) {
            var t = el.tagName;
            if (t === "INPUT" || t === "BUTTON" || t === "A" || t === "SELECT" || t === "TEXTAREA" || t === "LABEL") return true;
            if (el.isContentEditable) return true;
            el = el.parentElement;
        }
        return false;
    }

    function fallbackCopy(text) {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        return ok;
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text)
                .then(function () { return true; })
                .catch(function () { return fallbackCopy(text); });
        }
        return Promise.resolve(fallbackCopy(text));
    }

    // ---------- 엑셀 붙여넣기용 "텍스트 칸" (2026-10-06) ----------
    //  사용자 요청: 품번은 본질이 텍스트다. 3910703546 처럼 숫자로만 된 품번을 엑셀에 붙여넣으면 숫자가 되어
    //  다른 파일의 VLOOKUP(텍스트 품번)과 맞지 않는다(391024C170 은 원래 텍스트라 잘 된다).
    //  → 복사할 때 탭 구분 글자(text/plain)와 함께 엑셀용 HTML 표(text/html)도 넣는다. 엑셀은 HTML 을 먼저 읽고,
    //    mso-number-format:"\@"(텍스트 서식)이 붙은 칸은 글자 그대로 받는다. 검색칸·품번 메모 붙여넣기는 text/plain 을 쓰므로 그대로다.
    //  텍스트로 고정하는 칸:
    //    (1) 머리글이 식별자인 열 — 품번 · 부품번호 · 번호(SAP 고객번호·사업자번호·전표번호) · 문서 · 코드 · 판매처/납품처/지급처 코드 등
    //    (2) 값이 식별자처럼 생긴 칸 — 숫자 7자리 이상(천 단위 쉼표 없음), 0 으로 시작하는 숫자, 영문+숫자 섞임(엑셀이 1E5 같은 것을 숫자로 바꾸는 것도 막음)
    //  단, 쉼표·소수점이 있는 숫자(수량·금액 "1,234" "12.5")와 년월·날짜("2026-08")는 지금처럼 엑셀이 판단하게 둔다.
    var ID_HEADER_RE = /품번|부품번호|번호|문서|코드|자재$|^판매처$|^납품처$|^지급처$|^Sc/;
    var NUMERIC_HEADER_RE = /수량|금액|합계|건수|개수|갯수|단가|평균|비율|%/;

    function isFormattedNumber(v) { return /^-?[\d,]*\d(\.\d+)?$/.test(v) && /[,.]/.test(v); }
    function isDateLike(v) { return /^\d{4}[-.\/]\d{1,2}([-.\/]\d{1,2})?$/.test(v); }

    function looksLikeId(v) {
        if (!/^[0-9A-Za-z][0-9A-Za-z\-_\/]*$/.test(v)) return false;
        if (isDateLike(v)) return false;
        if (/[A-Za-z]/.test(v) && /\d/.test(v)) return true;   // 391024C170, 1E5 같은 것
        if (/^0\d+$/.test(v)) return true;                    // 앞자리 0 (0000102345)
        if (/^\d{7,}$/.test(v)) return true;                  // 3910703546
        if (/^\d+-\d+$/.test(v) && v.length >= 7) return true; // 하이픈 표시 품번 39107-03546
        return false;
    }

    function shouldForceText(value, header) {
        var v = (value || "").trim();
        if (!v) return false;
        if (isFormattedNumber(v) || isDateLike(v)) return false;
        var h = (header || "").trim();
        if (h && NUMERIC_HEADER_RE.test(h) && !/품번|번호/.test(h)) return looksLikeId(v);
        if (h && ID_HEADER_RE.test(h)) return true;
        return looksLikeId(v);
    }

    function escapeHtml(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    /** matrix(행 × 칸 글자) → 엑셀용 HTML. forceFn(r, c, value) 가 true 인 칸은 텍스트 서식. */
    function buildExcelHtml(matrix, forceFn) {
        var parts = [
            "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\">",
            "<head><meta charset=\"utf-8\"><style>td{font-family:'맑은 고딕';font-size:11pt;white-space:nowrap;} .t{mso-number-format:\"\\@\";}</style></head>",
            "<body><table>"
        ];
        for (var r = 0; r < matrix.length; r++) {
            parts.push("<tr>");
            for (var c = 0; c < matrix[r].length; c++) {
                var v = matrix[r][c] == null ? "" : String(matrix[r][c]);
                parts.push(forceFn(r, c, v) ? "<td class=\"t\" style=\"mso-number-format:'\\@'\">" : "<td>");
                parts.push(escapeHtml(v));
                parts.push("</td>");
            }
            parts.push("</tr>");
        }
        parts.push("</table></body></html>");
        return parts.join("");
    }

    /** 표의 보이는 열마다 가장 아래 머리글 글자(rowspan/colspan 반영). 머리글이 없으면 빈 배열. */
    function headerTexts(table) {
        var out = [];
        var head = table && table.tHead;
        if (!head) return out;
        var occupied = []; // occupied[r][c] = true
        for (var r = 0; r < head.rows.length; r++) {
            var row = head.rows[r];
            occupied[r] = occupied[r] || [];
            var c = 0;
            for (var i = 0; i < row.cells.length; i++) {
                var cell = row.cells[i];
                while (occupied[r][c]) c++;
                var cs = cell.colSpan || 1, rs = cell.rowSpan || 1;
                var text = (cell.innerText || cell.textContent || "").replace(/\s+/g, " ").trim();
                for (var dr = 0; dr < rs; dr++) {
                    occupied[r + dr] = occupied[r + dr] || [];
                    for (var dc = 0; dc < cs; dc++) {
                        occupied[r + dr][c + dc] = true;
                        if (text || out[c + dc] == null) out[c + dc] = text; // 아래 줄 머리글이 위 줄을 덮는다
                    }
                }
                c += cs;
            }
        }
        return out;
    }

    /** 글자(text/plain) + 엑셀용 HTML(text/html)을 함께 클립보드에 넣는다. 실패하면 글자만. */
    var richCopyPending = null;
    document.addEventListener("copy", function (e) {
        if (!richCopyPending || !e.clipboardData) return;
        e.clipboardData.setData("text/plain", richCopyPending.text);
        e.clipboardData.setData("text/html", richCopyPending.html);
        e.preventDefault();
        e.stopImmediatePropagation();
    }, true);

    function copyRich(text, html) {
        // 1) execCommand + copy 이벤트(같은 동기 흐름에서 두 형식을 확실히 넣는다)
        richCopyPending = { text: text, html: html };
        var ok = false;
        try { ok = fallbackCopy(text); } catch (e) { ok = false; }
        richCopyPending = null;
        if (ok) return Promise.resolve(true);
        // 2) 비동기 클립보드 API
        if (navigator.clipboard && window.isSecureContext && window.ClipboardItem) {
            try {
                var item = new ClipboardItem({
                    "text/plain": new Blob([text], { type: "text/plain" }),
                    "text/html": new Blob([html], { type: "text/html" })
                });
                return navigator.clipboard.write([item]).then(function () { return true; }).catch(function () { return copyText(text); });
            } catch (e) { }
        }
        return copyText(text);
    }

    // ---------- 표 복사 사용 로그 (2026-10-10) ----------
    //  사용자 보고: "N행 복사됨"이 떴는데 엑셀에 붙여넣으면 직전에 복사한 내용이 나올 때가 있다(다시 실행하면 정상).
    //  → 표 복사마다 "작업 · 표 복사" 줄을 남기고, 서버(ClipboardProbe)가 Windows 클립보드를 읽어 실제로 바뀌었는지 적는다.
    //  품번 내용은 보내지 않는다. 행·열·글자 수와 글자 해시만 보낸다.
    //  - Ctrl+C 를 눌렀는데 copy 이벤트가 아예 안 오면(브라우저나 다른 프로그램이 키를 가져감) "실패"로 남긴다.
    //  - 표 선택이 있는데 입력칸 포커스 등으로 브라우저 기본 복사에 맡긴 경우는 결과 없이 이유만 남긴다.

    /** FNV-1a 32비트(UTF-16 코드 단위). \r 를 없애고 끝의 빈 줄을 뗀 글자로 계산한다. 서버 ClipboardProbe.Hash 와 같아야 한다. */
    function clipHash(text) {
        var s = String(text || "").replace(/\r/g, "").replace(/\n+$/, "");
        var h = 0x811c9dc5;
        for (var i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 0x01000193);
        }
        return { hash: h >>> 0, length: s.length };
    }

    var lastCopyHash = -1;      // 직전 표 복사의 해시(클립보드가 이것 그대로면 "직전 표 복사 내용 그대로")
    var copyEventSeen = true;   // Ctrl+C 뒤 copy 이벤트가 왔는지

    function describeEl(el) {
        if (!el || !el.tagName) return "없음";
        if (el === document.body) return "본문";
        var cls = (el.className && typeof el.className === "string") ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
        return el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + cls + (el.readOnly ? "(읽기 전용)" : "");
    }

    function logTableCopy(info) {
        try { if (window.usageLog && window.usageLog.tableCopy) window.usageLog.tableCopy(info); } catch (err) { }
    }

    var toastEl = null, toastTimer = null;
    function toast(message) {
        if (!toastEl) {
            toastEl = document.createElement("div");
            toastEl.className = "pn-toast";
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = message;
        toastEl.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
    }

    // ---------- 1) 표 영역 선택 ----------

    var drag = null; // 진행 중 { table, r0, c0, r1, c1, active }
    var sel = null;  // 마우스를 놓은 뒤에도 남아 있는 선택 { table, r0, c0, r1, c1 }

    function findCell(el) {
        while (el && el !== document.body) {
            if (el.tagName === "TD" || el.tagName === "TH") return el;
            el = el.parentElement;
        }
        return null;
    }

    function eligibleTable(cell) {
        var table = cell.closest("table");
        if (!table) return null;
        if (table.classList.contains("pn-scratch-grid")) return table;
        if (!table.classList.contains("app-grid")) return null;
        if (table.classList.contains("data-grid")) return null;     // 편집용 표
        if (table.classList.contains("doc-list-grid")) return null; // 클릭해서 여는 목록
        return table;
    }

    function isGridCellInput(el) {
        return !!(el && el.tagName === "INPUT" && el.classList && el.classList.contains("pn-g-cell"));
    }

    function rowIndexOf(cell) {
        var tr = cell.parentElement;
        return tr && typeof tr.rowIndex === "number" ? tr.rowIndex : -1;
    }

    function cellText(cell) {
        var inp = cell.querySelector("input.pn-g-cell");
        if (inp) return (inp.value || "").trim();
        return (cell.innerText || cell.textContent || "").replace(/\s+/g, " ").trim();
    }

    // ✅ [2026-10-19] 칠한 칸을 기억해 두고 그 칸만 지운다(applyHighlight 만 칠한다). 예전에는 지울 때마다 문서 전체를 찾아서,
    //    숨은 탭에 1만 행 표가 있으면 모든 클릭·끌기·방향키마다 수십 ms 가 더 걸렸다.
    var highlighted = [];

    function clearHighlight() {
        for (var i = 0; i < highlighted.length; i++) highlighted[i].classList.remove(SEL_CLASS, CURSOR_CLASS);
        highlighted = [];
    }

    function clearSelection() {
        sel = null;
        clearHighlight();
    }

    // ✅ [2026-09-30] 열 번호는 "보이는 열"(앞 칸들의 colspan 합) 기준이다. 피벗의 소계/총합계 줄처럼
    //    앞쪽 칸이 병합된 행에서도 선택·복사·키보드 이동의 열이 어긋나지 않는다.

    /** 행 안에서 칸의 보이는 열 번호(시작 열). */
    function visualIndexOf(cell) {
        var row = cell.parentElement, v = 0;
        if (!row || !row.cells) return cell.cellIndex;
        for (var i = 0; i < cell.cellIndex; i++) v += row.cells[i].colSpan || 1;
        return v;
    }

    /** 보이는 열 vc 를 덮는 칸 { cell, start, index }. 행 폭을 넘으면 clamp=true 일 때 마지막 칸, 아니면 null. */
    function cellInfoAtVisual(row, vc, clamp) {
        if (!row || !row.cells || row.cells.length === 0) return null;
        var v = 0;
        for (var i = 0; i < row.cells.length; i++) {
            var span = row.cells[i].colSpan || 1;
            if (vc < v + span) return { cell: row.cells[i], start: v, index: i };
            v += span;
        }
        if (!clamp) return null;
        var last = row.cells.length - 1;
        return { cell: row.cells[last], start: v - (row.cells[last].colSpan || 1), index: last };
    }

    /** 선택 영역의 각 행(thead 제외)에 대해 fn(cellsOfRow) 호출. 칸이 없는 자리·병합 칸의 뒤쪽 자리는 null. */
    function forEachSelectedRow(s, fn) {
        var rows = s.table.rows;
        var rFrom = Math.min(s.r0, s.r1), rTo = Math.max(s.r0, s.r1);
        var cFrom = Math.min(s.c0, s.c1), cTo = Math.max(s.c0, s.c1);
        for (var r = rFrom; r <= rTo; r++) {
            var row = rows[r];
            if (!row) continue;
            if (row.parentElement && row.parentElement.tagName === "THEAD") continue;
            var cells = [];
            for (var c = cFrom; c <= cTo; c++) {
                var info = cellInfoAtVisual(row, c, false);
                // 병합 칸은 한 번만(그 칸이 시작하는 열, 또는 선택의 첫 열) — 엑셀 복사처럼 나머지 자리는 빈 값
                cells.push(info && (info.start === c || c === cFrom) ? info.cell : null);
            }
            fn(cells);
        }
    }

    function applyHighlight(s) {
        clearHighlight();
        if (!s) return;
        // 두 칸 이상이면 노란 범위, 한 칸이면 범위 색 없이 활성 칸 테두리만.
        if (s.r0 !== s.r1 || s.c0 !== s.c1) {
            forEachSelectedRow(s, function (cells) {
                for (var i = 0; i < cells.length; i++) if (cells[i]) { cells[i].classList.add(SEL_CLASS); highlighted.push(cells[i]); }
            });
        }
        var cur = cellAt(s.table, s.r1, s.c1);
        if (cur) { cur.classList.add(CURSOR_CLASS); highlighted.push(cur); }
    }

    /** 활성 칸 표시용: 보이는 열 c 를 덮는 칸(행이 짧으면 마지막 칸). */
    function cellAt(table, r, c) {
        var row = table && table.rows[r];
        var info = cellInfoAtVisual(row, c, true);
        return info ? info.cell : null;
    }

    function isInThead(table, r) {
        var row = table.rows[r];
        return !!(row && row.parentElement && row.parentElement.tagName === "THEAD");
    }

    /** 화면에 보이는지: display:none(빈 getClientRects) 도, visibility:hidden(미리 만들어 숨긴 화면) 도 아님. */
    function isShownEl(el) {
        if (!el || !el.getClientRects || el.getClientRects().length === 0) return false;
        try { return getComputedStyle(el).visibility !== "hidden"; } catch (e) { return true; }
    }

    function isEditable(el) {
        if (!el || !el.tagName) return false;
        var t = el.tagName;
        return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || !!el.isContentEditable;
    }

    /** 표 스크롤바(또는 .app-content 스크롤바)를 누른 것인지. 이때는 선택을 풀지 않는다. */
    function isScrollbarClick(e) {
        var t = e.target;
        if (!t || !(t instanceof Element)) return false;
        if (t === document.documentElement || t === document.body) {
            return e.clientX >= document.documentElement.clientWidth || e.clientY >= document.documentElement.clientHeight;
        }
        var st;
        try { st = getComputedStyle(t); } catch (err) { return false; }
        var canV = /(auto|scroll)/.test(st.overflowY) && t.scrollHeight > t.clientHeight;
        var canH = /(auto|scroll)/.test(st.overflowX) && t.scrollWidth > t.clientWidth;
        return (canV && e.offsetX >= t.clientWidth) || (canH && e.offsetY >= t.clientHeight);
    }

    /** 선택 영역의 칸 글자(행 × 칸). 끝쪽의 빈 행은 뺀다. */
    function selectionToMatrix(s) {
        var matrix = [];
        forEachSelectedRow(s, function (cells) {
            matrix.push(cells.map(function (cell) { return cell ? cellText(cell) : ""; }));
        });
        while (matrix.length > 0 && matrix[matrix.length - 1].join("").length === 0) matrix.pop();
        return matrix;
    }

    function selectionToTsv(s) {
        return selectionToMatrix(s).map(function (r) { return r.join("\t"); });
    }

    /** ✅ [2026-10-06] 선택 영역 → 엑셀용 HTML(품번 같은 식별자 칸은 텍스트 서식). 품번 메모 그리드는 전부 텍스트. */
    function selectionToExcelHtml(s, matrix) {
        var allText = s.table.classList.contains("pn-scratch-grid");
        var heads = allText ? [] : headerTexts(s.table);
        var cFrom = Math.min(s.c0, s.c1);
        return buildExcelHtml(matrix, function (r, c, v) {
            if (!v || !v.trim()) return false;
            return allText ? true : shouldForceText(v, heads[cFrom + c]);
        });
    }

    document.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return;
        if (isScrollbarClick(e)) return; // 스크롤바를 끌어도 선택/활성 칸은 그대로 둔다(엑셀과 같음)
        clearSelection();
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

        var cell = findCell(e.target);
        if (!cell) return;
        var table = eligibleTable(cell);
        if (!table) return;
        if (isControl(e.target, cell) && !isGridCellInput(e.target)) return;

        var r = rowIndexOf(cell);
        if (r < 0) return;
        var vc = visualIndexOf(cell);
        drag = {
            table: table, r0: r, c0: vc, r1: r, c1: vc, active: false,
            onInput: isGridCellInput(e.target) // 편집 칸을 누른 것이면 활성 칸을 만들지 않는다(입력 우선)
        };
    });

    document.addEventListener("mousemove", function (e) {
        if (!drag) return;
        var cell = findCell(e.target);
        if (!cell || cell.closest("table") !== drag.table) return;

        var r = rowIndexOf(cell);
        if (r < 0) return;
        var c = visualIndexOf(cell);

        if (!drag.active) {
            if (r === drag.r0 && c === drag.c0) return; // 같은 칸 안 = 브라우저 글자 선택 유지
            drag.active = true;
            try {
                if (isGridCellInput(document.activeElement)) document.activeElement.blur();
                var s = window.getSelection();
                if (s) s.removeAllRanges();
            } catch (err) { }
            drag.table.classList.add(TABLE_SELECTING_CLASS);
        }

        if (r !== drag.r1 || c !== drag.c1) {
            drag.r1 = r;
            drag.c1 = c;
            applyHighlight(drag);
        }
    });

    document.addEventListener("selectstart", function (e) {
        if (drag && drag.active) e.preventDefault();
    });

    function finishDrag() {
        var d = drag;
        drag = null;
        if (!d) return;
        d.table.classList.remove(TABLE_SELECTING_CLASS);

        if (!d.active) {
            // ✅ [2026-09-30] 그냥 클릭 = 그 칸을 활성 칸으로(엑셀처럼). 이후 방향키/Ctrl+방향키로 이동·선택한다.
            //    머리글 칸과 편집 칸(입력)은 제외한다. 칸 안의 글자 선택은 브라우저 동작 그대로 남는다.
            if (d.onInput || isInThead(d.table, d.r0)) return;
            sel = { table: d.table, r0: d.r0, c0: d.c0, r1: d.r0, c1: d.c0, single: true, how: "칸 클릭" };
            applyHighlight(sel);
            return;
        }

        sel = { table: d.table, r0: d.r0, c0: d.c0, r1: d.r1, c1: d.c1, how: "마우스 끌기" };
        applyHighlight(sel);
        var rows = Math.abs(d.r1 - d.r0) + 1, cols = Math.abs(d.c1 - d.c0) + 1;
        toast(rows + "행 × " + cols + "열 선택됨 · Ctrl+C 로 복사");
    }

    document.addEventListener("mouseup", finishDrag);
    window.addEventListener("blur", function () {
        if (drag) {
            drag.table.classList.remove(TABLE_SELECTING_CLASS);
            drag = null;
        }
    });

    // ---------- 1-b) 엑셀식 키보드 이동 / 선택 ----------

    function dataRowIndices(table) {
        var out = [];
        var rows = table.rows;
        for (var i = 0; i < rows.length; i++) {
            var p = rows[i].parentElement;
            if (p && p.tagName === "THEAD") continue;
            out.push(i);
        }
        return out;
    }

    function isEmptyCell(cell) {
        if (!cell) return true;
        var inp = cell.querySelector("input.pn-g-cell");
        if (inp) return (inp.value || "").trim().length === 0;
        return (cell.textContent || "").trim().length === 0; // textContent: 레이아웃 계산 없이 빠르게
    }

    /**
     * 엑셀 Ctrl+방향키. cells = 같은 줄(열 또는 행)의 칸들, p = 현재 위치, step = +1/-1 → 도착 위치.
     * - 지금 칸과 다음 칸에 모두 값이 있으면: 값이 이어지는 마지막 칸까지
     * - 그렇지 않으면: 그 방향에서 값이 있는 다음 칸까지(없으면 그 방향 끝)
     */
    function excelJump(cells, p, step) {
        var n = p + step;
        if (n < 0 || n >= cells.length) return p;
        if (!isEmptyCell(cells[p]) && !isEmptyCell(cells[n])) {
            while (n + step >= 0 && n + step < cells.length && !isEmptyCell(cells[n + step])) n += step;
            return n;
        }
        while (n >= 0 && n < cells.length && isEmptyCell(cells[n])) n += step;
        if (n < 0) return 0;
        if (n >= cells.length) return cells.length - 1;
        return n;
    }

    function scrollParent(el) {
        var p = el.parentElement;
        while (p && p !== document.body && p !== document.documentElement) {
            var st = getComputedStyle(p);
            if (/(auto|scroll)/.test(st.overflowY) && p.scrollHeight > p.clientHeight) return p;
            p = p.parentElement;
        }
        return null;
    }

    /** 칸이 보이게 스크롤하고, 고정 머리글(thead)·고정 합계줄(tfoot)에 가리면 그만큼 더 움직인다. */
    function revealCell(table, cell) {
        if (!cell) return;
        try { cell.scrollIntoView({ block: "nearest", inline: "nearest" }); } catch (err) { cell.scrollIntoView(false); }
        var sc = scrollParent(cell);
        if (!sc) return;
        var cr = cell.getBoundingClientRect();
        var scr = sc.getBoundingClientRect();
        var inHead = cell.parentElement && cell.parentElement.parentElement === table.tHead;
        var inFoot = cell.parentElement && cell.parentElement.parentElement === table.tFoot;
        if (table.tHead && !inHead) {
            var hb = table.tHead.getBoundingClientRect().bottom;
            if (hb > scr.top && cr.top < hb) sc.scrollTop -= Math.ceil(hb - cr.top);
        }
        if (table.tFoot && !inFoot) {
            var ft = table.tFoot.getBoundingClientRect().top;
            if (ft < scr.bottom && cr.bottom > ft) sc.scrollTop += Math.ceil(cr.bottom - ft);
        }
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { if (sel) clearSelection(); return; }
        if (!sel) return;
        if (e.altKey) return;
        // 입력 중에는 가로채지 않는다. ✅ [2026-10-02] 단, 숨은 탭 화면 안에 남은 포커스는 입력 중으로 보지 않는다.
        var activeEl = document.activeElement;
        var activeHidden = activeEl && activeEl.closest && activeEl.closest(".keepalive-hidden");
        if (isEditable(e.target) && !activeHidden) return;
        if (isEditable(activeEl) && !activeHidden) return;

        var key = e.key;
        var ctrl = e.ctrlKey || e.metaKey;
        var dr = 0, dc = 0, homeEnd = null;
        if (key === "ArrowDown") dr = 1;
        else if (key === "ArrowUp") dr = -1;
        else if (key === "ArrowRight") dc = 1;
        else if (key === "ArrowLeft") dc = -1;
        else if (ctrl && (key === "Home" || key === "End")) homeEnd = key;
        else return;

        var table = sel.table;
        // ✅ [2026-09-30] 표가 없어졌거나 숨겨졌으면(다른 메뉴로 옮겨 미리 만든 화면이 가려진 경우) 선택을 놓고 키를 가로채지 않는다.
        if (!table || !document.body.contains(table) || !isShownEl(table)) { clearSelection(); return; }
        var rowsIdx = dataRowIndices(table);
        if (rowsIdx.length === 0) return;
        e.preventDefault();

        // 현재 활성 칸(선택의 움직이는 끝) 위치. 머리글에서 시작한 선택이면 가장 가까운 데이터 행으로.
        // 열(c)은 보이는 열 번호 — 병합 칸(소계/총합계)을 지나도 원래 열로 돌아온다(엑셀과 같음).
        var rPos = rowsIdx.indexOf(sel.r1);
        if (rPos < 0) rPos = sel.r1 < rowsIdx[0] ? 0 : rowsIdx.length - 1;
        var curRow = table.rows[rowsIdx[rPos]];
        var vc = Math.max(0, sel.c1);

        var nr = rowsIdx[rPos], nc = vc;
        if (homeEnd === "Home") {
            nr = rowsIdx[0];
            nc = 0;
        } else if (homeEnd === "End") {
            nr = rowsIdx[rowsIdx.length - 1];
            var lastRow = table.rows[nr];
            nc = lastRow.cells.length > 0 ? visualIndexOf(lastRow.cells[lastRow.cells.length - 1]) : 0;
        } else if (dr !== 0) {
            // 세로: 같은 보이는 열의 칸들(병합 칸이면 그 칸, 행이 짧으면 빈칸 취급)
            var colCells = rowsIdx.map(function (ri) {
                var info = cellInfoAtVisual(table.rows[ri], vc, false);
                return info ? info.cell : null;
            });
            var np = ctrl ? excelJump(colCells, rPos, dr) : Math.max(0, Math.min(rowsIdx.length - 1, rPos + dr));
            nr = rowsIdx[np];
        } else {
            // 가로: 이 행의 실제 칸 단위로 움직인다(병합 칸은 한 번에 건너뜀). 도착 칸의 시작 열이 새 열.
            var rowCells = Array.prototype.slice.call(curRow.cells);
            if (rowCells.length > 0) {
                var cur = cellInfoAtVisual(curRow, vc, true);
                var pi = cur ? cur.index : 0;
                var ni = ctrl ? excelJump(rowCells, pi, dc) : Math.max(0, Math.min(rowCells.length - 1, pi + dc));
                nc = visualIndexOf(rowCells[ni]);
            }
        }

        if (e.shiftKey) {
            // 선택 넓히기: 시작점(r0,c0)은 그대로, 움직이는 끝만 이동
            sel = { table: table, r0: sel.r0, c0: sel.c0, r1: nr, c1: nc, how: (ctrl ? "Ctrl+Shift+" : "Shift+") + "방향키" };
            if (isInThead(table, sel.r0)) sel.r0 = rowsIdx[0];
        } else {
            sel = { table: table, r0: nr, c0: nc, r1: nr, c1: nc, single: true, how: "방향키" };
        }
        applyHighlight(sel);
        revealCell(table, cellAt(table, nr, nc));

        if (e.shiftKey) {
            var rows = 0;
            var rFrom = Math.min(sel.r0, sel.r1), rTo = Math.max(sel.r0, sel.r1);
            for (var i = 0; i < rowsIdx.length; i++) if (rowsIdx[i] >= rFrom && rowsIdx[i] <= rTo) rows++;
            var cols = Math.abs(sel.c1 - sel.c0) + 1;
            toast(rows.toLocaleString() + "행 × " + cols + "열 선택됨 · Ctrl+C 로 복사");
        }
    });

    // ✅ [2026-10-10] 표 선택이 있는 채로 Ctrl+C 를 눌렀는데 copy 이벤트가 오지 않으면 사용 로그에 "실패"로 남긴다.
    //    (한글 입력 상태에서도 잡히도록 e.code 도 본다. 길게 눌러 반복되는 키는 뺀다.)
    document.addEventListener("keydown", function (e) {
        if (!(e.ctrlKey || e.metaKey) || e.altKey || e.repeat) return;
        if (e.code !== "KeyC" && String(e.key || "").toLowerCase() !== "c") return;
        if (!sel || !sel.table || !isShownEl(sel.table)) return;
        copyEventSeen = false;
        var table = sel.table, shift = e.shiftKey, active = describeEl(document.activeElement), how = sel.how || "";
        setTimeout(function () {
            if (copyEventSeen) return;
            copyEventSeen = true;
            logTableCopy({
                el: table, result: "실패", level: "주의",
                detail: "Ctrl+C 를 눌렀지만 브라우저가 복사를 하지 않음(클립보드는 그대로)"
                    + (shift ? " · Shift 도 함께 눌림(Ctrl+Shift+C 는 엣지 개발자도구 키)" : "")
                    + " · 선택 " + how + " · 포커스 " + active
                    + (document.hasFocus() ? "" : " · 창이 비활성")
            });
        }, 500);
    }, true);

    // Ctrl+C: 표 선택이 남아 있으면 그 영역을 탭 구분 텍스트로 복사한다.
    document.addEventListener("copy", function (e) {
        copyEventSeen = true;
        if (!sel) return;
        if (!sel.table || !isShownEl(sel.table)) { // 숨겨진 표의 선택은 복사하지 않는다
            logTableCopy({ el: sel.table, detail: "숨은 화면의 표 선택이라 표 복사 안 함(브라우저 기본 복사)" });
            clearSelection();
            return;
        }
        // ✅ [2026-09-30] 입력칸에서 복사하거나(Tab 으로 옮겨 간 경우 포함), 활성 칸 하나 안에서 글자 일부를 끌어 고른 경우는
        //    브라우저 기본 복사를 그대로 둔다. 그 외(활성 칸 하나 또는 범위)는 칸 값을 탭 구분으로 복사한다.
        if (isEditable(document.activeElement) && !isGridCellInput(document.activeElement)) {
            logTableCopy({ el: sel.table, detail: "표 선택이 있지만 입력칸에 포커스가 있어 브라우저 기본 복사 · 포커스 " + describeEl(document.activeElement) });
            return;
        }
        if (sel.single) {
            try {
                var ds = window.getSelection();
                if (ds && !ds.isCollapsed && ds.toString().trim().length > 0) return;
            } catch (err) { }
        }
        var matrix, lines;
        try { matrix = selectionToMatrix(sel); } catch (err) {
            logTableCopy({ el: sel.table, result: "실패", detail: "선택 영역 읽기 오류: " + (err && err.message ? err.message : err) });
            clearSelection();
            return;
        }
        lines = matrix.map(function (r) { return r.join("\t"); });
        if (lines.length === 0) { toast("복사할 값이 없습니다."); return; }
        var text = lines.join("\n");
        var cols = Math.abs(sel.c1 - sel.c0) + 1;
        var hv = clipHash(text);
        var prev = lastCopyHash;
        lastCopyHash = hv.hash;
        var base = lines.length.toLocaleString() + "행 × " + cols + "열 · " + hv.length.toLocaleString() + "자 · 선택 " + (sel.how || "")
            + (document.hasFocus() ? "" : " · 창이 비활성");
        if (e.clipboardData) {
            e.clipboardData.setData("text/plain", text);
            // ✅ [2026-10-06] 엑셀 붙여넣기용 HTML(품번은 텍스트 칸). 만들다 실패해도 글자 복사는 그대로.
            var htmlOk = true;
            try { e.clipboardData.setData("text/html", selectionToExcelHtml(sel, matrix)); } catch (err) { htmlOk = false; }
            e.preventDefault();
            toast(lines.length + "행 복사됨 · 엑셀에 붙여넣기(Ctrl+V)"); // KSIS-UI : 안내 글만 바꿈(품번 메모는 B 전용)
            logTableCopy({
                el: sel.table, result: "성공", count: lines.length,
                detail: base + (htmlOk ? "" : " · 엑셀용 서식 만들기 실패"),
                clipHash: hv.hash, clipLength: hv.length, prevHash: prev
            });
        } else {
            var table = sel.table;
            copyText(text).then(function (ok) {
                toast(ok ? lines.length + "행 복사됨" : "복사에 실패했습니다.");
                logTableCopy({
                    el: table, result: ok ? "성공" : "실패", count: lines.length,
                    detail: base + " · 예비 복사 방식" + (ok ? "" : " 실패"),
                    clipHash: ok ? hv.hash : undefined, clipLength: hv.length, prevHash: prev
                });
            });
        }
    }, true);
})();
