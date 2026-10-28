/* Shop: catálogo, hoja de producto y pedido que se arma acá y se manda por WhatsApp.
   Mientras no haya fotos, cada producto se dibuja en SVG con el logo de Vientos. */
(function () {
  var V = window.VIENTOS;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var grid = $("[data-productos]");
  if (!grid) return;

  function wa(texto) { return "https://wa.me/" + V.whatsapp + "?text=" + encodeURIComponent(texto); }

  var porId = {};
  V.productos.forEach(function (p) { porId[p.id] = p; });

  /* ---------- Ilustraciones ---------- */
  var TELAS = {
    Negro: { luz: "#2c2c31", tela: "#141416", sombra: "#09090a", costura: "rgba(255,255,255,.07)", hueco: "#060607", cordon: "#d9d7d2",
      lt: "#dcdde0", lb: "#8d9097", lr: "#e0202c", lw: "#f3f1ec" },
    Blanco: { luz: "#fbfaf8", tela: "#e4e1db", sombra: "#c4c0b8", costura: "rgba(0,0,0,.08)", hueco: "#a9a59d", cordon: "#1b1b1d",
      lt: "#4a4b50", lb: "#1b1b1d", lr: "#e0202c", lw: "#cfccc5" },
    Rojo: { luz: "#d62a33", tela: "#b2121b", sombra: "#7d0b11", costura: "rgba(0,0,0,.14)", hueco: "#4a0609", cordon: "#f3f1ec",
      lt: "#f3f1ec", lb: "#2b0d10", lr: "#111113", lw: "#f3f1ec" }
  };
  var uid = 0;

  function logo(x, y, w, c) {
    var h = (w * 258 / 744).toFixed(1);
    return '<use href="#logo-vientos" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" style="--lg-txt:' + c.lt + ";--lg-black:" + c.lb + ";--lg-red:" + c.lr + ";--lg-white:" + c.lw + '"/>';
  }

  var FORMAS = {
    remera: function (g, c) {
      return '<path d="M150 92 Q200 130 250 92 L318 112 L376 196 L330 226 L310 198 L314 420 Q200 434 86 420 L90 198 L70 226 L24 196 L82 112 Z" fill="url(#' + g + ')"/>' +
        '<path d="M150 92 Q200 130 250 92" fill="none" stroke="' + c.sombra + '" stroke-width="8"/>' +
        '<path d="M157 99 Q200 125 243 99" fill="none" stroke="' + c.costura + '" stroke-width="2"/>' +
        '<path d="M365 189 L325 215 M35 189 L75 215" stroke="' + c.costura + '" stroke-width="2"/>' +
        '<path d="M122 252 Q132 330 120 410 M282 246 Q270 326 284 410" fill="none" stroke="' + c.costura + '" stroke-width="3"/>' +
        '<path d="M88 408 Q200 422 312 408" fill="none" stroke="' + c.costura + '" stroke-width="2"/>' +
        logo(146, 156, 108, c);
    },
    buzo: function (g, c) {
      return '<path d="M140 106 Q132 38 200 32 Q268 38 260 106 Z" fill="' + c.sombra + '"/>' +
        '<path d="M140 100 Q200 142 260 100 L322 118 L356 196 L368 402 L332 410 L316 232 L318 432 Q200 446 82 432 L84 232 L68 410 L32 402 L44 196 L78 118 Z" fill="url(#' + g + ')"/>' +
        '<path d="M160 104 Q200 68 240 104 Q200 136 160 104 Z" fill="' + c.hueco + '"/>' +
        '<path d="M186 124 L182 196 M214 124 L218 196" stroke="' + c.cordon + '" stroke-width="3.5" stroke-linecap="round"/>' +
        '<path d="M128 322 L272 322 L292 398 L108 398 Z" fill="none" stroke="' + c.costura + '" stroke-width="3"/>' +
        '<path d="M82 416 Q200 430 318 416 M36 388 L67 395 M364 388 L333 395" fill="none" stroke="' + c.costura + '" stroke-width="3"/>' +
        '<path d="M108 250 Q118 300 110 330 M292 250 Q282 300 290 330" fill="none" stroke="' + c.costura + '" stroke-width="3"/>' +
        logo(150, 220, 100, c);
    },
    musculosa: function (g, c) {
      return '<path d="M128 64 L160 64 Q200 172 240 64 L272 64 Q276 172 318 200 L320 430 Q200 444 80 430 L82 200 Q124 172 128 64 Z" fill="url(#' + g + ')"/>' +
        '<path d="M160 64 Q200 172 240 64" fill="none" stroke="' + c.sombra + '" stroke-width="7"/>' +
        '<path d="M272 64 Q276 172 318 200 M128 64 Q124 172 82 200" fill="none" stroke="' + c.costura + '" stroke-width="3"/>' +
        '<path d="M84 418 Q200 432 316 418" fill="none" stroke="' + c.costura + '" stroke-width="2"/>' +
        '<path d="M118 260 Q128 340 116 420 M282 260 Q272 340 284 420" fill="none" stroke="' + c.costura + '" stroke-width="3"/>' +
        logo(150, 222, 100, c);
    },
    top: function (g, c) {
      return '<g transform="translate(200 250) scale(1.32) translate(-200 -232)">' +
        '<path d="M126 118 L156 118 Q200 196 244 118 L274 118 Q280 212 306 246 L306 332 Q200 346 94 332 L94 246 Q120 212 126 118 Z" fill="url(#' + g + ')"/>' +
        '<path d="M94 300 Q200 314 306 300 L306 332 Q200 346 94 332 Z" fill="' + c.sombra + '"/>' +
        '<path d="M156 118 Q200 196 244 118" fill="none" stroke="' + c.sombra + '" stroke-width="5"/>' +
        '<path d="M274 118 Q280 212 306 246 M126 118 Q120 212 94 246" fill="none" stroke="' + c.costura + '" stroke-width="2.5"/>' +
        logo(167, 304, 66, c) + "</g>";
    },
    creatina: function (g, c, sel) {
      var peso = (sel && sel["Presentación"]) || "300 g";
      var rayas = "";
      for (var x = 140; x <= 262; x += 8) rayas += "M" + x + " 124 v44 ";
      return '<defs><linearGradient id="' + g + 't" x1="0" x2="1"><stop offset="0" stop-color="#0b0b0d"/><stop offset=".38" stop-color="#26262b"/><stop offset=".55" stop-color="#1b1b1f"/><stop offset="1" stop-color="#09090a"/></linearGradient></defs>' +
        '<path d="M136 120 h128 a10 10 0 0 1 10 10 v40 h-148 v-40 a10 10 0 0 1 10 -10 Z" fill="#1f1f23"/>' +
        '<path d="' + rayas + '" stroke="rgba(255,255,255,.06)" stroke-width="2"/>' +
        '<path d="M136 125 h128" stroke="rgba(255,255,255,.14)" stroke-width="2"/>' +
        '<rect x="130" y="170" width="140" height="9" fill="#0b0b0c"/>' +
        '<path d="M126 179 h148 v232 a16 16 0 0 1 -16 16 h-116 a16 16 0 0 1 -16 -16 Z" fill="url(#' + g + 't)"/>' +
        '<rect x="126" y="214" width="148" height="168" fill="#0f0f12"/>' +
        '<path d="M126 214 h148 M126 382 h148" stroke="rgba(255,255,255,.1)" stroke-width="1.5"/>' +
        logo(158, 226, 84, TELAS.Negro) +
        '<text x="200" y="292" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="700" font-size="31" letter-spacing="1" fill="#f3f1ec">CREATINA</text>' +
        '<text x="200" y="311" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="600" font-size="12" letter-spacing="3.6" fill="#a5a5ab">MONOHIDRATO</text>' +
        '<path d="M126 334 L274 322 L274 354 L126 366 Z" fill="#e0202c"/>' +
        '<text x="200" y="350" text-anchor="middle" transform="rotate(-4.6 200 344)" font-family="Barlow Condensed, sans-serif" font-weight="700" font-style="italic" font-size="19" letter-spacing="1" fill="#fff">' + peso.toUpperCase() + "</text>" +
        '<rect x="141" y="186" width="9" height="232" fill="rgba(255,255,255,.05)"/>';
    },
    shaker: function (g) {
      var marcas = "";
      for (var i = 0; i < 5; i++) marcas += "M156 " + (196 + i * 42) + " h14 ";
      return '<defs><linearGradient id="' + g + 'c" x1="0" x2="1"><stop offset="0" stop-color="#0c0c0e"/><stop offset=".4" stop-color="#232327"/><stop offset="1" stop-color="#0a0a0b"/></linearGradient></defs>' +
        '<path d="M212 72 h28 l5 24 h-38 Z" fill="#e0202c"/>' +
        '<rect x="150" y="96" width="100" height="32" fill="#27272b"/>' +
        '<path d="M150 101 h100" stroke="rgba(255,255,255,.14)" stroke-width="2"/>' +
        '<rect x="144" y="128" width="112" height="18" fill="#1a1a1d"/>' +
        '<path d="M146 146 L254 146 L242 414 Q200 424 158 414 Z" fill="url(#' + g + 'c)"/>' +
        '<path d="' + marcas + '" stroke="rgba(243,241,236,.22)" stroke-width="2"/>' +
        '<path d="M164 154 L173 154 L166 404 L159 404 Z" fill="rgba(255,255,255,.06)"/>' +
        logo(158, 262, 84, TELAS.Negro);
    }
  };
  var PISO = { remera: 452, buzo: 458, musculosa: 452, top: 438, creatina: 440, shaker: 436 };

  function figura(p, sel) {
    var c = TELAS[(sel && sel.Color) || "Negro"] || TELAS.Negro;
    var g = "vg" + (++uid);
    return '<svg class="prod__svg" viewBox="0 0 400 500" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c.luz + '"/><stop offset=".55" stop-color="' + c.tela + '"/><stop offset="1" stop-color="' + c.sombra + '"/></linearGradient>' +
      '<radialGradient id="' + g + 's"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="200" cy="' + PISO[p.forma] + '" rx="132" ry="13" fill="url(#' + g + 's)"/>' +
      FORMAS[p.forma](g, c, sel) + "</svg>";
  }

  function visual(p, sel) {
    return p.img ? '<img class="prod__img" src="' + p.img + '" alt="" loading="lazy" decoding="async">' : figura(p, sel);
  }

  function precio(p) { return p.precio ? "$ " + p.precio.toLocaleString("es-AR") : "Consultá precio"; }

  function inicial(p) {
    var sel = {};
    Object.keys(p.opciones).forEach(function (k) {
      var ops = p.opciones[k];
      sel[k] = (k === "Talle" && ops.length > 1) ? null : ops[0];
    });
    return sel;
  }

  function textoOpciones(sel) {
    return Object.keys(sel).filter(function (k) { return sel[k]; }).map(function (k) {
      return k === "Talle" ? "talle " + sel[k] : sel[k];
    }).join(", ");
  }

  /* ---------- Catálogo ---------- */
  grid.innerHTML = V.productos.map(function (p, i) {
    var elegir = p.opciones.Talle ? "Elegir talle" : "Ver opciones";
    return '<button type="button" class="prod rv" data-prod="' + p.id + '" data-cat="' + p.cat + '" style="transition-delay:' + ((i % 3) * 90) + 'ms">' +
      '<span class="prod__visual">' + visual(p, inicial(p)) +
      '<span class="prod__ver" aria-hidden="true"><span>' + elegir + "</span><span>→</span></span></span>" +
      '<span class="prod__fila"><span>' + (p.nuevo ? '<span class="prod__nuevo">Nuevo</span>' : "") +
      '<span class="prod__name">' + p.nombre + "</span></span></span>" +
      '<span class="prod__desc">' + p.desc + "</span>" +
      '<span class="prod__precio">' + precio(p) + "</span></button>";
  }).join("");

  if (window.vientosRevelar) window.vientosRevelar($$(".prod", grid));
  else $$(".prod", grid).forEach(function (p) { p.classList.add("is-in"); });

  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".prod");
    if (b) abrirProducto(b.getAttribute("data-prod"));
  });

  var filtros = $("[data-filtros]");
  filtros.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var cat = b.getAttribute("data-cat");
    $$("button", filtros).forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
    $$(".prod", grid).forEach(function (p) {
      var ver = cat === "todo" || p.getAttribute("data-cat") === cat;
      p.hidden = !ver;
      if (ver) p.classList.add("is-in");
    });
  });

  /* ---------- Pedido guardado en este navegador ---------- */
  var CLAVE = "vientos_pedido_v1";
  var pedido = [];
  try { pedido = JSON.parse(localStorage.getItem(CLAVE)) || []; } catch (e) { pedido = []; }
  pedido = pedido.filter(function (it) { return it && porId[it.id] && it.cant > 0; });
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(pedido)); } catch (e) { /* sin almacenamiento: el pedido vive mientras la página esté abierta */ } }

  var fab = $("[data-abrir-pedido]"), fabN = $("[data-pedido-n]");
  function pintarFab(rebote) {
    var n = pedido.reduce(function (s, it) { return s + it.cant; }, 0);
    fabN.textContent = n;
    fab.hidden = n === 0;
    if (rebote && n) { fab.classList.remove("is-bump"); void fab.offsetWidth; fab.classList.add("is-bump"); }
  }

  function bloquear(si) {
    document.documentElement.style.overflow = si ? "hidden" : "";
    var lenis = window.vientosLenis;
    if (lenis) { if (si) lenis.stop(); else lenis.start(); }
  }
  function cerrarAlTocarFondo(d) {
    d.setAttribute("data-lenis-prevent", "");
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    d.addEventListener("close", function () { bloquear(false); });
  }

  /* ---------- Hoja de producto ---------- */
  var hoja = $("#hoja-producto"), cuerpo = $("[data-hoja]");
  cerrarAlTocarFondo(hoja);

  function abrirProducto(id) {
    var p = porId[id], sel = inicial(p), cant = 1;
    var opciones = Object.keys(p.opciones).map(function (k) {
      return '<div class="opcion" data-op="' + k + '"><span class="opcion__t">' + k + '</span><div class="chips">' +
        p.opciones[k].map(function (v) {
          return '<button type="button" class="chip" data-v="' + v + '" aria-pressed="' + (sel[k] === v) + '">' + v + "</button>";
        }).join("") + "</div></div>";
    }).join("");

    cuerpo.className = "hoja__cuerpo hoja__cuerpo--prod";
    cuerpo.innerHTML =
      '<div class="hoja__visual" data-hoja-visual>' + visual(p, sel) + "</div>" +
      '<div class="hoja__datos">' +
      '<h3 class="hoja__titulo" id="hoja-titulo">' + p.nombre + "</h3>" +
      '<p class="hoja__desc">' + p.desc + "</p>" +
      '<p class="hoja__precio">' + precio(p) + "</p>" + opciones +
      '<div class="opcion"><span class="opcion__t">Cantidad</span><div class="cantidad">' +
      '<button type="button" data-menos aria-label="Uno menos"><svg class="ico"><use href="#i-minus"/></svg></button>' +
      "<output data-cant>1</output>" +
      '<button type="button" data-mas aria-label="Uno más"><svg class="ico"><use href="#i-plus"/></svg></button></div></div>' +
      '<div class="hoja__acciones">' +
      '<button type="button" class="btn btn--red btn--block" data-agregar><svg class="ico" aria-hidden="true"><use href="#i-bag"/></svg><span>Sumar al pedido</span></button>' +
      '<p class="aviso" data-aviso role="status"></p>' +
      '<a class="link" data-solo target="_blank" rel="noopener" href="#">Consultar solo este producto</a></div></div>';

    var aviso = $("[data-aviso]", cuerpo), solo = $("[data-solo]", cuerpo);
    function actualizarSolo() {
      var op = textoOpciones(sel);
      solo.href = wa("¡Hola Vientos! Quiero consultar por: " + p.nombre + (op ? " (" + op + ")" : "") + " × " + cant + ". ¿Me pasan precio y stock?");
    }
    actualizarSolo();

    $$(".opcion[data-op]", cuerpo).forEach(function (bloque) {
      var k = bloque.getAttribute("data-op");
      bloque.addEventListener("click", function (e) {
        var chip = e.target.closest(".chip");
        if (!chip) return;
        sel[k] = chip.getAttribute("data-v");
        $$(".chip", bloque).forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        if (!p.img && (k === "Color" || k === "Presentación")) $("[data-hoja-visual]", cuerpo).innerHTML = visual(p, sel);
        aviso.textContent = "";
        actualizarSolo();
      });
    });
    var out = $("[data-cant]", cuerpo);
    $("[data-menos]", cuerpo).addEventListener("click", function () { cant = Math.max(1, cant - 1); out.textContent = cant; actualizarSolo(); });
    $("[data-mas]", cuerpo).addEventListener("click", function () { cant = Math.min(20, cant + 1); out.textContent = cant; actualizarSolo(); });

    $("[data-agregar]", cuerpo).addEventListener("click", function () {
      var falta = Object.keys(sel).filter(function (k) { return !sel[k]; });
      if (falta.length) {
        aviso.style.color = "var(--red)";
        aviso.textContent = "Elegí " + falta.join(" y ").toLowerCase() + " para sumarlo.";
        return;
      }
      var clave = p.id + "|" + JSON.stringify(sel);
      var it = pedido.filter(function (x) { return x.clave === clave; })[0];
      if (it) it.cant = Math.min(20, it.cant + cant);
      else pedido.push({ clave: clave, id: p.id, sel: JSON.parse(JSON.stringify(sel)), cant: cant });
      guardar();
      pintarFab(true);
      hoja.close();
    });

    bloquear(true);
    hoja.showModal();
  }

  /* ---------- Hoja del pedido ---------- */
  var hojaPedido = $("#hoja-pedido"), listaP = $("[data-pedido-items]"), vacio = $("[data-pedido-vacio]");
  var enviar = $("[data-pedido-enviar]"), nombre = $("[data-pedido-nombre]"), vaciar = $("[data-pedido-vaciar]");
  cerrarAlTocarFondo(hojaPedido);

  function mensajePedido() {
    var n = nombre.value.trim();
    var lineas = ["¡Hola Vientos! " + (n ? "Soy " + n + ". " : "") + "Quiero hacer este pedido:"];
    pedido.forEach(function (it) {
      var op = textoOpciones(it.sel);
      lineas.push("• " + porId[it.id].nombre + (op ? " (" + op + ")" : "") + " × " + it.cant);
    });
    lineas.push("¿Me pasan precio, stock y cómo lo retiro?");
    return lineas.join("\n");
  }

  function pintarPedido() {
    listaP.innerHTML = pedido.map(function (it, i) {
      var op = textoOpciones(it.sel);
      return '<li class="pedido__item" data-i="' + i + '">' +
        '<div><p class="pedido__n">' + porId[it.id].nombre + "</p>" + (op ? '<p class="pedido__o">' + op + "</p>" : "") + "</div>" +
        '<button type="button" class="pedido__quitar" data-quitar aria-label="Quitar ' + porId[it.id].nombre + '"><svg class="ico"><use href="#i-close"/></svg></button>' +
        '<div class="cantidad"><button type="button" data-menos aria-label="Uno menos"><svg class="ico"><use href="#i-minus"/></svg></button>' +
        "<output>" + it.cant + '</output><button type="button" data-mas aria-label="Uno más"><svg class="ico"><use href="#i-plus"/></svg></button></div></li>';
    }).join("");
    vacio.hidden = pedido.length > 0;
    enviar.classList.toggle("is-disabled", !pedido.length);
    enviar.setAttribute("aria-disabled", pedido.length ? "false" : "true");
    vaciar.hidden = !pedido.length;
    enviar.href = wa(mensajePedido());
  }

  listaP.addEventListener("click", function (e) {
    var li = e.target.closest(".pedido__item");
    if (!li) return;
    var i = parseInt(li.getAttribute("data-i"), 10);
    if (e.target.closest("[data-quitar]")) pedido.splice(i, 1);
    else if (e.target.closest("[data-menos]")) { pedido[i].cant -= 1; if (pedido[i].cant < 1) pedido.splice(i, 1); }
    else if (e.target.closest("[data-mas]")) pedido[i].cant = Math.min(20, pedido[i].cant + 1);
    else return;
    guardar();
    pintarPedido();
    pintarFab(false);
  });
  nombre.addEventListener("input", function () { enviar.href = wa(mensajePedido()); });
  vaciar.addEventListener("click", function () {
    pedido = [];
    guardar();
    pintarPedido();
    pintarFab(false);
    hojaPedido.close();
  });

  fab.addEventListener("click", function () {
    pintarPedido();
    bloquear(true);
    hojaPedido.showModal();
  });

  pintarFab(false);
})();
