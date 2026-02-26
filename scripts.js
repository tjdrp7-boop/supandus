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

// ===== Tally embed loader (dynamicHeight 대응) =====
(function loadTally() {
  const widgetScriptSrc = "https://tally.so/widgets/embed.js";

  const hasEmbed = document.querySelector('iframe[data-tally-src]');
  if (!hasEmbed) return;

  const load = () => {
    if (typeof Tally !== "undefined") {
      Tally.loadEmbeds();
      return;
    }

    document
      .querySelectorAll('iframe[data-tally-src]:not([src])')
      .forEach((iframeEl) => {
        iframeEl.src = iframeEl.dataset.tallySrc;
      });
  };

  if (typeof Tally !== "undefined") {
    load();
    return;
  }

  if (document.querySelector(`script[src="${widgetScriptSrc}"]`) === null) {
    const script = document.createElement("script");
    script.src = widgetScriptSrc;
    script.async = true;
    script.onload = load;
    script.onerror = load;
    document.body.appendChild(script);
    return;
  }

  load();
})();

// ===== HERO VIDEO: 자동재생 시도 + 성공하면 video 레이어 사용 =====
(function heroVideo() {
  const video = document.querySelector("#heroVideo");
  if (!video) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    // 모션 최소화 환경이면 자동재생을 강제하지 않음(접근성)
    return;
  }

  const tryPlay = async () => {
    try {
      video.muted = true;
      video.playsInline = true;
      await video.play();
    } catch (e) {
      // 자동재생 막히면 poster가 보임(문제 없음)
    }
  };

  tryPlay();
})();
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

