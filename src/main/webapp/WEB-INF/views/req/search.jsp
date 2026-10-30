<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ③④ 요구사항 — 검색 영역 · 입력칸 [비교표 38~42 · 50번] --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/req/_head.jspf"%>
</head>
<body>
<%@ include file="/WEB-INF/views/req/_icons.jspf"%>
<div class="demo-page">

	<div class="demo-sec">
		<p class="demo-h"><b>38 · 42번</b> 검색 영역 : 회색 상자 46px 한 줄 · [모드 버튼] · 조건 · [검색] [해제] · 같은 것끼리 6px(라벨 ↔ 입력칸, 날짜 ~ 날짜, [검색] ↔ [해제]) · 다른 것끼리 12px(입력칸 → 다음 라벨, 마지막 입력칸 → [검색])</p>
		<div class="k-search">
			<div class="k-seg" data-name="region">
				<button type="button" class="k-seg-btn selected" data-value="KR">국내</button>
				<button type="button" class="k-seg-btn" data-value="OV">해외</button>
			</div>
			<label>매출 기간</label>
			<span class="k-date"><input type="text" class="k-input" name="fromDate" value="20260901"><button type="button" class="k-date-btn" tabindex="-1" title="달력"><svg class="k-ico"><use href="#i-cal"/></svg></button></span>
			<span class="k-tilde">~</span>
			<span class="k-date"><input type="text" class="k-input" name="toDate" value="2026.10.26"><button type="button" class="k-date-btn" tabindex="-1" title="달력"><svg class="k-ico"><use href="#i-cal"/></svg></button></span>
			<label>고객사</label>
			<select class="k-select" name="customer" data-empty>
				<option value="HMC">현대자동차</option><option value="KIA">기아</option><option value="MOBIS">현대모비스</option><option value="HMMA">HMMA</option><option value="KAGA">KaGA</option>
			</select>
			<label>K품번</label>
			<input type="text" class="k-input" name="kPart">
			<button type="button" class="k-btn k-btn-primary">검색</button>
			<button type="button" class="k-btn k-btn-ghost">해제</button>
		</div>
		<p class="demo-tip">버튼은 30px · 아이콘 없음 · 2글자. 이전/다음은 32번(표 아래 번호 페이지)을 따르므로 검색 영역에는 두지 않았다.</p>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>38번</b> 좁은 창 : 줄바꿈 없이 라벨 · 버튼 · 모드 버튼은 그대로, 입력칸만 줄어듦(최소 84px)</p>
		<div class="k-search" style="width:620px">
			<div class="k-seg">
				<button type="button" class="k-seg-btn selected" data-value="B">기본</button>
				<button type="button" class="k-seg-btn" data-value="U">상위포함</button>
			</div>
			<label>고객사</label>
			<select class="k-select"><option value="">전체</option><option>현대자동차</option><option>기아</option></select>
			<label>K품번</label>
			<input type="text" class="k-input">
			<label>고객품번</label>
			<input type="text" class="k-input">
			<button type="button" class="k-btn k-btn-primary">검색</button>
			<button type="button" class="k-btn k-btn-ghost">해제</button>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>39번</b> 입력칸 : 평소 · 누름(주색 테두리 + 3px 연한 빛) · 틀린 값</p>
		<div class="demo-line">
			<input type="text" class="k-input" value="평소" style="width:160px">
			<input type="text" class="k-input demo-focus" value="누른 상태" style="width:160px">
			<input type="text" class="k-input invalid" value="틀린 값" style="width:160px">
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>40번</b> 드롭다운 : 닫힌 상자는 B 모양 · 펼친 목록은 모서리 둥글게 + 그림자 · 올린 줄 = 주색 + 흰 글자 · 더미 선택지 · 회색 안내 글 없음(고르기 전엔 빈 상자, "전체"는 진짜 선택지)</p>
		<div class="demo-line" style="align-items:flex-start;min-height:190px">
			<select class="k-select" id="demoSelOpen" data-empty style="width:220px">
				<option>2026 상반기 중장기 매출</option><option>2026 하반기 중장기 매출</option><option>2027 중장기 매출</option><option>2028 중장기 매출</option>
			</select>
			<select class="k-select" style="width:160px"><option>현대자동차</option><option selected>기아</option><option>현대모비스</option></select>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>41번</b> 날짜 : 20261026 · 2026-10-26 · 2026.10.26 · 2026/10/26 모두 같은 날 → 칸을 떠나면 2026-10-26, 서버 값 20261026 · 그 달에 없는 일은 마지막 날로(2025-02-30 → 02-28, 2024-02-30 → 02-29, 2026-04-31 → 04-30) · Tab 은 달력 버튼에 멈추지 않음 · 달력 버튼은 입력칸 안 오른쪽 끝(20px)</p>
		<div class="demo-line" style="align-items:flex-start;min-height:300px">
			<span class="k-date" id="demoDateOpen"><input type="text" class="k-input" value="2026/10/26"><button type="button" class="k-date-btn" tabindex="-1" title="달력"><svg class="k-ico"><use href="#i-cal"/></svg></button></span>
			<span class="k-tilde" style="line-height:30px">~</span>
			<span class="k-date"><input type="text" class="k-input"><button type="button" class="k-date-btn" tabindex="-1" title="달력"><svg class="k-ico"><use href="#i-cal"/></svg></button></span>
			<input type="text" class="k-input" style="width:120px">
			<span class="demo-tip" id="demoDateVal" style="margin:7px 0 0 8px"></span>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>42번</b> 모드 버튼 : 2단 · 3단 (고른 쪽 = 주색 + 흰 글자, 한 번 클릭으로 바뀜)</p>
		<div class="demo-line">
			<div class="k-seg"><button type="button" class="k-seg-btn selected" data-value="ERP">ERP</button><button type="button" class="k-seg-btn" data-value="KPDM">KPDM</button></div>
			<div class="k-seg n3"><button type="button" class="k-seg-btn" data-value="D">일</button><button type="button" class="k-seg-btn selected" data-value="M">월</button><button type="button" class="k-seg-btn" data-value="Y">년</button></div>
		</div>
	</div>

	<div class="demo-sec">
		<p class="demo-h"><b>50번</b> 여러 개 고르는 드롭다운 : 닫힌 상자 · 펼친 상자 모양 · 줄 높이 · 올린 줄 색은 40번과 같음 · 고른 것은 한 줄 칩 + ×(긴 이름부터 줄여 한 칸에, 최소 앞 2글자, 그래도 넘치면 +N) · 찾기 · 전체 선택 · N개 선택 [취소] [확인] · 키보드는 엑셀 자동 필터 목록과 같게 · 확인 · Tab 은 다음 칸으로</p>
		<div class="k-search">
			<label>품목군</label>
			<select class="k-multi" name="grpSearch" multiple>
				<option value="G01" selected>ECU(가솔린)</option><option value="G02">ECU(디젤)</option><option value="G03" selected>TCU</option><option value="G04" selected>BMS</option><option value="G05">OBC</option><option value="G06">LDC</option><option value="G07">VCU</option><option value="G08">인젝터</option><option value="G09">연료펌프 모듈</option><option value="G10">산소센서</option><option value="G11">압력센서</option><option value="G12">점화코일</option><option value="G13">스로틀바디</option><option value="G14">전동식 워터펌프</option>
			</select>
			<label>고객사</label>
			<select class="k-select" data-empty>
				<option value="HMC">현대자동차</option><option value="KIA">기아</option><option value="MOBIS">현대모비스</option>
			</select>
			<button type="button" class="k-btn k-btn-primary">검색</button>
			<button type="button" class="k-btn k-btn-ghost">해제</button>
		</div>
		<p class="demo-tip">검색줄에서는 다른 칸과 같은 118px. 칩은 짧은 이름은 그대로, 긴 이름부터 같은 길이까지 줄여(…) 한 칸에 넣고, 칩마다 앞 2글자 + × 는 남긴다. 그래도 안 들어가면 뒤에서부터 감추고 "+N"(마우스를 올리면 고른 것 전부).</p>
		<p class="demo-tip" style="margin-top:14px">아래 작성 칸은 KSIS-A 출장보고 안건과 같은 규칙 : 업무 분류가 수주면 품목군 1개만(동그라미, 고르면 바로 닫힘, 여러 개를 골라 두었으면 첫 건만 남김), 가격 · 개발이면 여러 개.</p>
		<div style="min-height:430px;margin-top:6px">
			<table class="k-field" style="width:520px">
				<colgroup><col style="width:130px"><col></colgroup>
				<tr><th>업무 분류</th><td>
					<select class="k-select" id="demoBizType"><option value="ORD">수주</option><option value="PRI" selected>가격</option><option value="DEV">개발</option></select>
				</td></tr>
				<tr><th>품목군</th><td>
					<select class="k-multi" id="demoMsForm" name="itemGrp" multiple>
						<option value="G01">ECU(가솔린)</option><option value="G02">ECU(디젤)</option><option value="G03" selected>TCU</option><option value="G04">BMS</option><option value="G05" selected>OBC</option><option value="G06" selected>LDC</option><option value="G07" selected>VCU</option><option value="G08">인젝터</option><option value="G09">연료펌프 모듈</option><option value="G10">산소센서</option><option value="G11">압력센서</option><option value="G12">점화코일</option><option value="G13">스로틀바디</option><option value="G14">전동식 워터펌프</option>
					</select>
				</td></tr>
			</table>
		</div>
		<table class="demo-keys">
			<colgroup><col style="width:200px"><col><col style="width:250px"></colgroup>
			<thead><tr><th>키</th><th>동작(A · B 공통)</th><th>엑셀 자동 필터 목록</th></tr></thead>
			<tbody>
				<tr><td>Alt+↓ · ↓ · Enter · Space<br><small>(닫힌 상자에서)</small></td><td>펼침. 커서는 찾기 칸</td><td>Alt+↓ 로 펼침</td></tr>
				<tr><td>글자<br><small>(찾기 칸에서)</small></td><td>이름 일부로 목록을 좁힘(영문 대소문자 구분 없음)</td><td>찾기 칸</td></tr>
				<tr><td>↓<br><small>(찾기 칸에서)</small></td><td>목록 첫 줄(전체 선택)로</td><td>같음</td></tr>
				<tr><td>↑ ↓</td><td>한 줄 이동. 첫 줄에서 ↑ = 찾기 칸</td><td>같음</td></tr>
				<tr><td>Home · End</td><td>처음 · 끝 줄</td><td>같음</td></tr>
				<tr><td>PageUp · PageDown</td><td>한 화면씩</td><td>보이는 첫 · 끝 줄</td></tr>
				<tr><td>Space</td><td>체크 켜기 / 끄기. 전체 선택 줄은 지금 보이는 것 모두</td><td>같음((모두 선택) 포함)</td></tr>
				<tr><td>Enter · [확인]</td><td>확인 : 반영하고 닫은 뒤 다음 칸으로</td><td>같음(필터 적용)</td></tr>
				<tr><td>Esc · [취소]</td><td>취소 : 펼치기 전으로 되돌리고 닫음(커서는 이 칸 그대로)</td><td>같음</td></tr>
				<tr><td>Tab · Shift+Tab</td><td>확인과 같이 반영하고 다음 칸(Shift+Tab 은 앞 칸)으로</td><td>메뉴 안에서 돎</td></tr>
				<tr><td>글자<br><small>(목록에서)</small></td><td>찾기 칸으로 가서 이어 씀</td><td>없음(KSIS-A "타이핑해서 검색" 요청)</td></tr>
				<tr><td>바깥 누르기</td><td>확인과 같음(고른 것이 남음, KSIS-A 원래 부품과 같음)</td><td>취소</td></tr>
				<tr><td>하나만 고를 때</td><td>↑ ↓ 이동, Space · Enter 고르고 바로 닫힘(전체 선택 · [확인] 없음)</td><td>—</td></tr>
			</tbody>
		</table>
	</div>
