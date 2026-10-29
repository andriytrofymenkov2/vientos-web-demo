/* Datos de Vientos GYM. Todo lo que cambia (horarios, servicios, fotos, productos, convenios) se edita acá.
   img: foto del servicio (fotos reales del Instagram de Vientos, en img/vientos/). pos: qué parte de la foto se ve.
        null = sin foto (se muestra una pieza tipográfica).
   precio: número en pesos (ej. 25000). Si es null se muestra "Consultá precio". */
window.VIENTOS = {
  whatsapp: "5492966218045",
  telefono: "+5492966218045",
  telefonoVisible: "2966 21-8045",
  instagram: "https://www.instagram.com/vientosgym/",
  facebook: "https://www.facebook.com/VientosGYM/",
  djForm: "https://docs.google.com/forms/d/e/1FAIpQLSfGLhchcT0rrwygcSiJoyxCk2tgOL_4nl-hk1ZNqrF2vyELDQ/viewform",
  mapa: "https://www.google.com/maps/dir/?api=1&destination=Pellegrini+545,+R%C3%ADo+Gallegos,+Santa+Cruz",

  // Horario del gimnasio por día (0 = domingo). [abre, cierra] en horas; null = cerrado.
  horario: { 0: null, 1: [6, 23], 2: [6, 23], 3: [6, 23], 4: [6, 23], 5: [6, 23], 6: [10, 20] },

  mensajes: {
    general: "¡Hola Vientos! Quiero hacer una consulta.",
    empezar: "¡Hola Vientos! Quiero empezar a entrenar. ¿Me pasan info de planes y horarios?",
    convenio: "¡Hola Vientos! Quiero consultar el descuento de mi convenio. Trabajo en: ",
    clase: "¡Hola Vientos! Quiero información sobre "
  },

  servicios: [
    {
      id: "musculacion", nombre: "Musculación", tag: "Sala libre",
      img: "img/vientos/musculacion.jpg", pos: "45% 40%",
      resumen: "Lun a vie 6 a 23 h · Sáb 10 a 20 h",
      desc: "Salones equipados para entrenar a tu ritmo, con profes en sala que te orientan con la rutina y la técnica.",
      datos: [["Lunes a viernes", "6 a 23 h"], ["Sábados", "10 a 20 h"], ["Para", "Todos los niveles"]]
    },
    {
      id: "semipersonalizado", nombre: "Semipersonalizado", largo: "Entrenamiento semipersonalizado", tag: "Grupos reducidos",
      img: "img/vientos/semipersonalizado.jpg", pos: "30% 40%",
      resumen: "Lun, mié y vie · 8 y 9 h · desde 12 años",
      desc: "Diagnóstico inicial, plan a tu medida, corrección de técnica y seguimiento de tu evolución, en grupos chicos.",
      datos: [["Profe", "Ezequiel Zanca"], ["Lunes, miércoles y viernes", "8 a 9 h y 9 a 10 h"], ["Desde", "12 años"]]
    },
    {
      id: "calistenia", nombre: "Calistenia", largo: "Calistenia mixta", tag: "Fuerza y movilidad",
      img: "img/vientos/calistenia.jpg", pos: "78% 50%",
      resumen: "Mar y jue 14:15, 17 y 18 h · Vie 14:15 h",
      desc: "Fuerza, movilidad y control del cuerpo, con trabajo postural inspirado en el yoga y estiramiento al cierre de cada clase.",
      datos: [["Profe", "Matías Mancilla"], ["Martes y jueves", "14:15, 17 y 18 h"], ["Viernes", "14:15 h"]]
    },
    {
      id: "ciclo", nombre: "Ciclo indoor", largo: "Ciclo indoor · Top Ride", tag: "Top Ride",
      img: "img/vientos/ciclo.jpg", pos: "50% 60%",
      resumen: "Lun, mié y vie · 21 h",
      desc: "Bici fija con música, luces y un profe que marca el ritmo. Resistencia y energía en grupo.",
      datos: [["Profe", "Lore Díaz"], ["Lunes, miércoles y viernes", "21 h"]]
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
      img: "img/vientos/wushu.jpg", pos: "45% 60%",
      resumen: "Mar y jue · 19 h",
      desc: "Arte marcial chino que trabaja técnica, flexibilidad y concentración. Disciplina que transforma cuerpo, mente y espíritu.",
      datos: [["Martes y jueves", "19 h"]]
    },
    {
      id: "sanda", nombre: "Sanda", tag: "Combate",
      img: "img/vientos/sanda.jpg", pos: "55% 55%",
      resumen: "Mar y jue · 21 h",
      desc: "Combate deportivo chino que combina golpes, patadas y derribos. Disciplina, fuerza y constancia en acción.",
      datos: [["Martes y jueves", "21 h"]]
    },
    {
      id: "stretching", nombre: "Stretching", tag: "Movilidad",
      img: "img/vientos/stretching.jpg", pos: "25% 50%",
      resumen: "Consultá días y horarios",
      desc: "Elongación y movilidad para moverte mejor, prevenir lesiones y recuperarte entre entrenamientos.",
      datos: [["Días y horarios", "Consultá por WhatsApp"]]
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
    { dias: [1, 3, 5], hora: "08:00", srv: "semipersonalizado" },
    { dias: [1, 3, 5], hora: "09:00", srv: "semipersonalizado" },
    { dias: [2, 4, 5], hora: "14:15", srv: "calistenia" },
    { dias: [2, 4], hora: "17:00", srv: "calistenia" },
    { dias: [2, 4], hora: "18:00", srv: "calistenia" },
    { dias: [2, 4], hora: "19:00", srv: "wushu" },
    { dias: [1, 3, 5], hora: "21:00", srv: "ciclo" },
    { dias: [2, 4], hora: "21:00", srv: "sanda" }
  ],

  // Catálogo de ejemplo hasta que el gimnasio confirme productos, talles y precios.
  productos: [
    {
      id: "remera", nombre: "Remera Oversize", cat: "ropa", forma: "remera", precio: null, img: null, nuevo: true,
      desc: "Corte amplio con el logo Vientos al frente.",
      opciones: { Color: ["Negro", "Blanco"], Talle: ["S", "M", "L", "XL", "XXL"] }
    },
    {
      id: "buzo", nombre: "Buzo Canguro", cat: "ropa", forma: "buzo", precio: null, img: null,
      desc: "Con capucha y bolsillo canguro, para el frío del sur.",
      opciones: { Color: ["Negro"], Talle: ["S", "M", "L", "XL", "XXL"] }
    },
    {
      id: "musculosa", nombre: "Musculosa Training", cat: "ropa", forma: "musculosa", precio: null, img: null,
      desc: "Sisa amplia para entrenar con libertad.",
      opciones: { Color: ["Negro", "Rojo"], Talle: ["S", "M", "L", "XL"] }
    },
    {
      id: "top", nombre: "Top Deportivo", cat: "ropa", forma: "top", precio: null, img: null,
      desc: "Sostén medio para clases y sala.",
      opciones: { Color: ["Negro"], Talle: ["S", "M", "L"] }
    },
    {
      id: "creatina", nombre: "Creatina Monohidrato", cat: "suplementos", forma: "creatina", precio: null, img: null, nuevo: true,
      desc: "Para sumar fuerza y rendimiento. Consultá marcas disponibles.",
      opciones: { "Presentación": ["300 g", "500 g"] }
    },
    {
      id: "shaker", nombre: "Shaker Vientos", cat: "suplementos", forma: "shaker", precio: null, img: null,
      desc: "Para tus batidos y tu creatina de todos los días.",
      opciones: { Color: ["Negro"] }
    }
  ],

  convenios: [
    "APOC", "CENTA", "Imparables", "SMATA", "CASFPI · ANSES", "AMGyP · Gas y Petróleo",
    "Vía Cargo", "Autofarma", "Policía de Santa Cruz", "Bomberos", "APAP Santa Cruz", "Enerflex"
  ]
};

/* Arma la URL de una foto al ancho pedido (las de Unsplash se recortan en su servidor). */
window.vientosFoto = function (url, ancho) {
  if (!url) return "";
  if (url.indexOf("images.unsplash.com") === -1) return url;
  return url + "?auto=format&fit=crop&w=" + ancho + "&q=72";
};
