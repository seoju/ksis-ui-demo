/*

textarea 컬럼 클릭 시 메모 팝업을 표시 

*/
biz.ui.grid.memoEditor = {

    currentCell: null,

    options: {
        wrapId: "bizGridMemoEditorWrap",
        textareaId: "bizGridMemoEditor"
    },

    init: function () {
        var wrap = document.getElementById(this.options.wrapId);

        if (wrap) {
            return;
        }

        var html = `
            <div id="${this.options.wrapId}" style="
                display:none;
                position:absolute;
                z-index:9999;
                width:520px;
                border:1px solid #d9d9d9;
                background:#fff;
                box-shadow:0 4px 12px rgba(0,0,0,0.12);
                padding:12px;
                box-sizing:border-box;
                border-radius:4px;
            ">
                <textarea id="${this.options.textareaId}" style="
                    width:100%;
                    height:260px;
                    resize:none;
                    overflow-y:auto;
                    overflow-x:hidden;
                    box-sizing:border-box;
                    border:1px solid #cfcfcf;
                    outline:none;
                    padding:10px;
                    font-size:14px;
                    line-height:1.5;
                    color:#333;
                "></textarea>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", html);

        document.addEventListener("mousedown", function (e) {
            var wrap = document.getElementById(biz.ui.grid.memoEditor.options.wrapId);

            if (!wrap) {
                return;
            }

            if (wrap.style.display === "none") {
                return;
            }

            var cellEl = null;

            if (biz.ui.grid.memoEditor.currentCell) {
                cellEl = biz.ui.grid.memoEditor.currentCell.getElement();
            }

            if (!wrap.contains(e.target) && (!cellEl || !cellEl.contains(e.target))) {
                biz.ui.grid.memoEditor.save();
            }
        });
    },

	open: function (cell, editorOptions) {
	    this.init();
	    this.currentCell = cell;

	    var opts = editorOptions || {};
	    var width = opts.width || 400;
	    var height = opts.height || 220;

	    var wrap = document.getElementById(this.options.wrapId);
	    var textarea = document.getElementById(this.options.textareaId);

	    wrap.style.width = width + "px";
	    textarea.style.height = height + "px";
	    textarea.value = cell.getValue() || "";

	    var cellEl = cell.getElement();
	    var rect = cellEl.getBoundingClientRect();

	    // 기본 위치: 셀 아래
	    var left = window.scrollX + rect.left;
	    var top = window.scrollY + rect.bottom + 4;

	    // 팝업 실제 높이 계산용
	    var popupHeight = height + 24;   // padding 대충 포함
	    var popupWidth = width;
	    var margin = 10;

	    // 화면 오른쪽 넘치면 왼쪽으로 보정
	    var maxLeft = window.scrollX + window.innerWidth - popupWidth - margin;
	    if (left > maxLeft) {
	        left = maxLeft;
	    }

	    if (left < margin) {
	        left = margin;
	    }

	    // 화면 아래 넘치면 셀 위로 띄움
	    var bottomLimit = window.scrollY + window.innerHeight;
	    if (top + popupHeight > bottomLimit - margin) {
	        top = window.scrollY + rect.top - popupHeight - 4;
	    }

	    // 위로 띄웠는데도 화면 위 넘치면 최소 여백 유지
	    if (top < window.scrollY + margin) {
	        top = window.scrollY + margin;
	    }

	    wrap.style.left = left + "px";
	    wrap.style.top = top + "px";
	    wrap.style.display = "block";

	    setTimeout(function () {
	        textarea.focus();
	    }, 0);
	},

    save: function () {
        if (!this.currentCell) {
            return;
        }

        var textarea = document.getElementById(this.options.textareaId);
        var value = textarea.value;

        this.currentCell.setValue(value);
        this.close();
    },

    close: function () {
        var wrap = document.getElementById(this.options.wrapId);

        if (wrap) {
            wrap.style.display = "none";
        }

        this.currentCell = null;
    },

    applyToColumn: function (col, editorOptions) {
        var opts = editorOptions || {};
        var previewLength = opts.previewLength || 25;

        col.editor = false;
        col.editable = false;

        col.formatter = function (cell) {
            var value = cell.getValue() || "";
            value = String(value);

            if (value.length > previewLength) {
                return value.substring(0, previewLength) + "...";
            }

            return value;
        };

        col.cellClick = function (e, cell) {
            biz.ui.grid.memoEditor.open(cell, opts);
        };

        return col;
    }
};