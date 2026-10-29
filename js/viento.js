/* Viento de la portada: las tres ondas del logo (gris, roja y blanca) se dibujan cuando entra el título
   y después flamean en la franja entre el texto y los datos. Estelas finas siguen su forma.
   Mover el mouse o hacer scroll sopla más fuerte. */
(function () {
  var canvas = document.getElementById("viento");
  if (!canvas || !canvas.getContext) return;
  var hero = canvas.parentElement;
  var franja = hero.querySelector(".hero__band");
  var ctx = canvas.getContext("2d");
  var lento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var VEL = lento ? 0.35 : 1;

  var W = 0, H = 0, movil = true;
  var banda = { y: 0, h: 0 }, grosor = 14, sep = 24, amp = 30;
  var t = 0, ultimo = 0, raf = 0, visible = true, energia = 0, inicio = 0;

  var ONDAS = [
    { rgb: "128,130,138", alfa: 0.9, vel: 0.36, fase: 0.0, grosor: 1.0, x0: 0.03, x1: 0.93 },
    { rgb: "224,32,44", alfa: 1, vel: 0.4, fase: 0.28, grosor: 1.1, x0: 0.06, x1: 0.965, brillo: true },
    { rgb: "243,241,236", alfa: 0.96, vel: 0.44, fase: 0.56, grosor: 0.78, x0: 0.09, x1: 0.995 }
  ];
  var ESTELAS = [
    { off: -2.05, fase: -0.35, largo: 0.42, v: 0.045, ini: 0.0, alfa: 0.22, rgb: "243,241,236" },
    { off: -1.55, fase: -0.15, largo: 0.3, v: 0.06, ini: 0.55, alfa: 0.14, rgb: "243,241,236" },
    { off: 1.6, fase: 0.8, largo: 0.36, v: 0.05, ini: 0.3, alfa: 0.36, rgb: "224,32,44" },
    { off: 2.15, fase: 1.0, largo: 0.46, v: 0.038, ini: 0.8, alfa: 0.16, rgb: "243,241,236" }
  ];

  function suave(x) { x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); }

  function medir() {
    var r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    movil = W < 1024;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (franja) {
      var b = franja.getBoundingClientRect();
      banda.y = b.top - r.top;
      banda.h = b.height;
    } else {
      banda.y = H * 0.62;
      banda.h = H * 0.24;
    }
    grosor = Math.max(9, Math.min(W * 0.0115, 22));
    sep = Math.min(grosor * 1.75, banda.h * 0.2);
    amp = Math.max(14, Math.min(banda.h * 0.24, W * 0.06));
  }

  // Línea central compartida: todas las ondas son paralelas, como en el logo.
  function curva(X, ph, A) {
    return -A * (0.82 * Math.cos(Math.PI * 2 * 1.05 * X + ph) + 0.18 * Math.sin(Math.PI * 2 * 2.3 * X - ph * 0.7));
  }

  function onda(o, k, prog) {
    if (prog <= 0.002) return;
    var x0 = o.x0, x1 = o.x0 + (o.x1 - o.x0) * prog;
    var c = banda.y + banda.h * 0.5 + (k - 1) * sep;
    var ph = o.fase + t * o.vel;
    var A = amp * (0.9 + 0.1 * Math.sin(t * 0.55 + k * 0.9) + energia * 0.18);
    var N = 120, sup = [], inf = [];
    for (var i = 0; i <= N; i++) {
      var u = i / N, X = x0 + (x1 - x0) * u;
      var y = c + curva(X, ph, A);
      var g = grosor * o.grosor * Math.pow(Math.sin(Math.PI * u), 1.4) * (0.82 + 0.18 * Math.sin(Math.PI * 2.6 * u + ph * 0.5));
      sup.push(X * W, y - g / 2);
      inf.push(X * W, y + g / 2);
    }
    ctx.beginPath();
    ctx.moveTo(sup[0], sup[1]);
    for (i = 2; i < sup.length; i += 2) ctx.lineTo(sup[i], sup[i + 1]);
    for (i = inf.length - 2; i >= 0; i -= 2) ctx.lineTo(inf[i], inf[i + 1]);
    ctx.closePath();
    var grad = ctx.createLinearGradient(x0 * W, 0, x1 * W, 0);
    grad.addColorStop(0, "rgba(" + o.rgb + ",0.25)");
    grad.addColorStop(0.16, "rgba(" + o.rgb + "," + o.alfa + ")");
    grad.addColorStop(0.84, "rgba(" + o.rgb + "," + o.alfa + ")");
    grad.addColorStop(1, "rgba(" + o.rgb + ",0.3)");
    ctx.fillStyle = grad;
    if (o.brillo && !movil) { ctx.shadowColor = "rgba(224,32,44,.55)"; ctx.shadowBlur = 20; }
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
  }

  function estela(e, prog) {
    if (prog <= 0.002) return;
    var pos = ((t * e.v + e.ini) % 1.5) - 0.3;
    var x0 = Math.max(-0.02, pos), x1 = Math.min(1.02, pos + e.largo);
    if (x1 - x0 < 0.02) return;
    var c = banda.y + banda.h * 0.5 + e.off * sep;
    var ph = e.fase + t * 0.4;
    ctx.beginPath();
    for (var i = 0; i <= 70; i++) {
      var X = x0 + (x1 - x0) * i / 70;
      var y = c + curva(X, ph, amp * 0.96);
      if (i) ctx.lineTo(X * W, y); else ctx.moveTo(X * W, y);
    }
    var grad = ctx.createLinearGradient(pos * W, 0, (pos + e.largo) * W, 0);
    grad.addColorStop(0, "rgba(" + e.rgb + ",0)");
    grad.addColorStop(0.55, "rgba(" + e.rgb + "," + (e.alfa * prog) + ")");
    grad.addColorStop(1, "rgba(" + e.rgb + ",0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  function dibujar(ahora) {
    ctx.clearRect(0, 0, W, H);
    var e = lento ? 99 : (inicio ? (ahora - inicio) / 1000 : 0);
    var pe = suave((e - 1.1) / 1.2);
    for (var j = 0; j < ESTELAS.length; j++) estela(ESTELAS[j], pe);
    for (var k = 0; k < ONDAS.length; k++) onda(ONDAS[k], k, suave((e - k * 0.14) / 1.35));
  }

  function cuadro(ahora) {
    raf = 0;
    if (!visible || document.hidden) return;
    var dt = ultimo ? Math.min((ahora - ultimo) / 1000, 0.05) : 0.016;
    ultimo = ahora;
    if (!inicio && hero.classList.contains("is-in")) inicio = ahora + 750;
    energia *= 0.94;
    t += dt * VEL * (1 + energia * 1.6);
    dibujar(ahora);
    raf = requestAnimationFrame(cuadro);
  }

  function arrancar() {
    if (!raf && visible && !document.hidden) {
      ultimo = 0;
      raf = requestAnimationFrame(cuadro);
    }
  }

  medir();
  arrancar();

  var espera;
  window.addEventListener("resize", function () {
    clearTimeout(espera);
    espera = setTimeout(medir, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
  document.addEventListener("visibilitychange", arrancar);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entradas) {
      visible = entradas[0].isIntersecting;
      arrancar();
    }).observe(hero);
  }

  var px = null;
  hero.addEventListener("pointermove", function (e) {
    if (px !== null) energia = Math.min(1, energia + Math.abs(e.clientX - px) / 900);
    px = e.clientX;
  });
  hero.addEventListener("pointerleave", function () { px = null; });

  // El scroll también alimenta la energía de las ondas
  var sy = window.scrollY;
  window.addEventListener("scroll", function () {
    var dy = Math.abs(window.scrollY - sy);
    sy = window.scrollY;
    if (visible && dy > 0) energia = Math.min(1, energia + dy / 420);
  }, { passive: true });
})();
