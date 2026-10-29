/* Datos de Vientos GYM. Todo lo que cambia (horarios, servicios, planes, fotos, productos, convenios) se edita acá
   o desde el Panel de Administración (admin.html) conectado a Supabase.
   img: foto del servicio (fotos reales del Instagram de Vientos, en img/vientos/). pos: qué parte de la foto se ve.
        null = sin foto (se muestra una pieza tipográfica y gráfica de la disciplina).
   precio: número en pesos (ej. 25000). Si es null se muestra "Consultá precio". */
window.VIENTOS_DEFAULT = {
  whatsapp: "5492966218045",
  telefono: "+5492966218045",
  telefonoVisible: "2966 21-8045",
  instagram: "https://www.instagram.com/vientosgym/",
  facebook: "https://www.facebook.com/VientosGYM/",
  djForm: "https://docs.google.com/forms/d/e/1FAIpQLSfGLhchcT0rrwygcSiJoyxCk2tgOL_4nl-hk1ZNqrF2vyELDQ/viewform",
  mapa: "https://www.google.com/maps/dir/?api=1&destination=Pellegrini+545,+R%C3%ADo+Gallegos,+Santa+Cruz",

  // Horario del gimnasio por día (0 = domingo). [abre, cierra] en horas; null = cerrado.
  horario: { 0: null, 1: [6, 23], 2: [6, 23], 3: [6, 23], 4: [6, 23], 5: [6, 23], 6: [10, 20] },

  // Aviso especial o feriado (editable desde el panel de administración).
  avisoHorario: {
    activo: false,
    titulo: "Horario especial por feriado",
    texto: "Hoy abrimos en horario especial de 10:00 a 18:00 hs."
  },

  mensajes: {
    general: "¡Hola Vientos! Quiero hacer una consulta.",
    empezar: "¡Hola Vientos! Quiero empezar a entrenar. ¿Me pasan info de planes y horarios?",
    convenio: "¡Hola Vientos! Quiero consultar el descuento de mi convenio. Trabajo en: ",
    clase: "¡Hola Vientos! Quiero información sobre ",
    plan: "¡Hola Vientos! Quiero consultar por el "
  },

  servicios: [
    {
      id: "musculacion", nombre: "Musculación", tag: "Sala libre",
      img: "img/vientos/musculacion.jpg", pos: "45% 40%",
      resumen: "Lun a vie 06:00 a 23:00 hs · Sáb 10:00 a 20:00 hs",
      desc: "Salones equipados para entrenar a tu ritmo, con profes en sala que te orientan con la rutina y la técnica.",
      datos: [["Lunes a viernes", "06:00 a 23:00 hs"], ["Sábados", "10:00 a 20:00 hs"], ["Para", "Todos los niveles"]]
    },
    {
      id: "semipersonalizado", nombre: "Semipersonalizado", largo: "Entrenamiento semipersonalizado", tag: "Grupos reducidos",
      img: "img/vientos/semipersonalizado.jpg", pos: "30% 40%",
      resumen: "Lun, mié y vie · 08:00 y 09:00 hs · desde 12 años",
      desc: "Diagnóstico inicial, plan a tu medida, corrección de técnica y seguimiento de tu evolución, en grupos chicos.",
      datos: [["Profe", "Ezequiel Zanca"], ["Lunes, miércoles y viernes", "08:00 a 09:00 hs y 09:00 a 10:00 hs"], ["Desde", "12 años"]]
    },
    {
      id: "calistenia", nombre: "Calistenia", largo: "Calistenia mixta", tag: "Fuerza y movilidad",
      img: "img/vientos/calistenia.jpg", pos: "78% 50%",
      resumen: "Mar y jue 14:15, 17:00 y 18:00 hs · Vie 14:15 hs",
      desc: "Fuerza, movilidad y control del cuerpo, con trabajo postural inspirado en el yoga y estiramiento al cierre de cada clase.",
      datos: [["Profe", "Matías Mancilla"], ["Martes y jueves", "14:15, 17:00 y 18:00 hs"], ["Viernes", "14:15 hs"]]
    },
    {
      id: "ciclo", nombre: "Ciclo indoor", largo: "Ciclo indoor · Top Ride", tag: "Top Ride",
      img: null,
      resumen: "Lun, mié y vie · 21:00 hs",
      desc: "Bici fija con música, luces y un profe que marca el ritmo. Resistencia y energía en grupo.",
      datos: [["Profe", "Lore Díaz"], ["Lunes, miércoles y viernes", "21:00 hs"]]
    },
    {
      id: "kickboxing", nombre: "Kick boxing", tag: "Combate",
      img: "img/vientos/kickboxing.jpg", pos: "40% 50%",
      resumen: "Consultá días y horarios",
      desc: "Golpes, patadas y coordinación en un entrenamiento intenso que mejora tu estado físico y tu confianza.",
      datos: [["Días y horarios", "Consultá por WhatsApp"]]
    },
    {
      id: "wushu", nombre: "Wushu", tag: "Arte marcial",
      img: null,
      resumen: "Mar y jue · 19:00 hs",
      desc: "Arte marcial chino que trabaja técnica, flexibilidad y concentración. Disciplina que transforma cuerpo, mente y espíritu.",
      datos: [["Martes y jueves", "19:00 hs"]]
    },
    {
      id: "sanda", nombre: "Sanda", tag: "Combate",
      img: null,
      resumen: "Mar y jue · 21:00 hs",
      desc: "Combate deportivo chino que combina golpes, patadas y derribos. Disciplina, fuerza y constancia en acción.",
      datos: [["Martes y jueves", "21:00 hs"]]
    },
    {
      id: "stretching", nombre: "Stretching", tag: "Movilidad",
      img: "img/vientos/stretching.jpg", pos: "25% 50%",
      resumen: "Consultá días y horarios",
      desc: "Elongación y movilidad para moverte mejor, prevenir lesiones y recuperarte entre entrenamientos.",
      datos: [["Días y horarios", "Consultá por WhatsApp"]]
    }
  ],

  planes: [
    {
      id: "sala",
      nombre: "Pase Sala Libre",
      tag: "Musculación",
      precio: null,
      periodo: "Mensual",
      destacado: false,
      desc: "Entrená a tu ritmo en nuestros salones equipados, sin límite de horario y con profes en sala.",
      items: [
        "Acceso de lunes a sábados",
        "Armado de rutina según tu nivel",
        "Seguimiento de profes en sala",
        "Sin turno previo requerido"
      ]
    },
    {
      id: "full",
      nombre: "Pase Full Vientos",
      tag: "Más elegido",
      precio: null,
      periodo: "Mensual",
      destacado: true,
      desc: "Combiná el acceso a la sala de musculación con tus disciplinas favoritas para un progreso integral.",
      items: [
        "Musculación libre de lunes a sábados",
        "Acceso a disciplinas y clases grupales",
        "Evaluación inicial y ajuste de objetivos",
        "Descuentos con convenios adheridos"
      ]
    },
    {
      id: "disciplinas",
      nombre: "Pase Disciplinas",
      tag: "Clases y grupos",
      precio: null,
      periodo: "Mensual",
      destacado: false,
      desc: "Sumate a nuestras clases con horario fijo y entrená en grupos reducidos con seguimiento directo.",
      items: [
        "Semipersonalizado o Calistenia mixta",
        "Ciclo Indoor · Top Ride nocturno",
        "Kick Boxing, Wushu y Sanda",
        "Clases de Stretching y movilidad"
      ]
    }
  ],

  extras: [
    {
      id: "masajes", nombre: "Masajes", tag: "Recuperación", accion: "Pedí tu turno",
      img: null,
      desc: "Para recuperarte después de entrenar y llegar mejor a la próxima sesión.",
      wa: "¡Hola Vientos! Quiero pedir un turno de masajes."
    },
    {
      id: "food", nombre: "Vientos Food", tag: "Nutrición", accion: "Consultá el menú",
      img: null,
      desc: "Batidos y algo rico y nutritivo antes o después de entrenar, sin salir del gym.",
      wa: "¡Hola Vientos! Quiero saber qué hay hoy en Vientos Food."
    }
  ],

  // Fotos de la comunidad (tira que lleva a Instagram), de su propio Instagram.
  comunidad: [
    "img/vientos/comunidad-1.jpg", "img/vientos/comunidad-2.jpg", "img/vientos/comunidad-3.jpg",
    "img/vientos/comunidad-4.jpg", "img/vientos/comunidad-5.jpg", "img/vientos/comunidad-6.jpg"
  ],

  // Clases con horario fijo. dias: 1 = lunes … 6 = sábado. srv = id del servicio.
  clases: [
    { id: "c1", dias: [1, 3, 5], hora: "08:00", srv: "semipersonalizado", profe: "Ezequiel Zanca", nota: "" },
    { id: "c2", dias: [1, 3, 5], hora: "09:00", srv: "semipersonalizado", profe: "Ezequiel Zanca", nota: "" },
    { id: "c3", dias: [2, 4, 5], hora: "14:15", srv: "calistenia", profe: "Matías Mancilla", nota: "" },
    { id: "c4", dias: [2, 4], hora: "17:00", srv: "calistenia", profe: "Matías Mancilla", nota: "" },
    { id: "c5", dias: [2, 4], hora: "18:00", srv: "calistenia", profe: "Matías Mancilla", nota: "" },
    { id: "c6", dias: [2, 4], hora: "19:00", srv: "wushu", profe: "Arte marcial", nota: "" },
    { id: "c7", dias: [1, 3, 5], hora: "21:00", srv: "ciclo", profe: "Lore Díaz", nota: "" },
    { id: "c8", dias: [2, 4], hora: "21:00", srv: "sanda", profe: "Combate", nota: "" }
  ],

  // Catálogo de ejemplo hasta que el gimnasio confirme productos, talles y precios.
  productos: [
    {
      id: "remera", nombre: "Remera Oversize", cat: "ropa", forma: "remera", precio: null, img: null, nuevo: true, stock: "disponible",
      desc: "Corte amplio con el logo Vientos al frente.",
      opciones: { Color: ["Negro", "Blanco"], Talle: ["S", "M", "L", "XL", "XXL"] }
    },
    {
      id: "buzo", nombre: "Buzo Canguro", cat: "ropa", forma: "buzo", precio: null, img: null, nuevo: false, stock: "disponible",
      desc: "Con capucha y bolsillo canguro, para el frío del sur.",
      opciones: { Color: ["Negro"], Talle: ["S", "M", "L", "XL", "XXL"] }
    },
    {
      id: "musculosa", nombre: "Musculosa Training", cat: "ropa", forma: "musculosa", precio: null, img: null, nuevo: false, stock: "disponible",
      desc: "Sisa amplia para entrenar con libertad.",
      opciones: { Color: ["Negro", "Rojo"], Talle: ["S", "M", "L", "XL"] }
    },
    {
      id: "top", nombre: "Top Deportivo", cat: "ropa", forma: "top", precio: null, img: null, nuevo: false, stock: "ultimas",
      desc: "Sostén medio para clases y sala.",
      opciones: { Color: ["Negro"], Talle: ["S", "M", "L"] }
    },
    {
      id: "creatina", nombre: "Creatina Monohidrato", cat: "suplementos", forma: "creatina", precio: null, img: null, nuevo: true, stock: "disponible",
      desc: "Para sumar fuerza y rendimiento. Consultá marcas disponibles.",
      opciones: { "Presentación": ["300 g", "500 g"] }
    },
    {
      id: "shaker", nombre: "Shaker Vientos", cat: "suplementos", forma: "shaker", precio: null, img: null, nuevo: false, stock: "disponible",
      desc: "Para tus batidos y tu creatina de todos los días.",
      opciones: { Color: ["Negro"] }
    }
  ],

  convenios: [
    "APOC", "CENTA", "Imparables", "SMATA", "CASFPI · ANSES", "AMGyP · Gas y Petróleo",
    "Vía Cargo", "Autofarma", "Policía de Santa Cruz", "Bomberos", "APAP Santa Cruz", "Enerflex"
  ]
};

