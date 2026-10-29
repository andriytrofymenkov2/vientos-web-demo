/* Interacción general: scroll suave, navegación, estado abierto/cerrado, servicios, planes, horarios,
   fotos con parallax, comunidad, convenios y animaciones de entrada. */
(function () {
  var V = window.VIENTOS;
  var foto = window.vientosFoto;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var lento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var escritorio = window.matchMedia("(min-width: 1024px)");

  function wa(texto) { return "https://wa.me/" + V.whatsapp + "?text=" + encodeURIComponent(texto); }
  window.vientosWa = wa;

  var srvPorId = {};
  function indexarServicios() {
    srvPorId = {};
    (V.servicios || []).forEach(function (s) { srvPorId[s.id] = s; });
  }
  indexarServicios();

  function srcset(url, anchos) {
    if (!url || url.indexOf("images.unsplash.com") === -1) return "";
    return anchos.map(function (w) { return foto(url, w) + " " + w + "w"; }).join(", ");
  }

  /* ---------- Scroll suave ---------- */
  var lenis = null;
  if (window.Lenis && !lento) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    (function bucle(t) { lenis.raf(t); requestAnimationFrame(bucle); })(performance.now());
    window.vientosLenis = lenis;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (id.length < 2) return;
    var destino = document.getElementById(id.slice(1));
    if (!destino) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(destino, { duration: 1.4 });
    else destino.scrollIntoView({ behavior: lento ? "auto" : "smooth" });
    if (history.replaceState) history.replaceState(null, "", id);
  });

  /* ---------- Links ---------- */
  function actualizarLinksGenerales() {
    $$("[data-wa]").forEach(function (a) {
      a.href = wa((V.mensajes && V.mensajes[a.getAttribute("data-wa")]) || V.mensajes.general);
    });
    $$("[data-mapa]").forEach(function (a) { a.href = V.mapa; });
    $$("[data-dj]").forEach(function (a) { a.href = V.djForm; });
  }
  actualizarLinksGenerales();
  $$("[data-anio]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
  $$("img[data-src]").forEach(function (img) {
    var u = img.getAttribute("data-src"), w = parseInt(img.getAttribute("data-w") || "1200", 10);
    img.src = foto(u, w);
    var s = srcset(u, [Math.round(w * 0.5), w, Math.round(w * 1.5)]);
    if (s) { img.srcset = s; img.sizes = "(min-width: 1024px) 45vw, 90vw"; }
  });

  /* ---------- Hora de Río Gallegos ---------- */
  var NOMBRE_DIA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var DIAS = [[1, "Lunes"], [2, "Martes"], [3, "Miércoles"], [4, "Jueves"], [5, "Viernes"], [6, "Sábado"]];

  function ahora() {
    try {
      var partes = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Argentina/Rio_Gallegos", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23"
      }).formatToParts(new Date());
      var o = {};
      partes.forEach(function (p) { o[p.type] = p.value; });
      var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { dia: dias[o.weekday], min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function aMin(h) { var p = String(h || "0:0").split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1] || "0", 10); }
  function fmtHora(n) {
    if (typeof n === "string" && n.indexOf(":") >= 0) {
      var p = n.split(":");
      var hh = parseInt(p[0], 10);
      return (hh < 10 ? "0" : "") + hh + ":" + (p[1] || "00");
    }
    var num = parseInt(n, 10);
    return (num < 10 ? "0" : "") + num + ":00";
  }
  function hora(h) { return fmtHora(h); }

  function estado() {
    var a = ahora(), h = V.horario && V.horario[a.dia];
    if (h && a.min >= h[0] * 60 && a.min < h[1] * 60) {
      return { abierto: true, corto: "Abierto ahora · hasta las " + fmtHora(h[1]) + " hs", largo: "Abierto · cierra a las " + fmtHora(h[1]) + " hs" };
    }
    if (h && a.min < h[0] * 60) {
      return { abierto: false, corto: "Cerrado · abre hoy a las " + fmtHora(h[0]) + " hs", largo: "Cerrado · abre a las " + fmtHora(h[0]) + " hs" };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (a.dia + i) % 7, hh = V.horario && V.horario[d];
      if (hh) {
        var cuando = i === 1 ? "mañana" : "el " + NOMBRE_DIA[d];
        return { abierto: false, corto: "Cerrado · abre " + cuando + " a las " + fmtHora(hh[0]) + " hs", largo: "Cerrado · abre " + cuando + " a las " + fmtHora(hh[0]) + " hs" };
      }
    }
    return { abierto: false, corto: "Cerrado", largo: "Cerrado" };
  }

  function pintarEstado() {
    var e = estado(), a = ahora();
    $$("[data-estado]").forEach(function (n) {
      n.classList.toggle("is-open", e.abierto);
      $(".estado__txt", n).textContent = e.corto;
    });
    $$("[data-estado-largo]").forEach(function (n) {
      n.classList.toggle("is-open", e.abierto);
      n.innerHTML = '<i class="estado__dot"></i><span>' + e.largo + "</span>";
    });
    var lv = $("[data-hor-lv]"), sab = $("[data-hor-sab]"), dom = $("[data-hor-dom]");
    var txtLv = V.horario && V.horario[1] ? fmtHora(V.horario[1][0]) + " a " + fmtHora(V.horario[1][1]) + " hs" : "Cerrado";
    var txtSab = V.horario && V.horario[6] ? fmtHora(V.horario[6][0]) + " a " + fmtHora(V.horario[6][1]) + " hs" : "Cerrado";
    if (lv && V.horario) lv.textContent = txtLv;
    if (sab && V.horario) sab.textContent = txtSab;
    if (dom && V.horario) dom.textContent = V.horario[0] ? fmtHora(V.horario[0][0]) + " a " + fmtHora(V.horario[0][1]) + " hs" : "Cerrado";
    $$("[data-hor-lv-txt]").forEach(function (n) { n.textContent = txtLv; });
    $$("[data-hor-sab-txt]").forEach(function (n) { n.textContent = txtSab; });

    var filas = $$(".hor__rows > div");
    if (filas.length === 3) {
      var fila = a.dia === 0 ? 2 : a.dia === 6 ? 1 : 0;
      filas.forEach(function (f, i) { f.classList.toggle("is-hoy", i === fila); });
    }

    var aviso = $("[data-aviso-horario]");
    if (aviso) {
      if (V.avisoHorario && V.avisoHorario.activo && V.avisoHorario.texto) {
        aviso.hidden = false;
        aviso.innerHTML = "<b>" + (V.avisoHorario.titulo || "Aviso") + "</b><span>" + V.avisoHorario.texto + "</span>";
      } else {
        aviso.hidden = true;
      }
    }
  }

  /* ---------- Navegación ---------- */
  var nav = $("#nav"), burger = $(".nav__burger"), menu = $("#menu");
  var ultimoY = window.scrollY;

  function menuAbierto() { return burger.getAttribute("aria-expanded") === "true"; }
  function abrirMenu(si) {
    burger.setAttribute("aria-expanded", si ? "true" : "false");
    burger.setAttribute("aria-label", si ? "Cerrar menú" : "Abrir menú");
    if (si) {
      menu.hidden = false;
      nav.classList.remove("is-hidden");
      requestAnimationFrame(function () { menu.classList.add("is-open"); });
      document.documentElement.style.overflow = "hidden";
      if (lenis) lenis.stop();
    } else {
      menu.classList.remove("is-open");
      menu.hidden = true;
      document.documentElement.style.overflow = "";
      if (lenis) lenis.start();
    }
  }
  burger.addEventListener("click", function () { abrirMenu(!menuAbierto()); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { abrirMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menuAbierto()) abrirMenu(false); });
  escritorio.addEventListener("change", function (m) { if (m.matches && menuAbierto()) abrirMenu(false); });

  if ("IntersectionObserver" in window) {
    var links = $$(".nav__links a");
    var obsNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section, .pie").forEach(function (s) {
      if (!s.id) s.id = "s-" + (s.className.split(" ")[0] || "x");
      obsNav.observe(s);
    });
  }

  /* ---------- Parallax de fotos ---------- */
  var hero = $(".hero"), heroImg = $(".hero__img");
  var conParallax = $$("[data-parallax]");
  function parallax() {
    var vh = window.innerHeight, y = window.scrollY;
    if (heroImg && y < vh * 1.3) heroImg.style.translate = "0 " + (y * 0.3).toFixed(1) + "px";
    conParallax.forEach(function (img) {
      var r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      var centro = r.top + r.height / 2 - vh / 2;
      img.style.translate = "0 " + (-centro * parseFloat(img.getAttribute("data-parallax"))).toFixed(1) + "px";
    });
  }

  var pendiente = false;
  function alScroll() {
    pendiente = false;
    var y = window.scrollY;
    nav.classList.toggle("is-solid", y > 24);
    nav.classList.toggle("is-hidden", !menuAbierto() && y > ultimoY + 2 && y > 500);
    if (y < ultimoY - 2) nav.classList.remove("is-hidden");
    ultimoY = y;
    if (!lento) parallax();
  }
  window.addEventListener("scroll", function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(alScroll); }
  }, { passive: true });
  alScroll();

  /* ---------- Cintas ---------- */
  function cinta(nodo, textos, veces) {
    var grupo = "";
    for (var v = 0; v < veces; v++) {
      grupo += textos.map(function (t) { return '<span class="cinta__item">' + t + '<i class="cinta__sep"></i></span>'; }).join("");
    }
    nodo.innerHTML = grupo + grupo;
  }
  function pintarCintas() {
    $$("[data-cinta]").forEach(function (n) {
      if (n.getAttribute("data-cinta") === "frases") {
        cinta(n, ["Entrená con el viento a favor", "Entrená con un propósito", "Nunca es tarde para empezar", "La salud por encima de la estética", "Pellegrini 545 · Río Gallegos"], 2);
      } else {
        cinta(n, V.servicios.map(function (s) { return s.largo || s.nombre; }), 2);
      }
    });
  }
  pintarCintas();

  /* ---------- Emblemas vectoriales para disciplinas sin foto ---------- */
  function emblemaServicio(id) {
    if (id === "ciclo") {
      return '<svg class="tile__emblema" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="4" aria-hidden="true">' +
        '<circle cx="55" cy="135" r="36"/><circle cx="148" cy="135" r="36"/>' +
        '<circle cx="55" cy="135" r="8"/><circle cx="148" cy="135" r="8"/>' +
        '<path d="M55 135 L95 85 L148 135 M95 85 L82 62 H68 M95 85 L132 85 L148 135 M126 65 H148" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    if (id === "wushu") {
      return '<svg class="tile__emblema" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="4" aria-hidden="true">' +
        '<circle cx="100" cy="100" r="68"/>' +
        '<path d="M100 32 A34 34 0 0 1 100 100 A34 34 0 0 0 100 168"/>' +
        '<circle cx="100" cy="66" r="8" fill="currentColor"/><circle cx="100" cy="134" r="8"/></svg>';
    }
    if (id === "sanda" || id === "kickboxing") {
      return '<svg class="tile__emblema" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="4" aria-hidden="true">' +
        '<path d="M40 100 L100 36 L160 100 L100 164 Z"/>' +
        '<circle cx="100" cy="100" r="34"/><path d="M24 100 H176 M100 24 V176" stroke-opacity=".4"/></svg>';
    }
    return '<svg class="tile__emblema" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="4" aria-hidden="true">' +
      '<path d="M45 100 H155 M35 72 V128 M55 60 V140 M145 60 V140 M165 72 V128" stroke-linecap="round"/></svg>';
  }

  /* ---------- Servicios: mosaico de fotos y hoja de detalle ---------- */
  var tiles = $("[data-tiles]");
  var barra = $("[data-tiles-barra]");
  var lista = [];

  function fondoServicio(s, grande) {
    if (s.img) {
      var set = srcset(s.img, [600, 1000, 1600]);
      return '<img src="' + foto(s.img, grande ? 1400 : 1000) + '"' +
        (set ? ' srcset="' + set + '" sizes="(min-width: 1024px) ' + (grande ? "58vw" : "33vw") + ', 80vw"' : "") +
        (s.pos ? ' style="object-position:' + s.pos + '"' : "") + ' alt="" loading="lazy" decoding="async">';
    }
    return '<span class="tile__palabra" aria-hidden="true">' + s.nombre + "</span>" + emblemaServicio(s.id);
  }

  function pintarServicios() {
    if (!tiles) return;
    tiles.innerHTML = V.servicios.map(function (s, i) {
      var grande = i < 2;
      return '<a class="tile rv' + (s.img ? "" : " tile--tipo") + '" data-srv="' + s.id + '" href="' + wa(V.mensajes.clase + (s.largo || s.nombre) + ".") + '" target="_blank" rel="noopener" style="transition-delay:' + ((i < 2 ? i : (i - 2) % 3) * 90) + 'ms">' +
        fondoServicio(s, grande) +
        '<span class="tile__tag">' + s.tag + "</span>" +
        '<span class="tile__body"><span class="tile__name">' + s.nombre + '</span><span class="tile__meta">' + s.resumen + "</span>" +
        '<span class="tile__desc">' + s.desc + '</span><span class="tile__cta" data-cta-directo>Consultar</span></span></a>';
    }).join("");
    lista = $$(".tile", tiles);
    if (barra && lista.length) barra.style.width = (100 / lista.length) + "%";
    if (window.vientosRevelar) window.vientosRevelar(lista);
    marcarActiva();
    progreso();
  }

  function progreso() {
    if (!barra || escritorio.matches || !lista.length) return;
    var max = tiles.scrollWidth - tiles.clientWidth;
    var p = max > 0 ? tiles.scrollLeft / max : 0;
    barra.style.transform = "translateX(" + (p * (lista.length - 1) * 100) + "%)";
  }

  function marcarActiva() {
    if (!lista.length) return;
    if (escritorio.matches) { lista.forEach(function (t) { t.classList.remove("is-activa"); }); return; }
    var pad = parseFloat(getComputedStyle(tiles).paddingLeft) || 0;
    var base = tiles.getBoundingClientRect().left + pad, mejor = Infinity, activa = null;
    lista.forEach(function (t) {
      var d = Math.abs(t.getBoundingClientRect().left - base);
      if (d < mejor) { mejor = d; activa = t; }
    });
    lista.forEach(function (t) { t.classList.toggle("is-activa", t === activa); });
  }

  var esperaActiva;
  tiles.addEventListener("scroll", function () {
    progreso();
    clearTimeout(esperaActiva);
    esperaActiva = setTimeout(marcarActiva, 60);
  }, { passive: true });
  escritorio.addEventListener("change", marcarActiva);

  // Flechas de navegación del carrusel en móvil/tablet
  function moverCarrusel(dir) {
    if (!lista.length) return;
    pausaCarrusel = Date.now() + 9000;
    var ancho = lista[0].getBoundingClientRect().width + 12;
    tiles.scrollBy({ left: dir * ancho, behavior: "smooth" });
  }
  var btnPrev = $("[data-tiles-prev]"), btnNext = $("[data-tiles-next]");
  if (btnPrev) btnPrev.addEventListener("click", function () { moverCarrusel(-1); });
  if (btnNext) btnNext.addEventListener("click", function () { moverCarrusel(1); });

  // Soporte de arrastrar con mouse en tablets / ventanas intermedias
  var dragActivo = false, dragX0 = 0, dragScroll0 = 0, dragMovio = false;
  tiles.addEventListener("mousedown", function (e) {
    if (escritorio.matches || e.button !== 0) return;
    dragActivo = true;
    dragMovio = false;
    dragX0 = e.pageX;
    dragScroll0 = tiles.scrollLeft;
    tiles.classList.add("is-dragging");
  });
  window.addEventListener("mousemove", function (e) {
    if (!dragActivo) return;
    var dx = e.pageX - dragX0;
    if (Math.abs(dx) > 6) dragMovio = true;
    tiles.scrollLeft = dragScroll0 - dx;
  });
  window.addEventListener("mouseup", function () {
    if (!dragActivo) return;
    dragActivo = false;
    tiles.classList.remove("is-dragging");
  });

  // Hoja modal de detalle de servicio
  var hojaSrv = $("#hoja-servicio"), cuerpoSrv = $("[data-hoja-servicio]");
  if (hojaSrv) {
    hojaSrv.setAttribute("data-lenis-prevent", "");
    hojaSrv.addEventListener("click", function (e) { if (e.target === hojaSrv) hojaSrv.close(); });
    hojaSrv.addEventListener("close", function () {
      document.documentElement.style.overflow = "";
      if (lenis) lenis.start();
    });
  }

  function abrirServicio(id) {
    var s = srvPorId[id];
    if (!s || !hojaSrv || !cuerpoSrv) return;
    var turnos = (V.clases || []).filter(function (c) { return c.srv === s.id; });
    var mapaDias = { 1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb" };
    var htmlTurnos = turnos.length ? (
      '<div class="opcion"><span class="opcion__t">Turnos semanales (tocá para consultar cupo)</span><div class="srv-hoja__turnos">' +
      turnos.map(function (t) {
        var dTxt = (t.dias || []).map(function (d) { return mapaDias[d]; }).join(", ");
        var msg = "¡Hola Vientos! Quiero consultar si hay cupo para " + (s.largo || s.nombre) + " (" + dTxt + " a las " + hora(t.hora) + " hs).";
        return '<a class="srv-hoja__turno" href="' + wa(msg) + '" target="_blank" rel="noopener">' + dTxt + " · " + hora(t.hora) + " hs →</a>";
      }).join("") + "</div></div>"
    ) : "";

    var htmlDatos = (s.datos && s.datos.length) ? (
      '<dl class="srv-hoja__tabla">' +
      s.datos.map(function (par) {
        return '<div class="srv-hoja__fila"><dt>' + par[0] + "</dt><dd>" + par[1] + "</dd></div>";
      }).join("") + "</dl>"
    ) : "";

    var visualHtml = s.img
      ? '<img class="srv-hoja__img" src="' + foto(s.img, 1000) + '" alt="">'
      : '<div class="tile--tipo" style="position:relative;width:100%;height:100%;overflow:hidden"><span class="tile__palabra" style="font-size:5.2rem;top:22%">' + s.nombre + "</span>" + emblemaServicio(s.id) + "</div>";

    cuerpoSrv.className = "hoja__cuerpo hoja__cuerpo--prod";
    cuerpoSrv.innerHTML =
      '<div class="hoja__visual">' + visualHtml + "</div>" +
      '<div class="hoja__datos">' +
      '<p class="kicker">' + s.tag + "</p>" +
      '<h3 class="hoja__titulo" id="srv-hoja-titulo">' + (s.largo || s.nombre) + "</h3>" +
      '<p class="hoja__desc">' + s.desc + "</p>" +
      htmlDatos +
      htmlTurnos +
      '<div class="hoja__acciones">' +
      '<a class="btn btn--red btn--block" href="' + wa(V.mensajes.clase + (s.largo || s.nombre) + ".") + '" target="_blank" rel="noopener">' +
      '<svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg><span>Consultar por WhatsApp</span></a>' +
      "</div></div>";

    document.documentElement.style.overflow = "hidden";
    if (lenis) lenis.stop();
    hojaSrv.showModal();
    if (window.vientosPromoverCursor) window.vientosPromoverCursor();
  }

  tiles.addEventListener("click", function (e) {
    if (dragMovio) { e.preventDefault(); return; }
    var tile = e.target.closest(".tile");
    if (!tile) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    abrirServicio(tile.getAttribute("data-srv"));
  });

  var pausaCarrusel = 0, tilesVisibles = false;
  ["pointerdown", "touchstart", "wheel"].forEach(function (ev) {
    tiles.addEventListener(ev, function () { pausaCarrusel = Date.now() + 7000; }, { passive: true });
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { tilesVisibles = en[0].isIntersecting; }, { threshold: 0.4 }).observe(tiles);
  }
  setInterval(function () {
    if (escritorio.matches || !tilesVisibles || Date.now() < pausaCarrusel || document.hidden || !lista.length) return;
    var pad = parseFloat(getComputedStyle(tiles).paddingLeft) || 0;
    var base = tiles.getBoundingClientRect().left;
    var actual = 0, mejor = Infinity;
    lista.forEach(function (t, i) {
      var d = Math.abs(t.getBoundingClientRect().left - base - pad);
      if (d < mejor) { mejor = d; actual = i; }
    });
    var sig = lista[(actual + 1) % lista.length];
    var x = sig.getBoundingClientRect().left - base - pad + tiles.scrollLeft;
    tiles.scrollTo({ left: actual + 1 >= lista.length ? 0 : x, behavior: "smooth" });
  }, lento ? 6500 : 3800);

  /* ---------- Planes y pases ---------- */
  var gridPlanes = $("[data-planes]");
  function pintarPlanes() {
    if (!gridPlanes || !V.planes) return;
    gridPlanes.innerHTML = V.planes.map(function (p, i) {
      var precioTxt = p.precio
        ? "$ " + Number(p.precio).toLocaleString("es-AR") + "<small>/ " + (p.periodo || "mes") + "</small>"
        : "Consultá valor<small>Descuento por convenio</small>";
      var msg = (V.mensajes && V.mensajes.plan ? V.mensajes.plan : "¡Hola Vientos! Quiero consultar por el ") + p.nombre + ".";
      return '<article class="plan rv' + (p.destacado ? " plan--destacado" : "") + '" style="transition-delay:' + (i * 100) + 'ms">' +
        '<div class="plan__cab">' +
        '<div class="plan__fila-tag"><span class="plan__tag">' + (p.tag || "Pase") + '</span><span class="plan__periodo">' + (p.periodo || "Mensual") + "</span></div>" +
        '<h3 class="plan__nombre">' + p.nombre + "</h3>" +
        '<p class="plan__desc">' + p.desc + "</p>" +
        '<div class="plan__precio-bloque"><span class="plan__precio">' + precioTxt + "</span></div>" +
        '<ul class="plan__lista">' + (p.items || []).map(function (it) {
          return '<li><svg class="ico" aria-hidden="true"><use href="#i-check"/></svg><span>' + it + "</span></li>";
        }).join("") + "</ul>" +
        "</div>" +
        '<a class="btn ' + (p.destacado ? "btn--red" : "btn--ghost") + ' btn--block" href="' + wa(msg) + '" target="_blank" rel="noopener">' +
        '<span>Elegir ' + p.nombre + '</span><svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
        "</article>";
    }).join("");
    if (window.vientosRevelar) window.vientosRevelar($$(".plan", gridPlanes));
  }

  /* ---------- Además ---------- */
  function pintarExtras() {
    var nodo = $("[data-extras]");
    if (!nodo || !V.extras) return;
    nodo.innerHTML = V.extras.map(function (e, i) {
      var set = srcset(e.img, [700, 1100, 1600]);
      var fondo = e.img
        ? '<img src="' + foto(e.img, 1100) + '"' + (set ? ' srcset="' + set + '" sizes="(min-width: 1024px) 50vw, 90vw"' : "") + ' alt="" loading="lazy" decoding="async">'
        : '<span class="extra__palabra" aria-hidden="true">' + e.nombre + "</span>";
      return '<a class="extra rv' + (e.img ? "" : " extra--tipo") + '" href="' + wa(e.wa) + '" target="_blank" rel="noopener" style="transition-delay:' + (i * 120) + 'ms">' + fondo +
        '<span class="extra__tag">' + e.tag + "</span>" +
        '<span class="extra__body"><span class="extra__name">' + e.nombre + "</span><p>" + e.desc + '</p><span class="tile__cta">' + e.accion + "</span></span></a>";
    }).join("");
    if (window.vientosRevelar) window.vientosRevelar($$(".extra", nodo));
  }

  /* ---------- Horarios: grilla semanal con filtros y turnos clicables ---------- */
  var grilla = $("[data-grilla]");
  var barraFiltrosHor = $("[data-grilla-filtros]");
  var barraDiasHor = $("[data-grilla-dias]");
  var srvFiltroActivo = "todo";
  var diaFiltroActivo = 0; // 0 = todos los días

  function profeDe(s, c) {
    if (c && c.profe) return c.profe;
    if (!s || !s.datos) return "";
    for (var i = 0; i < s.datos.length; i++) if (s.datos[i][0] === "Profe") return s.datos[i][1];
    return s.tag || "";
  }

  function pintarControlesGrilla() {
    if (barraFiltrosHor) {
      var idsPresentes = [];
      (V.clases || []).forEach(function (c) {
        if (idsPresentes.indexOf(c.srv) === -1 && srvPorId[c.srv]) idsPresentes.push(c.srv);
      });
      var chips = [{ id: "todo", nombre: "Todas las clases" }].concat(idsPresentes.map(function (id) {
        return { id: id, nombre: srvPorId[id].nombre };
      }));
      barraFiltrosHor.innerHTML = chips.map(function (ch) {
        return '<button type="button" role="tab" class="hor__chip" data-srv-filtro="' + ch.id + '" aria-selected="' + (srvFiltroActivo === ch.id ? "true" : "false") + '">' + ch.nombre + "</button>";
      }).join("");
    }

    if (barraDiasHor) {
      var hoy = ahora().dia;
      var cortos = [[0, "Semana"], [1, "Lun"], [2, "Mar"], [3, "Mié"], [4, "Jue"], [5, "Vie"], [6, "Sáb"]];
      barraDiasHor.innerHTML = cortos.map(function (d) {
        var esHoy = d[0] !== 0 && d[0] === hoy;
        return '<button type="button" role="tab" class="hor__chip' + (esHoy ? " es-hoy" : "") + '" data-dia-filtro="' + d[0] + '" aria-selected="' + (diaFiltroActivo === d[0] ? "true" : "false") + '">' + d[1] + "</button>";
      }).join("");
    }
  }

  function pintarGrilla() {
    if (!grilla) return;
    var a = ahora();
    grilla.innerHTML = DIAS.map(function (d) {
      var delDia = (V.clases || []).filter(function (c) { return (c.dias || []).indexOf(d[0]) >= 0; })
        .sort(function (x, y) { return aMin(x.hora) - aMin(y.hora); });
      var esHoy = d[0] === a.dia, proxima = false;
      var items = delDia.length ? delDia.map(function (c) {
        var s = srvPorId[c.srv] || { nombre: c.srv, tag: "" };
        var m = aMin(c.hora), cls = "grilla__clase";
        if (esHoy) {
          if (a.min >= m + 60) cls += " is-past";
          else if (a.min >= m) cls += " is-now";
          else if (!proxima) { cls += " is-next"; proxima = true; }
        }
        if (srvFiltroActivo !== "todo") {
          cls += (c.srv === srvFiltroActivo) ? " is-match" : " is-dim";
        }
        var msg = "¡Hola Vientos! Quiero consultar cupo para " + s.nombre + " los " + d[1].toLowerCase() + " a las " + hora(c.hora) + " hs.";
        return '<li class="grilla__item"><a class="' + cls + '" data-srv-id="' + c.srv + '" href="' + wa(msg) + '" target="_blank" rel="noopener" title="Consultar cupo por WhatsApp">' +
          '<span class="grilla__hora">' + hora(c.hora) + "</span>" +
          "<span><b>" + s.nombre + "</b><small>" + profeDe(s, c) + "</small></span>" +
          '<span class="grilla__flecha" aria-hidden="true">→</span></a></li>';
      }).join("") : '<li class="grilla__libre">' + (d[0] === 6 ? "Sala de musculación de " + (V.horario && V.horario[6] ? fmtHora(V.horario[6][0]) + " a " + fmtHora(V.horario[6][1]) + " hs" : "10:00 a 20:00 hs") : "Sala de musculación libre") + "</li>";

      var ocultoDia = diaFiltroActivo !== 0 && diaFiltroActivo !== d[0];
      return '<div class="grilla__dia' + (esHoy ? " is-hoy" : "") + (ocultoDia ? " is-oculto-dia" : "") + '" data-dia="' + d[0] + '"><h3 class="grilla__nombre">' + d[1] + '</h3><ul class="grilla__lista">' + items + "</ul></div>";
    }).join("");
  }

  if (barraFiltrosHor) {
    barraFiltrosHor.addEventListener("click", function (e) {
      var b = e.target.closest("[data-srv-filtro]");
      if (!b) return;
      srvFiltroActivo = b.getAttribute("data-srv-filtro");
      $$("[data-srv-filtro]", barraFiltrosHor).forEach(function (x) {
        x.setAttribute("aria-selected", x === b ? "true" : "false");
      });
      pintarGrilla();
    });
  }

  if (barraDiasHor) {
    barraDiasHor.addEventListener("click", function (e) {
      var b = e.target.closest("[data-dia-filtro]");
      if (!b) return;
      diaFiltroActivo = parseInt(b.getAttribute("data-dia-filtro"), 10) || 0;
      $$("[data-dia-filtro]", barraDiasHor).forEach(function (x) {
        x.setAttribute("aria-selected", x === b ? "true" : "false");
      });
      pintarGrilla();
    });
  }

  /* ---------- Comunidad ---------- */
  var ig = $("[data-ig]");
  if (ig) {
    ig.innerHTML = V.comunidad.map(function (u, i) {
      return '<a class="rv" href="' + V.instagram + '" target="_blank" rel="noopener" aria-label="Ver Vientos GYM en Instagram" style="transition-delay:' + (i * 70) + 'ms">' +
        '<img src="' + foto(u, 600) + '" alt="" loading="lazy" decoding="async"><svg class="ico" aria-hidden="true"><use href="#i-ig"/></svg></a>';
    }).join("");
  }

  /* ---------- Convenios ---------- */
  function pintarConvenios() {
    if (!V.convenios || !V.convenios.length) return;
    var mitad = Math.ceil(V.convenios.length / 2);
    $$("[data-convenios]").forEach(function (n) {
      var fila = n.getAttribute("data-convenios") === "0" ? V.convenios.slice(0, mitad) : V.convenios.slice(mitad);
      if (!fila.length) fila = V.convenios;
      var grupo = fila.concat(fila).map(function (c) { return '<span class="conv__item">' + c + '<i class="conv__sep"></i></span>'; }).join("");
      n.innerHTML = grupo + grupo;
    });
  }

  /* ---------- Animaciones de entrada ---------- */
  function partir(el) {
    var i = 0;
    (function recorrer(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var w = document.createElement("span");
            w.className = "w";
            w.style.setProperty("--i", i++);
            w.textContent = p;
            frag.appendChild(w);
          });
          nodo.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          recorrer(n);
        }
      });
    })(el);
  }
  $$("[data-split]").forEach(partir);

  var obs = "IntersectionObserver" in window ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  function revelar(elementos) {
    elementos.forEach(function (el) { if (obs) obs.observe(el); else el.classList.add("is-in"); });
  }
  window.vientosRevelar = revelar;

  // Render inicial de todas las secciones dinámicas
  pintarServicios();
  pintarPlanes();
  pintarExtras();
  pintarEstado();
  pintarControlesGrilla();
  pintarGrilla();
  pintarConvenios();
  revelar($$(".rv, [data-split], .revela"));

  setInterval(function () { pintarEstado(); pintarGrilla(); }, 60000);

  // Re-render en caliente cuando se actualizan datos desde Supabase o el Panel de Administración
  function recargarTodo() {
    V = window.VIENTOS;
    indexarServicios();
    actualizarLinksGenerales();
    pintarCintas();
    pintarServicios();
    pintarPlanes();
    pintarExtras();
    pintarEstado();
    pintarControlesGrilla();
    pintarGrilla();
    pintarConvenios();
  }
  window.addEventListener("vientos:datos-actualizados", recargarTodo);
  window.addEventListener("storage", function (e) {
    if (e.key === "vientos_cms_datos_v1" && e.newValue) {
      try {
        var nuevos = JSON.parse(e.newValue);
        Object.keys(nuevos).forEach(function (k) { window.VIENTOS[k] = nuevos[k]; });
        recargarTodo();
        if (window.vientosPintarShop) window.vientosPintarShop();
      } catch (err) {}
    }
  });

  // Botón flotante de WhatsApp: aparece después de la portada.
  var fabWa = $(".fab-wa");
  if (fabWa && "IntersectionObserver" in window) {
    fabWa.classList.add("is-low");
    new IntersectionObserver(function (entradas) {
      fabWa.classList.toggle("is-low", entradas[0].intersectionRatio > 0.35);
    }, { threshold: [0, 0.35, 1] }).observe(hero);
  }

  // Números de la portada que cuentan solos.
  function contar(el) {
    var fin = parseFloat(el.getAttribute("data-contar")), dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var pre = el.getAttribute("data-pre") || "", suf = el.getAttribute("data-suf") || "";
    var t0 = 0, dur = lento ? 300 : 1700;
    (function paso(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + (fin * e).toFixed(dec).replace(".", ",") + suf;
      if (p < 1) requestAnimationFrame(paso);
    })(performance.now());
  }

  var listo = false;
  function entrarHero() {
    if (listo) return;
    listo = true;
    var espera = window.vientosIntro ? 1500 : 0;   // si hay intro, la portada entra cuando se va
    setTimeout(function () {
      requestAnimationFrame(function () { hero.classList.add("is-in"); });
      setTimeout(function () { $$("[data-contar]").forEach(contar); }, 1150);
    }, espera);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(entrarHero);
  setTimeout(entrarHero, 700);
})();
