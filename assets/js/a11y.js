/* =============================================================
   a11y.js — 접근성 보강 (전 페이지 공용)
   직지응급환자이송단 | lds77.github.io

   이 사이트는 FAQ·아코디언·탭·닫기 버튼이 전부 <div onclick="...">
   형태로 되어 있어 마우스로만 조작할 수 있었다. 종류가 13가지가 넘고
   페이지마다 이름이 달라(toggleFaq / toggleSubAccordion / toggleProcess ...)
   개별 수정 대신 런타임에서 일괄로 보강한다.

   - 네이티브로 조작 가능한 요소(a/button/input)는 건드리지 않는다
   - onclick 이 있는 나머지 요소에 role/tabindex 부여 + Enter/Space 처리
   - toggle* 계열은 .active 클래스를 감시해 aria-expanded 를 동기화
   ============================================================= */
(function () {
    'use strict';

    var NATIVE = ['a', 'button', 'input', 'textarea', 'select', 'summary'];

    function isNative(el) {
        return NATIVE.indexOf(el.tagName.toLowerCase()) !== -1;
    }

    // ----- 1) 조작 가능하게 만들기 -----
    var clickables = document.querySelectorAll('[onclick]');
    Array.prototype.forEach.call(clickables, function (el) {
        if (isNative(el)) return;
        if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    });

    // ----- 2) 키보드 처리 (Enter / Space) -----
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
        var el = e.target;
        if (!el || !el.hasAttribute || !el.hasAttribute('onclick')) return;
        if (isNative(el)) return;            // 링크·버튼은 브라우저가 알아서 처리
        e.preventDefault();                  // Space 로 페이지가 스크롤되지 않게
        el.click();
    });

    // ----- 3) aria-expanded 동기화 -----
    // 이 사이트의 토글은 예외 없이 자신에게 .active 를 붙였다 뗐다 한다.
    var togglers = Array.prototype.filter.call(
        document.querySelectorAll('[onclick]'),
        function (el) { return /^\s*toggle/i.test(el.getAttribute('onclick') || ''); }
    );

    // 펼침 상태를 어디에 표시하는지가 페이지마다 다르다.
    // 홈·병원 페이지는 헤더 자신에게 .active 를 붙이고,
    // 서비스 페이지의 toggleFaq 는 답변(다음 형제)에만 붙인다. 둘 다 본다.
    function panelOf(el) {
        var next = el.nextElementSibling;
        if (!next) return null;
        return /(answer|content|panel|body)/i.test(next.className || '') ? next : null;
    }

    function isOpen(el) {
        if (el.classList.contains('active')) return true;
        var panel = panelOf(el);
        return !!(panel && panel.classList.contains('active'));
    }

    function sync(el) {
        el.setAttribute('aria-expanded', isOpen(el) ? 'true' : 'false');
    }

    togglers.forEach(function (el) {
        sync(el);
        var panel = panelOf(el);
        if (panel && !panel.id) {
            panel.id = 'a11y-panel-' + Math.abs(
                Array.prototype.reduce.call(
                    (el.textContent || '').slice(0, 40) + togglers.indexOf(el),
                    function (h, c) { return (h * 31 + c.charCodeAt(0)) | 0; }, 7
                )
            );
        }
        if (panel && panel.id && !el.hasAttribute('aria-controls')) {
            el.setAttribute('aria-controls', panel.id);
        }
    });

    // ----- 4) 등장 애니메이션 안전장치 -----
    // 20개 페이지가 카드를 opacity:0 으로 숨긴 뒤 IntersectionObserver 로 되살린다.
    // 옵저버를 못 쓰거나 되살리는 코드가 실패하면 콘텐츠가 통째로 사라진다.
    // 여기서 별도 옵저버를 하나 더 걸어 두고, 마지막 보루로 타임아웃도 둔다.
    function revealStuck() {
        var stuck = Array.prototype.filter.call(
            document.querySelectorAll('[style*="opacity"]'),
            function (el) { return parseFloat(el.style.opacity) === 0; }
        );
        if (!stuck.length) return;

        function show(el) {
            el.style.opacity = '1';
            if (el.style.transform) el.style.transform = 'none';
        }

        var reduce = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // 모션 최소화 설정이거나 옵저버를 못 쓰면 즉시 전부 노출
        if (reduce || !('IntersectionObserver' in window)) {
            stuck.forEach(show);
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                show(e.target);
                io.unobserve(e.target);
            });
        }, { rootMargin: '200px' });
        stuck.forEach(function (el) { io.observe(el); });

        // 그래도 남아 있으면 8초 뒤 강제 노출 — 장식보다 콘텐츠가 우선이다
        setTimeout(function () {
            stuck.forEach(function (el) {
                if (parseFloat(el.style.opacity) === 0) show(el);
            });
        }, 8000);
    }

    // 페이지 자체 스크립트가 카드를 숨긴 뒤에 실행되어야 한다
    window.addEventListener('load', function () { setTimeout(revealStuck, 300); });

    if ('MutationObserver' in window && togglers.length) {
        // 헤더와 패널 어느 쪽의 class 가 바뀌어도 해당 헤더의 aria 를 다시 계산한다
        var owner = new WeakMap();
        var mo = new MutationObserver(function (records) {
            records.forEach(function (rec) {
                var header = owner.get(rec.target);
                if (header) sync(header);
            });
        });
        togglers.forEach(function (el) {
            owner.set(el, el);
            mo.observe(el, { attributes: true, attributeFilter: ['class'] });
            var panel = panelOf(el);
            if (panel) {
                owner.set(panel, el);
                mo.observe(panel, { attributes: true, attributeFilter: ['class'] });
            }
        });
    }
})();
