// 3rd Stage 公式LP - main.js
// モバイルメニューの開閉・追従CTAバーの表示制御

(function () {
  var menuOpen = document.getElementById('menu-open');
  var menuClose = document.getElementById('menu-close');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuOpen && menuClose && mobileMenu) {
    var openMenu = function () {
      mobileMenu.classList.add('open');
      document.body.classList.add('menu-open-lock'); // 背面スクロールを止める
      menuOpen.setAttribute('aria-expanded', 'true');
      mobileMenu.removeAttribute('aria-hidden');
      menuClose.focus();
    };
    var closeMenu = function (returnFocus) {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open-lock');
      menuOpen.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      if (returnFocus) menuOpen.focus();
    };

    menuOpen.addEventListener('click', openMenu);
    menuClose.addEventListener('click', function () { closeMenu(true); });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (!mobileMenu.classList.contains('open')) return;
      if (e.key === 'Escape') {
        closeMenu(true);
        return;
      }
      // 簡易フォーカストラップ：メニュー内の先頭/末尾要素でTabがループするようにする
      if (e.key === 'Tab') {
        var focusable = mobileMenu.querySelectorAll('a, button');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // 追従CTAバー：ファーストビューを通過したら表示する
  var fv = document.getElementById('fv');
  var followBar = document.getElementById('follow-bar');
  if (fv && followBar && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        followBar.classList.toggle('show', !entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
    }, { threshold: 0 });
    observer.observe(fv);
  }
})();
