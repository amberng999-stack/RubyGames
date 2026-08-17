(function () {
  const currentScript = document.currentScript;
  const scriptSource = currentScript ? currentScript.getAttribute('src') || '' : '';
  const rootPrefix = scriptSource.startsWith('../') ? '../' : '';

  const pageHistoryKey = 'rubyPageHistory';
  const backNavigationKey = 'rubyBackNavigation';
  const currentPage = window.location.pathname + window.location.search;
  let pageHistory;
  try { pageHistory = JSON.parse(sessionStorage.getItem(pageHistoryKey) || '[]'); }
  catch (error) { pageHistory = []; }
  if (sessionStorage.getItem(backNavigationKey) === 'true') {
    sessionStorage.removeItem(backNavigationKey);
  } else if (pageHistory[pageHistory.length - 1] !== currentPage) {
    pageHistory.push(currentPage);
    sessionStorage.setItem(pageHistoryKey, JSON.stringify(pageHistory.slice(-30)));
  }

  const pages = [
    ['index.html', 'HOME'],
    ['News_2.html', 'NEWS'],
    ['tournaments.html', 'TOURNAMENTS'],
    ['game.html', 'GAMES'],
    ['booking.html', 'BOOKING'],
    ['teams.html', 'TEAMS'],
    ['mission.html', 'MISSIONS'],
    ['shop.html', 'SHOP']
  ];

  const pageFile = window.location.pathname.split('/').pop() || 'index.html';
  const pageFolder = window.location.pathname.split('/').slice(-2, -1)[0] || '';
  const activeFile = pageFolder === 'News_Article'
    ? 'News_2.html'
    : pageFolder === 'Tournament_Details'
      ? 'tournaments.html'
      : pageFile === 'game-detail.html'
        ? 'game.html'
        : pageFile;
  const isHome = activeFile.toLowerCase() === 'index.html';

  if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Poppins"]')) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap';
    document.head.appendChild(fontLink);
  }

  const style = document.createElement('style');
  style.textContent = `
    html,body,button,input,select,textarea{font-family:Poppins,Arial,sans-serif!important}
    h1,h2,h3,h4,h5,h6,.ruby-header-brand{font-family:Impact,"Arial Black",sans-serif!important}
    body{overflow-x:hidden;background:#000;color:#fff}
    img,video,iframe{max-width:100%}
    body.ruby-fixed-header-page{padding-top:68px!important}
    .ruby-unified-header{position:fixed;top:0;left:0;z-index:1100;width:100%;min-height:68px;background:rgba(0,0,0,.96);border-bottom:1px solid #3c0a0f;font-family:Poppins,Arial,sans-serif}
    .ruby-header-inner{position:relative;width:min(1320px,calc(100% - 32px));min-height:68px;margin:auto;display:flex;align-items:center;gap:12px}
    .ruby-header-brand{display:flex;align-items:center;gap:9px;flex:0 0 auto;color:#9b111e!important;font-size:calc(1.55rem + 2px);font-weight:700;text-decoration:none!important;white-space:nowrap}
    .ruby-header-brand img{width:52px;height:52px;display:block;object-fit:contain;border-radius:8px}
    .ruby-header-toggle{display:none;margin-left:auto;width:46px;height:46px;border:1px solid #9b111e;border-radius:5px;background:transparent;color:#fff;font-size:calc(1.5rem + 2px)}
    .ruby-header-menu{display:flex;align-items:center;gap:2px;margin-left:auto}
    .ruby-header-menu>a{padding:.5rem .5rem;color:#dedede!important;font-size:calc(.9rem + 2px);font-weight:500;text-decoration:none!important;white-space:nowrap}
    .ruby-header-menu>a:hover,.ruby-header-menu>a.active{color:#bd1828!important}
    .ruby-header-cart{position:relative;flex:0 0 auto;width:44px;height:44px;margin-left:5px;border:1px solid #9b111e;border-radius:5px;background:transparent;color:#fff;font-size:calc(1.2rem + 2px);cursor:pointer}
    .ruby-header-cart:hover,.ruby-header-cart:focus{background:#9b111e}
    .ruby-header-cart-count{position:absolute;top:-8px;right:-8px;display:grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#9b111e;color:#fff;font-size:.72rem;font-weight:700}
    .ruby-header-auth{display:flex;align-items:center;margin-left:8px;white-space:nowrap}
    .ruby-header-auth>a,.ruby-header-auth .btn{display:inline-flex;align-items:center;justify-content:center;padding:.5rem .75rem;border:1px solid #9b111e;border-radius:5px;background:#9b111e;color:#fff!important;font-size:calc(.9rem + 2px);font-weight:600;text-decoration:none!important}
    .cookie-notice{position:fixed;z-index:1200;left:50%;bottom:1rem;transform:translateX(-50%);width:min(680px,calc(100% - 2rem));display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1.25rem;background:#191919;color:#fff;border:1px solid #9b111e;box-shadow:0 12px 45px #000;font-family:Poppins,Arial,sans-serif!important}
    .cookie-notice p{margin:0;font-size:.9rem}.cookie-notice-actions{display:flex;gap:.5rem;flex:0 0 auto}
    @media(max-width:1199px){
      .ruby-header-inner{flex-wrap:wrap;padding:10px 0}
      .ruby-header-toggle{display:block}
      .ruby-header-menu{display:none;order:4;width:100%;margin:0;flex-direction:column;align-items:stretch;padding:8px 0}
      .ruby-header-menu.show{display:flex}
      .ruby-header-menu>a{padding:.7rem 0}
      .ruby-header-auth{margin:0;padding-top:5px}
    }
    @media(max-width:575px){.ruby-header-inner{width:calc(100% - 20px)}.ruby-header-brand{font-size:calc(1.05rem + 2px);color:#9b111e!important}.ruby-header-brand img{width:44px;height:44px}.ruby-header-menu{order:5}.ruby-header-cart{order:4}.ruby-header-auth{width:100%;order:6}.ruby-header-auth>a,.ruby-header-auth .btn{width:100%}.cookie-notice{align-items:stretch;flex-direction:column}.cookie-notice-actions{width:100%}.cookie-notice-actions .btn{flex:1}}
  `;
  document.head.appendChild(style);

  if (!document.querySelector('script[src$="js/storage.js"],script[src$="storage.js"]')) {
    const storageScript = document.createElement('script');
    storageScript.src = `${rootPrefix}js/storage.js`;
    document.head.appendChild(storageScript);
  }

  function buildHeader() {
    const oldHeader = document.querySelector('header.site-navbar, nav.site-navbar, nav.mission-navbar, nav.shop-navbar, nav.navbar-ruby');
    if (!oldHeader) return;

    const existingAuth = document.getElementById('navbarAuth');
    const existingCartCount = document.getElementById('cartCount');
    const cartQuantity = existingCartCount ? existingCartCount.textContent.trim() || '0' : '0';
    const isShopPage = activeFile.toLowerCase() === 'shop.html';
    const signedInUsername = sessionStorage.getItem('username');
    const authMarkup = existingAuth && existingAuth.innerHTML.trim()
      ? existingAuth.innerHTML
      : signedInUsername
        ? `<a href="${rootPrefix}profile.html">PROFILE</a>`
        : `<a href="${rootPrefix}signin.html">SIGN IN</a>`;
    const links = pages.map(([href, label]) => {
      const active = href.toLowerCase() === activeFile.toLowerCase() ? ' active' : '';
      return `<a class="${active.trim()}" href="${rootPrefix}${href}">${label}</a>`;
    }).join('');

    const header = document.createElement('nav');
    header.className = 'ruby-unified-header';
    header.setAttribute('aria-label', 'Main navigation');
    header.innerHTML = `<div class="ruby-header-inner">
      <a class="ruby-header-brand" href="${rootPrefix}index.html"><img src="${rootPrefix}images/ruby games logo white.png" alt="Ruby Games Logo"><span>RUBY GAMES</span></a>
      <button class="ruby-header-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button>
      <div class="ruby-header-menu">${links}</div>
      ${isShopPage ? `<button class="ruby-header-cart" type="button" aria-label="Open shopping cart">&#128722;<span id="cartCount" class="ruby-header-cart-count">${cartQuantity}</span></button>` : ''}
      <div id="navbarAuth" class="ruby-header-auth">${authMarkup}</div>
    </div>`;
    oldHeader.replaceWith(header);
    document.body.classList.add('ruby-fixed-header-page');

    const cartButton = header.querySelector('.ruby-header-cart');
    if (cartButton) cartButton.addEventListener('click', () => {
      if (typeof window.openCart === 'function') window.openCart();
    });
    const toggle = header.querySelector('.ruby-header-toggle');
    const menu = header.querySelector('.ruby-header-menu');
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('show');
      toggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank') return;
      const destination = new URL(link.href, window.location.href);
      const destinationFile = destination.pathname.split('/').pop().toLowerCase();
      const loaderPages = ['news_2.html', 'tournaments.html', 'game.html', 'booking.html', 'teams.html', 'mission.html', 'shop.html'];
      if (loaderPages.includes(destinationFile)) {
        sessionStorage.removeItem('rubySkipNextLoader');
        sessionStorage.setItem('rubyShowNextLoader', 'true');
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildHeader);
  else buildHeader();
}());
