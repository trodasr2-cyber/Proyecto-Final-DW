document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  const data = Array.isArray(CALENDAR) ? CALENDAR : [];
  grid.innerHTML = data.map(renderCard).join('');
});

function renderCard(ev){
  const dateHtml = ev.date ? <span class="gp-date">${ev.date}</span> : '';

  const header = `
    <div class="gp-card__head">
      <span class="gp-round">${ev.round}</span>
      ${dateHtml}
    </div>
    <h3 class="gp-title">
      <span class="gp-flag"></span> ${ev.country}
    </h3>
    <p class="gp-sub">${ev.title}</p>
  `;

  let body = '';
  if (ev.status === 'past' && ev.podium && ev.podium.length){
    body = `
      <div class="gp-podium">
        ${ev.podium.slice(0,3).map(p => podiumItem(p)).join('')}
      </div>
    `;
  } else if (ev.trackImg) {
    body = `
      <div class="gp-track">
        <img src="${ev.trackImg}" alt="Circuito de ${ev.country}" />
      </div>
    `;
  }

  const badge = ev.highlight ? <span class="gp-badge">NEXT RACE</span> : '';

  return `
    <article class="gp-card ${ev.status === 'upcoming' ? 'is-upcoming' : ''}">
      ${badge}
      ${header}
      ${body}
    </article>
  `;
}

function podiumItem(p){
  const posText = p.pos === 1 ? '1ST' : (p.pos === 2 ? '2ND' : '3RD');
  return `
    <div class="podium">
      <div class="podium__pos">${posText}</div>
      <div class="podium__driver">
        <img src="${p.img}" alt="${p.name}">
        <div class="podium__meta">
          <strong>${p.code}</strong>
          <span>${p.time}</span>
        </div>
      </div>
    </div>
  `;
}