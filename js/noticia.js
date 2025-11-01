document.addEventListener('DOMContentLoaded', () => {
  const $article = document.getElementById('article');
  if (!$article) return;

  try {
    if (typeof NEWS === 'undefined' || !Array.isArray(NEWS) || !NEWS.length){
      $article.innerHTML = heroMsg(
        'No hay noticias para mostrar',
        'Revisa js/news-data.js y que se cargue ANTES de js/noticia.js en noticia.html.',
        true
      );
      return;
    }

    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const n = NEWS.find(x => x.id === id);

    if (!n) {
      $article.innerHTML = heroMsg(
        'No encontramos esta noticia',
        'Es posible que el enlace haya cambiado o la noticia ya no esté disponible.',
        true
      );
      return;
    }

    const paragraphs = Array.isArray(n.content) ? n.content.map(p => `<p>${escapeHtml(p)}</p>`).join('') : '';

    $article.innerHTML = `
      <header class="article__header">
        <h1 class="article__title">${escapeHtml(n.title)}</h1>
        <div class="article__meta">
          <span class="tag">${escapeHtml(n.tag || '')}</span>
          <time>${escapeHtml(n.time || '')}</time>
        </div>
        <p class="article__excerpt">${escapeHtml(n.excerpt || '')}</p>
      </header>

      <section class="article__content">
        ${paragraphs}
      </section>

      <figure class="article__figure">
        <img class="article__image" src="${n.imageLarge || n.img || ''}" alt="Imagen de ${escapeHtml(n.title)}">
        <figcaption class="article__caption">Foto: F1FanZone</figcaption>
      </figure>

      <div class="article__back">
        <a href="noticias.html" class="btn">← Regresar a todas las noticias</a>
      </div>
    `;
  } catch (err) {
    console.error('[Noticia] Error:', err);
    $article.innerHTML = heroMsg('Ocurrió un error al cargar la noticia.', 'Revisa la consola del navegador.');
  }
});

function heroMsg(title, text, withBack=false){
  return `
    <section class="hero">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(text)}</p>
      ${withBack ? `<p><a class="btn" href="noticias.html">Volver a noticias</a></p>` : ''}
    </section>
  `;
}

function escapeHtml(str){
  return String(str || '').replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[s]));
}
