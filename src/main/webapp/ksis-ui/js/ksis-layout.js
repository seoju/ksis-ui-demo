// =====================================================================
//  KSIS 공통 : 전체 틀(상단 가로바 · 좌측 메뉴 · 화면 탭)   [비교표 1~18번]
//
//  ksis.layout.init({ open: function (path, title, viewEl) { … } })
//    open : 소메뉴를 눌러 탭 화면을 새로 만들 때 부른다. viewEl 안에 그 화면을 그린다.
//           (KSIS-A 는 여기서 지금처럼 화면 JSP 를 불러와 넣으면 된다)
//
//  동작
//   [4번]  ≡ 버튼 : 좌측 메뉴 폭 0 ↔ 펼침(0.15초). 접은 상태는 저장하지 않는다.
//   [9번]  대분류는 각자 따로 펼침 · 접힘(하나를 열어도 다른 것은 안 닫힘). 펼친 상태는 이 PC 에 기억(새로고침 뒤에도 그대로).
//   [10번] 대분류 이름 = 펼치기/접기만(화면 이동 없음).
//   [12·13번] 메뉴 검색 · 즐겨찾기 없음.
//   [15번] 상단 탭을 누르면 떠날 때 상태 그대로 + 탭마다 스크롤 위치 기억.
//   [16번] 이미 열린 화면을 좌측 소메뉴로 다시 누르면 처음 상태로 새로 만들고 탭을 맨 오른쪽으로.
//   [17번] 탭은 최대 10개. 넘으면 가장 오래 안 본 탭을 안내 없이 닫는다.
//   [18번] 닫기 : ✕, 시스템명 클릭(전체 닫기 + 메인). 보던 탭을 닫으면 오른쪽 이웃(없으면 왼쪽), 하나도 없으면 메인.
//          우클릭 메뉴 · [전체닫기] 버튼 없음.
//   [7번]  브라우저 창 제목은 시스템 이름으로 고정(탭에 따라 바뀌지 않음).
// =====================================================================
(function (window, document) {
	"use strict";

	var ksis = window.ksis = window.ksis || {};
	var MAX_TABS = 10;
	var OPEN_KEY = "ksis.menu.open";
	// [14번] 책갈피 탭의 왼쪽 S 곡선 · 오른쪽 내려가는 곡선. 참고한 사내 시스템의 탭 그림(tab_sprite.png, 2배 크기)의
	//        곡선을 픽셀 단위로 따서 그 좌표 그대로 옮김(viewBox 도 그림 좌표). 색은 CSS(--k-tab-fill)로 바꿈
	var TAB_EDGES =
		'<svg class="k-tab-l" viewBox="0 0 40 70" aria-hidden="true"><path d="M40 8L30.05 8L30.05 8.5L27.55 9.5L25.06 11.5L23.12 14.5L22.05 17.5L21.79 20.5L21.79 54.5L21.47 57.5L20.68 60.5L19.22 63.5L17.68 65.5L13.68 68.5L11.18 69.5L11.18 70L40 70Z"/></svg>' +
		'<svg class="k-tab-r" viewBox="50 0 70 70" aria-hidden="true"><path d="M50 8L55.96 8L55.96 8.5L60.65 11.5L62.65 14.5L89.76 65.5L91.65 67.5L95.62 69.5L95.62 70L50 70Z"/></svg>';

	ksis.layout = {
		init: function (options) {
			options = options || {};
			var sidebar = document.querySelector(".k-sidebar");
			var tabbar = document.querySelector(".k-tabbar");
			var content = document.querySelector(".k-content");
			var home = content.querySelector(".k-main-home");
			var tabs = [];        // { path, title, view, seen, scroll }
			var active = null;
			var clock = 0;

			// ---- [4번] 메뉴 접기 ----
			var ham = document.querySelector(".k-hamburger");
			if (ham) ham.addEventListener("click", function () { sidebar.classList.toggle("collapsed"); });

			// ---- [9번] 대분류 펼침(각자 따로, 기억) ----
			function loadOpen() { try { return JSON.parse(localStorage.getItem(OPEN_KEY) || "[]"); } catch (e) { return []; } }
			function saveOpen() {
				var keys = Array.prototype.map.call(sidebar.querySelectorAll(".k-menu-group-header.expanded"), function (h) { return h.dataset.group; });
				try { localStorage.setItem(OPEN_KEY, JSON.stringify(keys)); } catch (e) { }
			}
			var opened = loadOpen();
			Array.prototype.forEach.call(sidebar.querySelectorAll(".k-menu-group-header"), function (h) {
				setGroup(h, opened.indexOf(h.dataset.group) >= 0);
				h.addEventListener("click", function () { setGroup(h, !h.classList.contains("expanded")); saveOpen(); });
			});
			function setGroup(h, on) {
				h.classList.toggle("expanded", on);
				h.setAttribute("aria-expanded", on ? "true" : "false");
				var t = h.querySelector(".k-menu-toggle");
				if (t) t.textContent = on ? "－" : "＋";
			}

			// ---- 소메뉴 ----
			sidebar.addEventListener("click", function (e) {
				var a = e.target.closest(".k-menu-item");
				if (!a) return;
				e.preventDefault();
				openFromMenu(a.dataset.path, a.dataset.title || a.textContent.trim());
			});

			// ---- [2·18번] 시스템명 = 전체 닫기 + 메인 ----
			var logo = document.querySelector(".k-logo");
			if (logo) logo.addEventListener("click", function () {
				tabs.slice().forEach(function (t) { t.view.remove(); });
				tabs = [];
				activate(null);
			});

			function find(path) { return tabs.filter(function (t) { return t.path === path; })[0]; }

			function makeView(tab) {
				var view = document.createElement("div");
				view.className = "k-tab-view";
				content.appendChild(view);
				tab.view = view;
				tab.scroll = { top: 0, left: 0 };
				if (typeof options.open === "function") options.open(tab.path, tab.title, view);
				if (ksis.enhance) ksis.enhance(view);
			}

			function openFromMenu(path, title) {
				var tab = find(path);
				if (tab) {
					// [16번] 처음 상태로 새로 만들고 맨 오른쪽으로
					tab.view.remove();
					tabs.splice(tabs.indexOf(tab), 1);
				} else {
					tab = { path: path, title: title };
					// [17번] 10개를 넘으면 가장 오래 안 본 탭을 닫는다(안내 없음)
					if (tabs.length >= MAX_TABS) {
						var oldest = tabs.slice().sort(function (a, b) { return a.seen - b.seen; })[0];
						oldest.view.remove();
						tabs.splice(tabs.indexOf(oldest), 1);
					}
				}
				tabs.push(tab);
				makeView(tab);
				activate(tab, true);
			}

			function close(tab) {
				var i = tabs.indexOf(tab);
				if (i < 0) return;
				tab.view.remove();
				tabs.splice(i, 1);
				if (active === tab) activate(tabs[i] || tabs[i - 1] || null);
				else renderTabs();
			}

			function activate(tab, fresh) {
				if (active && active !== tab && active.view && active.view.isConnected) {
					active.scroll = { top: content.scrollTop, left: content.scrollLeft }; // [15번] 탭마다 스크롤 기억
				}
				active = tab;
				tabs.forEach(function (t) { t.view.classList.toggle("k-hidden", t !== tab); t.view.inert = t !== tab; });
				if (home) home.hidden = !!tab;
				if (tab) {
					tab.seen = ++clock;
					content.scrollTop = fresh ? 0 : tab.scroll.top;
					content.scrollLeft = fresh ? 0 : tab.scroll.left;
				} else {
					content.scrollTop = 0;
				}
				Array.prototype.forEach.call(sidebar.querySelectorAll(".k-menu-item"), function (a) {
					a.classList.toggle("active", !!tab && a.dataset.path === tab.path);
				});
				renderTabs();
			}

			function renderTabs() {
				tabbar.innerHTML = "";
				tabs.forEach(function (t, i) {
					var el = document.createElement("div");
					el.className = "k-tab" + (t === active ? " active" : "");
					el.setAttribute("role", "tab");
					el.title = t.title;
					el.style.zIndex = tabs.length - i; // 앞 탭의 오른쪽 곡선이 뒤 탭의 왼쪽 곡선 위로(보는 탭은 CSS 로 맨 위)
					el.innerHTML = TAB_EDGES + '<span class="k-tab-title"></span><button type="button" class="k-tab-close" title="탭 닫기">✕</button>';
					el.querySelector(".k-tab-title").textContent = t.title;
					el.addEventListener("click", function (e) {
						if (e.target.closest(".k-tab-close")) close(t);
						else if (t !== active) activate(t);
					});
					tabbar.appendChild(el);
				});
			}

			activate(null);
			return { openFromMenu: openFromMenu, tabs: function () { return tabs.slice(); } };
		}
	};
})(window, document);
