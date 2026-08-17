/* Common interface behaviour shared by every page. */
$(function () {
  if (!document.querySelector('script[src$="site-header.js"]')) {
    const sharedHeaderScript = document.createElement('script');
    sharedHeaderScript.src = 'js/site-header.js';
    document.head.appendChild(sharedHeaderScript);
  }

  $('.fade-section').each(function () {
    const section = this;
    const reveal = () => {
      if (section.getBoundingClientRect().top < window.innerHeight - 60) section.classList.add('is-visible');
    };
    $(window).on('scroll', reveal);
    reveal();
  });

  const countdowns = $('[data-countdown]');
  if (countdowns.length) {
    const updateCountdowns = () => {
      countdowns.each(function () {
        const remaining = new Date($(this).data('countdown')).getTime() - Date.now();
        if (remaining <= 0) {
          $(this).text('Started');
          return;
        }
        const totalSeconds = Math.floor(remaining / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        $(this).text(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      });
    };
    updateCountdowns();
    window.setInterval(updateCountdowns, 1000);
  }

  const playerPortraits = [
    ['axiom.png', 'Axiom'], ['vanta.png', 'Vanta'], ['kairu.png', 'Kairu'], ['nyx.png', 'Nyx'],
    ['ryujin.png', 'Ryujin'], ['ember.png', 'Ember'], ['strix.png', 'Strix'], ['lumen.png', 'Lumen'],
    ['zephyr.png', 'Zephyr'], ['onyx.png', 'Onyx'], ['ruby.png', 'Ruby'], ['flare.png', 'Flare']
  ];
  $('.player-card .player-avatar').each(function (index) {
    const portrait = playerPortraits[index];
    if (!portrait) return;
    $('<img>', {
      class: 'player-avatar',
      src: `images/players/${portrait[0]}`,
      alt: `Portrait of ${portrait[1]}`,
      loading: 'lazy'
    }).replaceAll(this);
  });

  const merchandiseTrack = document.getElementById('merchTrack');
  if (merchandiseTrack) {
    const merchandiseCards = Array.from(merchandiseTrack.querySelectorAll('.merch-card'));
    const loopCards = merchandiseCards.slice(0, Math.min(3, merchandiseCards.length));
    loopCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      merchandiseTrack.appendChild(clone);
    });

    let activeProduct = 0;
    let merchandiseMoving = false;

    const scrollToProduct = (index, behavior = 'smooth') => {
      const allCards = merchandiseTrack.querySelectorAll('.merch-card');
      merchandiseTrack.scrollTo({
        left: allCards[index].offsetLeft - allCards[0].offsetLeft,
        behavior
      });
    };

    const moveMerchandise = (direction) => {
      if (merchandiseMoving) return;
      merchandiseMoving = true;

      if (direction > 0 && activeProduct === merchandiseCards.length - 1) {
        activeProduct = merchandiseCards.length;
        scrollToProduct(activeProduct);
        window.setTimeout(() => {
          activeProduct = 0;
          scrollToProduct(0, 'instant');
          merchandiseMoving = false;
        }, 500);
        return;
      }

      activeProduct = (activeProduct + direction + merchandiseCards.length) % merchandiseCards.length;
      scrollToProduct(activeProduct);
      window.setTimeout(() => { merchandiseMoving = false; }, 500);
    };
    $('#merchPrev').on('click', () => moveMerchandise(-1));
    $('#merchNext').on('click', () => moveMerchandise(1));
  }

  const playerShowcase = document.getElementById('playerShowcase');
  const playerShowcaseTrack = document.getElementById('playerShowcaseTrack');
  if (playerShowcase && playerShowcaseTrack) {
    const teamSlides = playerShowcaseTrack.querySelectorAll('.player-team-slide');
    let activeTeam = 0;
    let playerRotation;
    let playerLoopFallback;

    const firstTeamClone = teamSlides[0].cloneNode(true);
    firstTeamClone.setAttribute('aria-hidden', 'true');
    playerShowcaseTrack.appendChild(firstTeamClone);

    const resetPlayerLoop = () => {
      if (activeTeam < teamSlides.length) return;
      window.clearTimeout(playerLoopFallback);
      playerShowcaseTrack.style.transition = 'none';
      activeTeam = 0;
      playerShowcaseTrack.style.transform = 'translateX(0)';
      void playerShowcaseTrack.offsetWidth;
      playerShowcaseTrack.style.transition = 'transform .7s ease';
    };

    const showNextTeam = () => {
      // Recover immediately if a browser missed the previous transition event.
      if (activeTeam >= teamSlides.length) resetPlayerLoop();

      activeTeam += 1;
      playerShowcaseTrack.style.transition = 'transform .7s ease';
      playerShowcaseTrack.style.transform = `translateX(-${activeTeam * 100}%)`;

      if (activeTeam === teamSlides.length) {
        window.clearTimeout(playerLoopFallback);
        playerLoopFallback = window.setTimeout(resetPlayerLoop, 850);
      }
    };

    playerShowcaseTrack.addEventListener('transitionend', resetPlayerLoop);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) resetPlayerLoop();
    });

    const startPlayerRotation = () => {
      window.clearInterval(playerRotation);
      playerRotation = window.setInterval(showNextTeam, 3000);
    };
    playerShowcase.addEventListener('mouseenter', () => window.clearInterval(playerRotation));
    playerShowcase.addEventListener('mouseleave', startPlayerRotation);
    playerShowcase.addEventListener('focusin', () => window.clearInterval(playerRotation));
    playerShowcase.addEventListener('focusout', startPlayerRotation);
    startPlayerRotation();
  }
  $('.navbar-nav .nav-link').on('click', function () {
    const menu = document.getElementById('siteMenu');
    if (menu && menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
  $('#signUpDemo').on('click', function (event) {
    event.preventDefault();
    alert('Sign Up is a front-end demonstration and does not create a real account.');
  });
});