// Mismo proyecto de Supabase que la app de socios de Vientos. La clave es la pública (va en el navegador);
// solo el dueño de Vientos puede escribir (lo controla supabase/schema.sql).
window.VIENTOS_SUPABASE = {
  url: "https://oypqievulxbvjjxxfvvq.supabase.co",
  anonKey: "sb_publishable_zHtcseGjRLeZpHxNMYZ0zw_N03E6mi5"
};

// Clona la base y aplica la última copia conocida; después trae lo publicado en Supabase
(function () {
  var base = JSON.parse(JSON.stringify(window.VIENTOS_DEFAULT));
  try {
    var guardado = localStorage.getItem("vientos_cms_datos_v1");
    if (guardado) {
      var parsed = JSON.parse(guardado);
      if (parsed && typeof parsed === "object") {
        Object.keys(parsed).forEach(function (k) {
          if (parsed[k] !== undefined && parsed[k] !== null) base[k] = parsed[k];
        });
      }
    }
  } catch (e) {}
  window.VIENTOS = base;

  // Sincronización en vivo con Supabase si el proyecto tiene credenciales configuradas
  try {
    var sbCfg = window.VIENTOS_SUPABASE;
    if (sbCfg && sbCfg.url && sbCfg.anonKey) {
      fetch(sbCfg.url.replace(/\/$/, "") + "/rest/v1/vientos_web_contenido?id=eq.principal&select=datos", {
        headers: {
          "apikey": sbCfg.anonKey,
          "Authorization": "Bearer " + sbCfg.anonKey
        }
      }).then(function (r) { return r.ok ? r.json() : null; })
        .then(function (rows) {
          if (rows && rows[0] && rows[0].datos) {
            var remotos = rows[0].datos;
            Object.keys(remotos).forEach(function (k) {
              if (remotos[k] !== undefined && remotos[k] !== null) window.VIENTOS[k] = remotos[k];
            });
            try { localStorage.setItem("vientos_cms_datos_v1", JSON.stringify(remotos)); } catch (e) {}
            window.dispatchEvent(new CustomEvent("vientos:datos-actualizados"));
          }
        }).catch(function () {});
    }
  } catch (e) {}
})();

/* Arma la URL de una foto al ancho pedido (las de Unsplash se recortan en su servidor). */
window.vientosFoto = function (url, ancho) {
  if (!url) return "";
  if (url.indexOf("images.unsplash.com") === -1) return url;
  return url + "?auto=format&fit=crop&w=" + ancho + "&q=72";
};
