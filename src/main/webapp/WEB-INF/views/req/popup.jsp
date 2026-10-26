<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ③④ 요구사항 — 업무 팝업 [비교표 43번]. 크기 · 머리줄 · 버튼줄은 A 신규(ksis-pop), 바깥 모양 · 줄 · 색은 B --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/req/_head.jspf"%>
</head>
<body>
<%@ include file="/WEB-INF/views/req/_icons.jspf"%>
<div class="demo-page">
	<div class="demo-sec">
		<p class="demo-h"><b>43번</b> 업무 팝업 : 폭 1100 / 700 / 500 / 450 고정 · 머리줄을 잡고 끌어 옮김 · ✕ · Esc 로 닫힘 · 3. 파일 업로드는 탐색기에서 파일을 끌어다 놓기 또는 [파일 선택]<c:if test="${theme == 'b'}"> · ⛶ 전체 화면(KSIS-B 만)</c:if></p>
		<div class="demo-line">
			<button type="button" class="k-btn k-btn-primary" onclick="ksis.modal.open('popL')">대 1100</button>
			<button type="button" class="k-btn k-btn-ghost" onclick="ksis.modal.open('popM')">중 700</button>
			<button type="button" class="k-btn k-btn-ghost" onclick="ksis.modal.open('popS')">소 500</button>
		</div>
	</div>
	<c:if test="${theme != 'b'}">
	<%-- [27번] KSIS-A 만 : 같은 작성창이라도 결재자가 열면 확인창처럼 주 버튼(승인)에 포커스. KSIS-B 는 결재 단계가 없어 해당 없음 --%>
	<div class="demo-sec">
		<p class="demo-h"><b>27번 (KSIS-A 만)</b> 같은 작성창 : 상신한 사람이 열면 첫 작성 항목에 포커스 · 중간 결재자 · 최종 결재자가 열면 [승인]에 포커스(확인창처럼, 바로 Enter = 승인)</p>
		<div class="demo-line">
			<button type="button" class="k-btn k-btn-ghost" onclick="ksis.modal.open('popL')">상신자로 열기</button>
			<button type="button" class="k-btn k-btn-ghost" id="btnOpenApprove" onclick="ksis.modal.open('popApprove', { focus: 'button' })">결재자로 열기</button>
		</div>
	</div>
	</c:if>
</div>

<div class="k-modal" id="popL" hidden>
	<div class="k-pop">
		<div class="k-pop-header">
			<div class="k-pop-title">가격 변경 작성</div>
			<%-- 전체 화면 버튼은 KSIS-B 만 둔다(비교표 43번 B 메모 "지금 있는 전체 화면 버튼은 유지") --%>
			<c:if test="${theme == 'b'}"><button type="button" class="k-pop-full" title="전체 화면">⛶</button></c:if>
			<button type="button" class="k-pop-close" title="닫기">✕</button>
		</div>
		<div class="k-pop-body">
			<div class="k-section">
				<p class="k-section-title">1. 기초 정보</p>
				<table class="k-field">
					<colgroup><col class="k-label-col"><col><col class="k-label-col"><col></colgroup>
					<tr><th>등록일</th><td><span class="k-date"><input type="text" class="k-input" value="2026-10-26"><button type="button" class="k-date-btn" tabindex="-1" title="달력"><svg class="k-ico"><use href="#i-cal"/></svg></button></span></td>
						<th>고객사</th><td><select class="k-select" data-placeholder="고객사 선택"><option>현대자동차</option><option>기아</option><option>현대모비스</option></select></td></tr>
					<tr><th>품목군</th><td><input type="text" class="k-input" value="ECU" readonly></td>
						<th>프로젝트</th><td><input type="text" class="k-input" value="NE1 HEV"></td></tr>
				</table>
			</div>
			<div class="k-section">
				<p class="k-section-title">2. 가격 정보</p>
				<table class="k-field">
					<colgroup><col class="k-label-col"><col><col class="k-label-col"><col></colgroup>
					<tr><th>K품번</th><td><input type="text" class="k-input" value="39100-10000"></td>
						<th>고객품번</th><td><input type="text" class="k-input" value="A1000-NE1"></td></tr>
					<tr><th>현재 단가</th><td><input type="text" class="k-input" value="15,000" readonly style="text-align:right"></td>
						<th>변경 단가</th><td><input type="text" class="k-input" value="14,550" style="text-align:right"></td></tr>
					<tr><th>변경 사유</th><td colspan="3"><textarea class="k-input">약정 인하 3% (2027년 1월 적용)</textarea></td></tr>
				</table>
			</div>
			<div class="k-section">
				<p class="k-section-title">3. 파일 업로드</p>
				<table class="k-field">
					<colgroup><col class="k-label-col"><col></colgroup>
					<%-- [43번] 파일 업로드 : 끌어다 놓기 + 파일 선택(ksis-file.js). 칸 밖에 놓으면 아무 일 없음 --%>
					<tr><th>첨부</th><td><div class="k-file" data-name="attach" data-accept=".xlsx,.xls,.pdf,.png,.jpg" data-max-mb="20"><input type="file" multiple></div></td></tr>
				</table>
			</div>
		</div>
		<div class="k-pop-footer">
			<button type="button" class="k-btn k-btn-ghost" data-modal-close>취소</button>
			<button type="button" class="k-btn k-btn-primary">저장</button>
		</div>
	</div>
