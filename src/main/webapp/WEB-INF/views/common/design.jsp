<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- 디자인 검토(plan-b 가지 전용) : 요구사항 메인 틀(③ KSIS-A)을 전체 화면으로 띄우고, 떠 있는 리모컨으로
     A · B / 화면 탭(14번) 기존 · 1~3안 / 좌측 메뉴(11번) 기존 · 1~5안을 바꿔 본다.
     화면 주소 : /view/req-{a|b}/layout?tabPlan=0|2|3&menuPlan=0|2~5 (탭 1안 · 메뉴 1안은 값 없음 = main 과 같은 기본 화면).
     안을 바꾸면 새 화면을 뒤에서 열어 열려 있던 탭 · 보던 탭 · 메뉴 접힘을 그대로 되살린 뒤 바꿔 끼운다. --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>디자인 검토 · KSIS UI 통일 시연</title>
<link rel="stylesheet" href="<c:url value='/demo/demo-shell.css'/>">
</head>
<body class="dr-page">
<div class="dr-stage" id="drStage"></div>

<div class="dr" id="dr">
	<div class="dr-head" id="drHead">
		<span class="dr-grip" aria-hidden="true"></span>
		<b>디자인 검토</b>
		<button type="button" class="dr-icon" id="drMin" title="접기 / 펴기">–</button>
		<a class="dr-icon" href="<c:url value='/'/>" title="처음 화면">⌂</a>
	</div>
	<div class="dr-body">
		<div class="dr-row"><span>시스템</span>
			<div class="dr-seg" data-k="t"><button type="button" data-v="a">A</button><button type="button" data-v="b">B</button></div></div>
		<div class="dr-row"><span>탭</span>
			<div class="dr-seg" data-k="tab"><button type="button" data-v="0">기존</button><button type="button" data-v="1">1안</button><button type="button" data-v="2">2안</button><button type="button" data-v="3">3안</button></div></div>
		<div class="dr-row"><span>메뉴</span>
			<div class="dr-seg" data-k="menu"><button type="button" data-v="0">기존</button><button type="button" data-v="1">1안</button><button type="button" data-v="2">2안</button><button type="button" data-v="3">3안</button><button type="button" data-v="4">4안</button><button type="button" data-v="5">5안</button></div></div>
	</div>
</div>

