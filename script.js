/* ==========================================================
   Yachay Wasi · Lógica de la página
   Catálogo con filtros, reservas guardadas en el navegador,
   horario en hora de Lima, agenda de eventos, carnet de socio,
   formularios con validación y tema claro/oscuro.
   ========================================================== */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento */ }
    }
  };

  const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* ---------------- Datos ---------------- */
  const BOOKS = [
    { id: 1, title: 'Los ríos profundos', author: 'José María Arguedas', year: 1958, cat: 'Narrativa', pages: 240, copies: 3,
      desc: 'Ernesto, un adolescente criado entre indios, llega a un internado en Abancay. Una novela sobre la infancia, la música y el choque de dos mundos en los Andes.' },
    { id: 2, title: 'La ciudad y los perros', author: 'Mario Vargas Llosa', year: 1963, cat: 'Narrativa', pages: 400, copies: 2,
      desc: 'La vida de un grupo de cadetes en el Colegio Militar Leoncio Prado, entre la violencia, la lealtad y el miedo. Una de las novelas fundamentales del boom latinoamericano.' },
    { id: 3, title: 'Tradiciones peruanas', author: 'Ricardo Palma', year: 1872, cat: 'Narrativa', pages: 520, copies: 4,
      desc: 'Relatos breves y llenos de humor que recorren la historia del Perú, desde el Inca hasta la República, con la gracia de un cronista limeño.' },
    { id: 4, title: 'Aves sin nido', author: 'Clorinda Matto de Turner', year: 1889, cat: 'Narrativa', pages: 280, copies: 0,
      desc: 'Primera gran novela indigenista del Perú. Denuncia los abusos contra las comunidades andinas y el poder de gobernadores y curas de provincia.' },
    { id: 5, title: 'El mundo es ancho y ajeno', author: 'Ciro Alegría', year: 1941, cat: 'Narrativa', pages: 560, copies: 1,
      desc: 'La historia de la comunidad de Rumi y su lucha por conservar la tierra frente a un hacendado. Un clásico de la narrativa social peruana.' },
    { id: 6, title: 'La palabra del mudo', author: 'Julio Ramón Ribeyro', year: 1972, cat: 'Narrativa', pages: 380, copies: 2,
      desc: 'Cuentos reunidos de uno de los grandes narradores breves de la lengua española, con personajes de la clase media limeña y sus pequeñas derrotas.' },
    { id: 7, title: 'Un mundo para Julius', author: 'Alfredo Bryce Echenique', year: 1970, cat: 'Narrativa', pages: 600, copies: 1,
      desc: 'Julius crece entre mayordomos y mansiones en la Lima aristocrática, y descubre poco a poco las desigualdades que lo rodean.' },
    { id: 8, title: 'Redoble por Rancas', author: 'Manuel Scorza', year: 1970, cat: 'Narrativa', pages: 330, copies: 0,
      desc: 'Primera entrega de "La guerra silenciosa", basada en la lucha de comunidades de Cerro de Pasco contra una empresa minera estadounidense.' },
    { id: 9, title: 'Trilce', author: 'César Vallejo', year: 1922, cat: 'Poesía', pages: 150, copies: 3,
      desc: 'Poemario de vanguardia que rompe con la sintaxis y el vocabulario tradicionales. Una de las obras más radicales de la poesía en español.' },
    { id: 10, title: 'Comentarios reales', author: 'Inca Garcilaso de la Vega', year: 1609, cat: 'Historia', pages: 700, copies: 1,
      desc: 'Crónica del mundo incaico escrita por un mestizo cuzqueño. Una fuente clave para conocer la memoria andina y la visión de su autor.' },
    { id: 11, title: '7 ensayos de interpretación de la realidad peruana', author: 'José Carlos Mariátegui', year: 1928, cat: 'Ensayo', pages: 420, copies: 2,
      desc: 'Análisis de la economía, la tierra, la educación, la religión y la literatura del Perú desde una mirada marxista y profundamente original.' },
    { id: 12, title: 'El caballero Carmelo', author: 'Abraham Valdelomar', year: 1918, cat: 'Narrativa', pages: 90, copies: 5,
      desc: 'Cuento clásico sobre un gallo de pelea y una familia de provincia. Una lectura breve, tierna y muy querida por generaciones de escolares.' },
    { id: 13, title: 'Abril rojo', author: 'Santiago Roncagliolo', year: 2006, cat: 'Narrativa', pages: 290, copies: 2,
      desc: 'Un fiscal investiga una serie de crímenes en Ayacucho durante la Semana Santa. Novela negra que dialoga con la memoria reciente del país.' },
    { id: 14, title: 'Cuentos andinos para niños', author: 'Colección Wawakuna', year: 2015, cat: 'Infantil', pages: 64, copies: 6,
      desc: 'Zorros, cóndores y vizcachas protagonizan relatos de tradición oral andina, con ilustraciones a todo color. Para leer en voz alta.' },
    { id: 15, title: 'El principito', author: 'Antoine de Saint-Exupéry', year: 1943, cat: 'Infantil', pages: 96, copies: 4,
      desc: 'Un piloto varado en el desierto conoce a un niño que viene de otro planeta. Un cuento para todas las edades sobre la amistad y lo esencial.' },
    { id: 16, title: 'Breve historia del tiempo', author: 'Stephen Hawking', year: 1988, cat: 'Ciencia', pages: 256, copies: 2,
      desc: 'Una explicación accesible del origen del universo, los agujeros negros y la naturaleza del tiempo, sin necesidad de fórmulas.' },
    { id: 17, title: 'Cien años de soledad', author: 'Gabriel García Márquez', year: 1967, cat: 'Narrativa', pages: 471, copies: 0,
      desc: 'La saga de la familia Buendía en Macondo, entre lo cotidiano y lo extraordinario. La novela más conocida del realismo mágico.' },
    { id: 18, title: 'La Tierra y el cielo: guía de aves del Perú', author: 'Equipo Yachay Wasi', year: 2021, cat: 'Ciencia', pages: 180, copies: 3,
      desc: 'Guía ilustrada con más de 120 aves comunes en costa, sierra y selva, con consejos para observarlas y reconocer su canto.' }
  ];

  const CATEGORIES = ['Todas', 'Narrativa', 'Poesía', 'Historia', 'Ensayo', 'Infantil', 'Ciencia'];

  // Horario: índice 0 = domingo. null = cerrado.
  const HOURS = [null, [8, 20], [8, 20], [8, 20], [8, 20], [8, 20], [9, 17]];
  const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const pad = (n) => String(n).padStart(2, '0');

  // Eventos definidos por días a partir de hoy, para que la agenda nunca quede vencida.
  const EVENTS = [
    { offset: 1, time: '17:00', title: 'Cuentacuentos en quechua y castellano', place: 'Sala Wawakuna', tag: 'Infantil' },
    { offset: 3, time: '18:30', title: 'Club de lectura: "Los ríos profundos"', place: 'Sala de lectura', tag: 'Club' },
    { offset: 6, time: '10:00', title: 'Taller de escritura de cuentos breves', place: 'Aula 2', tag: 'Taller' },
    { offset: 9, time: '19:00', title: 'Conversatorio sobre Ribeyro y el cuento peruano', place: 'Auditorio', tag: 'Charla' },
    { offset: 12, time: '09:30', title: 'Visita guiada para colegios', place: 'Hall principal', tag: 'Visita' },
    { offset: 15, time: '16:00', title: 'Quechua básico para principiantes', place: 'Aula 1', tag: 'Taller' }
  ];

  /* ---------------- Utilidades de fecha y hora (Lima) ---------------- */
  function limaNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Lima', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: map[get('weekday')], hour: Number(get('hour')) % 24, minute: Number(get('minute')) };
  }

  function openStatus() {
    const { day, hour, minute } = limaNow();
    const now = hour + minute / 60;
    const today = HOURS[day];
    if (today && now >= today[0] && now < today[1]) {
      return { open: true, text: `Abierto ahora · cerramos a las ${pad(today[1])}:00` };
    }
    if (today && now < today[0]) {
      return { open: false, text: `Cerrado · abrimos hoy a las ${pad(today[0])}:00` };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (HOURS[d]) {
        const when = i === 1 ? 'mañana' : `el ${DAYS[d].toLowerCase()}`;
        return { open: false, text: `Cerrado · abrimos ${when} a las ${pad(HOURS[d][0])}:00` };
      }
    }
    return { open: false, text: 'Cerrado' };
  }

  /* ---------------- Aviso (toast) ---------------- */
  let toastTimer;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------------- Reservas ---------------- */
  const reservas = new Set(store.get('yw-reservas', []));

  function saveReservas() { store.set('yw-reservas', Array.from(reservas)); }
  function bookById(id) { return BOOKS.find((b) => b.id === id); }

  function reserveLabel(book) {
    if (reservas.has(book.id)) return 'Reservado';
    return book.copies > 0 ? 'Reservar' : 'Lista de espera';
  }

  function toggleReserva(id) {
    const book = bookById(id);
    if (reservas.has(id)) {
      reservas.delete(id);
      toast(`Cancelaste tu reserva de "${book.title}"`);
    } else {
      reservas.add(id);
      toast(book.copies > 0
        ? `Reservaste "${book.title}". Recógelo en 3 días hábiles.`
        : `Estás en la lista de espera de "${book.title}".`);
    }
    saveReservas();
    refreshReservas();
  }

  function refreshReservas() {
    $('#reservasCount').textContent = reservas.size;
    renderBooks();
    if ($('#bookDialog').open) fillBookDialog(currentBookId);
    if ($('#resDialog').open) renderReservasList();
  }

  /* ---------------- Catálogo ---------------- */
  const state = { q: '', cat: 'Todas', onlyAvail: false, sort: 'titulo' };

  function renderChips() {
    const box = $('#chips');
    box.innerHTML = CATEGORIES.map((c) =>
      `<button type="button" class="chip" data-cat="${c}" aria-pressed="${state.cat === c}">${c}</button>`
    ).join('');
  }

  function filteredBooks() {
    const q = normalize(state.q.trim());
    let list = BOOKS.filter((b) => {
      if (state.cat !== 'Todas' && b.cat !== state.cat) return false;
      if (state.onlyAvail && b.copies === 0) return false;
      if (q && !normalize(`${b.title} ${b.author}`).includes(q)) return false;
      return true;
    });
    const by = {
      'titulo': (a, b) => a.title.localeCompare(b.title, 'es'),
      'autor': (a, b) => a.author.localeCompare(b.author, 'es'),
      'año-desc': (a, b) => b.year - a.year,
      'año-asc': (a, b) => a.year - b.year
    };
    return list.sort(by[state.sort]);
  }

  function renderBooks() {
    const list = filteredBooks();
    $('#results').textContent = `Mostrando ${list.length} de ${BOOKS.length} títulos`;
    $('#books').innerHTML = list.length ? list.map((b) => {
      const reserved = reservas.has(b.id);
      const pill = b.copies > 0
        ? `<span class="pill ok">${b.copies} disponible${b.copies > 1 ? 's' : ''}</span>`
        : `<span class="pill no">Prestado</span>`;
      return `
        <article class="book">
          <button type="button" class="cover" data-cat="${b.cat}" data-open="${b.id}" aria-label="Ver detalle de ${b.title}">
            <span class="c-cat">${b.cat}</span>
            <span>
              <span class="c-title">${b.title}</span>
              <span class="c-author">${b.author}</span>
            </span>
          </button>
          <div class="book-foot"><span class="book-year">${b.year}</span>${pill}</div>
          <button type="button" class="btn ${reserved ? 'done' : 'ghost'}" data-reserve="${b.id}">${reserveLabel(b)}</button>
        </article>`;
    }).join('') : `<p class="empty">No encontramos libros con esos filtros. Prueba con otro autor o quita alguna categoría.</p>`;
  }

  /* ---------------- Detalle de libro ---------------- */
  let currentBookId = null;

  function fillBookDialog(id) {
    const b = bookById(id);
    if (!b) return;
    $('#dTitle').textContent = b.title;
    $('#dAuthor').textContent = b.author;
    $('#dMeta').innerHTML =
      `<div><dt>Año</dt><dd>${b.year}</dd></div>` +
      `<div><dt>Páginas</dt><dd>${b.pages}</dd></div>` +
      `<div><dt>Categoría</dt><dd>${b.cat}</dd></div>`;
    $('#dDesc').textContent = b.desc;
    const pill = $('#dPill');
    pill.className = 'pill ' + (b.copies > 0 ? 'ok' : 'no');
    pill.textContent = b.copies > 0 ? `${b.copies} ejemplar${b.copies > 1 ? 'es' : ''} disponible${b.copies > 1 ? 's' : ''}` : 'Prestado, hay lista de espera';
    const btn = $('#dReserve');
    btn.textContent = reserveLabel(b);
    btn.className = 'btn ' + (reservas.has(b.id) ? 'done' : 'primary');
  }

  function openBook(id) {
    currentBookId = id;
    fillBookDialog(id);
    $('#bookDialog').showModal();
  }

  /* ---------------- Mis reservas ---------------- */
  function renderReservasList() {
    const list = $('#resList');
    if (!reservas.size) {
      list.innerHTML = '<li><span>Todavía no tienes reservas. Elige un libro del catálogo.</span></li>';
      return;
    }
    list.innerHTML = Array.from(reservas).map((id) => {
      const b = bookById(id);
      return `<li><span><b>${b.title}</b><small>${b.author} · ${b.copies > 0 ? 'Para recoger en mostrador' : 'En lista de espera'}</small></span>
        <button type="button" class="icon-btn" data-cancel="${id}">Cancelar</button></li>`;
    }).join('');
  }

  /* ---------------- Eventos ---------------- */
  function renderEvents() {
    const base = new Date();
    const items = EVENTS.map((e) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + e.offset);
      return { ...e, date: d };
    });
    $('#events').innerHTML = items.map((e) => {
      const mon = e.date.toLocaleDateString('es-PE', { month: 'short' }).replace('.', '');
      const dow = e.date.toLocaleDateString('es-PE', { weekday: 'long' });
      return `<li class="event">
        <div class="date"><span class="d-day">${e.date.getDate()}</span><span class="d-mon">${mon}</span></div>
        <div><h3>${e.title}</h3><p>${dow.charAt(0).toUpperCase() + dow.slice(1)}, ${e.time} · ${e.place}</p></div>
        <span class="tag">${e.tag}</span>
      </li>`;
    }).join('');

    const first = items[0];
    const fdow = first.date.toLocaleDateString('es-PE', { weekday: 'long' });
    $('#heroEvent').innerHTML = `${first.title}<small>${fdow.charAt(0).toUpperCase() + fdow.slice(1)} ${first.date.getDate()}, ${first.time} · ${first.place}</small>`;
  }

  /* ---------------- Horarios ---------------- */
  function renderHours() {
    const { day } = limaNow();
    const order = [1, 2, 3, 4, 5, 6, 0];
    $('#hoursBody').innerHTML = order.map((d) => {
      const h = HOURS[d];
      return `<tr class="${d === day ? 'today-row' : ''}"><th scope="row">${DAYS[d]}</th><td>${h ? `${pad(h[0])}:00 a ${pad(h[1])}:00` : 'Cerrado'}</td></tr>`;
    }).join('');
  }

  function renderStatus() {
    const s = openStatus();
    ['heroStatus', 'hoursStatus'].forEach((id) => {
      const el = $('#' + id);
      el.classList.toggle('open', s.open);
      el.classList.toggle('closed', !s.open);
    });
    $('#heroStatusText').textContent = s.text;
    $('#hoursStatusText').textContent = s.text;
    renderHours();
  }

  /* ---------------- Validación ---------------- */
  function setError(input, errEl, message) {
    errEl.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    return !message;
  }
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  /* ---------------- Carnet de socio ---------------- */
  function setupMemberForm() {
    const form = $('#memberForm');
    $('#mDni').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = $('#mNombre'), dni = $('#mDni'), correo = $('#mCorreo');
      const ok = [
        setError(nombre, $('#eNombre'), nombre.value.trim().split(/\s+/).length >= 2 ? '' : 'Escribe tu nombre y apellido.'),
        setError(dni, $('#eDni'), /^\d{8}$/.test(dni.value) ? '' : 'El DNI tiene 8 números.'),
        setError(correo, $('#eCorreo'), isEmail(correo.value.trim()) ? '' : 'Escribe un correo válido, por ejemplo nombre@correo.com.')
      ].every(Boolean);
      if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }

      const plan = $('input[name="plan"]:checked').value;
      const year = new Date().getFullYear();
      const num = `YW-${year}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
      $('#cName').textContent = nombre.value.trim();
      $('#cPlan').textContent = plan;
      $('#cNum').textContent = num;
      $('#cValid').textContent = `Válido hasta diciembre de ${year + 1}, tras activarlo con tu DNI`;
      $('#carnet').hidden = false;
      $('#carnetEmpty').hidden = true;
      toast('Tu carnet virtual está listo');
    });
  }

  /* ---------------- Contacto ---------------- */
  function setupContactForm() {
    const form = $('#contactForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = $('#cNombre'), c = $('#cCorreo'), m = $('#cMsg');
      const ok = [
        setError(n, $('#ecNombre'), n.value.trim() ? '' : 'Escribe tu nombre.'),
        setError(c, $('#ecCorreo'), isEmail(c.value.trim()) ? '' : 'Escribe un correo válido.'),
        setError(m, $('#ecMsg'), m.value.trim().length >= 10 ? '' : 'Cuéntanos un poco más, mínimo 10 caracteres.')
      ].every(Boolean);
      if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
      const msg = $('#contactOk');
      msg.textContent = `Gracias, ${n.value.trim().split(/\s+/)[0]}. Recibimos tu mensaje y te responderemos al correo indicado.`;
      msg.hidden = false;
      form.reset();
    });
  }

  /* ---------------- Tema claro / oscuro ---------------- */
  function setupTheme() {
    const root = document.documentElement;
    const saved = store.get('yw-tema', null);
    if (saved) root.setAttribute('data-theme', saved);

    $('#themeToggle').addEventListener('click', () => {
      const current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('yw-tema', next);
    });
  }

  /* ---------------- Eventos de la interfaz ---------------- */
  function setupUI() {
    // Menú móvil
    const toggle = $('#navToggle'), nav = $('#mainNav');
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });

    // Búsqueda del hero
    $('#heroSearch').addEventListener('submit', (e) => {
      e.preventDefault();
      state.q = $('#heroQ').value;
      $('#q').value = state.q;
      renderBooks();
      $('#catalogo').scrollIntoView();
    });

    // Filtros del catálogo
    $('#q').addEventListener('input', (e) => { state.q = e.target.value; renderBooks(); });
    $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; renderBooks(); });
    $('#onlyAvail').addEventListener('change', (e) => { state.onlyAvail = e.target.checked; renderBooks(); });
    $('#chips').addEventListener('click', (e) => {
      const chip = e.target.closest('[data-cat]');
      if (!chip) return;
      state.cat = chip.dataset.cat;
      renderChips();
      renderBooks();
    });

    // Tarjetas de libros
    $('#books').addEventListener('click', (e) => {
      const open = e.target.closest('[data-open]');
      const res = e.target.closest('[data-reserve]');
      if (open) openBook(Number(open.dataset.open));
      if (res) toggleReserva(Number(res.dataset.reserve));
    });

    // Diálogos
    $('#dReserve').addEventListener('click', () => toggleReserva(currentBookId));
    $('#btnReservas').addEventListener('click', () => { renderReservasList(); $('#resDialog').showModal(); });
    $('#resList').addEventListener('click', (e) => {
      const c = e.target.closest('[data-cancel]');
      if (c) toggleReserva(Number(c.dataset.cancel));
    });
    $$('dialog').forEach((dlg) => {
      dlg.addEventListener('click', (e) => {
        if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
      });
    });
  }

  /* ---------------- Inicio ---------------- */
  function init() {
    setupTheme();
    renderChips();
    renderBooks();
    renderEvents();
    renderStatus();
    setInterval(renderStatus, 60000);
    setupUI();
    setupMemberForm();
    setupContactForm();
    $('#reservasCount').textContent = reservas.size;
    $('#year').textContent = new Date().getFullYear();
    $('#yearsOpen').textContent = new Date().getFullYear() - 1962;
  }

  init();
})();
