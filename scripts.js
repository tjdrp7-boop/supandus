// Smooth scroll
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

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Tally embed loader (공식 위젯 스크립트 로드 + data-tally-src 적용)
(function loadTally() {
  const iframes = document.querySelectorAll("iframe[data-tally-src]");
  if (!iframes.length) return;

  // data-tally-src -> src로 세팅
  iframes.forEach((iframe) => {
    if (!iframe.src) iframe.src = iframe.dataset.tallySrc;
  });

  // 위젯 스크립트 로드 (한 번만)
  const scriptId = "tally-widget";
  if (document.getElementById(scriptId)) return;

  const s = document.createElement("script");
  s.id = scriptId;
  s.src = "https://tally.so/widgets/embed.js";
  s.async = true;
  document.body.appendChild(s);
})();
