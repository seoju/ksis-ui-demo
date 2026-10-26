<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ③④ 요구사항 — 알림 · 확인 창 [비교표 44번]. ksis.showAlert / ksis.showConfirm (biz.showAlert / biz.showConfirm 과 부르는 방법이 같다) --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/req/_head.jspf"%>
</head>
<body>
<%@ include file="/WEB-INF/views/req/_icons.jspf"%>
<div class="demo-page">
	<div class="demo-sec">
		<p class="demo-h"><b>44번</b> 공통 알림 · 확인 창 : 폭 450 · 가운데 아이콘 + 메시지 · [취소] [확인] 가운데 · 모서리 16 · 뒤 45% · Esc · ✕ 로 닫힘 · 위쪽을 잡고 끌어 옮김 · 열리면 [확인]에 포커스</p>
		<div class="demo-line">
			<button type="button" class="k-btn k-btn-primary" id="btnAlert">알림 창</button>
			<button type="button" class="k-btn k-btn-danger" id="btnConfirm">삭제</button>
			<span class="demo-tip" id="dlgResult" style="margin:0 0 0 8px"></span>
		</div>
		<p class="demo-tip">KSIS-B 의 브라우저 기본 alert() · confirm() 과 [삭제] → [한 번 더 누르면 삭제] 두 번 누르기도 이 창으로 바꾼다.</p>
	</div>
</div>
<script>
(function () {
	var out = document.getElementById('dlgResult');
	document.getElementById('btnAlert').onclick = function () {
		ksis.showAlert('저장되었습니다.', function () { out.textContent = '알림 창 닫힘'; });
	};
	document.getElementById('btnConfirm').onclick = function () {
		ksis.showConfirm('선택한 문서 3건을 삭제하시겠습니까?', function () { out.textContent = '[확인] → 삭제'; }, function () { out.textContent = '[취소]'; });
	};
	document.addEventListener('DOMContentLoaded', function () { if (location.hash !== '#closed') document.getElementById('btnConfirm').click(); });
})();
</script>
</body>
</html>
