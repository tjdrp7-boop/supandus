// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);

// ===== Footer year =====
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Smooth scroll (anchor) =====
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

// ===== Tally embed loader (dynamicHeight) =====
(function loadTally() {
  const hasEmbed = document.querySelector('iframe[data-tally-src]');
  if (!hasEmbed) return;

  const widgetScriptSrc = "https://tally.so/widgets/embed.js";

  const run = () => {
    // data-tally-src -> src 주입 (src가 없을 때만)
    document
      .querySelectorAll('iframe[data-tally-src]:not([src])')
      .forEach((iframeEl) => {
        iframeEl.src = iframeEl.dataset.tallySrc;
      });

    // 위젯이 있으면 dynamicHeight 적용
    if (typeof Tally !== "undefined" && typeof Tally.loadEmbeds === "function") {
      Tally.loadEmbeds();
    }
  };

  // 이미 로드되어 있으면 실행
  if (typeof Tally !== "undefined") {
    run();
    return;
  }

  // 스크립트 중복 로드 방지
  const existing = document.querySelector(`script[src="${widgetScriptSrc}"]`);
  if (existing) {
    // 로드 완료 전일 수 있으니 약간 기다렸다가 실행
    setTimeout(run, 0);
    return;
  }

  const script = document.createElement("script");
  script.src = widgetScriptSrc;
  script.async = true;
  script.onload = run;
  script.onerror = run;
  document.body.appendChild(script);
})();

// ===== HERO VIDEO: autoplay 시도 =====
(function heroVideo() {
  const video = document.querySelector("#heroVideo");
  if (!video) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const tryPlay = async () => {
    try {
      video.muted = true;
      video.playsInline = true;
      await video.play();
    } catch (e) {
      // autoplay가 막히면 poster/첫 프레임이 보임(문제 없음)
    }
  };

  tryPlay();
})();
