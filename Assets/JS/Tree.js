document.addEventListener('DOMContentLoaded', () => {
  const stageTabs = document.querySelectorAll('.section-results .stage-tab');
  const playoffsPane = document.getElementById('playoffsPane');
  const groupsPane = document.getElementById('groupsPane');
  const bracketWrap = document.getElementById('bracketWrap');
  const bracket = document.getElementById('bracket');
  const svgLines = document.getElementById('bracketLines');
  const connectors = [
    ['qf1', 'sf1'], ['qf2', 'sf1'],
    ['qf3', 'sf2'], ['qf4', 'sf2'],
    ['sf1', 'gf1'], ['sf2', 'gf1'],
    ['gf1', 'champ']
  ];

  const drawBracketLines = () => {
    if (!bracket || !bracketWrap || !svgLines) return;

    requestAnimationFrame(() => {
      const bracketRect = bracket.getBoundingClientRect();
      const wrapRect = bracketWrap.getBoundingClientRect();
      const svgLeft = bracketRect.left - wrapRect.left + bracketWrap.scrollLeft;
      const svgTop = bracketRect.top - wrapRect.top + bracketWrap.scrollTop;

      svgLines.style.left = svgLeft + 'px';
      svgLines.style.top = svgTop + 'px';
      svgLines.style.width = bracketRect.width + 'px';
      svgLines.style.height = bracketRect.height + 'px';
      svgLines.setAttribute('width', bracketRect.width);
      svgLines.setAttribute('height', bracketRect.height);
      svgLines.setAttribute('viewBox', `0 0 ${bracketRect.width} ${bracketRect.height}`);
      svgLines.innerHTML = '';

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `
        <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>`;
      svgLines.appendChild(defs);

      connectors.forEach(([srcId, tgtId]) => {
        const srcEl = document.querySelector(`[data-match="${srcId}"]`);
        const tgtEl = document.querySelector(`[data-match="${tgtId}"]`);
        if (!srcEl || !tgtEl) return;

        const srcRect = srcEl.getBoundingClientRect();
        const tgtRect = tgtEl.getBoundingClientRect();
        const x1 = srcRect.right - bracketRect.left;
        const y1 = (srcRect.top + srcRect.bottom) / 2 - bracketRect.top;
        const x2 = tgtRect.left - bracketRect.left;
        const y2 = (tgtRect.top + tgtRect.bottom) / 2 - bracketRect.top;
        const mx = (x1 + x2) / 2;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} H ${mx} V ${y2} H ${x2}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#bc1b2b');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('stroke-opacity', '0.4');
        path.setAttribute('filter', 'url(#lineGlow)');
        svgLines.appendChild(path);
      });
    });
  };

  stageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      stageTabs.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const stage = tab.dataset.stage;
      if (playoffsPane) playoffsPane.hidden = stage !== 'playoffs';
      if (groupsPane) groupsPane.hidden = stage !== 'groups';
      if (stage === 'playoffs') drawBracketLines();
    });
  });

  document.querySelectorAll('.section-results .bracket-team').forEach(team => {
    team.addEventListener('mouseenter', () => {
      const nameSpan = team.querySelector('span:first-child');
      if (!nameSpan) return;
      const name = nameSpan.textContent.trim();
      document.querySelectorAll('.section-results .bracket-team').forEach(el => {
        const elName = el.querySelector('span:first-child');
        if (elName && elName.textContent.trim() === name) {
          el.classList.add('team-highlight');
          el.closest('.bracket-match')?.classList.add('match-highlight');
        }
      });
    });

    team.addEventListener('mouseleave', () => {
      document.querySelectorAll('.section-results .bracket-team.team-highlight').forEach(el => {
        el.classList.remove('team-highlight');
      });
      document.querySelectorAll('.section-results .bracket-match.match-highlight').forEach(el => {
        el.classList.remove('match-highlight');
      });
    });
  });

  window.addEventListener('load', drawBracketLines);
  window.addEventListener('resize', () => setTimeout(drawBracketLines, 120));
});
