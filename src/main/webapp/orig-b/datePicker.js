// ✅ 초록 달력 버튼 클릭 시, 화면에는 안 보이게 숨겨둔 <input type="date">의
//    네이티브 달력 팝업을 강제로 띄워주는 헬퍼.
//    (숨긴 input을 CSS로 완전히 감추면서도, 클릭 없이 프로그램적으로
//    달력을 열 수 있어 "년-월-일" 형태의 중복 박스가 화면에 남지 않는다.)
window.datePickerInterop = {
    show: function (el) {
        if (!el) return;
        try {
            if (typeof el.showPicker === "function") {
                el.showPicker();
            } else {
                el.focus();
            }
        } catch (e) {
            el.focus();
        }
    }
}