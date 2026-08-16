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
  if (name !== 'cookieConsent' && getCookie('cookieConsent') !== 'accepted') return false;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
  return true;
}

function getCookie(name) {
  const prefix = encodeURIComponent(name) + '=';
  const item = document.cookie.split('; ').find(cookie => cookie.startsWith(prefix));
  return item ? decodeURIComponent(item.substring(prefix.length)) : '';
}

function deleteCookie(name) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax${secure}`;
}

function clearOptionalCookies() {
  ['rememberedUsername', 'rubyUserName'].forEach(deleteCookie);
}

function showCookieNotice() {
  if (getCookie('cookieConsent')) return;
  const notice = document.createElement('aside');
  notice.id = 'cookieNotice';
  notice.className = 'cookie-notice';
  notice.setAttribute('aria-label', 'Cookie preferences');
  notice.innerHTML = `<p>Allow optional cookies to remember your username and booking name? Essential session and shopping storage will still be used.</p><div class="cookie-notice-actions"><button class="btn btn-ruby btn-sm" id="acceptCookies" type="button">ACCEPT</button><button class="btn btn-outline-light btn-sm" id="declineCookies" type="button">DECLINE</button></div>`;
  document.body.appendChild(notice);
  document.getElementById('acceptCookies').addEventListener('click', () => chooseCookieConsent('accepted'));
  document.getElementById('declineCookies').addEventListener('click', () => chooseCookieConsent('declined'));
}

function chooseCookieConsent(choice) {
  setCookie('cookieConsent', choice, 7);
  if (choice !== 'accepted') clearOptionalCookies();
  const notice = document.getElementById('cookieNotice');
  if (notice) notice.remove();
}

function getFavouriteTeam() { return localStorage.getItem('favouriteTeam') || ''; }
function setFavouriteTeam(teamName) { localStorage.setItem('favouriteTeam', teamName); renderFavouriteTeams(); }
function removeFavouriteTeam() { localStorage.removeItem('favouriteTeam'); renderFavouriteTeams(); }

function renderFavouriteTeams() {
  const favourite = getFavouriteTeam();
  document.querySelectorAll('.favourite-button').forEach(function (button) {
    const selected = button.dataset.team === favourite;
    button.classList.toggle('btn-ruby', selected);
    button.classList.toggle('btn-outline-ruby', !selected);
    button.textContent = selected ? '♥ Favourite' : '♡ Add to Favourite';
  });
  const status = document.getElementById('favouriteStatus');
  if (status) status.textContent = favourite ? `Your favourite team: ${favourite}` : 'No favourite team selected.';
  const removeButton = document.getElementById('removeFavourite');
  if (removeButton) removeButton.hidden = !favourite;
}

function initialiseStorageFeatures() {
  showCookieNotice();
  renderFavouriteTeams();
  document.addEventListener('click', function (event) {
    const button = event.target.closest('.favourite-button');
    if (!button) return;
    const team = button.dataset.team;
    getFavouriteTeam() === team ? removeFavouriteTeam() : setFavouriteTeam(team);
  });
  const removeButton = document.getElementById('removeFavourite');
  if (removeButton) removeButton.addEventListener('click', removeFavouriteTeam);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialiseStorageFeatures);
else initialiseStorageFeatures();