</div>
<style>
	/* 시연용 : 누른 모양을 클릭 없이 보여 줌(같은 규칙) */
	.k-input.demo-focus { border-color: var(--k-primary); box-shadow: 0 0 0 3px var(--k-primary-soft); }
	/* 시연용 : 50번 키보드 표(KSIS 에 옮길 대상 아님) */
	.demo-keys { width: 100%; max-width: 860px; margin-top: 4px; border-collapse: collapse; font-size: 12.5px; color: var(--k-text); }
	.demo-keys th, .demo-keys td { padding: 6px 10px; border: 1px solid var(--k-list-border); text-align: left; vertical-align: middle; }
	.demo-keys th { background: #F7F8FA; font-weight: 700; }
	.demo-keys td:first-child { font-weight: 700; white-space: nowrap; }
	.demo-keys td:last-child { color: var(--k-text-sub); }
	.demo-keys small { font-weight: 400; color: var(--k-text-sub); }
</style>
<script>
document.addEventListener('DOMContentLoaded', function () {
	var v = document.getElementById('demoDateVal');
	var inp = document.querySelector('#demoDateOpen input');
	function show() { v.textContent = '서버로 보낼 값 : ' + (ksis.date.value(inp) || '(없음)'); }
	inp.addEventListener('change', show); inp.addEventListener('blur', show); show();
	// [50번] 업무 분류가 수주면 품목군 1개만, 가격 · 개발이면 여러 개(KSIS-A 출장보고 안건과 같은 규칙)
	var msForm = document.getElementById('demoMsForm');
	document.getElementById('demoBizType').addEventListener('change', function () { ksis.multi.setSingle(msForm, this.value === 'ORD'); });
	// 처음에 펼친 모양을 보여 준다(바깥을 누르면 닫힘)
	if (location.hash !== '#closed') {
		document.querySelector('#demoSelOpen').parentNode.querySelector('.k-select-box').click();
		document.querySelector('#demoDateOpen .k-date-btn').click();
		msForm.parentNode.querySelector('.k-ms-box').click();
	}
});
</script>
</body>
</html>
