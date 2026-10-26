// =====================================================================
//  KSIS 공통 : 업무 팝업 열기 · 닫기 · 끌어 옮기기   [비교표 43번 · 27번]
//
//  마크업(JSP)
//    <div class="k-modal" id="..." hidden>
//      <div class="k-pop [k-pop-m | k-pop-s | k-pop-xs]">       폭 1100 / 700 / 500 / 450
//        <div class="k-pop-header">
//          <div class="k-pop-title">제목</div>
//          <button class="k-pop-close">✕</button>               ✕ 는 반드시 둔다
//        </div>
//        <div class="k-pop-body"> 1. 절 … table.k-field … </div>
//        <div class="k-pop-footer"> [취소] [저장] </div>        회색 띠, 버튼 가운데
//      </div>
//    </div>
//
//  ksis.modal.open(idOrEl) / ksis.modal.close(idOrEl)
//    - [27번] 열면 본문의 첫 번째 작성 항목(입력칸 · 드롭다운 · 날짜 · 여러 줄 칸, 읽기 전용 · 비활성 제외)에 포커스.
//      작성 항목이 없는 팝업이면 주 버튼(.k-btn-primary). 알림 · 확인 창(44번)은 ksis-dialog.js 가 주 버튼에 포커스.
//      [27번 KSIS-A] 같은 작성창이라도 결재자(중간 결재 · 최종 결재)가 여는 경우는 거의 고치지 않는 "확인창"이므로
//      주 버튼(승인)에 포커스 : ksis.modal.open(id, { focus: "button" }) 또는 <div class="k-modal" data-focus="button">.
//      상신한 사람이 열 때는 그냥 open(id) → 첫 작성 항목. (KSIS-B 는 결재 단계가 없어 해당 없음)
//    - 머리줄을 잡고 끌어 옮김. Esc · ✕ · data-modal-close 버튼으로 닫힘.
//    - .k-pop-full 버튼(KSIS-B 만 둠)은 전체 화면 전환.
// =====================================================================
(function (window, document) {
	"use strict";

	var ksis = window.ksis = window.ksis || {};
	var stack = [];

	// [27번] 본문의 첫 번째 작성 항목(화면에 보이고 쓸 수 있는 것, 문서 순서대로)
	var FIELD = ".k-pop-body input:not([type=hidden]):not([type=file]):not([readonly]):not([disabled])," +
		" .k-pop-body textarea:not([readonly]):not([disabled]), .k-pop-body .k-select-box:not([disabled])";
	function firstField(layer) {
		var list = layer.querySelectorAll(FIELD);
		for (var i = 0; i < list.length; i++) {
			if (list[i].offsetParent !== null) return list[i];
		}
		return null;
	}
	var zIndex = 1500;

	function get(idOrEl) {
		return typeof idOrEl === "string" ? document.getElementById(idOrEl) : idOrEl;
	}

	function wire(layer) {
		if (layer.dataset.kModalWired) return;
		layer.dataset.kModalWired = "1";
		var pop = layer.querySelector(".k-pop");
		var head = layer.querySelector(".k-pop-header");
		if (pop && head && ksis.makeDraggable) layer._drag = ksis.makeDraggable(pop, head);
		layer.addEventListener("click", function (e) {
			var b = e.target.closest("button");
			if (!b) return;
			if (b.classList.contains("k-pop-close") || b.hasAttribute("data-modal-close")) ksis.modal.close(layer);
			else if (b.classList.contains("k-pop-full")) {
				pop.classList.toggle("is-fullscreen");
				if (layer._drag) layer._drag.reset();
			}
		});
	}

	ksis.modal = {
		open: function (idOrEl, options) {
			var layer = get(idOrEl);
			if (!layer) return;
			wire(layer);
			layer.hidden = false;
			layer.style.zIndex = String(++zIndex);
			layer._returnFocus = document.activeElement;
			stack.push(layer);
			if (ksis.enhance) ksis.enhance(layer);
			var byButton = (options && options.focus === "button") || layer.dataset.focus === "button";
			var primary = layer.querySelector(".k-pop-footer .k-btn-primary");
			var target = byButton ? (primary || firstField(layer)) : (firstField(layer) || primary);
			if (target) target.focus();
		},
		close: function (idOrEl) {
			var layer = get(idOrEl);
			if (!layer) return;
			layer.hidden = true;
			var pop = layer.querySelector(".k-pop");
			if (pop) pop.classList.remove("is-fullscreen");
			if (layer._drag) layer._drag.reset();
			stack = stack.filter(function (l) { return l !== layer; });
			var f = layer._returnFocus;
			if (f && f.focus && document.body.contains(f)) { try { f.focus({ preventScroll: true }); } catch (e) { } }
		}
	};

	document.addEventListener("keydown", function (e) {
		if (e.key !== "Escape" || stack.length === 0) return;
		if (document.querySelector(".k-dialog-layer")) return; // 알림 창이 위에 있으면 그 창이 먼저 닫힘
		if (document.querySelector(".k-select-wrap.open, .k-calendar")) return; // 펼친 목록 · 달력 먼저
		ksis.modal.close(stack[stack.length - 1]);
	});
})(window, document);
