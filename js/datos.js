/* Datos de Vientos GYM. Todo lo que cambia (horarios, servicios, fotos, productos, convenios) se edita acá.
   img: foto del servicio. Las de Unsplash son de muestra hasta tener las de Gemini o las fotos reales:
        para cambiarlas, poné la ruta local (ej. "img/servicios/calistenia.jpg").
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
      img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
      resumen: "Lun a vie 6 a 23 h · Sáb 10 a 20 h",
      desc: "Salones equipados para entrenar a tu ritmo, con profes en sala que te orientan con la rutina y la técnica.",
      datos: [["Lunes a viernes", "6 a 23 h"], ["Sábados", "10 a 20 h"], ["Para", "Todos los niveles"]]
    },
    {
      id: "semipersonalizado", nombre: "Semipersonalizado", largo: "Entrenamiento semipersonalizado", tag: "Grupos reducidos",
      img: "https://images.unsplash.com/photo-1648542036561-e1d66a5ae2b1",
      resumen: "Lun, mié y vie · 8 y 9 h · desde 12 años",
      desc: "Diagnóstico inicial, plan a tu medida, corrección de técnica y seguimiento de tu evolución, en grupos chicos.",
      datos: [["Profe", "Ezequiel Zanca"], ["Lunes, miércoles y viernes", "8 a 9 h y 9 a 10 h"], ["Desde", "12 años"]]
    },
    {
      id: "calistenia", nombre: "Calistenia", largo: "Calistenia mixta", tag: "Fuerza y movilidad",
      img: "https://images.unsplash.com/photo-1677165733273-dcc3724c00e8",
      resumen: "Mar y jue 14:15, 17 y 18 h · Vie 14:15 h",
      desc: "Fuerza, movilidad y control del cuerpo, con trabajo postural inspirado en el yoga y estiramiento al cierre de cada clase.",
      datos: [["Profe", "Matías Mancilla"], ["Martes y jueves", "14:15, 17 y 18 h"], ["Viernes", "14:15 h"]]
    },
    {
      id: "ciclo", nombre: "Ciclo indoor", largo: "Ciclo indoor · Top Ride", tag: "Top Ride",
      img: "https://images.unsplash.com/photo-1709315821780-3c092a9eddda",
      resumen: "Lun, mié y vie · 21 h",
      desc: "Bici fija con música, luces y un profe que marca el ritmo. Resistencia y energía en grupo.",
      datos: [["Profe", "Lore Díaz"], ["Lunes, miércoles y viernes", "21 h"]]
    },
    {
      id: "kickboxing", nombre: "Kick boxing", tag: "Combate",
      img: "https://images.unsplash.com/photo-1636581563711-cd454f1bf99a",
      resumen: "Consultá días y horarios",
      desc: "Golpes, patadas y coordinación en un entrenamiento intenso que mejora tu estado físico y tu confianza.",
      datos: [["Días y horarios", "Consultá por WhatsApp"]]
    },
    {
      id: "wushu", nombre: "Wushu", tag: "Arte marcial",
      img: "https://images.unsplash.com/photo-1539465386388-838f814495bd",
      resumen: "Mar y jue · 19 h",
      desc: "Arte marcial chino que trabaja técnica, flexibilidad y concentración. Disciplina que transforma cuerpo, mente y espíritu.",
      datos: [["Martes y jueves", "19 h"]]
    },
    {
      id: "sanda", nombre: "Sanda", tag: "Combate",
      img: "https://images.unsplash.com/photo-1611077479643-5b3c01381f9e",
      resumen: "Mar y jue · 21 h",
      desc: "Combate deportivo chino que combina golpes, patadas y derribos. Disciplina, fuerza y constancia en acción.",
      datos: [["Martes y jueves", "21 h"]]
    },
    {
      id: "stretching", nombre: "Stretching", tag: "Movilidad",
      img: "https://images.unsplash.com/photo-1791388891306-8bff414568d2",
      resumen: "Consultá días y horarios",
      desc: "Elongación y movilidad para moverte mejor, prevenir lesiones y recuperarte entre entrenamientos.",
      datos: [["Días y horarios", "Consultá por WhatsApp"]]
    }
  ],

  extras: [
    {
      id: "masajes", nombre: "Masajes", tag: "Recuperación", accion: "Pedí tu turno",
      img: "https://images.unsplash.com/photo-1761284758997-1074f2a33114",
      desc: "Para recuperarte después de entrenar y llegar mejor a la próxima sesión.",
      wa: "¡Hola Vientos! Quiero pedir un turno de masajes."
    },
    {
      id: "food", nombre: "Vientos Food", tag: "Nutrición", accion: "Consultá el menú",
      img: "https://images.unsplash.com/photo-1595348020949-87cdfbb44174",
      desc: "Batidos y algo rico y nutritivo antes o después de entrenar, sin salir del gym.",
      wa: "¡Hola Vientos! Quiero saber qué hay hoy en Vientos Food."
    }
  ],

  // Fotos de la comunidad (tira que lleva a Instagram). De muestra hasta tener las de sus redes.
  comunidad: [
    "https://images.unsplash.com/photo-1517130038641-a774d04afb3c",
    "https://images.unsplash.com/photo-1536922246289-88c42f957773",
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2",
    "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39",
    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb",
    "https://images.unsplash.com/photo-1549576490-b0b4831ef60a"
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
