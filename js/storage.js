/* Cookies and localStorage preferences. No passwords are ever stored. */
const rubyAccountStorageKeys = [
  'memberPoints',
  'rewardHistory',
  'rewardRedeemCounts',
  'orderHistory',
  'cart',
  'favouriteTeam',
  'acceptedMissions',
  'missionHistory',
  'dailyRefreshDate',
  'rubyBookings',
  'tournamentsInCharge',
  'profilePicture'
];

function getRubyAccountId(username, email) {
  const identity = String(email || username || 'guest').trim().toLowerCase();
  return encodeURIComponent(identity || 'guest');
}

function getRubyAccountOwnedKeys() {
  const keys = new Set(rubyAccountStorageKeys);
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.startsWith('rubyReminder:')) keys.add(key);
  }
  return Array.from(keys);
}

function saveRubyAccountStorage(accountId) {
  getRubyAccountOwnedKeys().forEach(function (key) {
    const value = localStorage.getItem(key);
    const accountKey = `rubyAccount:${accountId}:${key}`;
    if (value === null) localStorage.removeItem(accountKey);
    else localStorage.setItem(accountKey, value);
  });
}

function loadRubyAccountStorage(accountId) {
  const keys = new Set(rubyAccountStorageKeys);
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    const prefix = `rubyAccount:${accountId}:rubyReminder:`;
    if (key && key.startsWith(prefix)) keys.add(key.substring(`rubyAccount:${accountId}:`.length));
  }

  getRubyAccountOwnedKeys().forEach(function (key) { keys.add(key); });
  keys.forEach(function (key) {
    const value = localStorage.getItem(`rubyAccount:${accountId}:${key}`);
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  });
}

function switchRubyAccountStorage(username, email) {
  const previousAccount = localStorage.getItem('rubyActiveAccount') || 'guest';
  const nextAccount = getRubyAccountId(username, email);
  if (previousAccount === nextAccount) return;

  saveRubyAccountStorage(previousAccount);
  loadRubyAccountStorage(nextAccount);
  localStorage.setItem('rubyActiveAccount', nextAccount);
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const prefix = encodeURIComponent(name) + '=';
  const item = document.cookie.split('; ').find(cookie => cookie.startsWith(prefix));
  return item ? decodeURIComponent(item.substring(prefix.length)) : '';
}

function showCookieNotice() {
  if (getCookie('cookieConsent')) return;
  const notice = document.createElement('aside');
  notice.id = 'cookieNotice';
  notice.className = 'cookie-notice';
  notice.setAttribute('aria-label', 'Cookie preferences');
  notice.innerHTML = `<p>We use cookies to remember your website preferences.</p><div class="d-flex gap-2"><button class="btn btn-ruby btn-sm" id="acceptCookies">ACCEPT</button><button class="btn btn-outline-light btn-sm" id="declineCookies">DECLINE</button></div>`;
  document.body.appendChild(notice);
  $('#acceptCookies').on('click', () => chooseCookieConsent('accepted'));
  $('#declineCookies').on('click', () => chooseCookieConsent('declined'));
}

function chooseCookieConsent(choice) {
  setCookie('cookieConsent', choice, 7);
  $('#cookieNotice').fadeOut(250, function () { this.remove(); });
}

function getFavouriteTeam() { return localStorage.getItem('favouriteTeam') || ''; }
function setFavouriteTeam(teamName) { localStorage.setItem('favouriteTeam', teamName); renderFavouriteTeams(); }
function removeFavouriteTeam() { localStorage.removeItem('favouriteTeam'); renderFavouriteTeams(); }

function renderFavouriteTeams() {
  const favourite = getFavouriteTeam();
  $('.favourite-button').each(function () {
    const selected = $(this).data('team') === favourite;
    $(this).toggleClass('btn-ruby', selected).toggleClass('btn-outline-ruby', !selected);
    $(this).text(selected ? '♥ Favourite' : '♡ Add to Favourite');
  });
  $('#favouriteStatus').text(favourite ? `Your favourite team: ${favourite}` : 'No favourite team selected.');
  $('#removeFavourite').toggle(Boolean(favourite));
}

$(function () {
  showCookieNotice();
  renderFavouriteTeams();
  $(document).on('click', '.favourite-button', function () {
    const team = $(this).data('team');
    getFavouriteTeam() === team ? removeFavouriteTeam() : setFavouriteTeam(team);
  });
  $('#removeFavourite').on('click', removeFavouriteTeam);
});
