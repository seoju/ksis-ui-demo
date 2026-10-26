<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%--
  ② KSIS-B 원래 — 전체 틀. KSIS_B MainLayout.razor · TabBar.razor · MenuLink.razor 가 그리는 마크업 그대로(app.css 복사본).
  KSIS-B 는 Blazor(C#) 라 탭 · 메뉴 동작(TabState.cs)은 아래 짧은 JS 로 똑같이 흉내 냈다:
  대분류 각자 펼침 · 탭 최대 10개(가장 오래 안 본 탭 닫힘) · 소메뉴 다시 누르면 새로 만들고 맨 오른쪽 · 로고 = 전체 닫기 + 메인 · 가운데 버튼 = 닫기.
--%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-b/_head.jspf"%>
</head>
<body>
<div class="app-shell">
	<header class="app-header">
		<div class="header-left">
			<button class="hamburger-btn" title="메뉴 열기/닫기"><span></span><span></span><span></span></button>
			<div class="app-logo" title="처음 화면으로 이동">
				<span class="app-logo-acronym">영업정보시스템(KSIS-B)</span>
				<span class="app-logo-fullname">Kefico Sales Information System · Bridge v1.0.0.123</span>
			</div>
		</div>
		<div class="header-user-badge-wrap">
			<div class="header-user-badge">K123456 영업관리자</div>
		</div>
		<div class="header-right">
			<div class="header-tagline" id="bTagline" style="display:none">
				<div class="tagline-text">
					<span class="tagline-main">예측데이터를 자산으로!</span>
					<span class="tagline-sub">장기 영업 예상과 수주현황을 시스템으로 관리합니다.</span>
				</div>
				<svg class="tagline-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="24" cy="24" r="23" fill="#E7F9EE" />
					<path d="M12 30L19 22L25 27L36 14" stroke="#03C75A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M29 14H36V21" stroke="#03C75A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</div>
		</div>
	</header>

	<div class="app-body">
		<nav class="app-sidebar">
			<div class="sidebar-menu">
				<c:forEach var="g" items="${menus}">
					<div class="sidebar-group">
						<button class="sidebar-group-header" data-group="${g.key()}" title="메뉴 펼치기/접기">
							<span class="sidebar-group-toggle">＋</span>
							<span class="sidebar-group-title">${g.title()}</span>
						</button>
						<div class="sidebar-submenu" style="display:none">
							<c:forEach var="m" items="${g.items()}">
								<a class="sidebar-item sidebar-subitem menu-link" role="link" data-path="${m.path()}" data-title="${m.title()}"><span class="sidebar-item-text">ㄴ ${m.title()}</span></a>
							</c:forEach>
						</div>
					</div>
				</c:forEach>
			</div>
		</nav>

		<div class="app-workspace">
			<div class="tab-bar" role="tablist" hidden></div>
			<main class="app-content">
				<div id="bHome" class="card"><h2 class="page-title">메인 화면</h2><p class="um-hint">좌측 메뉴에서 소메뉴를 눌러 탭을 열어 보세요.</p></div>
			</main>
		</div>
	</div>
</div>

<template id="bScreen">
	<div class="card">
		<div class="list-toolbar">
			<h2 class="page-title" data-slot="title"></h2>
			<span class="vform-muted toolbar-count-box">
				<span class="toolbar-info">총 ${fn:length(rows)}건</span>
				<span class="toolbar-count-sub">1~${fn:length(rows)} (페이지 1 / 1)</span>
			</span>
			<div class="toolbar-actions">
				<button class="btn btn-primary btn-sm">엑셀 다운로드</button>
			</div>
		</div>
		<div class="data-options search-area">
			<div class="data-options-left">
				<label>고객사</label>
				<select class="text-input" style="width:150px"><option>전체</option><option>현대자동차</option><option>기아</option></select>
				<label style="margin-left:12px;">품번</label>
				<input class="text-input" style="width:260px;" />
			</div>
			<div class="search-area-right">
				<div class="seg-stack">
					<button type="button" class="seg-stack-btn" disabled>← 이전</button>
					<button type="button" class="seg-stack-btn" disabled>다음 →</button>
				</div>
			</div>
		</div>
		<table class="app-grid">
			<thead><tr><th>No</th><th>K품번</th><th>고객품번</th><th>고객사</th><th>차종</th><th>수량</th><th>등록일</th></tr></thead>
			<tbody>
			<c:forEach var="r" items="${rows}">
				<tr><td>${r.no}</td><td>${r.kPart}</td><td>${r.custPart}</td><td>${r.customer}</td><td>${r.carType}</td><td style="text-align:right">${r.qty}</td><td>${r.date}</td></tr>
			</c:forEach>
			</tbody>
		</table>
	</div>
</template>

<script>
/* TabState.cs · MainLayout.razor 동작 흉내(시연용) */
(function () {
	var MAX = 10, tabs = [], active = null, clock = 0;
	var sidebar = document.querySelector('.app-sidebar');
	var bar = document.querySelector('.tab-bar');
	var content = document.querySelector('.app-content');
	var home = document.getElementById('bHome');
	var tagline = document.getElementById('bTagline');

	document.querySelector('.hamburger-btn').onclick = function () { sidebar.classList.toggle('collapsed'); };
	document.querySelectorAll('.sidebar-group-header').forEach(function (h) {
		h.onclick = function () {
			var on = !h.classList.contains('expanded');
			h.classList.toggle('expanded', on);
			h.querySelector('.sidebar-group-toggle').textContent = on ? '－' : '＋';
			h.nextElementSibling.style.display = on ? '' : 'none';   // Razor 는 @if 로 그리지 않음
		};
	});
	sidebar.addEventListener('click', function (e) {
		var a = e.target.closest('.menu-link'); if (!a) return;
		var t = tabs.filter(function (x) { return x.path === a.dataset.path; })[0];
		if (t) { t.view.remove(); tabs.splice(tabs.indexOf(t), 1); }
		else {
			t = { path: a.dataset.path, title: a.dataset.title };
			if (tabs.length >= MAX) { var o = tabs.slice().sort(function (x, y) { return x.seen - y.seen; })[0]; o.view.remove(); tabs.splice(tabs.indexOf(o), 1); }
		}
		t.view = document.createElement('div');
		t.view.className = 'keepalive-view';
		t.view.appendChild(document.getElementById('bScreen').content.cloneNode(true));
		t.view.querySelector('[data-slot="title"]').textContent = t.title;
		content.appendChild(t.view);
		tabs.push(t); show(t);
	});
	document.querySelector('.app-logo').onclick = function () { tabs.forEach(function (t) { t.view.remove(); }); tabs = []; show(null); };
	function close(t) {
		var i = tabs.indexOf(t); t.view.remove(); tabs.splice(i, 1);
		if (active === t) show(tabs[i] || tabs[i - 1] || null); else render();
	}
	function show(t) {
		active = t; if (t) t.seen = ++clock;
		tabs.forEach(function (x) { x.view.classList.toggle('keepalive-hidden', x !== t); x.view.inert = x !== t; });
		home.hidden = !!t; tagline.style.display = t ? "" : "none";   // 메인화면에서는 우상단 문구 · 아이콘 생략
		document.querySelectorAll('.menu-link').forEach(function (a) { a.classList.toggle('active', !!t && a.dataset.path === t.path); });
		document.title = t ? t.title : 'KSIS-B';
		render();
	}
	function render() {
		bar.hidden = tabs.length === 0; bar.innerHTML = '';
		tabs.forEach(function (t) {
			var el = document.createElement('div');
			el.className = 'tab-item' + (t === active ? ' active' : ''); el.title = t.title; el.setAttribute('role', 'tab');
			el.innerHTML = '<span class="tab-item-title"></span><button class="tab-item-close" type="button" title="탭 닫기">✕</button>';
			el.firstChild.textContent = t.title;
			el.onclick = function (e) { if (e.target.closest('.tab-item-close')) close(t); else show(t); };
			el.onmouseup = function (e) { if (e.button === 1) close(t); };
			bar.appendChild(el);
		});
	}
})();
</script>
</body>
</html>
