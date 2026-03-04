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


// ===== Footer policy modal =====
(function policyModal(){
  const modal = document.getElementById("policyModal");
  const titleEl = document.getElementById("policyModalTitle");
  const bodyEl = document.getElementById("policyModalBody");
  if (!modal || !titleEl || !bodyEl) return;

    const content = {
    brand: {
      title: "브랜드 정보",
      html: `
        <p><b>Arclinea</b>는 1925년 이탈리아에서 시작된 하이엔드 주방 브랜드로, 주방을 ‘가구’가 아닌 거주를 위한 건축 시스템으로 설계해 왔습니다.</p>
        <p class="muted">쇼룸 상담은 예약제로 운영됩니다. 예약 접수 후 순차적으로 연락드립니다.</p>
      `
    },

    business: {
      title: "사업자정보",
      html: `
        <h4>회사 정보</h4>
        <ul>
          <li><b>상호</b> : 유한회사 유앤어스</li>
          <li><b>대표</b> : 박환승, 백명주</li>
          <li><b>사업자등록번호</b> : 211-86-55924</li>
          <li><b>통신판매업 신고번호</b> : 2020서울강남03353</li>
          <li><b>주소</b> : 서울특별시 강남구 논현로140길 21 유앤어스 빌딩</li>
        </ul>

        <h4>계좌 정보(무통장입금)</h4>
        <ul>
          <li>하나은행 244-890021-49204 / 예금주: 유한회사 유앤어스</li>
        </ul>

        <h4>개인정보보호책임자</h4>
        <ul>
          <li>김도진 / <a href="mailto:uns@youandus.co.kr">uns@youandus.co.kr</a></li>
        </ul>
      `
    },

    privacy: {
      title: "개인정보처리방침",
      html: `
        <h4>[ 개인정보처리방침 ]</h4>
        <p>유한회사 유앤어스(주)는 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다. 개인정보 처리방침은 정부의 법률 및 지침 변경이나 회사의 내부 방침 변경 등으로 수시로 변경될 수 있으며, 이용자께서는 사이트 방문 시 수시로 확인하시기 바랍니다.</p>

        <p><b>목차</b></p>
        <ol>
          <li>개인정보 수집에 대한 동의</li>
          <li>수집하는 개인정보 항목 및 수집방법</li>
          <li>개인정보의 수집 및 이용목적</li>
          <li>개인정보의 보유 및 이용기간</li>
          <li>개인정보의 파기 절차 및 방법</li>
          <li>수집한 개인정보의 공유 및 제공</li>
          <li>이용자 자신의 개인정보 관리(열람,정정,삭제 등)에 관한 사항</li>
          <li>쿠키(Cookie)의 운용 및 거부</li>
          <li>개인정보의 위탁처리</li>
          <li>개인정보보호를 위한 기술적/관리적 대책</li>
          <li>개인정보 관련 의견수렴 및 불만처리에 관한 사항</li>
          <li>개인정보 보호책임자 및 담당자의 소속-성명 및 연락처</li>
          <li>이용자 및 법정대리인의 권리와 그 행사방법</li>
          <li>권익침해 구제방법</li>
          <li>고지의 의무</li>
        </ol>

        <h4>1. 개인정보 수집에 대한 동의</h4>
        <p>유한회사 유앤어스(주)는 이용자가 회사의 개인정보 수집·이용 동의 또는 이용약관에 대해 「동의」 버튼을 클릭할 수 있는 절차를 마련하고, 「동의」 버튼 클릭 시 개인정보 수집에 동의한 것으로 봅니다.</p>

        <h4>2. 수집하는 개인정보의 항목 및 수집방법</h4>
        <p><b>가. 수집 항목</b></p>
        <ul>
          <li>서비스 제공을 위한 필수/선택 정보(예: 이름, 연락처, 이메일 등)</li>
          <li>부정 이용 방지 및 비인가 사용 방지를 위한 정보(예: IP Address)</li>
          <li>14세 미만 가입자의 경우 법정대리인의 정보(해당 시)</li>
        </ul>
        <p><b>나. 수집 방법</b></p>
        <ul>
          <li>홈페이지, 모바일기기, 서면양식, 팩스, 전화, 상담 게시판, 이메일, 이벤트 응모 등</li>
          <li>협력회사로부터의 제공</li>
          <li>생성정보 수집 툴을 통한 수집</li>
        </ul>
        <p class="muted">* 회사는 민감정보(인종/사상/건강/성생활 등)는 원칙적으로 수집하지 않으며, 필요 시 사전 동의를 받습니다.</p>

        <h4>3. 개인정보의 수집 및 이용 목적</h4>
        <ul>
          <li>신규 서비스 개발 및 콘텐츠 확충</li>
          <li>본인 확인, 민원처리, 고지사항 전달 등 회원관리(해당 시)</li>
          <li>마케팅 및 광고 활용(동의한 범위 내)</li>
        </ul>

        <h4>4. 개인정보의 보유 및 이용기간</h4>
        <p>유한회사 유앤어스(주)는 원칙적으로 개인정보의 수집 및 이용 목적이 달성되면 지체 없이 파기합니다. 다만, 관련 법령에 따라 일정 기간 보존할 수 있습니다.</p>
        <ul>
          <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
          <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
          <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
          <li>방문(로그)에 관한 기록: 3개월</li>
        </ul>

        <h4>5. 개인정보의 파기 절차 및 방법</h4>
        <p><b>가. 파기절차</b> 목적 달성 후 별도 DB로 옮겨 내부 방침 및 법령에 따른 기간 저장 후 파기합니다.</p>
        <p><b>나. 파기방법</b></p>
        <ul>
          <li>종이 출력물: 분쇄 또는 소각</li>
          <li>전자 파일: 복구 불가능한 방법으로 삭제</li>
        </ul>

        <h4>6. 수집한 개인정보의 공유 및 제공</h4>
        <p>이용자의 동의 범위 내에서 사용하며, 동의 없이 외부에 제공하지 않습니다. 다만 법령에 의하거나 수사기관의 적법한 요청이 있는 경우 예외로 합니다.</p>

        <h4>7. 이용자 자신의 개인정보 관리(열람,정정,삭제 등)</h4>
        <p>이용자는 언제든지 개인정보의 열람/정정/삭제를 요청할 수 있으며, 회사는 지체 없이 조치합니다.</p>

        <h4>8. 쿠키(Cookie)의 운용 및 거부</h4>
        <p>회사는 맞춤형 서비스 제공 등을 위해 쿠키를 사용할 수 있으며, 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>

        <h4>9. 개인정보의 위탁처리</h4>
        <p>회사는 서비스 제공을 위하여 필요한 경우 개인정보 처리 업무를 위탁할 수 있으며, 위탁 시 관련 법령에 따라 안전하게 관리되도록 합니다.</p>
        <ul>
          <li>엔에이치엔고도㈜: 고객정보 DB 시스템 구축 및 운영/관리(전산아웃소싱)</li>
          <li class="muted">* 예약 접수 폼 운영에 외부 설문/폼 서비스(Tally 등)를 사용하는 경우, 해당 위탁 내역을 운영 기준에 맞게 추가/정리합니다.</li>
        </ul>

        <h4>10. 개인정보보호를 위한 기술적/관리적 대책</h4>
        <ul>
          <li>내부관리계획 수립 및 정기 교육</li>
          <li>접근권한 관리, 접근통제시스템, 보안프로그램 설치 등</li>
          <li>전산실/자료보관실 접근통제 등 물리적 조치</li>
        </ul>

        <h4>11. 개인정보 관련 의견수렴 및 불만처리</h4>
        <p>개인정보보호 관련 불만/문의는 아래 개인정보 보호책임자에게 연락하실 수 있습니다.</p>

        <h4>12. 개인정보 보호책임자 및 담당자</h4>
        <ul>
          <li><b>개인정보보호책임자</b> : 김도진</li>
          <li><b>E-mail</b> : <a href="mailto:uns@youandus.co.kr">uns@youandus.co.kr</a></li>
        </ul>

        <h4>13. 이용자 및 법정대리인의 권리와 행사방법</h4>
        <p>이용자는 개인정보 조회/수정/삭제/동의철회 등을 요청할 수 있으며, 회사는 지체 없이 조치합니다.</p>

        <h4>14. 권익침해 구제방법</h4>
        <ul>
          <li>개인정보 침해신고센터(한국인터넷진흥원): 국번없이 118</li>
          <li>개인정보 분쟁조정위원회: 1833-6972</li>
        </ul>

        <h4>15. 고지의 의무</h4>
        <p>개인정보처리방침의 내용 추가/삭제/수정이 있을 경우 홈페이지 공지사항 등을 통해 고지합니다.</p>
      `
    },

    terms: {
      title: "이용약관",
      html: `
        <p>본 페이지는 쇼룸 방문 예약 접수 및 상담 안내를 위한 목적입니다.</p>
        <h4>1. 예약 안내</h4>
        <ul>
          <li>예약 접수 후 담당자가 확인하여 순차적으로 연락드립니다(확정 안내).</li>
          <li>운영 시간/휴무일은 상황에 따라 변경될 수 있습니다.</li>
        </ul>
        <h4>2. 유의사항</h4>
        <ul>
          <li>허위 정보 입력 시 예약이 제한될 수 있습니다.</li>
          <li>콘텐츠는 예고 없이 변경될 수 있습니다.</li>
        </ul>
      `
    }
  };

  let lastFocus = null;

  function openModal(key, triggerEl){
    const c = content[key];
    if (!c) return;
    lastFocus = triggerEl || document.activeElement;

    titleEl.textContent = c.title;
    bodyEl.innerHTML = c.html;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // focus close button
    const closeBtn = modal.querySelector("[data-modal-close]");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(){
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-modal]");
    if (btn) {
      e.preventDefault();
      openModal(btn.getAttribute("data-modal"), btn);
      return;
    }

    if (modal.classList.contains("is-open")) {
      const closer = e.target.closest("[data-modal-close]");
      if (closer) closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
})();
