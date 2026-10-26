<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ① KSIS-A 원래 — 알림 · 확인 창. paragon/biz.default.js 의 biz.showAlert / biz.showConfirm 원본 그대로 --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-a/_head.jspf"%>
</head>
<body>
<div class="contens-wrap" style="max-height:none">
<div class="demo-page" style="padding-left:0">
	<div class="demo-sec">
		<p class="demo-h"><b>44번</b> biz.showAlert / biz.showConfirm : 가운데 아이콘(안내 파랑 · 질문 주황) + 14px 메시지 · 가운데 [취소][확인] · Esc 로 닫힘 · 끌어 옮기기</p>
		<div class="demo-line">
			<button type="button" class="page-btn btn-primary" id="btnAlert">알림 창</button>
			<button type="button" class="page-btn btn-danger" id="btnConfirm"><i class="fa-solid fa-trash"></i> 삭제</button>
			<span class="demo-tip" id="dlgResult" style="margin:0 0 0 8px"></span>
		</div>
	</div>
</div>
</div>
<script>
$(function () {
	var out = $('#dlgResult');
	$('#btnAlert').on('click', function () { biz.showAlert('저장되었습니다.', function () { out.text('알림 창 닫힘'); }); });
	$('#btnConfirm').on('click', function () {
		biz.showConfirm('선택한 문서 3건을 삭제하시겠습니까?', function () { out.text('[확인] → 삭제'); }, function () { out.text('[취소]'); });
	});
	if (location.hash !== '#closed') $('#btnConfirm').trigger('click');
});
</script>
</body>
</html>
