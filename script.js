// Settings you can easily change
const phoneNumber = "96895651128"; // no plus
const whatsappMessage = "YESSSSS OF COURSE BABY 💖💖💖 I'm your Valentine 😘";

// Elements
const loader = document.getElementById("loader");
const loaderDots = document.getElementById("loaderDots");
const card = document.getElementById("card");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");
const waBtn = document.getElementById("waBtn");

// Loading screen animation
let dotCount = 0;
const dotTimer = setInterval(() => {
  dotCount = (dotCount + 1) % 4;
  loaderDots.textContent = "Please wait" + ".".repeat(dotCount);
}, 350);

setTimeout(() => {
  clearInterval(dotTimer);
  loader.style.display = "none";
  card.classList.remove("hidden");
  document.title = "Be My Valentine?";
}, 1800);

// WhatsApp link builder
function getWhatsAppUrl() {
  const text = encodeURIComponent(whatsappMessage);
  return `https://wa.me/${phoneNumber}?text=${text}`;
}

// Confetti
function confettiBurst() {
  const count = 90;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.style.position = "fixed";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = "-10px";
    piece.style.width = "8px";
    piece.style.height = "12px";
    piece.style.opacity = "0.92";
    piece.style.borderRadius = "2px";
    piece.style.background = `hsl(${Math.random() * 360}, 90%, 60%)`;
    piece.style.zIndex = "9999";
    document.body.appendChild(piece);

    const fall = 700 + Math.random() * 900;
    const drift = (Math.random() * 2 - 1) * 140;

    piece.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)" },
        { transform: `translate(${drift}px, ${fall}px) rotate(${Math.random() * 720}deg)` }
      ],
      { duration: 1200 + Math.random() * 900, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" }
    );

    setTimeout(() => piece.remove(), 2600);
  }
}

// YES flow
function onYes() {
  result.textContent = "YAYYYY 💖💖💖 I LOVE YOU. Locked in. Valentine secured 😌🔐";
  confettiBurst();

  const waUrl = getWhatsAppUrl();
  waBtn.href = waUrl;
  waBtn.classList.remove("hidden");
}


yesBtn.addEventListener("click", onYes);

// NO button behavior
let dodges = 0;
const maxDodges = 6;
let coolingDown = false;

function rectsOverlap(a, b, pad = 10) {
  return !(
    a.right + pad < b.left ||
    a.left - pad > b.right ||
    a.bottom + pad < b.top ||
    a.top - pad > b.bottom
  );
}

function moveNoButton() {
  if (coolingDown) return;

  coolingDown = true;
  dodges++;

  const yesRect = yesBtn.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  // Try multiple random moves until we find one that does NOT overlap YES
  let x = 0;
  let y = 0;
  let attempts = 0;

  while (attempts < 25) {
    attempts++;

    // Bigger range feels fun, but still safe
    const tryX = Math.floor(Math.random() * 280) - 140; // -140..140
    const tryY = Math.floor(Math.random() * 220) - 110; // -110..110

    // Predict the "future" No button rectangle after translate
    const futureNo = {
      left: noRect.left + tryX,
      right: noRect.right + tryX,
      top: noRect.top + tryY,
      bottom: noRect.bottom + tryY
    };

    if (!rectsOverlap(futureNo, yesRect, 14)) {
      x = tryX;
      y = tryY;
      break;
    }
  }

  noBtn.style.transform = `translate(${x}px, ${y}px)`;

  // Small delay so mobile touchstart + click does not double count
  setTimeout(() => {
    coolingDown = false;
  }, 180);

  if (dodges === maxDodges) {
    setTimeout(() => {
      noBtn.textContent = "Fine. I’m yours 💖";
      noBtn.classList.remove("no");
      noBtn.classList.add("yes");
      noBtn.style.transform = "translate(0px, 0px)";

      // Now it behaves like YES
      noBtn.onclick = onYes;
    }, 400);
  }
}

// desktop
noBtn.addEventListener("mouseenter", moveNoButton);

// mobile + click
noBtn.addEventListener("click", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton, { passive: true });


