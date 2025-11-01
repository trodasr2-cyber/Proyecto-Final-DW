document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  const hasNEWS = (typeof NEWS !== 'undefined') && Array.isArray(NEWS) && NEWS.length > 0;
  const data = hasNEWS ? NEWS : [
    {
      id: "piastri-passenger-princess",
      title: "Oscar Piastri se convierte en el nuevo instructor de conducción de Amelia Dimoldenberg en ‘La princesa pasajera’",
      time: "hace 5 horas",
      tag: "VIDEO",
      img: "img/noticias/n1.jpg",
      excerpt: "El piloto de McLaren se une a la divertida serie con Amelia y revela anécdotas del paddock."
    },
    {
      id: "louis-tomlinson-vegas",
      title: "Louis Tomlinson, Kane Brown y otros encabezarán el entretenimiento de la parrilla del Gran Premio de Las Vegas",
      time: "hace 6 horas",
      tag: "ENTRETENIMIENTO",
      img: "img/noticias/n2.jpg",
      excerpt: "El cantante británico participará en el evento musical previo al GP de Las Vegas."
    },
    {
      id: "palmer-penalizaciones-mexico",
      title: "¿Debieron haber más penalizaciones en México?",
      time: "hace 7 horas",
      tag: "ANÁLISIS",
      img: "img/escuderias/ferrari.png",
      excerpt: "Jolyon Palmer analiza las maniobras polémicas y la consistencia de los comisarios."
    }
  ];

  grid.innerHTML = data.map(n => `
    <article class="news-card">
      <div class="news-card__media">
        <img src="${n.img}" alt="Imagen de ${n.title}">
        <span class="news-card__tag">${n.tag}</span>
      </div>
      <div class="news-card__body">
        <h3 class="news-card__title">${n.title}</h3>
        <p class="news-card__excerpt">${n.excerpt}</p>
      </div>
      <div class="news-card__meta">
        <time>${n.time}</time>
        <a class="news-card__btn" href="noticia.html?id=${encodeURIComponent(n.id)}">Leer</a>
      </div>
    </article>
  `).join('');

  if (!hasNEWS) {
    console.warn("[Noticias] Usando datos de fallback. Revisa que js/news-data.js exista y se cargue antes de js/noticias.js");
  }
});