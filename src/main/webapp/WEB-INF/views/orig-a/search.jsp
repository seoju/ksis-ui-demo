<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ① KSIS-A 원래 — 검색 영역 · 입력칸. designtemplate/filter.jsp · input.jsp 와 같은 클래스(filter-bar-v2 · filter-input-v2 · form-control · fm_radio) --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-a/_head.jspf"%>
</head>
<body>
<div class="contens-wrap" style="max-height:none">
<div class="demo-page" style="padding-left:0">

	<div class="demo-sec">
		<p class="demo-h"><b>38번</b> 필터바(filter-bar-v2) : 흰 카드 · 모서리 12 · 그림자 · 라벨 왼쪽 · 조건 사이 구분선 · 버튼 오른쪽 끝 · 넘치면 줄바꿈</p>
		<div class="filter-bar-v2">
			<form class="filter-form-v2" onsubmit="return false;">
				<div class="filter-group-v2">
					<span class="filter-label-v2">기간</span>
					<input type="date" class="filter-input-v2" value="2026-09-01">
					<span class="filter-label-v2">~</span>
					<input type="date" class="filter-input-v2" value="2026-10-26">
				</div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2">
					<span class="filter-label-v2">고객사</span>
					<select class="filter-input-v2"><option value="">전체</option><option>현대자동차</option><option>기아</option></select>
				</div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2">
					<span class="filter-label-v2">K품번</span>
					<input type="text" class="filter-input-v2" placeholder="K품번 일부">
				</div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2">
					<label class="fm_checkbox">본인 기준 조회<input type="checkbox" checked><span class="checkmark"></span></label>
				</div>
			</form>
			<div class="filter-actions-v2">
				<button type="button" class="page-btn btn-ghost"><i class="fa-solid fa-rotate"></i> 초기화</button>
				<button type="button" class="page-btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i> 조회</button>
			</div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>38번</b> 좁은 창 : 줄이 바뀐다(.nowrap 을 붙이면 한 줄 고정)</p>
		<div class="filter-bar-v2" style="width:620px">
			<form class="filter-form-v2" onsubmit="return false;">
				<div class="filter-group-v2"><span class="filter-label-v2">고객사</span><select class="filter-input-v2"><option>전체</option></select></div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2"><span class="filter-label-v2">K품번</span><input type="text" class="filter-input-v2"></div>
				<div class="filter-divider-v2"></div>
				<div class="filter-group-v2"><span class="filter-label-v2">고객품번</span><input type="text" class="filter-input-v2"></div>
			</form>
			<div class="filter-actions-v2"><button type="button" class="page-btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i> 조회</button></div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>39번</b> 입력칸 : 새 filter-input-v2(34px · 1.5px · #FAFAFA · 누르면 파랑) · 구형 form-control(36px · 모서리 2 · 15px)</p>
		<div class="demo-line">
			<input type="text" class="filter-input-v2" value="평소">
			<input type="text" class="filter-input-v2 demo-focus" value="누른 상태">
			<input type="text" class="form-control" value="구형 form-control" style="width:180px;flex:none">
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>40번</b> 드롭다운 : select(자체 화살표) · 자동완성(jQuery UI, .custom-autocomplete 목록)</p>
		<div class="demo-line" style="align-items:flex-start;min-height:190px">
			<select class="filter-select-v2" style="height:34px;width:200px"><option>선택하세요</option><option>2026 상반기 중장기 매출</option></select>
			<input type="text" class="filter-input-v2" id="aAuto" placeholder="고객사 두 글자" value="현대" style="width:220px">
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>41번</b> 날짜 : 브라우저 기본 날짜 칸(type="date"). 달력은 브라우저가 그림 · yyyyMMdd 직접 입력 불가</p>
		<div class="demo-line">
			<input type="date" class="filter-input-v2" value="2026-10-26">
			<span>~</span>
			<input type="date" class="filter-input-v2">
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>42번</b> 모드 버튼 부품 없음 → 동그라미 선택(fm_radio) · 보기 전환(seg_toggle)</p>
		<div class="demo-line">
			<div class="fm_radio_box">
				<label class="fm_radio">국내<input type="radio" name="aRegion" checked><span class="checkmark"></span></label>
				<label class="fm_radio">해외<input type="radio" name="aRegion"><span class="checkmark"></span></label>
			</div>
			<div class="seg_toggle" style="margin-left:20px">
				<button type="button" class="seg_btn on">일</button><button type="button" class="seg_btn">월</button><button type="button" class="seg_btn">년</button>
			</div>
		</div>
	</div>
</div>
</div>
<style>.filter-input-v2.demo-focus { border-color: #0082c7; background: #FFFFFF; }</style>
<script>
$(function () {
	$('#aAuto').autocomplete({
		source: ['현대자동차', '현대모비스', '현대케피코', '현대위아', '기아'],
		minLength: 2,
		classes: { 'ui-autocomplete': 'custom-autocomplete' }
	});
	if (location.hash !== '#closed') $('#aAuto').autocomplete('search', '현대');
	$('.seg_toggle').on('click', '.seg_btn', function () { $(this).addClass('on').siblings().removeClass('on'); });
});
</script>
</body>
</html>
