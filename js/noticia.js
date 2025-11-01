document.addEventListener('DOMContentLoaded', () => {
  const $article = document.getElementById('article');
  if (!$article || typeof NEWS === 'undefined') {
    console.error("NEWS no está definido o no se encontró el elemento #article");
    return;
  }

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const n = NEWS.find(x => x.id === id);

  if (!n) {
    $article.innerHTML = `
      <section class="hero">
        <h1>No encontramos esta noticia</h1>
        <p>Es posible que el enlace haya cambiado o la noticia ya no esté disponible.</p>
        <p><a class="btn" href="noticias.html">Volver a noticias</a></p>
      </section>
    `;
    return;
  }

  const paragraphs = (n.content || []).map(p => <p>${p}</p>).join('');

  $article.innerHTML = `
    <header class="article__header">
      <h1 class="article__title">${n.title}</h1>
      <div class="article__meta">
        <span class="tag">${n.tag}</span>
        <time>${n.time}</time>
      </div>
      <p class="article__excerpt">${n.excerpt}</p>
    </header>

    <section class="article__content">
      ${paragraphs}
    </section>

    <figure class="article__figure">
      <img class="article__image" src="${n.imageLarge || n.img}" alt="Imagen de ${n.title}">
      <figcaption class="article__caption"></figcaption>
    </figure>

    <div class="article__back">
      <a href="noticias.html" class="btn">← Regresar a todas las noticias</a>
    </div>
  `;
});