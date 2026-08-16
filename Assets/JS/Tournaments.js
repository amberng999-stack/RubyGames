window.addEventListener('DOMContentLoaded', function () {
  setupCountdown();
  setupReminders();
});

function setupReminders() {
  const reminderButtons = document.querySelectorAll('.schedule-action .btn-primary');

  function markReminderSet(button) {
    button.textContent = 'Reminder Is Set';
    button.classList.add('reminder-is-set');
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute('tabindex', '-1');
  }

  reminderButtons.forEach(function (button, index) {
    const reminderKey = `rubyReminder:${window.location.pathname}:${index}`;

    try {
      if (localStorage.getItem(reminderKey)) markReminderSet(button);
    } catch (error) {
      // The reminder still works for this visit when storage is unavailable.
    }

    button.addEventListener('click', function (event) {
      event.preventDefault();
      if (button.classList.contains('reminder-is-set')) return;

      const scheduleItem = button.closest('.schedule-item');
      const reminderDetails = {
        tournament: document.title.replace(/\s*\|.*$/, '').trim(),
        match: scheduleItem?.querySelector('.schedule-info h3')?.textContent.trim() || `Match ${index + 1}`,
        teams: scheduleItem?.querySelector('.schedule-info p')?.textContent.trim() || '',
        date: [
          scheduleItem?.querySelector('.schedule-date .day')?.textContent.trim(),
          scheduleItem?.querySelector('.schedule-date .month')?.textContent.trim()
        ].filter(Boolean).join(' '),
        time: scheduleItem?.querySelector('.schedule-time')?.textContent.trim() || '',
        page: window.location.pathname,
        setAt: new Date().toISOString()
      };

      if (!sessionStorage.getItem('username')) {
        sessionStorage.setItem('rubyPendingAction', JSON.stringify({
          type: 'setReminder',
          returnUrl: window.location.pathname + window.location.search,
          reminderKey: reminderKey,
          reminderDetails: reminderDetails
        }));
        window.location.href = 'signin.html';
        return;
      }

      markReminderSet(button);
      try { localStorage.setItem(reminderKey, JSON.stringify(reminderDetails)); }
      catch (error) { /* Keep the visual state for this visit. */ }
      window.alert('Successfully Set Reminder!');
    });
  });

  if (sessionStorage.getItem('username')) {
    try {
      const pendingAction = JSON.parse(sessionStorage.getItem('rubyPendingAction') || 'null');
      if (pendingAction?.type === 'setReminder' && pendingAction.returnUrl === window.location.pathname + window.location.search) {
        const pendingButtonIndex = Number(String(pendingAction.reminderKey).split(':').pop());
        const pendingButton = reminderButtons[pendingButtonIndex];
        localStorage.setItem(pendingAction.reminderKey, JSON.stringify(pendingAction.reminderDetails));
        if (pendingButton) markReminderSet(pendingButton);
        sessionStorage.removeItem('rubyPendingAction');
        window.alert('Successfully Set Reminder!');
      }
    } catch (error) {
      sessionStorage.removeItem('rubyPendingAction');
    }
  }
}

function setupCountdown() {
  const countdown = document.getElementById('countdown');
  if (!countdown) return;

  const targetDate = new Date(countdown.dataset.date).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      countdown.innerHTML = '<div><strong>LIVE</strong><span>Now</span></div>';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
