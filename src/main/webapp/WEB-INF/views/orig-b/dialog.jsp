<%@ page pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglibs.jspf"%>
<%-- ② KSIS-B 원래 — 알림 · 확인 창. 브라우저 기본 alert() / confirm()(약 48곳) + 두 번 누르기 삭제 버튼(DocumentWrite.razor "한 번 더 누르면 삭제") --%>
<!DOCTYPE html>
<html lang="ko">
<head>
<%@ include file="/WEB-INF/views/orig-b/_head.jspf"%>
</head>
<body style="background:#fff">
<div class="demo-page">
	<div class="demo-sec">
		<p class="demo-h"><b>44번</b> 브라우저 기본 창 : 모양은 브라우저가 정함(색 · 글꼴 · 위치를 바꿀 수 없음) · 제목 줄에 주소가 나옴</p>
		<div class="demo-line">
			<button class="btn btn-primary" onclick="alert('저장되었습니다.')">알림 창</button>
			<button class="btn btn-danger" onclick="document.getElementById('dlgResult').textContent = confirm('선택한 문서 3건을 삭제하시겠습니까?') ? '[확인] → 삭제' : '[취소]'">삭제</button>
			<span class="demo-tip" id="dlgResult" style="margin:0 0 0 8px"></span>
		</div>
	</div>
	<div class="demo-sec">
		<p class="demo-h"><b>44번</b> 두 번 누르기 : [테이블 삭제] → 글자가 [한 번 더 누르면 삭제]로 바뀌고 한 번 더 누르면 실행(3초 지나면 되돌아감)</p>
		<button class="btn btn-danger docform-footer-btn" id="armBtn">테이블 삭제</button>
	</div>
	<div class="demo-sec">
		<p class="demo-h">브라우저 기본 확인 창 모양(크롬 · 엣지 예시 그림)</p>
		<div style="width:448px;padding:22px 24px 18px;border-radius:8px;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,.28);font:13px/1.5 system-ui,sans-serif;color:#202124">
			<div style="font-size:14px;margin-bottom:14px">localhost:8090 내용:</div>
			<div style="margin-bottom:22px">선택한 문서 3건을 삭제하시겠습니까?</div>
			<div style="display:flex;justify-content:flex-end;gap:8px">
				<span style="padding:7px 16px;border:1px solid #DADCE0;border-radius:18px;color:#1A73E8">취소</span>
				<span style="padding:7px 16px;border-radius:18px;background:#1A73E8;color:#fff">확인</span>
			</div>
		</div>
	</div>
</div>
<script>
(function () {
	var b = document.getElementById('armBtn'), armed = false, t;
	b.onclick = function () {
		if (!armed) { armed = true; b.textContent = '한 번 더 누르면 삭제'; t = setTimeout(function () { armed = false; b.textContent = '테이블 삭제'; }, 3000); }
		else { clearTimeout(t); armed = false; b.textContent = '삭제됨'; setTimeout(function () { b.textContent = '테이블 삭제'; }, 1200); }
	};
})();
</script>
</body>
</html>
