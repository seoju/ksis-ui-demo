// =====================================================================
//  KSIS 공통 : 파일 업로드(파일 선택 + 끌어다 놓기)   [비교표 43번 업무 팝업 "파일 업로드"]
//
//  <div class="k-file" data-name="attach" data-accept=".xlsx,.xls,.pdf" data-max-mb="20" data-max-count="10">
//    <input type="file" multiple>
//  </div>
//  - 칸 하나가 끌어다 놓는 자리이자 [파일 선택] 버튼. 탐색기에서 파일을 끌어 칸 위에 놓으면 들어간다(여러 개 한 번에).
//  - 끌고 칸 위에 올라오면 테두리 · 바탕이 주색으로 바뀐다. 칸 밖(팝업 다른 곳 · 뒤 화면)에 놓으면 아무 일도 없다
//    (브라우저가 그 파일을 열어 버리며 화면을 떠나는 것을 막음).
//  - 넣은 파일은 칸 아래 목록 : 이름 · 크기 · ✕(빼기). 같은 이름 · 같은 크기 파일은 한 번만 들어간다.
//  - data-accept(확장자) · data-max-mb(파일 하나 최대 MB, 기본 20) · data-max-count(최대 개수) 를 넘으면
//    넣지 않고 알림 창으로 어떤 파일이 왜 빠졌는지 알려 준다.
//  - multiple 이 없으면 한 개만 : 새로 넣으면 앞 파일을 바꾼다.
//  - 저장할 때 : ksis.file.files(el) → File 배열, ksis.file.appendTo(el, formData) → formData 에 name 으로 붙임.
//  ksis.file.enhance(root)
// =====================================================================
(function (window, document) {
	"use strict";

	var ksis = window.ksis = window.ksis || {};
	var store = new WeakMap(); // .k-file → File[]

	function sizeText(n) {
		if (n < 1024) return n + " B";
		if (n < 1024 * 1024) return (n / 1024).toFixed(0) + " KB";
		return (n / 1024 / 1024).toFixed(1) + " MB";
	}
	function ext(name) {
		var i = name.lastIndexOf(".");
		return i < 0 ? "" : name.slice(i).toLowerCase();
	}
	function esc(s) {
		return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
	}
	function hasFiles(e) {
		return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], "Files") >= 0;
	}

	function build(el) {
		if (el.dataset.kFile) return;
		el.dataset.kFile = "1";

		var input = el.querySelector("input[type=file]") || el.appendChild(document.createElement("input"));
		input.type = "file";
		input.hidden = true;
		if (el.dataset.accept) input.accept = el.dataset.accept;
		var multiple = input.multiple;

		var drop = document.createElement("div");
		drop.className = "k-file-drop";
		drop.tabIndex = 0;
		drop.setAttribute("role", "button");
		drop.innerHTML =
			'<span class="k-file-msg">파일을 여기로 끌어다 놓거나</span>' +
			'<span class="k-btn k-btn-ghost k-file-pick">파일 선택</span>' +
			(el.dataset.accept || el.dataset.maxMb
				? '<span class="k-file-rule">' + esc([el.dataset.accept ? el.dataset.accept.split(",").join(" · ") : "", "최대 " + (el.dataset.maxMb || 20) + "MB"].filter(Boolean).join(" · ")) + "</span>"
				: "");
		el.appendChild(drop);

		var list = document.createElement("ul");
		list.className = "k-file-list";
		el.appendChild(list);

		store.set(el, []);

		function paint() {
			var files = store.get(el);
			list.innerHTML = files.map(function (f, i) {
				return '<li><span class="k-file-name" title="' + esc(f.name) + '">' + esc(f.name) + '</span>' +
					'<span class="k-file-size">' + sizeText(f.size) + '</span>' +
					'<button type="button" class="k-file-del" data-i="' + i + '" title="빼기">✕</button></li>';
			}).join("");
			list.hidden = files.length === 0;
			el.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { files: files.slice() } }));
		}

		function add(fileList) {
			var files = multiple ? store.get(el).slice() : [];
			var maxMb = parseFloat(el.dataset.maxMb || "20");
			var maxCount = parseInt(el.dataset.maxCount || "0", 10);
			var accept = (el.dataset.accept || "").split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
			var rejected = [];
			Array.prototype.forEach.call(fileList, function (f) {
				if (accept.length && accept.indexOf(ext(f.name)) < 0) { rejected.push(f.name + " : 올릴 수 없는 파일 종류"); return; }
				if (f.size > maxMb * 1024 * 1024) { rejected.push(f.name + " : " + maxMb + "MB 넘음"); return; }
				if (files.some(function (x) { return x.name === f.name && x.size === f.size; })) return; // 같은 파일은 한 번만
				if (maxCount && files.length >= maxCount) { rejected.push(f.name + " : 최대 " + maxCount + "개"); return; }
				if (!multiple) files = [];
				files.push(f);
			});
			store.set(el, files);
			paint();
			if (rejected.length && ksis.showAlert) ksis.showAlert("아래 파일은 넣지 않았습니다.\n" + rejected.join("\n")); // 알림 창이 글자를 안전하게 바꿔 보여 줌
		}

		drop.addEventListener("click", function () { input.click(); });
		drop.addEventListener("keydown", function (e) {
			if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
		});
		input.addEventListener("change", function () { add(input.files); input.value = ""; });

		// 끌어다 놓기 : 칸 안 글자 위를 지날 때 깜빡이지 않게 들어온 횟수를 센다
		var depth = 0;
		drop.addEventListener("dragenter", function (e) {
			if (!hasFiles(e)) return;
			e.preventDefault();
			depth++;
			el.classList.add("is-over");
		});
		drop.addEventListener("dragover", function (e) {
			if (!hasFiles(e)) return;
			e.preventDefault();
			e.dataTransfer.dropEffect = "copy";
		});
		drop.addEventListener("dragleave", function () {
			depth = Math.max(0, depth - 1);
			if (depth === 0) el.classList.remove("is-over");
		});
		drop.addEventListener("drop", function (e) {
			if (!hasFiles(e)) return;
			e.preventDefault();
			e.stopPropagation();
			depth = 0;
			el.classList.remove("is-over");
			add(e.dataTransfer.files);
		});

		list.addEventListener("click", function (e) {
			var b = e.target.closest(".k-file-del");
			if (!b) return;
			var files = store.get(el).slice();
			files.splice(parseInt(b.dataset.i, 10), 1);
			store.set(el, files);
			paint();
		});

		list.hidden = true;
	}

	// 칸 밖에 파일을 놓으면 브라우저가 그 파일을 열며 화면을 떠나므로 막는다(화면 전체에 한 번)
	window.addEventListener("dragover", function (e) { if (hasFiles(e)) { e.preventDefault(); e.dataTransfer.dropEffect = "none"; } });
	window.addEventListener("drop", function (e) { if (hasFiles(e)) e.preventDefault(); });

	ksis.file = {
		enhance: function (root) {
			Array.prototype.forEach.call((root || document).querySelectorAll(".k-file"), build);
		},
		files: function (el) { return (store.get(el) || []).slice(); },
		appendTo: function (el, formData) {
			var name = el.dataset.name || "file";
			(store.get(el) || []).forEach(function (f) { formData.append(name, f, f.name); });
			return formData;
		},
		clear: function (el) {
			store.set(el, []);
			var list = el.querySelector(".k-file-list");
			if (list) { list.innerHTML = ""; list.hidden = true; }
		}
	};

	document.addEventListener("DOMContentLoaded", function () { ksis.file.enhance(document); });
})(window, document);
