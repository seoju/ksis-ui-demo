/* =====================================================================
   [14번] 화면 탭 2안 · 3안 — 탭 검토 화면에서 ?tabPlan=2 · ?tabPlan=3 일 때만 덧붙인다(ksis-tabs-plan2.css 와 짝).
   기본 ksis-layout.js(1안, main 과 같음)는 그대로 두고, 그려진 탭에 곡선 조각과 겹침 순서만 더한다.
   어느 안으로 정하든 KSIS 에는 ksis-layout.js 의 renderTabs 에 합쳐 넣는다.
   ===================================================================== */
(function () {
	"use strict";

	// 책갈피 탭의 왼쪽 S 곡선 · 오른쪽 내려가는 곡선. 참고한 사내 시스템의 탭 그림(tab_sprite.png, 2배 크기)의
	// 곡선을 픽셀 단위로 따서 그 좌표 그대로 옮김(viewBox 도 그림 좌표). 색은 CSS(--k-tab-fill)로 바꿈
	var TAB_EDGES =
		'<svg class="k-tab-l" viewBox="0 0 40 70" aria-hidden="true"><path d="M40 8L30.05 8L30.05 8.5L27.55 9.5L25.06 11.5L23.12 14.5L22.05 17.5L21.79 20.5L21.79 54.5L21.47 57.5L20.68 60.5L19.22 63.5L17.68 65.5L13.68 68.5L11.18 69.5L11.18 70L40 70Z"/></svg>' +
		'<svg class="k-tab-r" viewBox="50 0 70 70" aria-hidden="true"><path d="M50 8L55.96 8L55.96 8.5L60.65 11.5L62.65 14.5L89.76 65.5L91.65 67.5L95.62 69.5L95.62 70L50 70Z"/></svg>';

	// 탭마다 곡선 조각을 붙이고, 앞 탭의 오른쪽 곡선이 뒤 탭의 왼쪽 곡선 위로 오게 한다(보는 탭은 CSS 로 맨 위)
	function decorate(bar) {
		var tabs = bar.querySelectorAll(".k-tab");
		Array.prototype.forEach.call(tabs, function (el, i) {
			el.style.zIndex = tabs.length - i;
			if (!el.querySelector(".k-tab-l")) el.insertAdjacentHTML("afterbegin", TAB_EDGES);
		});
	}

	// 가로바 왼쪽(≡ + 시스템명) 오른쪽 끝 위치. 탭 3안에서 메뉴를 접었을 때 이 오른쪽부터 탭을 놓는다
	// 가운데 사번 문구 아래끝도 잰다(탭 3안은 탭 위끝을 이 아래까지만 올린다)
	function measureHead() {
		var root = document.documentElement.style;
		var headLeft = document.querySelector(".k-header-left");
		var badge = document.querySelector(".k-user-badge");
		if (headLeft) root.setProperty("--k-header-left-w", Math.ceil(headLeft.getBoundingClientRect().right) + "px");
		if (badge) root.setProperty("--k-badge-bottom", Math.ceil(badge.getBoundingClientRect().bottom) + "px");
	}

	document.addEventListener("DOMContentLoaded", function () {
		var bar = document.querySelector(".k-tabbar");
		if (bar) {
			decorate(bar);
			// ksis-layout.js 는 탭이 바뀔 때마다 탭 줄을 새로 그린다 → 그릴 때마다 다시 붙임(그리기 직후, 화면에 나오기 전)
			new MutationObserver(function () { decorate(bar); }).observe(bar, { childList: true });
		}
		measureHead();
	});
	window.addEventListener("resize", measureHead);
	window.addEventListener("load", measureHead); // 글꼴이 늦게 들어와 글자 크기가 바뀌는 경우
})();
