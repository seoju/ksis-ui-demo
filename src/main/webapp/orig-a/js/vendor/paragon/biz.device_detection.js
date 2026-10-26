/**
 * 디바이스 감지 및 리디렉션 스크립트
 * 모바일 기기 및 태블릿을 감지하여 적절한 버전으로 리디렉션합니다.
 */


// 디바이스 타입을 감지하는 함수
function detectMobileDevice() {
    const ua = navigator.userAgent.toLowerCase();
    const isMobileMode = ua.includes("mobile");

    // 최신 아이패드 Air/Pro 감지 (Mac UA + 터치스크린)
    const isModernIpad = /macintosh|mac os x/.test(ua)
                      && navigator.maxTouchPoints > 1;

    // Linux ARM 터치 태블릿 감지 (아이뮤즈 등 저가 안드로이드 태블릿)
    // UA는 x86_64로 위장하지만 platform은 Linux armv8l 등으로 나옴
    const isLinuxTouchTablet = navigator.platform.toLowerCase().includes("linux arm")
                            && navigator.maxTouchPoints > 0;

    // 화면 크기 기준 (태블릿 해상도 이하)
	const smallerSide = Math.min(screen.width, screen.height);
	const isSmallScreen = smallerSide <= 1024 && navigator.maxTouchPoints > 0;

    // 태블릿 판별
    const isTablet = isModernIpad
                  || isLinuxTouchTablet
                  || isSmallScreen
                  || (ua.includes("android") && !isMobileMode)
                  || ua.includes("ipad")
                  || /tablet|kindle|silk|playbook/.test(ua);

    // 스마트폰 판별
    const isPhone = !isTablet
                 && /android|iphone|ipod|windows phone|blackberry|nokia|opera mini/.test(ua)
                 && isMobileMode;

    console.log("User-Agent:", ua);
    console.log("platform:", navigator.platform);
    console.log("maxTouchPoints:", navigator.maxTouchPoints);
    console.log("screen:", screen.width + "x" + screen.height);
    console.log("isPhone:", isPhone, "isTablet:", isTablet);
    console.log("isLinuxTouchTablet:", isLinuxTouchTablet, "isSmallScreen:", isSmallScreen);

    return isPhone || isTablet;
}


// 페이지 URL 확인 및 리디렉션 함수
function redirectToAppropriateVersion() {
    const isMobile = detectMobileDevice();
    const currentPath = window.location.pathname;

    // 현재 경로에서 디렉토리와 파일명 분리
    const lastSlashIndex = currentPath.lastIndexOf("/");
    const directoryPath = currentPath.substring(0, lastSlashIndex + 1);
    const filename = currentPath.substring(lastSlashIndex + 1);

    // 파일명이 비어있으면 처리하지 않음 (루트 경로나 디렉토리 경로)
    if (!filename) {
        return;
    }

    // 현재 페이지가 모바일 버전인지 확인 (m_로 시작하는지)
    const isMobilePage = filename.startsWith("m_");

    let targetPath = null;

    if (isMobile && !isMobilePage) {
        // 모바일/태블릿 디바이스이지만 데스크톱 페이지에 접근한 경우
        // → 모바일 버전으로 리디렉션 (m_ 접두사 추가)
        targetPath = directoryPath + "m_" + filename;
    } else if (!isMobile && isMobilePage) {
        // 데스크톱 디바이스이지만 모바일 페이지에 접근한 경우
        // → 데스크톱 버전으로 리디렉션 (m_ 접두사 제거)
        targetPath = directoryPath + filename.substring(2); // "m_" 제거
    }

    // 리디렉션 실행
    if (targetPath && targetPath !== currentPath) {
        window.location.href = targetPath;
    }
}

// 특정 페이지에서 리디렉션을 비활성화하는 함수
function shouldSkipRedirection() {
    const currentPath = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);

    // forceMobile이고 inPopup 파라미터가 있으면 리디렉션 건너뛰기
    if (urlParams && urlParams.get('forceMobile') === 'Y' && urlParams.get('inPopup') === 'Y') {
        return true;
    }

    // 리디렉션을 건너뛸 페이지들
    const skipPages = [
        "/api/",
        "/ajax/",
        "/resources/",
        "/static/",
        "/css/",
        "/js/",
        "/html/",
        "/images/",
        "/img/"
    ];

    // 현재 경로가 건너뛸 페이지 목록에 포함되는지 확인
    return skipPages.some(skipPath => currentPath.startsWith(skipPath));
}

// 페이지 로드 시 리디렉션 함수 실행
document.addEventListener("DOMContentLoaded", function() {
    // 리소스 파일이나 API 경로는 리디렉션하지 않음
    if (!shouldSkipRedirection()) {
        redirectToAppropriateVersion();
    }
});

// 윈도우 리사이즈 시에도 체크 (옵션)
//window.addEventListener("resize", function() {
//    // 디바운스를 위한 타이머
//    clearTimeout(window.resizeTimer);
//    window.resizeTimer = setTimeout(function() {
//        if (!shouldSkipRedirection()) {
//            redirectToAppropriateVersion();
//        }
//    }, 250);
//});