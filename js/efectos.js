/* Efectos premium: barra de progreso, cursor propio y botones magnéticos (solo con mouse).
   La intro con el logo está en index.html para que aparezca antes que todo. */
(function () {
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var lento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mouse = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---------- Progreso de lectura ---------- */
  var barra = document.createElement("div");
  barra.className = "progreso";
  barra.setAttribute("aria-hidden", "true");
  document.body.appendChild(barra);
  var pendiente = false;
  function pintar() {
    pendiente = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
  }
  window.addEventListener("scroll", function () { if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); } }, { passive: true });
  pintar();

  if (!mouse.matches) return;

  /* ---------- Cursor propio ---------- */
  var punto = document.createElement("div"), aro = document.createElement("div");
  punto.className = "cursor-punto";
  aro.className = "cursor-aro";
  aro.innerHTML = "<span></span>";
  [punto, aro].forEach(function (n) { n.setAttribute("aria-hidden", "true"); document.body.appendChild(n); });
  document.documentElement.classList.add("con-cursor");
  var etiqueta = aro.firstChild;
  var x = innerWidth / 2, y = innerHeight / 2, ax = x, ay = y, visible = false;

  document.addEventListener("mousemove", function (e) {
    x = e.clientX; y = e.clientY;
    if (!visible) { visible = true; ax = x; ay = y; document.documentElement.classList.add("cursor-visible"); }
    punto.style.transform = "translate(" + x + "px," + y + "px)";
  });
  document.addEventListener("mouseleave", function () { visible = false; document.documentElement.classList.remove("cursor-visible"); });
  (function seguir() {
    var k = lento ? 1 : 0.18;
    ax += (x - ax) * k; ay += (y - ay) * k;
    aro.style.transform = "translate(" + ax.toFixed(1) + "px," + ay.toFixed(1) + "px)";
    requestAnimationFrame(seguir);
  })();

  function modo(e) {
    var foto = e.target.closest(".tile, .extra, .prod, .ig a");
    var link = e.target.closest("a, button, .chip, label");
    var campo = e.target.closest("input, textarea, iframe");
    aro.classList.toggle("is-foto", !!foto);
    aro.classList.toggle("is-link", !foto && !!link);
    document.documentElement.classList.toggle("cursor-oculto", !!campo);
    etiqueta.textContent = foto ? (foto.classList.contains("prod") ? "Elegir" : foto.closest(".ig") ? "Instagram" : "Ver") : "";
  }
  document.addEventListener("mouseover", modo);
  document.addEventListener("mousedown", function () { aro.classList.add("is-click"); });
  document.addEventListener("mouseup", function () { aro.classList.remove("is-click"); });

  /* ---------- Botones magnéticos ---------- */
  if (lento) return;
  $$(".btn, .nav__cta, .fab-wa, .hero__scroll").forEach(function (b) {
    b.classList.add("magnetico");
    b.addEventListener("mousemove", function (e) {
      var r = b.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.style.transform = "translate(" + (dx * 14).toFixed(1) + "px," + (dy * 10).toFixed(1) + "px)";
    });
    b.addEventListener("mouseleave", function () { b.style.transform = ""; });
  });
})();
