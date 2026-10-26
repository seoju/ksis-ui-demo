<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%--
  ② KSIS-B 원래 — 그리드. app.css 의 table.app-grid · .data-grid + KSIS_B wwwroot 의 partNumberTools.js · columnResize.js · gridPaste.js 원본 그대로.
  B 는 쪽 넘김 · 붙여넣은 값 저장을 C#(.NET)이 하므로 그 부분만 아래 짧은 JS 로 흉내 냈다(dotNetRef 자리에 같은 이름의 함수).
--%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-b/_head.jspf"%>
<script src="<c:url value='/orig-b/partNumberTools.js'/>"></script>
<script src="<c:url value='/orig-b/columnResize.js'/>"></script>
<script src="<c:url value='/orig-b/gridPaste.js'/>"></script>
<style>
	/* SalesPerformanceByPart.razor 안의 <style> 중 데이터형 표 · 열 폭 손잡이 부분 그대로 */
	.sp-compact-table { table-layout: fixed; min-width: max-content; }
	.sp-compact-table th, .sp-compact-table td { text-align: center !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	table.app-grid.sp-compact-table td { height: var(--data-row-height); box-sizing: border-box; padding: 4px 6px; font-size: var(--data-row-font); line-height: 1.35; }
	table.app-grid.sp-compact-table th { position: relative; padding: 4px 10px 4px 6px; font-size: 11.5px; line-height: 1.25; }
	.sp-compact-table th .col-resizer { position: absolute; top: 0; right: 0; bottom: 0; width: 7px; cursor: col-resize; user-select: none; }
	.sp-compact-table th .col-resizer:hover { background: rgba(41, 98, 227, 0.25); }
	.sp-compact-table.col-resizing { cursor: col-resize; user-select: none; }
</style>
</head>
<body style="background:#fff">
<div class="demo-page">

	<div class="demo-sec">
		<p class="demo-h"><b>28~36번</b> 조회 표(table.app-grid) : 칸 클릭 = 활성 칸(초록 테두리) · 끌어서 영역 선택 · Ctrl+C · 방향키 이동 · 쪽 넘김은 검색줄 오른쪽 [이전]/[다음] · 15건씩</p>
		<div class="list-toolbar">
			<h2 class="page-title">품번별 매출 실적</h2>
			<span class="vform-muted toolbar-count-box">
				<span class="toolbar-info">총 ${fn:length(rows)}건</span>
				<span class="toolbar-count-sub" id="bRange"></span>
			</span>
			<div class="toolbar-actions"><button class="btn btn-primary btn-sm">엑셀 다운로드</button></div>
		</div>
		<div class="data-options search-area">
			<div class="data-options-left">
				<label>K품번</label>
				<input class="text-input" style="width:200px;" />
			</div>
			<div class="search-area-right">
				<div class="seg-stack">
					<button type="button" class="seg-stack-btn" id="bPrev">← 이전</button>
					<button type="button" class="seg-stack-btn" id="bNext">다음 →</button>
				</div>
			</div>
		</div>
		<table class="app-grid" id="bList">
			<thead><tr><th>No</th><th>K품번</th><th>고객품번</th><th>고객사</th><th>차종</th><th>품목</th><th>수량</th><th>금액</th><th>담당</th><th>등록일</th></tr></thead>
			<tbody>
			<c:forEach var="r" items="${rows}">
				<tr class="${r.no % 4 == 1 ? 'row-clickable' : ''}">
					<td>${r.no}</td><td>${r.kPart}</td><td>${r.custPart}</td><td>${r.customer}</td><td>${r.carType}</td><td>${r.item}</td>
					<td style="text-align:right">${r.qty}</td><td style="text-align:right">${r.amount}</td><td>${r.owner}</td><td>${r.date}</td>
				</tr>
			</c:forEach>
			</tbody>
		</table>
		<p class="demo-tip">손가락 커서는 눌러서 무언가 열리는 행(.row-clickable, 여기서는 1 · 5 · 9 …번 행)에만. 열 폭 손잡이는 아래 데이터형 표에만 있다.</p>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>31 · 33번</b> 데이터형 표(32px · 12px, SalesPerformanceByPart) : 머리글 오른쪽 끝을 끌어 열 폭 조절(원래는 폭을 기억)</p>
		<div style="overflow-x:auto">
			<table class="app-grid sp-compact-table" id="bCompact">
				<colgroup><col style="width:90px"><col style="width:130px"><col style="width:130px"><col style="width:120px"><col style="width:90px"><col style="width:110px"></colgroup>
				<thead><tr><th>년월<span class="col-resizer" title="끌어서 열 폭 조절"></span></th><th>K품번<span class="col-resizer" title="끌어서 열 폭 조절"></span></th><th>고객품번<span class="col-resizer" title="끌어서 열 폭 조절"></span></th><th>판매처<span class="col-resizer" title="끌어서 열 폭 조절"></span></th><th>수량<span class="col-resizer" title="끌어서 열 폭 조절"></span></th><th>금액<span class="col-resizer" title="끌어서 열 폭 조절"></span></th></tr></thead>
				<tbody>
				<c:forEach var="r" items="${rows}" end="5">
					<tr><td>2026-0${r.no}</td><td>${r.kPart}</td><td>${r.custPart}</td><td>${r.customer}</td><td>${r.qty}</td><td>${r.amount}</td></tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>30 · 37번</b> 입력 표(.data-grid, 중장기 매출 작성) : 칸을 한 번 누르고 Ctrl+V(행 수가 다르면 브라우저 확인 창) · 두 번 누르면 편집(편집 칸 모양은 화면마다 다름)</p>
		<div class="data-grid-wrapper">
			<textarea id="bEditPasteCatcher" class="grid-paste-catcher" tabindex="-1"></textarea>
			<table class="app-grid data-grid" id="bEdit">
				<thead><tr><th>K품번</th><th>품목</th><th>2027</th><th>2028</th><th>2029</th></tr></thead>
				<tbody>
				<c:forEach var="i" begin="0" end="4">
					<tr>
						<td class="grid-cell align-center" tabindex="0" data-row="${i}" data-col="0">${rows[i].kPart}</td>
						<td class="grid-cell align-center" tabindex="0" data-row="${i}" data-col="1">${rows[i].item}</td>
						<c:forEach var="c" begin="2" end="4">
							<td class="grid-cell align-right${i == 2 && c == 3 ? ' invalid-cell' : ''}" tabindex="0" data-row="${i}" data-col="${c}">${i == 2 && c == 3 ? '12,3x' : (i + 1) * 1000 + c * 10}</td>
						</c:forEach>
					</tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
	</div>
</div>

<script>
(function () {
	// 쪽 넘김 흉내(B 는 C# 이 15건씩 잘라 그린다)
	var tbody = document.querySelector('#bList tbody');
	var all = Array.prototype.slice.call(tbody.rows), size = 15, page = 0, pages = Math.ceil(all.length / size);
	function draw() {
		tbody.innerHTML = '';
		all.slice(page * size, page * size + size).forEach(function (r) { tbody.appendChild(r); });
		document.getElementById('bRange').textContent = (page * size + 1) + '~' + Math.min(all.length, page * size + size) + ' (페이지 ' + (page + 1) + ' / ' + pages + ')';
		document.getElementById('bPrev').disabled = page === 0;
		document.getElementById('bNext').disabled = page + 1 >= pages;
	}
	document.getElementById('bPrev').onclick = function () { page--; draw(); };
	document.getElementById('bNext').onclick = function () { page++; draw(); };
	draw();

	// 열 폭 : C#(GridColumnWidthState) 대신 아무 일도 안 하는 대상
	columnResizeInterop.register(document.getElementById('bCompact'), { invokeMethodAsync: function () { return Promise.resolve(); } });

	// 입력 표 : DocumentWrite.razor 의 OnCellClick / OnPasteData 흉내
	var edit = document.getElementById('bEdit');
	function cell(r, c) { return edit.querySelector('td[data-row="' + r + '"][data-col="' + c + '"]'); }
	gridPasteInterop.register('bEdit', {
		invokeMethodAsync: function (name, a, b, c) {
			if (name === 'OnPasteData') {
				c.split('\n').forEach(function (line, r) { line.split('\t').forEach(function (v, k) { var td = cell(a + r, b + k); if (td) td.textContent = v.trim(); }); });
			}
			return Promise.resolve();
		}
	});
	edit.addEventListener('click', function (e) {
		var td = e.target.closest('td.grid-cell'); if (!td) return;
		edit.querySelectorAll('.selected-cell').forEach(function (x) { x.classList.remove('selected-cell'); });
		td.classList.add('selected-cell');
		gridPasteInterop.selectCell('bEdit', +td.dataset.row, +td.dataset.col);
	});
	edit.addEventListener('dblclick', function (e) {
		var td = e.target.closest('td.grid-cell'); if (!td || td.querySelector('input')) return;
		var v = td.textContent; td.className = td.className.replace('grid-cell', '').trim(); td.textContent = '';
		var inp = document.createElement('input'); inp.className = 'grid-cell-input ' + (td.classList.contains('align-right') ? 'align-right' : 'align-center');
		inp.value = v; td.appendChild(inp); inp.focus(); inp.select();
		inp.onblur = function () { td.textContent = inp.value; td.classList.add('grid-cell'); };
	});
})();
</script>
</body>
</html>
