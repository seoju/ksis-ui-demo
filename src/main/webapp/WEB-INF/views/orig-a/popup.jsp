<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ① KSIS-A 원래 — 업무 팝업. ksis/bus/dve/dveChgWrite.jsp 와 같은 마크업(.modal.size_l > .popup_layer.ksis-pop, 절 + field-table, pop_footer) --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-a/_head.jspf"%>
</head>
<body>
<div class="contens-wrap" style="max-height:none">
<div class="demo-page" style="padding-left:0">
	<div class="demo-sec">
		<p class="demo-h"><b>43번</b> 업무 팝업(ksis-pop) : 폭 고정 1100 · 흰 머리줄 + 왼쪽 파란 막대 5px · 머리줄을 잡고 끌어 옮김 · 아래 회색 버튼줄 50px · 모서리 없음</p>
		<button type="button" class="page-btn btn-primary" onclick="$('#aModal').addClass('show')"><i class="fa-solid fa-plus"></i> 신규</button>
	</div>
</div>
</div>
<div class="modal size_l show" id="aModal">
	<div class="popup_layer ksis-pop">
		<div class="pop_header">
			<div class="pop_header_ttl">가격 변경 작성</div>
			<button type="button" class="btn-close" onclick="$('#aModal').removeClass('show')">close</button>
		</div>
		<div class="pop_body">
			<div class="section">
				<p class="section-title">1. 기초 정보</p>
				<table class="field-table">
					<colgroup><col style="width:16%"><col style="width:34%"><col style="width:16%"><col style="width:34%"></colgroup>
					<tr><td class="label">등록일<span class="req">*</span></td><td><input type="date" value="2026-10-26"></td>
						<td class="label">고객사</td><td><select><option>선택하세요</option><option>현대자동차</option></select></td></tr>
					<tr><td class="label">품목군</td><td><input type="text" value="ECU" readonly></td>
						<td class="label">프로젝트</td><td><input type="text" value="NE1 HEV"><span class="field-hint">※ 프로젝트명은 수주 기준으로 입력합니다.</span></td></tr>
				</table>
			</div>
			<div class="section">
				<p class="section-title">2. 가격 정보</p>
				<table class="field-table">
					<colgroup><col style="width:16%"><col style="width:34%"><col style="width:16%"><col style="width:34%"></colgroup>
					<tr><td class="label">K품번</td><td><input type="text" value="39100-10000"></td><td class="label">고객품번</td><td><input type="text" value="A1000-NE1"></td></tr>
					<tr><td class="label">현재 단가</td><td><input type="text" value="15,000" readonly></td><td class="label">변경 단가</td><td><input type="text" value="14,550"></td></tr>
					<tr><td class="label">변경 사유</td><td colspan="3"><textarea>약정 인하 3% (2027년 1월 적용)</textarea></td></tr>
				</table>
			</div>
			<div class="section">
				<p class="section-title">3. 파일 업로드</p>
				<table class="field-table">
					<colgroup><col style="width:16%"><col></colgroup>
					<tr><td class="label">첨부</td><td><button type="button" class="inline-btn">파일 선택</button></td></tr>
				</table>
			</div>
		</div>
		<div class="pop_footer">
			<div class="btn_box">
				<div class="right">
					<button type="button" class="page-btn btn-ghost" onclick="$('#aModal').removeClass('show')">취소</button>
					<button type="button" class="page-btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> 저장</button>
				</div>
			</div>
		</div>
	</div>
</div>
<script>
// biz.ui.modalbuilder 의 setupDraggable 과 같이 머리줄을 잡고 끌기(jQuery UI)
$('#aModal .popup_layer').draggable({ handle: '.pop_header', containment: 'window' });
</script>
</body>
</html>
