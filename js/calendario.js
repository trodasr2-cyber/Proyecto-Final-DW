document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  try {
    const data = (typeof CALENDAR !== 'undefined' && Array.isArray(CALENDAR)) ? CALENDAR : [];
    if (!data.length) {
      grid.innerHTML = errorBox('No se encontraron datos del calendario. Revisa js/calendar-data.js y que se cargue ANTES de js/calendario.js en calendario.html.');
      return;
    }
    grid.innerHTML = data.map(renderCard).join('');
  } catch (err) {
    console.error('[Calendario] Error:', err);
    grid.innerHTML = errorBox('Hubo un error al renderizar el calendario. Revisa la consola del navegador.');
  }
});

function renderCard(ev){
  const round = ev.round || 'Round';
  const dateHtml = ev.date ? `<span class="gp-date">${ev.date}</span>` : '';

  const header = `
    <div class="gp-card__head">
      <span class="gp-round">${round}</span>
      ${dateHtml}
    </div>
    <h3 class="gp-title"><span class="gp-flag"></span> ${escapeHtml(ev.country || '')}</h3>
    <p class="gp-sub">${escapeHtml(ev.title || '')}</p>
  `;

  let body = '';
  if (ev.status === 'past' && Array.isArray(ev.podium) && ev.podium.length){
    body = `
      <div class="gp-podium">
        ${ev.podium.slice(0,3).map(p => podiumItem(p)).join('')}
      </div>
    `;
  } else if (ev.trackImg) {

    body = `
      <div class="gp-track">
        <img src="${ev.trackImg}" alt="Circuito de ${escapeHtml(ev.country || '')}">
      </div>
    `;
  }

  const badge = ev.highlight ? `<span class="gp-badge">NEXT RACE</span>` : '';

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
  const code = (p.code || '').toUpperCase();
  const time = p.time || '';
  const img = p.img || 'img/pilotos/placeholder.png';
  const name = p.name || code;

  return `
    <div class="podium">
      <div class="podium__pos">${posText}</div>
      <div class="podium__driver">
        <img src="${img}" alt="${escapeHtml(name)}">
        <div class="podium__meta">
          <strong>${escapeHtml(code)}</strong>
          <span>${escapeHtml(time)}</span>
        </div>
      </div>
    </div>
  `;
}

function errorBox(msg){
  return `<div style="padding:16px;border:1px solid var(--line);border-radius:12px;background:#13161a;color:#ffb4b4;">
    <strong>⚠️ Atención:</strong> ${escapeHtml(msg)}
  </div>`;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[s]));
}
