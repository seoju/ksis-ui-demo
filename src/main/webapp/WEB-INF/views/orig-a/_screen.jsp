<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ① KSIS-A 원래 — 탭 하나에 불러오는 업무 화면 조각. designtemplate/list.jsp · filter.jsp 와 같은 클래스 --%>
<div class="work-wrap-v2">
	<div class="page-header-v2">
		<div>
			<div class="page-title-v2"><c:out value="${title}"/></div>
			<div class="page-sub-v2">KSIS-A 화면 제목 아래 설명 줄(page-sub-v2)</div>
		</div>
	</div>
	<div class="filter-bar-v2">
		<form class="filter-form-v2" onsubmit="return false;">
			<div class="filter-group-v2">
				<span class="filter-label-v2">고객사</span>
				<select class="filter-input-v2"><option value="">전체</option><option>현대자동차</option><option>기아</option><option>현대모비스</option></select>
			</div>
			<div class="filter-divider-v2"></div>
			<div class="filter-group-v2">
				<span class="filter-label-v2">품번</span>
				<input type="text" class="filter-input-v2">
			</div>
		</form>
		<div class="filter-actions-v2">
			<button type="button" class="page-btn btn-ghost"><i class="fa-solid fa-rotate"></i> 초기화</button>
			<button type="button" class="page-btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i> 조회</button>
		</div>
	</div>
	<div class="table-card-v2">
		<div class="table-toolbar-v2">
			<div class="table-toolbar-left-v2">
				<span class="table-title-v2">목록</span>
				<span class="count-badge-v2">${fn:length(rows)}건</span>
			</div>
			<div class="table-toolbar-right-v2">
				<button type="button" class="page-btn btn-ghost"><i class="fa-regular fa-file-excel"></i> Excel</button>
				<button type="button" class="page-btn btn-primary"><i class="fa-solid fa-plus"></i> 신규</button>
			</div>
		</div>
		<div class="table-inner-wrap">
			<table class="tbl_list">
				<colgroup><col style="width:6%"><col style="width:16%"><col style="width:16%"><col><col style="width:12%"><col style="width:14%"><col style="width:12%"></colgroup>
				<thead><tr><th>No</th><th>K품번</th><th>고객품번</th><th>고객사</th><th>차종</th><th>수량</th><th>등록일</th></tr></thead>
				<tbody>
				<c:forEach var="r" items="${rows}">
					<tr><td>${r.no}</td><td class="mono">${r.kPart}</td><td class="mono">${r.custPart}</td><td>${r.customer}</td><td>${r.carType}</td><td class="num">${r.qty}</td><td class="nowrap">${r.date}</td></tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
	</div>
</div>
