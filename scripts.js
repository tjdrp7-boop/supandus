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

// ===== Tally embed loader =====
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

// ===== HERO VIDEO: 자동재생 시도 + 성공하면 video 레이어 사용 =====
(function heroVideo() {
  const media = $("#heroMedia");
  const video = $("#heroVideo");
  const ctrl = $("#mediaCtrl");
  const ctrlText = $("#mediaCtrlText");

  if (!media || !video) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return; // 모션 최소화면 영상 비활성

  const setCtrlState = (playing) => {
    if (!ctrlText) return;
    ctrlText.textContent = playing ? "PAUSE" : "PLAY";
    if (ctrl) ctrl.setAttribute("aria-label", playing ? "영상 일시정지" : "영상 재생");
  };

  const tryPlay = async () => {
    try {
      video.muted = true;
      video.playsInline = true;

      await video.play();
      media.classList.add("is-video");
      if (ctrl) ctrl.style.display = "flex";
      setCtrlState(true);
    } catch (err) {
      if (ctrl) ctrl.style.display = "none";
    }
  };

  // 뷰포트 밖이면 pause (퍼포먼스)
  const io = new IntersectionObserver(
    (entries) => {
      const ent = entries[0];
      if (!ent) return;

      if (!ent.isIntersecting) {
        if (!video.paused) {
          video.pause();
          setCtrlState(false);
        }
      } else {
        if (media.classList.contains("is-video") && video.paused) {
          video.play().then(() => setCtrlState(true)).catch(() => {});
        }
      }
    },
    { threshold: 0.25 }
  );
  io.observe(media);

  // 컨트롤 토글
  if (ctrl) {
    ctrl.addEventListener("click", async () => {
      if (video.paused) {
        try {
          await video.play();
          media.classList.add("is-video");
          setCtrlState(true);
        } catch (e) {}
      } else {
        video.pause();
        setCtrlState(false);
      }
    });
  }

  tryPlay();
})();

///////안녕하세요