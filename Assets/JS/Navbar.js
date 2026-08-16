document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('script[src$="site-header.js"]')) {
    const sharedHeaderScript = document.createElement('script');
    const insideFolder = /\/(News_Article|Tournament_Details)\//.test(window.location.pathname);
    sharedHeaderScript.src = `${insideFolder ? '../' : ''}js/site-header.js`;
    document.head.appendChild(sharedHeaderScript);
  }

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

  function returnToPreviousPage() {
    let history;
    try { history = JSON.parse(sessionStorage.getItem(pageHistoryKey) || '[]'); }
    catch (error) { history = []; }
    if (history[history.length - 1] === currentPage) history.pop();
    const previousPage = history.pop();
    if (previousPage) {
      history.push(previousPage);
      sessionStorage.setItem(pageHistoryKey, JSON.stringify(history));
      sessionStorage.setItem(backNavigationKey, 'true');
      sessionStorage.setItem('rubySkipNextLoader', 'true');
      window.location.href = previousPage;
      return;
    }
    sessionStorage.setItem('rubySkipNextLoader', 'true');
    window.location.href = document.querySelector('a[href$="index.html"]').href;
  }

  const toggleBtn = document.getElementById('navbarToggle');
  const menu = document.getElementById('navbarMenu');
  const brand = document.querySelector('.site-navbar .navbar-brand');

  if (brand && !document.querySelector('.header-back-button')) {
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'header-back-button';
    backButton.setAttribute('aria-label', 'Go back to previous page');
    backButton.title = 'Back';
    backButton.innerHTML = '&#8592;';
    backButton.addEventListener('click', returnToPreviousPage);
    brand.parentNode.insertBefore(backButton, brand);
  }

  if (menu) {
    const insideFolder = /\/(News_Article|Tournament_Details)\//.test(window.location.pathname);
    const prefix = insideFolder ? '../' : '';
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const primaryPages = [
      ['index.html', 'Home'],
      ['News_2.html', 'News'],
      ['tournaments.html', 'Tournaments'],
      ['game.html', 'Games'],
      ['booking.html', 'Booking'],
      ['teams.html', 'Teams'],
      ['mission.html', 'Missions'],
      ['shop.html', 'Shop']
    ];

    const signedInUsername = sessionStorage.getItem('username');
    const accountLink = signedInUsername
      ? `<a class="btn btn-ruby" href="${prefix}profile.html">Profile</a>`
      : `<a class="btn btn-ruby" href="${prefix}signin.html">Sign In</a>`;

    menu.innerHTML = primaryPages.map(([href, label]) => {
      const active = currentFile.toLowerCase() === href.toLowerCase() ? ' active' : '';
      return `<a class="nav-link${active}" href="${prefix}${href}">${label}</a>`;
    }).join('') + accountLink;
  }

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
  }
});
