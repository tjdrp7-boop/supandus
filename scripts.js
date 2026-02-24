// smooth scroll
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href");
  if (!id || id === "#") return;

  const el = document.querySelector(id);
  if (!el) return;

  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
});

// year
document.getElementById("year").textContent = new Date().getFullYear();

// Tally embed
(function loadTally() {
  const iframes = document.querySelectorAll("iframe[data-tally-src]");
  if (!iframes.length) return;

  iframes.forEach((iframe) => {
    if (!iframe.src) iframe.src = iframe.dataset.tallySrc;
  });

  const scriptId = "tally-widget";
  if (document.getElementById(scriptId)) return;

  const s = document.createElement("script");
  s.id = scriptId;
  s.src = "https://tally.so/widgets/embed.js";
  s.async = true;
  document.body.appendChild(s);
})();