</div>

<c:if test="${theme != 'b'}">
<div class="k-modal" id="popApprove" hidden>
	<div class="k-pop k-pop-m">
		<div class="k-pop-header"><div class="k-pop-title">가격 변경 결재</div><button type="button" class="k-pop-close" title="닫기">✕</button></div>
		<div class="k-pop-body">
			<table class="k-field">
				<colgroup><col class="k-label-col"><col></colgroup>
				<tr><th>상신자</th><td><input type="text" class="k-input" value="K123456 영업인원" readonly></td></tr>
				<tr><th>K품번</th><td><input type="text" class="k-input" value="39100-10000" readonly></td></tr>
				<tr><th>변경 단가</th><td><input type="text" class="k-input" value="15,000 → 14,550" readonly></td></tr>
				<tr><th>결재 의견</th><td><textarea class="k-input" placeholder="필요할 때만 적음"></textarea></td></tr>
			</table>
		</div>
		<div class="k-pop-footer"><button type="button" class="k-btn k-btn-ghost" data-modal-close>반려</button><button type="button" class="k-btn k-btn-primary" onclick="ksis.modal.close('popApprove'); ksis.showAlert('승인했습니다.')">승인</button></div>
	</div>
</div>
</c:if>

<div class="k-modal" id="popM" hidden>
	<div class="k-pop k-pop-m">
		<div class="k-pop-header"><div class="k-pop-title">고객사 선택</div><button type="button" class="k-pop-close" title="닫기">✕</button></div>
		<div class="k-pop-body">
			<table class="k-field">
				<colgroup><col class="k-label-col"><col></colgroup>
				<tr><th>고객사</th><td><select class="k-select" data-placeholder="고객사 선택"><option>현대자동차</option><option>기아</option></select></td></tr>
				<tr><th>담당</th><td><input type="text" class="k-input"></td></tr>
			</table>
		</div>
		<div class="k-pop-footer"><button type="button" class="k-btn k-btn-ghost" data-modal-close>취소</button><button type="button" class="k-btn k-btn-primary">확인</button></div>
	</div>
</div>

<div class="k-modal" id="popS" hidden>
	<div class="k-pop k-pop-s">
		<div class="k-pop-header"><div class="k-pop-title">메모</div><button type="button" class="k-pop-close" title="닫기">✕</button></div>
		<div class="k-pop-body">
			<table class="k-field">
				<colgroup><col class="k-label-col"><col></colgroup>
				<tr><th>메모</th><td><textarea class="k-input"></textarea></td></tr>
			</table>
		</div>
		<div class="k-pop-footer"><button type="button" class="k-btn k-btn-ghost" data-modal-close>취소</button><button type="button" class="k-btn k-btn-primary">저장</button></div>
	</div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function () { if (location.hash !== '#closed') ksis.modal.open('popL'); });
</script>
</body>
</html>
