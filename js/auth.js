/* Front-end session demonstration only; this is not secure authentication. */
function updateAuthenticationNavbar() {
  const username = sessionStorage.getItem('username');
  const container = document.getElementById('navbarAuth');
  if (!container) return;
  container.innerHTML = username
    ? `<a class="welcome-text me-lg-2 text-decoration-none" href="profile.html">Welcome, <strong>${escapeHtml(username)}</strong></a><button class="btn btn-outline-light btn-sm" id="logoutButton">LOG OUT</button>`
    : `<a class="btn btn-ruby btn-sm" href="signin.html">SIGN IN</a>`;
}

function escapeHtml(value) {
  return $('<div>').text(value).html();
}

function logoutUser() {
  try {
    if (typeof switchRubyAccountStorage === 'function') switchRubyAccountStorage('', '');
  } catch (error) {
    // Logout must still complete if browser storage is unavailable or full.
  }
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('email');
  window.location.replace('index.html');
}

function readStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function makeProfileListItem(title, details) {
  const item = document.createElement('article');
  item.className = 'profile-list-item';
  const heading = document.createElement('h3');
  heading.className = 'profile-list-title';
  heading.textContent = title;
  item.appendChild(heading);
  if (details) {
    const meta = document.createElement('p');
    meta.className = 'profile-list-meta';
    meta.textContent = details;
    item.appendChild(meta);
  }
  return item;
}

function makeProfileReminderItem(reminder, details) {
  const item = makeProfileListItem(reminder.tournament || 'Tournament', details);
  if (reminder.match) {
    const match = document.createElement('span');
    match.className = 'profile-list-context';
    match.textContent = ` — ${reminder.match}`;
    item.querySelector('.profile-list-title').appendChild(match);
  }
  return item;
}

function renderProfileCollection(listId, countId, entries, emptyMessage, itemRenderer) {
  const list = document.getElementById(listId);
  const count = document.getElementById(countId);
  if (!list || !count) return;
  count.textContent = entries.length;
  list.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('p');
    empty.className = 'profile-empty';
    empty.textContent = emptyMessage;
    list.appendChild(empty);
    return;
  }
  entries.forEach(function (entry, index) { list.appendChild(itemRenderer(entry, index)); });
}

function getProfileReminders() {
  const legacySchedules = {
    'LoL_Tournaments.html': [
      ['22 SEP', '18:00 UTC'], ['22 SEP', '20:00 UTC'], ['23 SEP', '18:00 UTC'], ['23 SEP', '20:00 UTC'],
      ['25 SEP', '18:00 UTC'], ['25 SEP', '20:00 UTC'], ['28 SEP', '21:00 UTC']
    ],
    'HonourOfKings_Tournaments.html': [
      ['01 OCT', '18:00 UTC'], ['01 OCT', '20:00 UTC'], ['02 OCT', '18:00 UTC'], ['02 OCT', '20:00 UTC'],
      ['04 OCT', '18:00 UTC'], ['04 OCT', '20:00 UTC'], ['06 OCT', '21:00 UTC']
    ],
    'MobileLegends_Tournaments.html': [
      ['22 SEP', '18:00 UTC'], ['22 SEP', '20:00 UTC'], ['23 SEP', '18:00 UTC'], ['23 SEP', '20:00 UTC'],
      ['25 SEP', '18:00 UTC'], ['25 SEP', '20:00 UTC'], ['28 SEP', '21:00 UTC']
    ]
  };
  const reminders = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !key.startsWith('rubyReminder:')) continue;
    const storedValue = localStorage.getItem(key);
    let details;
    try { details = JSON.parse(storedValue); }
    catch (error) { details = null; }
    if (details && typeof details === 'object') {
      reminders.push(details);
      continue;
    }
    const reminderIndex = Number(key.split(':').pop());
    const fileName = key.split(':').slice(1, -1).join(':').split('/').pop() || 'Tournament';
    const legacySchedule = legacySchedules[fileName]?.[reminderIndex] || [];
    reminders.push({
      tournament: fileName.replace(/_Tournaments\.html$/i, '').replace(/([a-z])([A-Z])/g, '$1 $2'),
      match: '',
      teams: '', date: legacySchedule[0] || 'Date unavailable', time: legacySchedule[1] || 'Time unavailable'
    });
  }
  return reminders;
}

