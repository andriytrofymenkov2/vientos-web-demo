/* Interacción general: scroll suave, navegación, estado abierto/cerrado, servicios, horarios,
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
  V.servicios.forEach(function (s) { srvPorId[s.id] = s; });

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
  $$("[data-wa]").forEach(function (a) {
    a.href = wa(V.mensajes[a.getAttribute("data-wa")] || V.mensajes.general);
  });
  $$("[data-mapa]").forEach(function (a) { a.href = V.mapa; });
  $$("[data-dj]").forEach(function (a) { a.href = V.djForm; });
  $$("[data-anio]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
  $$("img[data-src]").forEach(function (img) {
    var u = img.getAttribute("data-src"), w = parseInt(img.getAttribute("data-w") || "1200", 10);
    img.src = foto(u, w);
    var s = srcset(u, [Math.round(w * 0.5), w, Math.round(w * 1.5)]);
    if (s) { img.srcset = s; img.sizes = "(min-width: 1024px) 45vw, 90vw"; }
  });

  /* ---------- Hora de Río Gallegos ---------- */
  var NOMBRE_DIA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
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
  function aMin(h) { var p = h.split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function hora(h) { return h.replace(/^0/, ""); }

  function estado() {
    var a = ahora(), h = V.horario[a.dia];
    if (h && a.min >= h[0] * 60 && a.min < h[1] * 60) {
      return { abierto: true, corto: "Abierto ahora · hasta las " + h[1] + " h", largo: "Abierto · cierra a las " + h[1] + " h" };
    }
    if (h && a.min < h[0] * 60) {
      return { abierto: false, corto: "Cerrado · abre hoy a las " + h[0] + " h", largo: "Cerrado · abre a las " + h[0] + " h" };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (a.dia + i) % 7, hh = V.horario[d];
      if (hh) {
        var cuando = i === 1 ? "mañana" : "el " + NOMBRE_DIA[d];
        return { abierto: false, corto: "Cerrado · abre " + cuando + " a las " + hh[0] + " h", largo: "Cerrado · abre " + cuando + " a las " + hh[0] + " h" };
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
    var filas = $$(".hor__rows > div");
    if (filas.length === 3) {
      var fila = a.dia === 0 ? 2 : a.dia === 6 ? 1 : 0;
      filas.forEach(function (f, i) { f.classList.toggle("is-hoy", i === fila); });
    }
  }
  pintarEstado();
  setInterval(function () { pintarEstado(); pintarGrilla(); }, 60000);

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
  $$("[data-cinta]").forEach(function (n) {
    if (n.getAttribute("data-cinta") === "frases") {
      cinta(n, ["Tu objetivo es nuestra meta", "Entrená con un propósito", "Nunca es tarde para empezar", "La salud por encima de la estética", "Pellegrini 545 · Río Gallegos"], 2);
    } else {
      cinta(n, V.servicios.map(function (s) { return s.largo || s.nombre; }), 2);
    }
  });

  /* ---------- Servicios: mosaico de fotos ---------- */
  var tiles = $("[data-tiles]");
  tiles.innerHTML = V.servicios.map(function (s, i) {
    var grande = i < 2;
    var set = srcset(s.img, [600, 1000, 1600]);
    return '<a class="tile rv" href="' + wa(V.mensajes.clase + (s.largo || s.nombre) + ".") + '" target="_blank" rel="noopener" style="transition-delay:' + ((i < 2 ? i : (i - 2) % 3) * 90) + 'ms">' +
      '<img src="' + foto(s.img, grande ? 1400 : 1000) + '"' + (set ? ' srcset="' + set + '" sizes="(min-width: 1024px) ' + (grande ? "58vw" : "33vw") + ', 80vw"' : "") + (s.pos ? ' style="object-position:' + s.pos + '"' : "") + ' alt="" loading="lazy" decoding="async">' +
      '<span class="tile__tag">' + s.tag + "</span>" +
      '<span class="tile__body"><span class="tile__name">' + s.nombre + '</span><span class="tile__meta">' + s.resumen + "</span>" +
      '<span class="tile__desc">' + s.desc + '</span><span class="tile__cta">Consultar</span></span></a>';
  }).join("");

  // En celular es un carrusel que avanza solo y se deja mover con el dedo.
  var barra = $("[data-tiles-barra]");
  var lista = $$(".tile", tiles);
  if (barra) barra.style.width = (100 / lista.length) + "%";
  function progreso() {
    if (!barra || escritorio.matches) return;
    var max = tiles.scrollWidth - tiles.clientWidth;
    var p = max > 0 ? tiles.scrollLeft / max : 0;
    barra.style.transform = "translateX(" + (p * (lista.length - 1) * 100) + "%)";
  }
  // En celular la tarjeta que queda al frente del carrusel se ilumina sola (como el hover de la compu).
  function marcarActiva() {
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
  marcarActiva();
  var pausaCarrusel = 0, tilesVisibles = false;
  ["pointerdown", "touchstart", "wheel"].forEach(function (ev) {
    tiles.addEventListener(ev, function () { pausaCarrusel = Date.now() + 7000; }, { passive: true });
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { tilesVisibles = en[0].isIntersecting; }, { threshold: 0.4 }).observe(tiles);
  }
  setInterval(function () {
    if (escritorio.matches || !tilesVisibles || Date.now() < pausaCarrusel || document.hidden) return;
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

  /* ---------- Además ---------- */
  $("[data-extras]").innerHTML = V.extras.map(function (e, i) {
    var set = srcset(e.img, [700, 1100, 1600]);
    // Sin foto propia del gimnasio: pieza tipográfica con el nombre gigante calado.
    var fondo = e.img
      ? '<img src="' + foto(e.img, 1100) + '"' + (set ? ' srcset="' + set + '" sizes="(min-width: 1024px) 50vw, 90vw"' : "") + ' alt="" loading="lazy" decoding="async">'
      : '<span class="extra__palabra" aria-hidden="true">' + e.nombre + "</span>";
    return '<a class="extra rv' + (e.img ? "" : " extra--tipo") + '" href="' + wa(e.wa) + '" target="_blank" rel="noopener" style="transition-delay:' + (i * 120) + 'ms">' + fondo +
      '<span class="extra__tag">' + e.tag + "</span>" +
      '<span class="extra__body"><span class="extra__name">' + e.nombre + "</span><p>" + e.desc + '</p><span class="tile__cta">' + e.accion + "</span></span></a>";
  }).join("");

  /* ---------- Horarios: grilla semanal ---------- */
  var DIAS = [[1, "Lunes"], [2, "Martes"], [3, "Miércoles"], [4, "Jueves"], [5, "Viernes"], [6, "Sábado"]];
  var grilla = $("[data-grilla]");
  function profeDe(s) {
    for (var i = 0; i < s.datos.length; i++) if (s.datos[i][0] === "Profe") return s.datos[i][1];
    return s.tag;
  }
  function pintarGrilla() {
    if (!grilla) return;
    var a = ahora();
    grilla.innerHTML = DIAS.map(function (d) {
      var delDia = V.clases.filter(function (c) { return c.dias.indexOf(d[0]) >= 0; })
        .sort(function (x, y) { return aMin(x.hora) - aMin(y.hora); });
      var esHoy = d[0] === a.dia, proxima = false;
      var items = delDia.length ? delDia.map(function (c) {
        var s = srvPorId[c.srv], m = aMin(c.hora), cls = "grilla__clase";
        if (esHoy) {
          if (a.min >= m + 60) cls += " is-past";
          else if (a.min >= m) cls += " is-now";
          else if (!proxima) { cls += " is-next"; proxima = true; }
        }
        return '<li class="' + cls + '"><span class="grilla__hora">' + hora(c.hora) + "</span><span><b>" + s.nombre + "</b><small>" + profeDe(s) + "</small></span></li>";
      }).join("") : '<li class="grilla__libre">' + (d[0] === 6 ? "Sala de musculación de 10 a 20 h" : "Sin clases con horario fijo") + "</li>";
      return '<div class="grilla__dia' + (esHoy ? " is-hoy" : "") + '"><h3 class="grilla__nombre">' + d[1] + '</h3><ul class="grilla__lista">' + items + "</ul></div>";
    }).join("");
  }
  pintarGrilla();

  /* ---------- Comunidad ---------- */
  var ig = $("[data-ig]");
  if (ig) {
    ig.innerHTML = V.comunidad.map(function (u, i) {
      return '<a class="rv" href="' + V.instagram + '" target="_blank" rel="noopener" aria-label="Ver Vientos GYM en Instagram" style="transition-delay:' + (i * 70) + 'ms">' +
        '<img src="' + foto(u, 600) + '" alt="" loading="lazy" decoding="async"><svg class="ico" aria-hidden="true"><use href="#i-ig"/></svg></a>';
    }).join("");
  }

  /* ---------- Convenios ---------- */
  var mitad = Math.ceil(V.convenios.length / 2);
  $$("[data-convenios]").forEach(function (n) {
    var fila = n.getAttribute("data-convenios") === "0" ? V.convenios.slice(0, mitad) : V.convenios.slice(mitad);
    var grupo = fila.concat(fila).map(function (c) { return '<span class="conv__item">' + c + '<i class="conv__sep"></i></span>'; }).join("");
    n.innerHTML = grupo + grupo;
  });

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
  revelar($$(".rv, [data-split], .revela"));

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
