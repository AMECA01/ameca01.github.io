/* ============================================================
   AMECA机械 · 交互脚本
   - 主题切换（深色/浅色/跟随系统）
   - 移动端菜单
   - 搜索框交互
   - 数字滚动计数
   - 滚动出现动画
   - 回到顶部
   - 导航高亮
   - 磁吸按钮效果
   ============================================================ */

(function () {
    'use strict';

    const root = document.documentElement;
    const body = document.body;

    /* ---------- 1. 主题切换 ---------- */
    const themeToggle = document.getElementById('themeToggle');
    const STORAGE_KEY = 'lq-theme';

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }

    // 初始化主题：localStorage > 系统偏好 > 深色
    function initTheme() {
        let saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
        if (saved) {
            applyTheme(saved);
        } else {
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            applyTheme(prefersLight ? 'light' : 'dark');
        }
    }
    initTheme();

    themeToggle.addEventListener('click', () => {
        const cur = root.getAttribute('data-theme');
        applyTheme(cur === 'dark' ? 'light' : 'dark');
    });

    // 监听系统主题变化（仅当用户未手动设置时）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        let saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (err) {}
        if (!saved) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    /* ---------- 2. 移动端菜单 ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');

    function updateMenuToggleAria(open) {
        const key = open ? 'aria.menu.close' : 'aria.menu.open';
        menuToggle.setAttribute('data-i18n-aria', key);
        if (window.AMECA_i18n) {
            const lang = window.AMECA_i18n.getLang();
            menuToggle.setAttribute('aria-label', window.AMECA_i18n.t(key, lang));
        }
    }

    menuToggle.addEventListener('click', () => {
        const open = mainNav.classList.toggle('open');
        menuToggle.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', open);
        updateMenuToggleAria(open);
    });

    // 点击导航链接后关闭移动菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            updateMenuToggleAria(false);
        });
    });

    /* ---------- 3. 搜索框交互 ---------- */
    const searchInput = document.getElementById('searchInput');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');

    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.getAttribute('data-query');
            searchInput.value = query;
            searchInput.focus();
            searchInput.style.width = '';
            searchInput.style.flex = '1';
        });
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            doSearch(searchInput.value);
        }
    });

    document.querySelector('.search-btn').addEventListener('click', () => {
        doSearch(searchInput.value);
    });

    function doSearch(query) {
        const q = (query || '').trim();
        if (!q) {
            flashSearch('请输入搜索关键词');
            return;
        }
        flashSearch('正在搜索「' + q + '」…');
        console.log('[Search]', q);
    }

    function flashSearch(msg) {
        const input = searchInput;
        const placeholder = input.placeholder;
        input.placeholder = msg;
        input.value = '';
        setTimeout(() => { input.placeholder = placeholder; }, 1800);
    }

    /* ---------- 4. 数字滚动计数 ---------- */
    const counters = document.querySelectorAll('.stat-num');

    function animateCount(el) {
        const target = parseFloat(el.getAttribute('data-count'));
        const decimal = parseInt(el.getAttribute('data-decimal') || '0', 10);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            // easeOutExpo
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            const val = target * eased;
            el.textContent = decimal > 0 ? val.toFixed(decimal) : Math.floor(val);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = decimal > 0 ? target.toFixed(decimal) : target;
        }
        requestAnimationFrame(tick);
    }

    /* ---------- 5. 滚动出现动画 ---------- */
    const revealTargets = document.querySelectorAll(
        '.hero-content, .hero-stats, .section-head, .product-card, .about-text, .about-visual'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                // 数字计数
                const nums = entry.target.querySelectorAll('.stat-num');
                nums.forEach(n => {
                    if (!n.dataset.counted) {
                        n.dataset.counted = '1';
                        animateCount(n);
                    }
                });
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealTargets.forEach(el => io.observe(el));

    /* ---------- 6. 回到顶部 ---------- */
    const backToTop = document.getElementById('backToTop');
    const header = document.getElementById('siteHeader');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        backToTop.classList.toggle('show', y > 480);
        // 顶部栏滚动收缩
        header.classList.toggle('scrolled', y > 30);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- 7. 导航高亮（滚动锚点） ---------- */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = ['home', 'products', 'about'].map(id => document.getElementById(id));

    const navIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('data-page') === id);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => s && navIO.observe(s));

    /* ---------- 8. 磁吸按钮效果 ---------- */
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = 0.18;
            el.style.transform = `translate(${x * strength}px, ${y * strength - 6}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    /* ---------- 9. 顶部栏滚动加深（仅视觉，不改变高度，杜绝抖动） ---------- */
    const shrinkStyle = document.createElement('style');
    shrinkStyle.textContent = `
        .site-header.scrolled .header-bg-overlay::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(8, 12, 20, 0.45);
            backdrop-filter: blur(12px) saturate(140%);
            -webkit-backdrop-filter: blur(12px) saturate(140%);
            transition: opacity 0.4s cubic-bezier(0.16,1,0.3,1);
            pointer-events: none;
        }
        .site-header:not(.scrolled) .header-bg-overlay::after {
            opacity: 0;
        }
        .site-header.scrolled .header-bg-overlay::after {
            opacity: 1;
        }
        .site-header::after {
            content: '';
            position: absolute;
            inset: auto 0 0 0;
            height: 1px;
            background: rgba(255,255,255,0.06);
            opacity: 0;
            transition: opacity 0.4s var(--ease-premium);
            pointer-events: none;
        }
        .site-header.scrolled::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(shrinkStyle);

    console.log('%cAMECA机械 · Premium Frontend Ready', 'color:#ff6a13;font-weight:bold;font-size:14px;');
})();
