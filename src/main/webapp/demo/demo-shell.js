// 비교 화면 틀(시연 전용) : 보기 방식 · 가상 화면 폭 · 칸 제목 표시
(function () {
	"use strict";
	var panes = document.getElementById("dsPanes");
	var modeSel = document.getElementById("dsMode");
	var widthSel = document.getElementById("dsWidth");
	var tabs = document.getElementById("dsTabs");
	var KEY = "ksis.demo.view";

	// 화면 폭 : 레이아웃은 1600px 화면을 줄여 보이고, 부품 영역은 칸 크기 그대로(영역마다 따로 기억)
	var main = document.getElementById("dsMain");
	var WKEY = "ksis.demo.width." + main.dataset.area;
	widthSel.value = main.dataset.defaultWidth;
	try {
		var saved = JSON.parse(localStorage.getItem(KEY) || "{}");
		if (saved.mode) modeSel.value = saved.mode;
		var w = localStorage.getItem(WKEY);
		if (w != null) widthSel.value = w;
	} catch (e) { }

	// 칸 안 iframe 을 "가상 화면 폭"으로 그린 뒤 칸 크기에 맞게 줄인다(실제 모니터에서 보는 배치 그대로)
	function fit() {
		var w = parseInt(widthSel.value, 10);
		Array.prototype.forEach.call(panes.querySelectorAll(".ds-pane-body"), function (body) {
			var f = body.querySelector("iframe");
			var bw = body.clientWidth, bh = body.clientHeight;
			if (!bw) return;
			if (!w) { f.style.width = bw + "px"; f.style.height = bh + "px"; f.style.transform = ""; return; }
			var s = bw / w;
			f.style.width = w + "px";
			f.style.height = Math.ceil(bh / s) + "px";
			f.style.transform = "scale(" + s + ")";
		});
	}
	function setMode() {
		panes.className = "ds-panes mode-" + modeSel.value;
		tabs.hidden = modeSel.value !== "one";
		fit();
		try { localStorage.setItem(KEY, JSON.stringify({ mode: modeSel.value })); localStorage.setItem(WKEY, widthSel.value); } catch (e) { }
	}
	modeSel.addEventListener("change", setMode);
	widthSel.addEventListener("change", setMode);
	window.addEventListener("resize", fit);
	tabs.addEventListener("click", function (e) {
		var b = e.target.closest("button");
		if (!b) return;
		Array.prototype.forEach.call(tabs.children, function (x) { x.classList.toggle("on", x === b); });
		Array.prototype.forEach.call(panes.children, function (p, i) { p.classList.toggle("on", String(i) === b.dataset.pane); });
		fit();
	});

	// [7번] 칸마다 브라우저 창 제목을 머리에 보여 준다(iframe 안이라 실제 창 제목에는 안 보이므로)
	function showTitles() {
		Array.prototype.forEach.call(panes.querySelectorAll(".ds-pane"), function (p) {
			var f = p.querySelector("iframe"), em = p.querySelector(".ds-title em");
			try { em.textContent = f.contentDocument.title || "—"; } catch (e) { }
		});
	}
	Array.prototype.forEach.call(panes.querySelectorAll("iframe"), function (f) { f.addEventListener("load", showTitles); });
	setInterval(showTitles, 1000);

	setMode();
})();
