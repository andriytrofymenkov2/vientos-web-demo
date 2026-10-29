/* Vientos GYM · Lógica del Panel de Administración (Local + Supabase) */
(function () {
  var V = window.VIENTOS;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var DIAS = [
    [1, "Lunes"],
    [2, "Martes"],
    [3, "Miércoles"],
    [4, "Jueves"],
    [5, "Viernes"],
    [6, "Sábado"]
  ];

  // Asegurar IDs únicos en las clases existentes
  (V.clases || []).forEach(function (c, idx) {
    if (!c.id) c.id = "cl_" + (idx + 1) + "_" + Math.random().toString(36).slice(2, 6);
  });

  var toastEl = $("[data-toast]");
  var toastTimer = 0;
  function toast(msg, esError) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.toggle("is-err", !!esError);
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 3200);
  }

  /* ---------- Navegación por pestañas ---------- */
  var tabs = $$("[data-tab]");
  var paneles = $$("[data-panel]");
  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var destino = btn.getAttribute("data-tab");
      tabs.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      paneles.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== destino; });
    });
  });

  $$("[data-cerrar-modal]").forEach(function (b) {
    b.addEventListener("click", function () {
      var m = document.getElementById(b.getAttribute("data-cerrar-modal"));
      if (m) m.close();
    });
  });

  function srvPorId(id) {
    for (var i = 0; i < V.servicios.length; i++) {
      if (V.servicios[i].id === id) return V.servicios[i];
    }
    return { id: id, nombre: id, tag: "" };
  }

  function profePorDefecto(s) {
    if (!s || !s.datos) return "";
    for (var i = 0; i < s.datos.length; i++) {
      if (s.datos[i][0] === "Profe") return s.datos[i][1];
    }
    return s.tag || "";
  }

  /* ---------- 1. Programación Semanal (Lunes a Sábado) ---------- */
  var contSemana = $("[data-adm-semana]");
  var modalClase = $("#modal-clase");
  var selectSrvClase = $("[data-cl-srv]");

  function poblarSelectServicios() {
    if (!selectSrvClase) return;
    selectSrvClase.innerHTML = V.servicios.map(function (s) {
      return '<option value="' + s.id + '">' + s.nombre + "</option>";
    }).join("");
  }

  function aMin(h) {
    var p = String(h || "00:00").split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1] || "0", 10);
  }

  function pintarSemana() {
    if (!contSemana) return;
    poblarSelectServicios();
    contSemana.innerHTML = DIAS.map(function (d) {
      var diaNum = d[0], diaNom = d[1];
      var turnos = (V.clases || []).filter(function (c) {
        return (c.dias || []).indexOf(diaNum) >= 0;
      }).sort(function (a, b) { return aMin(a.hora) - aMin(b.hora); });

      var listaHtml = turnos.length ? turnos.map(function (t) {
        var s = srvPorId(t.srv);
        var pr = t.profe || profePorDefecto(s);
        return '<div class="adm-turno">' +
          '<div class="adm-turno__top">' +
          '<span class="adm-turno__hora">' + t.hora + " hs</span>" +
          '<div class="adm-turno__acc">' +
          '<button type="button" data-editar-clase="' + t.id + '">Editar</button>' +
          '<button type="button" data-quitar-dia="' + t.id + '" data-dia="' + diaNum + '" title="Quitar de ' + diaNom + '">×</button>' +
          "</div></div>" +
          '<div class="adm-turno__srv">' + s.nombre + "</div>" +
          (pr ? '<div class="adm-turno__profe">' + pr + "</div>" : "") +
          "</div>";
      }).join("") : '<p class="adm-dia__vacio">Sin clases fijas cargadas</p>';

      return '<div class="adm-dia">' +
        '<div class="adm-dia__cab"><h4>' + diaNom + "</h4><span>" + turnos.length + (turnos.length === 1 ? " turno" : " turnos") + "</span></div>" +
        '<div class="adm-dia__lista">' + listaHtml + "</div></div>";
    }).join("");
  }

  contSemana.addEventListener("click", function (e) {
    var btnEd = e.target.closest("[data-editar-clase]");
    if (btnEd) {
      abrirModalClase(btnEd.getAttribute("data-editar-clase"));
      return;
    }
    var btnQuitar = e.target.closest("[data-quitar-dia]");
    if (btnQuitar) {
      var cid = btnQuitar.getAttribute("data-quitar-dia");
      var dNum = parseInt(btnQuitar.getAttribute("data-dia"), 10);
      var idx = V.clases.findIndex(function (x) { return x.id === cid; });
      if (idx >= 0) {
        V.clases[idx].dias = V.clases[idx].dias.filter(function (d) { return d !== dNum; });
        if (!V.clases[idx].dias.length) V.clases.splice(idx, 1);
        pintarSemana();
        guardarLocal("Turno actualizado");
      }
    }
  });

  var btnsDiasClase = $$("[data-cl-dias] [data-d]");
  btnsDiasClase.forEach(function (b) {
    b.addEventListener("click", function () {
      var est = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", est ? "false" : "true");
    });
  });

  function abrirModalClase(id) {
    poblarSelectServicios();
    var c = id ? V.clases.filter(function (x) { return x.id === id; })[0] : null;
    $("[data-modal-clase-tit]").textContent = c ? "Editar turno de clase" : "Nuevo turno de clase";
    $("[data-cl-id]").value = c ? c.id : "";
    selectSrvClase.value = c ? c.srv : (V.servicios[1] ? V.servicios[1].id : V.servicios[0].id);
    $("[data-cl-hora]").value = c ? c.hora : "18:00";
    $("[data-cl-profe]").value = c ? (c.profe || profePorDefecto(srvPorId(c.srv))) : "";
    var diasActivos = c ? (c.dias || []) : [1, 3, 5];
    btnsDiasClase.forEach(function (b) {
      var d = parseInt(b.getAttribute("data-d"), 10);
      b.setAttribute("aria-pressed", diasActivos.indexOf(d) >= 0 ? "true" : "false");
    });
    $("[data-cl-borrar]").hidden = !c;
    modalClase.showModal();
  }

  $("[data-nueva-clase]").addEventListener("click", function () { abrirModalClase(null); });

  $("[data-form-clase]").addEventListener("submit", function (e) {
    e.preventDefault();
    var id = $("[data-cl-id]").value;
    var srv = selectSrvClase.value;
    var hora = $("[data-cl-hora]").value;
    var profe = $("[data-cl-profe]").value.trim();
    var dias = [];
    btnsDiasClase.forEach(function (b) {
      if (b.getAttribute("aria-pressed") === "true") dias.push(parseInt(b.getAttribute("data-d"), 10));
    });
    if (!dias.length) {
      toast("Elegí al menos un día de la semana", true);
      return;
    }
    if (id) {
      var item = V.clases.filter(function (x) { return x.id === id; })[0];
      if (item) { item.srv = srv; item.hora = hora; item.profe = profe; item.dias = dias; }
    } else {
      V.clases.push({
        id: "cl_" + Date.now(),
        srv: srv,
        hora: hora,
        profe: profe,
        dias: dias
      });
    }
    modalClase.close();
    pintarSemana();
    guardarLocal("Programación semanal guardada");
  });

  $("[data-cl-borrar]").addEventListener("click", function () {
    var id = $("[data-cl-id]").value;
    V.clases = V.clases.filter(function (x) { return x.id !== id; });
    modalClase.close();
    pintarSemana();
    guardarLocal("Turno eliminado");
  });

  // Horarios de apertura y aviso de feriado
  function cargarInputsHorarios() {
    var lv = (V.horario && V.horario[1]) || [6, 23];
    var sab = (V.horario && V.horario[6]) || [10, 20];
    $("[data-hor-lv-abre]").value = lv[0];
    $("[data-hor-lv-cierra]").value = lv[1];
    $("[data-hor-sab-abre]").value = sab[0];
    $("[data-hor-sab-cierra]").value = sab[1];
    var av = V.avisoHorario || { activo: false, titulo: "Horario especial por feriado", texto: "" };
    $("[data-aviso-activo]").checked = !!av.activo;
    $("[data-aviso-titulo]").value = av.titulo || "";
    $("[data-aviso-texto]").value = av.texto || "";
  }

  function leerInputsHorarios() {
    var lvA = parseInt($("[data-hor-lv-abre]").value, 10) || 6;
    var lvC = parseInt($("[data-hor-lv-cierra]").value, 10) || 23;
    var sabA = parseInt($("[data-hor-sab-abre]").value, 10) || 10;
    var sabC = parseInt($("[data-hor-sab-cierra]").value, 10) || 20;
    V.horario = {
      0: null,
      1: [lvA, lvC],
      2: [lvA, lvC],
      3: [lvA, lvC],
      4: [lvA, lvC],
      5: [lvA, lvC],
      6: [sabA, sabC]
    };
    V.avisoHorario = {
      activo: $("[data-aviso-activo]").checked,
      titulo: $("[data-aviso-titulo]").value.trim() || "Aviso especial",
      texto: $("[data-aviso-texto]").value.trim()
    };
  }

  /* ---------- 2. Shop / Productos ---------- */
  var contProds = $("[data-adm-prods]");
  var modalProd = $("#modal-prod");

  function pintarProductos() {
    if (!contProds) return;
    contProds.innerHTML = (V.productos || []).map(function (p) {
      var precioTxt = p.precio ? "$ " + Number(p.precio).toLocaleString("es-AR") : "Consultá precio";
      var ops = Object.keys(p.opciones || {}).map(function (k) {
        return k + ": " + (p.opciones[k] || []).join(", ");
      }).join(" · ");
      var stockLabel = p.stock === "agotado" ? "Sin stock" : (p.stock === "ultimas" ? "Últimas unidades" : "Disponible");
      var miniatura = p.img
        ? '<img src="' + p.img + '" alt="">'
        : '<span style="font-family:var(--display);font-weight:700;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)">SVG · ' + (p.forma || "remera") + "</span>";
      return '<article class="adm-prod">' +
        '<div class="adm-prod__top">' +
        '<div class="adm-prod__vis">' + miniatura + "</div>" +
        '<div class="adm-prod__info">' +
        '<span class="adm-prod__cat">' + p.cat + (p.nuevo ? " · NUEVO" : "") + " · " + stockLabel + "</span>" +
        '<h4 class="adm-prod__nom">' + p.nombre + "</h4>" +
        '<span class="adm-prod__precio">' + precioTxt + "</span>" +
        '<p class="adm-prod__ops">' + (ops || "Sin variantes") + "</p>" +
        "</div></div>" +
        '<div class="adm-prod__pie">' +
        '<span style="font-size:.8rem;color:var(--mute)">' + p.desc + "</span>" +
        '<button type="button" class="adm-btn adm-btn--sm" data-editar-prod="' + p.id + '">Editar</button>' +
        "</div></article>";
    }).join("");
  }

  contProds.addEventListener("click", function (e) {
    var b = e.target.closest("[data-editar-prod]");
    if (b) abrirModalProd(b.getAttribute("data-editar-prod"));
  });

  function abrirModalProd(id) {
    var p = id ? V.productos.filter(function (x) { return x.id === id; })[0] : null;
    $("[data-modal-prod-tit]").textContent = p ? "Editar producto" : "Nuevo producto";
    $("[data-pr-id]").value = p ? p.id : "";
    $("[data-pr-nombre]").value = p ? p.nombre : "";
    $("[data-pr-cat]").value = p ? p.cat : "ropa";
    $("[data-pr-precio]").value = (p && p.precio) ? p.precio : "";
    $("[data-pr-stock]").value = (p && p.stock) ? p.stock : "disponible";
    $("[data-pr-forma]").value = (p && p.forma) ? p.forma : "remera";
    $("[data-pr-desc]").value = p ? p.desc : "";
    $("[data-pr-img]").value = (p && p.img) ? p.img : "";
    $("[data-pr-nuevo]").checked = !!(p && p.nuevo);

    var ops = (p && p.opciones) || {};
    $("[data-pr-colores]").value = (ops.Color || []).join(", ");
    var tallesOPres = ops.Talle || ops["Presentación"] || [];
    $("[data-pr-talles]").value = tallesOPres.join(", ");

    $("[data-pr-borrar]").hidden = !p;
    modalProd.showModal();
  }

  $("[data-nuevo-prod]").addEventListener("click", function () { abrirModalProd(null); });

  // Compresión de foto al subir archivo desde celular o PC
  $("[data-pr-file]").addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        var maxW = 720;
        var w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        var c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        var dataUrl = c.toDataURL("image/jpeg", 0.82);
        $("[data-pr-img]").value = dataUrl;
        toast("Foto procesada y lista para guardar");
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Sin foto, el producto vuelve a mostrar su ilustración.
  $("[data-pr-sin-foto]").addEventListener("click", function () {
    $("[data-pr-img]").value = "";
    $("[data-pr-file]").value = "";
  });

  $("[data-form-prod]").addEventListener("submit", function (e) {
    e.preventDefault();
    var id = $("[data-pr-id]").value;
    var nombre = $("[data-pr-nombre]").value.trim();
    var cat = $("[data-pr-cat]").value;
    var precioRaw = $("[data-pr-precio]").value.trim();
    var precio = precioRaw ? parseInt(precioRaw, 10) : null;
    var stock = $("[data-pr-stock]").value;
    var forma = $("[data-pr-forma]").value;
    var desc = $("[data-pr-desc]").value.trim();
    var img = $("[data-pr-img]").value.trim() || null;
    var nuevo = $("[data-pr-nuevo]").checked;

    var colores = $("[data-pr-colores]").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var talles = $("[data-pr-talles]").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var opciones = {};
    if (colores.length) opciones.Color = colores;
    if (talles.length) {
      opciones[cat === "suplementos" ? "Presentación" : "Talle"] = talles;
    }

    if (id) {
      var item = V.productos.filter(function (x) { return x.id === id; })[0];
      if (item) {
        item.nombre = nombre; item.cat = cat; item.precio = precio;
        item.stock = stock; item.forma = forma; item.desc = desc;
        item.img = img; item.nuevo = nuevo; item.opciones = opciones;
      }
    } else {
      V.productos.push({
        id: "prod_" + Date.now(),
        nombre: nombre, cat: cat, precio: precio,
        stock: stock, forma: forma, desc: desc,
        img: img, nuevo: nuevo, opciones: opciones
      });
    }
    modalProd.close();
    pintarProductos();
    guardarLocal("Producto guardado en el Shop");
  });

  $("[data-pr-borrar]").addEventListener("click", function () {
    var id = $("[data-pr-id]").value;
    V.productos = V.productos.filter(function (x) { return x.id !== id; });
    modalProd.close();
    pintarProductos();
    guardarLocal("Producto eliminado");
  });

  /* ---------- 3. Servicios y Planes ---------- */
  var contPlanes = $("[data-adm-planes]");
  var contServicios = $("[data-adm-servicios]");

  function pintarPlanesAdmin() {
    if (!contPlanes) return;
    contPlanes.innerHTML = (V.planes || []).map(function (p, i) {
      return '<div class="adm-card" data-plan-idx="' + i + '">' +
        '<div class="adm-card__cab">' +
        '<div><span class="adm-card__tag">' + p.tag + '</span><h4 class="adm-card__tit">' + p.nombre + "</h4></div>" +
        '<label class="adm-check"><input type="checkbox" data-pl-dest ' + (p.destacado ? "checked" : "") + "><span>Destacado</span></label>" +
        "</div>" +
        '<div class="adm-grid-2">' +
        '<div class="adm-campo"><label>Nombre del Plan</label><input type="text" class="adm-input" data-pl-nom value="' + p.nombre + '"></div>' +
        '<div class="adm-campo"><label>Precio $ (vacío = Consultar)</label><input type="number" class="adm-input" data-pl-precio value="' + (p.precio || "") + '" placeholder="Consultar"></div>' +
        "</div>" +
        '<div class="adm-campo"><label>Descripción</label><input type="text" class="adm-input" data-pl-desc value="' + p.desc + '"></div>' +
        '<div class="adm-campo"><label>Beneficios (uno por línea)</label><textarea class="adm-textarea" data-pl-items>' + (p.items || []).join("\n") + "</textarea></div>" +
        "</div>";
    }).join("");
  }

  function leerPlanesAdmin() {
    $$("[data-plan-idx]", contPlanes).forEach(function (card) {
      var i = parseInt(card.getAttribute("data-plan-idx"), 10);
      var p = V.planes[i];
      if (!p) return;
      p.nombre = $("[data-pl-nom]", card).value.trim() || p.nombre;
      var pr = $("[data-pl-precio]", card).value.trim();
      p.precio = pr ? parseInt(pr, 10) : null;
      p.desc = $("[data-pl-desc]", card).value.trim();
      p.destacado = $("[data-pl-dest]", card).checked;
      p.items = $("[data-pl-items]", card).value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    });
  }

  function pintarServiciosAdmin() {
    if (!contServicios) return;
    contServicios.innerHTML = (V.servicios || []).map(function (s, i) {
      return '<div class="adm-card" data-srv-idx="' + i + '">' +
        '<div class="adm-card__cab">' +
        '<div><span class="adm-card__tag">' + s.tag + '</span><h4 class="adm-card__tit">' + s.nombre + "</h4></div>" +
        "</div>" +
        '<div class="adm-grid-2">' +
        '<div class="adm-campo"><label>Nombre</label><input type="text" class="adm-input" data-sr-nom value="' + s.nombre + '"></div>' +
        '<div class="adm-campo"><label>Etiqueta superior</label><input type="text" class="adm-input" data-sr-tag value="' + s.tag + '"></div>' +
        "</div>" +
        '<div class="adm-campo"><label>Resumen de días y horarios</label><input type="text" class="adm-input" data-sr-res value="' + s.resumen + '"></div>' +
        '<div class="adm-campo"><label>Descripción</label><textarea class="adm-textarea" data-sr-desc>' + s.desc + "</textarea></div>" +
        '<div class="adm-campo"><label>Foto (ruta o vacío para pieza tipográfica)</label><input type="text" class="adm-input" data-sr-img value="' + (s.img || "") + '" placeholder="Sin foto (se muestra diseño tipográfico)"></div>' +
        "</div>";
    }).join("");
  }

  function leerServiciosAdmin() {
    $$("[data-srv-idx]", contServicios).forEach(function (card) {
      var i = parseInt(card.getAttribute("data-srv-idx"), 10);
      var s = V.servicios[i];
      if (!s) return;
      s.nombre = $("[data-sr-nom]", card).value.trim() || s.nombre;
      s.tag = $("[data-sr-tag]", card).value.trim() || s.tag;
      s.resumen = $("[data-sr-res]", card).value.trim();
      s.desc = $("[data-sr-desc]", card).value.trim();
      var imgVal = $("[data-sr-img]", card).value.trim();
      s.img = imgVal ? imgVal : null;
    });
  }

  /* ---------- 4. Convenios y Contacto ---------- */
  var contConvenios = $("[data-adm-convenios]");
  function pintarConveniosAdmin() {
    if (!contConvenios) return;
    contConvenios.innerHTML = (V.convenios || []).map(function (c, i) {
      return '<span class="adm-chip"><span>' + c + '</span><button type="button" data-quitar-conv="' + i + '" aria-label="Quitar">×</button></span>';
    }).join("");
  }
  contConvenios.addEventListener("click", function (e) {
    var b = e.target.closest("[data-quitar-conv]");
    if (!b) return;
    var i = parseInt(b.getAttribute("data-quitar-conv"), 10);
    V.convenios.splice(i, 1);
    pintarConveniosAdmin();
    guardarLocal("Convenio eliminado");
  });
  $("[data-form-convenio]").addEventListener("submit", function (e) {
    e.preventDefault();
    var inp = $("[data-input-convenio]");
    var val = inp.value.trim();
    if (!val) return;
    V.convenios.push(val);
    inp.value = "";
    pintarConveniosAdmin();
    guardarLocal("Convenio agregado");
  });

  function cargarContactoAdmin() {
    $("[data-cfg-wa]").value = V.whatsapp || "";
    $("[data-cfg-tel]").value = V.telefonoVisible || "";
    $("[data-cfg-ig]").value = V.instagram || "";
  }
  function leerContactoAdmin() {
    V.whatsapp = $("[data-cfg-wa]").value.trim() || V.whatsapp;
    V.telefonoVisible = $("[data-cfg-tel]").value.trim() || V.telefonoVisible;
    V.instagram = $("[data-cfg-ig]").value.trim() || V.instagram;
  }

  /* ---------- 5. Sesión y publicación en Supabase (mismo proyecto que la app de socios) ---------- */
  var SB = window.VIENTOS_SUPABASE;
  var SB_URL = SB.url.replace(/\/$/, "");
  var CLAVE_SESION = "vientos_web_sesion_v1";

  function leerSesion() {
    try { return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null; } catch (e) { return null; }
  }
  function guardarSesion(d) {
    var ses = { access: d.access_token, refresh: d.refresh_token, vence: Date.now() + (d.expires_in || 3600) * 1000, email: d.user && d.user.email };
    try { localStorage.setItem(CLAVE_SESION, JSON.stringify(ses)); } catch (e) {}
    return ses;
  }
  function borrarSesion() { try { localStorage.removeItem(CLAVE_SESION); } catch (e) {} }

  function pedirToken(tipo, cuerpo) {
    return fetch(SB_URL + "/auth/v1/token?grant_type=" + tipo, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SB.anonKey },
      body: JSON.stringify(cuerpo)
    }).then(function (r) {
      return r.json().then(function (d) {
        if (!r.ok || !d.access_token) throw new Error(d.error_description || d.msg || "No se pudo iniciar sesión");
        return d;
      });
    });
  }

  // Devuelve una sesión vigente; si vence en menos de 2 minutos la renueva sola.
  function sesionVigente() {
    var ses = leerSesion();
    if (!ses || !ses.refresh) return Promise.resolve(null);
    if (ses.vence - Date.now() > 120000) return Promise.resolve(ses);
    return pedirToken("refresh_token", { refresh_token: ses.refresh })
      .then(guardarSesion)
      .catch(function () { borrarSesion(); return null; });
  }

  function rpc(nombre, args, token) {
    return fetch(SB_URL + "/rest/v1/rpc/" + nombre, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SB.anonKey, "Authorization": "Bearer " + (token || SB.anonKey) },
      body: JSON.stringify(args || {})
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)); });
  }

  // Sin sesión de dueño se ve solo la pantalla de ingreso.
  var pantallaLogin = $("[data-login]");
  function pintarEstado(ses) {
    var ok = !!ses;
    pantallaLogin.hidden = ok;
    document.documentElement.classList.toggle("adm-bloqueado", !ok);
    var u = $("[data-usuario-sesion]");
    if (u) u.textContent = ok ? (ses.email || "") : "";
    if (!ok) setTimeout(function () { var i = $("[data-login-usuario]"); if (i) i.focus(); }, 50);
  }
  function actualizarIndicadorConexion() { sesionVigente().then(pintarEstado); }

  function recolectarTodo() {
    leerInputsHorarios();
    leerPlanesAdmin();
    leerServiciosAdmin();
    leerContactoAdmin();
  }

  function vistaPreviaLocal() {
    try { localStorage.setItem("vientos_cms_datos_v1", JSON.stringify(V)); } catch (e) {}
  }

  // Publica en Supabase. Sin sesión de dueño no publica y lo dice claro.
  function publicar(mostrarToast) {
    vistaPreviaLocal();
    return sesionVigente().then(function (ses) {
      pintarEstado(ses);
      if (!ses) {
        if (mostrarToast) toast("No se publicó: iniciá sesión con el usuario del dueño. Por ahora el cambio se ve solo en este navegador.", true);
        return false;
      }
      return fetch(SB_URL + "/rest/v1/vientos_web_contenido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SB.anonKey,
          "Authorization": "Bearer " + ses.access,
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({ id: "principal", datos: V, actualizado_en: new Date().toISOString() })
      }).then(function (r) {
        if (r.status === 401 || r.status === 403) throw new Error("tu usuario no tiene permiso de dueño");
        if (r.status === 404) throw new Error("falta correr supabase/schema.sql");
        if (!r.ok) throw new Error("error " + r.status);
        if (mostrarToast) toast("Publicado: ya se ve en la página web");
        return true;
      }).catch(function (err) {
        if (mostrarToast) toast("No se publicó (" + err.message + "). El cambio se ve solo en este navegador.", true);
        return false;
      });
    });
  }

  function guardarLocal(mensaje) {
    recolectarTodo();
    publicar(false).then(function (ok) {
      toast(ok ? (mensaje || "Guardado") + " y publicado" : (mensaje || "Guardado") + " solo en este navegador (iniciá sesión para publicar)", !ok);
    });
  }

  $("[data-guardar-todo]").addEventListener("click", function () {
    recolectarTodo();
    publicar(true);
  });

  // Ingreso con el mismo usuario y contraseña de la app de socios (usuario, DNI o email).
  var errorLogin = $("[data-login-error]");
  var botonEntrar = $("[data-login-entrar]");
  $("[data-login-form]").addEventListener("submit", function (e) {
    e.preventDefault();
    var ident = $("[data-login-usuario]").value.trim();
    var pass = $("[data-login-clave]").value;
    errorLogin.textContent = "";
    botonEntrar.disabled = true;
    botonEntrar.textContent = "Entrando…";
    rpc("login_email", { p_ident: ident, p_pass: pass })
      .then(function (email) {
        if (!email) throw new Error("Usuario o contraseña incorrectos.");
        return pedirToken("password", { email: email, password: pass });
      })
      .then(function (d) {
        var ses = guardarSesion(d);
        return rpc("es_admin_web", {}, ses.access).then(function (esAdmin) {
          if (!esAdmin) { borrarSesion(); throw new Error("Esta cuenta no tiene permiso para administrar la página."); }
          $("[data-login-clave]").value = "";
          pintarEstado(ses);
        }, function () {
          borrarSesion();
          throw new Error("El panel todavía no está activado en Supabase (falta correr supabase/schema.sql).");
        });
      })
      .catch(function (err) {
        errorLogin.textContent = /fetch|network/i.test(err.message) ? "Sin conexión. Probá de nuevo." : err.message;
      })
      .then(function () { botonEntrar.disabled = false; botonEntrar.textContent = "Entrar"; });
  });

  $("[data-sb-salir]").addEventListener("click", function () {
    borrarSesion();
    pintarEstado(null);
    toast("Sesión cerrada");
  });

  function inicializarVista() {
    pintarSemana();
    cargarInputsHorarios();
    pintarProductos();
    pintarPlanesAdmin();
    pintarServiciosAdmin();
    pintarConveniosAdmin();
    cargarContactoAdmin();
    actualizarIndicadorConexion();
  }

  inicializarVista();
  // Cuando llega lo publicado en Supabase, el panel arranca desde ahí (y no desde lo de fábrica).
  window.addEventListener("vientos:datos-actualizados", inicializarVista);
})();