function renderProfileActivity() {
  renderProfileCollection('profileReminderList', 'profileReminderCount', getProfileReminders(), 'No tournament reminders have been set.', function (reminder) {
    const schedule = [reminder.teams, reminder.date, reminder.time].filter(Boolean).join(' · ');
    return makeProfileReminderItem(reminder, schedule);
  });

  const tournaments = readStoredArray('tournamentsInCharge');
  renderProfileCollection('profileTournamentList', 'profileTournamentCount', tournaments, 'No tournaments are currently assigned to you.', function (tournament) {
    const value = typeof tournament === 'string' ? { name: tournament } : tournament;
    return makeProfileListItem(value.name || value.tournament || 'Tournament assignment', [value.role, value.date, value.status].filter(Boolean).join(' · ') || 'In charge');
  });

  const orders = readStoredArray('orderHistory').slice().reverse();
  renderProfileCollection('profileOrderList', 'profileOrderCount', orders, 'No merchandise orders have been placed.', function (order) {
    const itemCount = Array.isArray(order.items) ? order.items.reduce(function (total, item) { return total + Number(item.quantity || 1); }, 0) : 0;
    const orderDate = order.date ? new Date(order.date).toLocaleDateString() : 'Date unavailable';
    const total = Number(order.total || 0).toFixed(2);
    return makeProfileListItem(`Order #${order.id || 'Pending'} — ${order.status || 'Placed'}`, `${itemCount} item${itemCount === 1 ? '' : 's'} · RM ${total} · ${orderDate}`);
  });

  const bookings = readStoredArray('rubyBookings').slice().sort(function (first, second) {
    return Number(second.createdAt || 0) - Number(first.createdAt || 0);
  });
  renderProfileCollection('profileBookingList', 'profileBookingCount', bookings, 'No gaming-room bookings have been made.', function (booking) {
    const title = `${booking.roomName || 'Gaming Room'} — ${booking.status || 'Pending'}`;
    const details = [booking.id, booking.date, booking.time, booking.type].filter(Boolean).join(' · ');
    return makeProfileListItem(title, details);
  });
}

function displayProfilePicture(dataUrl) {
  const picture = document.getElementById('profilePicture');
  const initial = document.getElementById('profileInitial');
  if (!picture || !initial) return;
  if (dataUrl) {
    picture.src = dataUrl;
    picture.hidden = false;
    initial.hidden = true;
  } else {
    picture.removeAttribute('src');
    picture.hidden = true;
    initial.hidden = false;
  }
}

function initialiseProfilePicture() {
  const input = document.getElementById('profilePictureInput');
  const message = document.getElementById('profilePictureMessage');
  if (!input || !message) return;
  displayProfilePicture(localStorage.getItem('profilePicture') || '');

  input.addEventListener('change', function () {
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      message.textContent = 'Please choose a JPG, PNG, or WebP image.';
      input.value = '';
      return;
    }
    if (file.size > 1500000) {
      message.textContent = 'Please choose an image smaller than 1.5 MB.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', function () {
      try {
        localStorage.setItem('profilePicture', String(reader.result));
        displayProfilePicture(String(reader.result));
        message.textContent = 'Profile picture updated.';
      } catch (error) {
        message.textContent = 'The image could not be saved. Please choose a smaller image.';
      }
      input.value = '';
    });
    reader.addEventListener('error', function () {
      message.textContent = 'The image could not be opened.';
      input.value = '';
    });
    reader.readAsDataURL(file);
  });
}

function initialiseProfilePage() {
  const profile = document.getElementById('profilePage');
  if (!profile) return;
  const username = sessionStorage.getItem('username');
  const email = sessionStorage.getItem('email');
  if (!username) {
    window.location.replace('signin.html');
    return;
  }
  $('#profileUsername').text(username);
  $('#profileWelcomeName').text(username);
  $('#profileEmail').text(email || 'Email not available');
  $('#profileInitial').text(username.charAt(0).toUpperCase());
  renderProfileActivity();
  initialiseProfilePicture();
}

function initialiseSignInForm() {
  const form = document.getElementById('signInForm');
  if (!form) return;
  const remembered = getCookie('rememberedUsername');
  if (remembered) {
    $('#username').val(remembered);
    $('#rememberMe').prop('checked', true);
  }
  $('#signInForm').on('submit', function (event) {
    event.preventDefault();
    const username = $('#username').val().trim();
    const email = $('#email').val().trim();
    const password = $('#password').val();
    const errors = [];
    if (!username) errors.push('Username is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Enter a valid email address.');
    if (!password) errors.push('Password is required.');
    if (errors.length) {
      $('#validationSummary').html(errors.join('<br>')).show();
      $(this).addClass('was-validated');
      return;
    }
    if (typeof switchRubyAccountStorage === 'function') switchRubyAccountStorage(username, email);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('email', email);
    if ($('#rememberMe').is(':checked')) setCookie('rememberedUsername', username, 7);
    else setCookie('rememberedUsername', '', -1);
    let destination = 'profile.html';
    try {
      const pendingAction = JSON.parse(sessionStorage.getItem('rubyPendingAction') || 'null');
      if (pendingAction?.returnUrl && String(pendingAction.returnUrl).startsWith('/')) destination = pendingAction.returnUrl;
    } catch (error) {
      // Use the profile page when pending action data is unavailable.
    }
    window.location.replace(destination);
  });
}

$(function () {
  $(document).off('click.rubyLogout', '#logoutButton').on('click.rubyLogout', '#logoutButton', function (event) {
    event.preventDefault();
    logoutUser();
  });
  updateAuthenticationNavbar();
  initialiseSignInForm();
  initialiseProfilePage();
});