<script>
(function () {
	"use strict";
	var BASE = "${pageContext.request.contextPath}";
	var $ = function (id) { return document.getElementById(id); };
	var stage = $("drStage"), dr = $("dr");
	var ALLOWED = { t: "ab", tab: "0123", menu: "012345" };

	// 고른 안은 주소에 둔다(새로고침해도 그대로). 처음은 A · 탭 1안 · 메뉴 1안 = main 과 같은 화면
	var state = { t: "a", tab: "1", menu: "1" };
	var qs = new URLSearchParams(location.search);
	Object.keys(state).forEach(function (k) {
		var v = qs.get(k);
		if (v && v.length === 1 && ALLOWED[k].indexOf(v) >= 0) state[k] = v;
	});

	function frameUrl(s) {
		var q = [];
		if (s.tab !== "1") q.push("tabPlan=" + s.tab);
		if (s.menu !== "1") q.push("menuPlan=" + s.menu);
		return BASE + "/view/req-" + s.t + "/layout" + (q.length ? "?" + q.join("&") : "");
	}

	// ---- 화면 바꿔 끼우기 : 열린 탭 · 보던 탭 · 메뉴 접힘을 새 화면에 되살림 ----
	var shown = null, loading = null;
	function snapshot(f) {
		try {
			var d = f.contentDocument;
			var act = d.querySelector(".k-tab.active");
			return {
				tabs: Array.prototype.map.call(d.querySelectorAll(".k-tab"), function (e) { return e.title; }),
				active: act ? act.title : null,
				collapsed: !!d.querySelector(".k-sidebar.collapsed")
			};
		} catch (e) { return null; }
	}
	function restore(d, snap) {
		if (!snap) {
			// 처음 열 때 : 첫 대메뉴를 펴고 소메뉴 4개를 탭으로 띄운 뒤 두 번째 탭을 본다
			var g = d.querySelector(".k-menu-group-header");
			if (!g) return;
			if (!g.classList.contains("expanded")) g.click();
			Array.prototype.slice.call(g.parentNode.querySelectorAll(".k-menu-item"), 0, 4).forEach(function (it) { it.click(); });
			var first = d.querySelectorAll(".k-tab");
			if (first[1]) first[1].click();
			return;
		}
		snap.tabs.forEach(function (title) {
			var it = Array.prototype.find.call(d.querySelectorAll(".k-menu-item"), function (e) { return e.getAttribute("data-title") === title; });
			if (it) it.click();
		});
		if (snap.active) {
			var tab = Array.prototype.find.call(d.querySelectorAll(".k-tab"), function (e) { return e.title === snap.active; });
			if (tab && !tab.classList.contains("active")) tab.click();
		}
		if (snap.collapsed) { var h = d.querySelector(".k-hamburger"); if (h) h.click(); }
	}
	function show() {
		var snap = loading ? loading._snap : (shown ? snapshot(shown) : null);
		if (loading) loading.remove();
		var f = document.createElement("iframe");
		f.className = "dr-frame is-loading";
		f.title = "요구사항 화면";
		f._snap = snap;
		f.addEventListener("load", function () {
			if (f !== loading) return;
			try { restore(f.contentDocument, snap); } catch (e) { }
			requestAnimationFrame(function () {
				if (f !== loading) return;
				f.classList.remove("is-loading");
				if (shown) shown.remove();
				shown = f; loading = null;
			});
		});
		loading = f;
		f.src = frameUrl(state);
		stage.appendChild(f);
	}

	// ---- 리모컨 ----
	function paint() {
		Array.prototype.forEach.call(dr.querySelectorAll(".dr-seg"), function (seg) {
			var k = seg.getAttribute("data-k");
			Array.prototype.forEach.call(seg.children, function (b) {
				var on = b.getAttribute("data-v") === state[k];
				b.classList.toggle("on", on);
				b.setAttribute("aria-pressed", on ? "true" : "false");
			});
		});
		history.replaceState(null, "", "?t=" + state.t + "&tab=" + state.tab + "&menu=" + state.menu);
	}
	dr.addEventListener("click", function (e) {
		var b = e.target.closest(".dr-seg button");
		if (!b) return;
		var k = b.parentNode.getAttribute("data-k"), v = b.getAttribute("data-v");
		if (state[k] === v) return;
		state[k] = v;
		paint();
		show();
	});

	// 접기 · 위치는 이 브라우저에 기억
	function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
	function save(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
	if (load("dr.min") === "1") dr.classList.add("is-min");
	$("drMin").addEventListener("click", function () {
		dr.classList.toggle("is-min");
		save("dr.min", dr.classList.contains("is-min") ? "1" : "0");
		place(dr.offsetLeft, dr.offsetTop);
	});

	// 머리줄을 잡고 끌어 옮김(끄는 동안 화면이 마우스를 가로채지 않게)
	function place(x, y) {
		var maxX = window.innerWidth - dr.offsetWidth - 4, maxY = window.innerHeight - dr.offsetHeight - 4;
		x = Math.max(4, Math.min(x, maxX)); y = Math.max(4, Math.min(y, maxY));
		dr.style.left = x + "px"; dr.style.top = y + "px";
		return [x, y];
	}
	var pos = null;
	try { pos = JSON.parse(load("dr.pos") || "null"); } catch (e) { }
	if (pos) place(pos[0], pos[1]);
	else place(window.innerWidth - dr.offsetWidth - 24, window.innerHeight - dr.offsetHeight - 24);
	window.addEventListener("resize", function () { place(dr.offsetLeft, dr.offsetTop); });

	$("drHead").addEventListener("pointerdown", function (e) {
		if (e.target.closest(".dr-icon")) return;
		var sx = e.clientX - dr.offsetLeft, sy = e.clientY - dr.offsetTop;
		document.body.classList.add("dr-dragging");
		function move(ev) { place(ev.clientX - sx, ev.clientY - sy); }
		function up() {
			document.body.classList.remove("dr-dragging");
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			save("dr.pos", JSON.stringify([dr.offsetLeft, dr.offsetTop]));
		}
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		e.preventDefault();
	});

	paint();
	show();
})();
</script>
</body>
</html>
