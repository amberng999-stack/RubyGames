/* Home-page-only behaviour. */
document.addEventListener('DOMContentLoaded', function () {
  const revealSections = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 80px' });
    revealSections.forEach(function (section) { observer.observe(section); });
  } else {
    revealSections.forEach(function (section) { section.classList.add('visible'); });
  }

  const visitStatus = document.getElementById('visitStatus');
  if (visitStatus) {
    const pageViews = Number(sessionStorage.getItem('rubySessionPageViews') || 0) + 1;
    sessionStorage.setItem('rubySessionPageViews', String(pageViews));
    visitStatus.textContent = `Pages viewed in this session: ${pageViews}`;
  }

  const weatherStatus = document.getElementById('weatherStatus');
  if (weatherStatus) loadCampusWeather(weatherStatus);

  const shareButton = document.getElementById('facebookShare');
  if (shareButton) {
    shareButton.addEventListener('click', function (event) {
      event.preventDefault();
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(shareUrl, 'rubyFacebookShare', 'width=640,height=480,noopener,noreferrer');
    });
  }
});

function loadCampusWeather(output) {
  const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=3.214&longitude=101.729&current=temperature_2m&timezone=Asia%2FKuala_Lumpur';
  fetch(endpoint)
    .then(function (response) {
      if (!response.ok) throw new Error('Weather request failed');
      return response.json();
    })
    .then(function (data) {
      const temperature = data.current?.temperature_2m;
      output.textContent = Number.isFinite(temperature) ? `${Math.round(temperature)}°C at Sungai Long` : 'Sungai Long campus';
    })
    .catch(function () {
      output.textContent = 'Sungai Long campus';
    });
}
