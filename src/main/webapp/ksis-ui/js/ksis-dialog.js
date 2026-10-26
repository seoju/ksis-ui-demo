// =====================================================================
//  KSIS 공통 : 알림 · 확인 창 + 짧은 안내(토스트)   [비교표 44번 · 27번]
//
//  ksis.showAlert(message, callback, title, options)
//  ksis.showConfirm(message, confirmCallback, cancelCallback, title, options)
//    - KSIS-A 의 biz.showAlert / biz.showConfirm 과 부르는 방법이 같다(그대로 바꿔 끼울 수 있게).
//    - 모양 : A 공통 창 그대로(폭 450px · 제목 숨김 + 오른쪽 위 ✕ · 가운데 40px 아이콘 + 14px 메시지 · 버튼 가운데 110px)
//             + 이번에 정한 것(모서리 16px · 그림자 · 뒤 45% · 확인 = 주 버튼 · 취소 = 보조 버튼 · ⓘ 주색).
//    - Esc · ✕ 로 닫힘(확인 창은 취소로 처리). 위쪽을 잡고 끌어 옮김.
//    - [27번] 창이 열리면 주 버튼(확인)에 포커스 → Enter 를 누르면 확인.
//      (A 는 띄우기 전에 포커스를 빼서 Enter 가 뒤 버튼을 다시 누르지 않게 했다. 여기서는 포커스를 창의 확인 버튼으로 옮겨 같은 문제를 막는다)
//    - options : { confirmText, cancelText, icon: 'info' | 'question' }
//  ksis.toast(message) — 화면 아래 가운데 잠깐 뜨는 안내(그리드 복사 · 붙여넣기 결과)
// =====================================================================
(function (window, document) {
	"use strict";

	var ksis = window.ksis = window.ksis || {};
	var zIndex = 2000;

	var ICONS = {
		info: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/></svg>',
		question: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M9.4 9.3a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.3-2.6 4" stroke-linecap="round"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/></svg>'
	};

	/** A 와 같은 규칙 : 날 것의 < > & 는 바꾸고, 줄바꿈 · 강조 태그(<br> <b> <strong>)만 살린다 */
	function safeText(value) {
		if (value === null || value === undefined) return "";
		return String(value)
			.replace(/&(?!(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);)/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/&lt;br\s*\/?&gt;/gi, "<br>")
			.replace(/&lt;(\/?)(b|strong)&gt;/gi, "<$1$2>");
	}

	/** 머리 부분을 잡고 끌어 옮기기(창 밖으로는 못 나감). 업무 팝업(ksis-modal.js)도 같이 쓴다 */
	ksis.makeDraggable = function (box, handle) {
		var x = 0, y = 0;
		handle.addEventListener("mousedown", function (e) {
			if (e.button !== 0 || e.target.closest("button, input, select, textarea, a")) return;
			e.preventDefault();
			var sx = e.clientX - x, sy = e.clientY - y;
			var r0 = box.getBoundingClientRect();
			var minX = x - r0.left, maxX = x + (window.innerWidth - r0.right);
			var minY = y - r0.top, maxY = y + (window.innerHeight - r0.bottom);
			function move(ev) {
				x = Math.max(minX, Math.min(maxX, ev.clientX - sx));
				y = Math.max(minY, Math.min(maxY, ev.clientY - sy));
				box.style.transform = "translate(" + x + "px," + y + "px)";
			}
			function up() {
				document.removeEventListener("mousemove", move);
				document.removeEventListener("mouseup", up);
			}
			document.addEventListener("mousemove", move);
			document.addEventListener("mouseup", up);
		});
		return { reset: function () { x = 0; y = 0; box.style.transform = ""; } };
	};

	function open(kind, message, okFn, cancelFn, title, options) {
		options = options || {};
		var icon = options.icon || (kind === "alert" ? "info" : "question");
		var layer = document.createElement("div");
		layer.className = "k-modal k-dialog-layer";
		layer.style.zIndex = String(++zIndex);
		layer.setAttribute("role", "dialog");
		layer.setAttribute("aria-modal", "true");
		layer.setAttribute("aria-label", title || (kind === "alert" ? "알림" : "확인"));
		layer.innerHTML =
			'<div class="k-dialog">' +
			'  <div class="k-dialog-head"><button type="button" class="k-pop-close" title="닫기" aria-label="닫기">✕</button></div>' +
			'  <div class="k-dialog-body">' +
			'    <div class="k-dialog-icon ' + icon + '">' + (ICONS[icon] || ICONS.info) + '</div>' +
			'    <div class="k-dialog-msg">' + safeText(message) + '</div>' +
			'  </div>' +
			'  <div class="k-dialog-foot">' +
			(kind === "confirm" ? '<button type="button" class="k-btn k-btn-ghost" data-act="cancel">' + safeText(options.cancelText || "취소") + '</button>' : "") +
			'    <button type="button" class="k-btn k-btn-primary" data-act="ok">' + safeText(options.confirmText || "확인") + '</button>' +
			'  </div>' +
			'</div>';
		document.body.appendChild(layer);

		var box = layer.querySelector(".k-dialog");
		ksis.makeDraggable(box, layer.querySelector(".k-dialog-head"));
		var returnFocus = document.activeElement;

		function close(ok) {
			document.removeEventListener("keydown", onKey, true);
			layer.parentNode && layer.parentNode.removeChild(layer);
			if (returnFocus && returnFocus.focus && document.body.contains(returnFocus)) {
				try { returnFocus.focus({ preventScroll: true }); } catch (e) { }
			}
			var fn = ok ? okFn : (kind === "alert" ? okFn : cancelFn);
			if (typeof fn === "function") setTimeout(fn, 0);
		}
		function onKey(e) {
			if (layer.style.zIndex !== String(zIndex)) return; // 가장 위 창만
			if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(false); }
		}
		layer.addEventListener("click", function (e) {
			var b = e.target.closest("button");
			if (!b) return;
			if (b.classList.contains("k-pop-close")) close(false);
			else if (b.dataset.act === "ok") close(true);
			else if (b.dataset.act === "cancel") close(false);
		});
		document.addEventListener("keydown", onKey, true);

		// [27번] 주 버튼에 포커스
		layer.querySelector('[data-act="ok"]').focus();
		return layer;
	}

	ksis.showAlert = function (message, callback, title, options) {
		return open("alert", message, callback, null, title, options);
	};
	ksis.showConfirm = function (message, confirmCallback, cancelCallback, title, options) {
		return open("confirm", message, confirmCallback, cancelCallback, title, options);
	};

	var toastEl = null, toastTimer = null;
	ksis.toast = function (message) {
		if (!toastEl) {
			toastEl = document.createElement("div");
			toastEl.className = "pn-toast";
			document.body.appendChild(toastEl);
		}
		toastEl.textContent = message;
		toastEl.classList.add("show");
		clearTimeout(toastTimer);
		toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
	};
})(window, document);
