/**
 - Licensed under the Apache License, Version 2.0 (the "License");
 - you may not use this file except in compliance with the License.
 - You may obtain a copy of the License at
 -
 - http://www.apache.org/licenses/LICENSE-2.0
 -
 - Unless required by applicable law or agreed to in writing, software
 - distributed under the License is distributed on an "AS IS" BASIS,
 - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 - See the License for the specific language governing permissions and
 - limitations under the License.

 */
 // main.js
 (function(global) {
     // 이미 모듈이 존재하는지 확인
     if (global.MainModule) {
         return; // 이미 존재하면 함수 실행 중단
     }

     // 새로운 모듈 생성
     var privateVar = 'private 데이터';

     function privateFunction() {
         console.log('이 함수는 외부에서 접근할 수 없습니다');
     }

     global.MainModule = {
         init: function() {
             console.log('MainModule이 초기화되었습니다');
         },
         goPage: function(url, param){
			if (param) {
				//-- 페이지 로딩은 기본적으로 get 방식을 사용함
//		      $(".contens-wrap").load(url, param);
			  // GET 방식으로 파라미터 전달
	          $.get(url, param, function(data) {
	              $(".contens-wrap").html(data);
	          });
		    } else {
				//-- 파라메터 전달이 없으면 get 방식이 사용됨
		      $(".contens-wrap").load(url);
		    }
		 },

		 ajaxOpt : function() {
			var ajaxOpt = {
	            url: biz.getUrl('/paragon/user/getOne'),
				type: "POST",
	 	        param: { loginId: $("#username").text().trim() },
	 	        callback: function(response) {
	 	            if (response && response.data) {
//						usercorp.append(response.data.corpNm);
						if( response.data.wtNm === null ){
							userwt.append(' ( 미등록 ) ');
						}else if( response.data.wtNm === "" ){

						}else{
							userwt.append(' ( '+response.data.wtNm+' ) ');
						}

	 	            }
	 	        },
	 	        errorCallback: function(xhr, status, error) {
	 	            console.error("유저정보 조회 오류:", error);
	 	        }
			 };
			 biz.ajax.request(ajaxOpt);
         }
     };
 })(window);

// SCBCHANGE_20260318 START
/* ================================================
   프로필 드롭다운
   ================================================ */
(function() {
    var $dd  = null;
    var $btn = null;
    $(document).ready(function() {
        $dd  = $('#profileDropdown');
        $btn = $('#username');

        $btn.on('click', function(e) {
            e.stopPropagation();
            $dd.toggleClass('open');
        });

        // 드롭다운 외부 클릭 시 닫기
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#usernameWrap').length) {
                $dd.removeClass('open');
            }
        });
    });
})();


// SCBCHANGE_20260306 START
/* ================================================
   TabManager - 헤더 탭 관리 (scrollLeft 방식)
   ================================================ */
