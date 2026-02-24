// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ===== Footer year =====
$("#year").textContent = new Date().getFullYear();

// ===== Drawer menu =====
const drawer = $("#drawer");
const menuBtn = $("#menuBtn");
const closeBtn = $("#closeBtn");

function openDrawer() {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuBtn.addEventListener("click", openDrawer);
closeBtn.addEventListener("click", closeDrawer);
drawer.addEventListener("click", (e) => {
  if (e.target === drawer) closeDrawer();
});

// Drawer link 클릭 시 닫고 스크롤
$$(".drawer-link").forEach((a) => {
  a.addEventListener("click", () => {
    closeDrawer();
  });
});

// ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

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

  // autoplay 시도
  const tryPlay = async () => {
    try {
      // iOS/Safari에서 autoplay 조건(뮤트/playsinline) 충족 필요
      video.muted = true;
      video.playsInline = true;

      await video.play();
      media.classList.add("is-video");
      ctrl.style.display = "flex";
      setCtrlState(true);
    } catch (err) {
      // autoplay 실패 시: 이미지 레이어 그대로 유지
      ctrl.style.display = "none";
    }
  };

  const setCtrlState = (playing) => {
    if (!ctrlText) return;
    ctrlText.textContent = playing ? "PAUSE" : "PLAY";
    ctrl.setAttribute("aria-label", playing ? "영상 일시정지" : "영상 재생");
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
        // 다시 들어오면 재생 시도 (사용자 정책에 따라 실패할 수 있음)
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

  // 초기 실행
  tryPlay();
})();
