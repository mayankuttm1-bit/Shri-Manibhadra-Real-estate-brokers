// Universal Header & Mobile Drawer Controller
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('mobile-menu-btn') || document.querySelector('.mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer') || document.querySelector('.mobile-drawer');
    const closeBtn = document.getElementById('drawer-close') || document.querySelector('.drawer-close');
    const backdrop = document.getElementById('drawer-backdrop') || document.querySelector('.drawer-backdrop');
    const navLinks = document.querySelectorAll('.drawer-nav a, .drawer-footer a');

    if (!menuBtn || !drawer) return;

    function openDrawer() {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        if (backdrop) backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        if (backdrop) backdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (drawer.classList.contains('open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeDrawer();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeDrawer);
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });

    // Header scroll background effect
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});