window.TabManager = (function() {
    const tabs = [];
    let activeId = null;

    const $list  = $('#tabList');
    const $wrap  = $('.tab-list-wrap');
    const $btnL  = $('#tabScrollLeft');
    const $btnR  = $('#tabScrollRight');
    const STEP   = 150;    // 스크롤 버튼 이동 픽셀

    function genId() { return 'tab_' + Date.now(); }

    function escHtml(str) {
        return String(str)
            .replace(/&/g,'&amp;').replace(/</g,'&lt;')
            .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function render() {
        $list.empty();
        tabs.forEach(function(t) {
            var $tab = $('<div class="tab-item-nav">')
                .attr('data-tab-id', t.id)
                .toggleClass('active', t.id === activeId);
            $tab.append('<span class="tab-name">' + escHtml(t.name) + '</span>');
            $tab.append('<span class="tab-close"><i class="fa-solid fa-xmark"></i></span>');
            $list.append($tab);
        });
        $('#tabHint').toggle(tabs.length === 0);
        updateScroll();
    }

    function updateScroll() {
        if (!$wrap[0]) return;
        var sl  = $wrap.scrollLeft();
        var max = $wrap[0].scrollWidth - $wrap[0].clientWidth;
        $btnL.toggleClass('visible', sl > 2);
        $btnR.toggleClass('visible', sl < max - 2);
    }

    function scrollToActive() {
        if (!activeId) return;
        var $active = $list.find('[data-tab-id="' + activeId + '"]');
        if (!$active.length) return;
        setTimeout(function() {
            var sl    = $wrap.scrollLeft();
            var wrapW = $wrap[0].clientWidth;
            var left  = $active[0].offsetLeft;
            var right = left + $active[0].offsetWidth;
            if (left < sl) {
                $wrap.scrollLeft(left - 6);
            } else if (right > sl + wrapW) {
                $wrap.scrollLeft(right - wrapW + 6);
            }
            updateScroll();
        }, 20);
    }

    /* 현재 활성 탭 콘텐츠를 DOM에서 분리해 메모리에 보존 */
    function saveCurrentTabContent() {
        if (!activeId) return;
        var cur = tabs.find(function(x){ return x.id === activeId; });
        if (cur) {
            biz.ui.grid.blockRedrawAll($(".contens-wrap")[0]);  // detach 전 redraw 차단
            cur.content = $(".contens-wrap").children().detach();
        }
    }

    function activate(id) {
        var t = tabs.find(function(x){ return x.id === id; });
        if (!t) return;
        if (id === activeId) return;          // 이미 활성 탭 → 아무것도 하지 않음

        saveCurrentTabContent();              // 현재 탭 분리·저장
        activeId = id;

        if (t.content) {
            $(".contens-wrap").append(t.content);   // 캐시 복원 (재조회 없음)
            biz.ui.grid.restoreRedrawAll($(".contens-wrap")[0]);  // redraw 복원 + 재렌더링
        } else {
            $(".contens-wrap").load(t.url);          // 최초 로드
        }

        $('.menu-item').removeClass('active');
        $('.menu-item[data-menu-url="' + t.url + '"]').addClass('active');
        render();
        scrollToActive();
    }

    /* 공개 API */
    function openTab(url, name) {
        if (!url || url === '') return;
        var existing = tabs.find(function(t){ return t.url === url; });
        if (existing) { activate(existing.id); return; }

        saveCurrentTabContent();              // 현재 탭 분리·저장

        var id = genId();
        tabs.push({ url: url, name: name, id: id, content: null });
        activeId = id;
        $(".contens-wrap").load(url);
        $('.menu-item').removeClass('active');
        $('.menu-item[data-menu-url="' + url + '"]').addClass('active');
        render();
        scrollToActive();
    }

    function closeTab(id) {
        var idx = tabs.findIndex(function(t){ return t.id === id; });
        if (idx < 0) return;
        tabs[idx].content = null;             // 메모리 해제
        tabs.splice(idx, 1);
        if (activeId === id) {
            activeId = null;
            $(".contens-wrap").empty();
            if (tabs.length > 0) {
                activate(tabs[Math.min(idx, tabs.length - 1)].id);
            } else {
                $('.menu-item').removeClass('active');
                render();
            }
        } else {
            render();
        }
    }

    /* 이벤트 바인딩 */
    $(document).on('click', '.tab-item-nav', function(e) {
        if ($(e.target).closest('.tab-close').length) return;
        activate($(this).data('tab-id'));
    });
    $(document).on('click', '.tab-close', function(e) {
        e.stopPropagation();
        closeTab($(this).closest('.tab-item-nav').data('tab-id'));
    });
    $btnL.on('click', function() {
        $wrap.animate({ scrollLeft: $wrap.scrollLeft() - STEP }, 150, updateScroll);
    });
    $btnR.on('click', function() {
        $wrap.animate({ scrollLeft: $wrap.scrollLeft() + STEP }, 150, updateScroll);
    });
    $wrap.on('scroll', updateScroll);
    $(window).on('resize', updateScroll);

    function closeAllTabs() {
        tabs.forEach(function(t){ t.content = null; });
        tabs.length = 0;
        activeId = null;
        $(".contens-wrap").empty();
        $('.menu-item').removeClass('active');
        render();
    }

    $('#closeAllTabs').on('click', function(){ closeAllTabs(); });

    /* 우클릭 컨텍스트 메뉴 */
    var $ctxMenu = $('<ul id="tabContextMenu" class="tab-ctx-menu">' +
        '<li data-action="close"><i class="fa-solid fa-xmark"></i> 이 탭 닫기</li>' +
        '<li data-action="closeAll"><i class="fa-solid fa-xmark"></i> 전체 닫기</li>' +
        '<li class="ctx-divider"></li>' +
        '<li data-action="favorite"><i class="fa-regular fa-star"></i> <span class="fav-text">즐겨찾기 등록</span></li>' +
    '</ul>').appendTo('body');

    var ctxTabId = null;

    /* 탭 URL로 메뉴 정보 찾기 (leftMenu에서 로드한 menuMap 활용) */
    function findMenuByUrl(url) {
        if (!url) return null;
        var $menuItem = $('.menu-item[data-menu-url="' + url + '"]');
        if ($menuItem.length) {
            return { menuId: $menuItem.data('menu-id'), url: url };
        }
        return null;
    }

    $(document).on('contextmenu', '.tab-item-nav', function(e) {
        e.preventDefault();
        e.stopPropagation();
        ctxTabId = $(this).data('tab-id');

        /* 즐겨찾기 상태 확인 후 메뉴 텍스트 변경 */
        var tab = tabs.find(function(t){ return t.id === ctxTabId; });
        if (tab) {
            var menu = findMenuByUrl(tab.url);
            if (menu && menu.menuId) {
                $.get('/paragon/menu-favorite/' + menu.menuId + '/exists', function(isFav) {
                    var $favItem = $ctxMenu.find('[data-action="favorite"]');
                    var $icon = $favItem.find('i, svg').first();
                    if (isFav) {
                        $icon.replaceWith('<i class="fa-solid fa-star"></i>');
                        $favItem.find('.fav-text').text('즐겨찾기 해제');
                    } else {
                        $icon.replaceWith('<i class="fa-regular fa-star"></i>');
                        $favItem.find('.fav-text').text('즐겨찾기 등록');
                    }
                    $favItem.show();
                });
            } else {
                $ctxMenu.find('[data-action="favorite"]').hide();
            }
        }

        $ctxMenu.css({ top: e.pageY, left: e.pageX }).addClass('visible');
    });

    $ctxMenu.on('click', 'li', function() {
        var action = $(this).data('action');
        if (action === 'close' && ctxTabId) {
            closeTab(ctxTabId);
        } else if (action === 'closeAll') {
            closeAllTabs();
        } else if (action === 'favorite' && ctxTabId) {
            var tab = tabs.find(function(t){ return t.id === ctxTabId; });
            if (tab) {
                var menu = findMenuByUrl(tab.url);
                if (menu && menu.menuId) {
                    var isFav = $ctxMenu.find('[data-action="favorite"] .fav-text').text() === '즐겨찾기 해제';
                    if (isFav) {
                        $.ajax({ url: '/paragon/menu-favorite/' + menu.menuId, type: 'DELETE' });
                    } else {
                        $.ajax({ url: '/paragon/menu-favorite/' + menu.menuId, type: 'POST' });
                    }
                }
            }
        }
        $ctxMenu.removeClass('visible');
        ctxTabId = null;
    });

    $(document).on('click contextmenu', function(e) {
        if (!$(e.target).closest('#tabContextMenu').length) {
            $ctxMenu.removeClass('visible');
        }
    });

    return { openTab: openTab, closeTab: closeTab, closeAllTabs: closeAllTabs };
})();
// SCBCHANGE_20260306 END
