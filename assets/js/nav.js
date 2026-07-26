/* =============================================================
   nav.js — 전역 내비게이션 동작
   직지응급환자이송단 | lds77.github.io

   - 모바일 햄버거 열기/닫기
   - 하위 메뉴(서비스/지역) 토글: 클릭 기반이라 터치 기기에서도 동일하게 동작
   - Escape / 바깥 클릭으로 닫기, 현재 페이지 자동 표시
   ============================================================= */
(function () {
    'use strict';

    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var toggle = nav.querySelector('.site-nav-toggle');
    var subToggles = Array.prototype.slice.call(nav.querySelectorAll('.site-nav-sub-toggle'));

    function closeSubmenus(except) {
        subToggles.forEach(function (btn) {
            if (btn !== except) btn.setAttribute('aria-expanded', 'false');
        });
    }

    function closeAll() {
        closeSubmenus(null);
        nav.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    // 햄버거
    if (toggle) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (!open) closeSubmenus(null);
        });
    }

    // 하위 메뉴
    subToggles.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = btn.getAttribute('aria-expanded') === 'true';
            closeSubmenus(btn);
            btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
    });

    // 바깥 클릭 시 닫기
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) closeAll();
    });

    // Escape
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var openSub = subToggles.filter(function (b) {
            return b.getAttribute('aria-expanded') === 'true';
        })[0];
        closeAll();
        if (openSub) openSub.focus();
        else if (toggle && nav.classList.contains('is-open')) toggle.focus();
    });

    // 헤더에 큰 전화번호가 있는 페이지(홈)에서는 그것이 보이는 동안
    // 내비의 전화 버튼을 감춰 같은 번호가 두 번 보이지 않게 한다.
    var headerPhone = document.querySelector('header .phone-number');
    if (headerPhone && 'IntersectionObserver' in window) {
        nav.classList.add('site-nav--call-idle');
        new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                nav.classList.toggle('site-nav--call-idle', entry.isIntersecting);
            });
        }, { threshold: 0 }).observe(headerPhone);
    }

    // 현재 페이지 표시
    var here = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/') || '/';
    Array.prototype.forEach.call(nav.querySelectorAll('a[href]'), function (a) {
        var url;
        try {
            url = new URL(a.href, location.href);
        } catch (err) {
            return;
        }
        // 섹션 링크(#pricing 등)는 경로만 보면 홈과 같아져 잘못 표시된다.
        // 해시가 있는 링크는 해시까지 일치할 때만 현재로 본다.
        if (url.hash && url.hash !== location.hash) return;
        var path = url.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/') || '/';
        if (path !== here) return;
        a.setAttribute('aria-current', 'page');
        var parentItem = a.closest ? a.closest('.site-nav-item--has-sub') : null;
        if (parentItem) parentItem.classList.add('site-nav-item--current');
    });
})();
