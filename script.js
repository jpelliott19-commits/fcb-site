// nav goes solid once you leave the hero
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("stuck", window.scrollY > 80);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// before / after handles
document.querySelectorAll("[data-ba]").forEach((fig) => {
  const frame = fig.querySelector(".ba-frame");
  const before = fig.querySelector(".before");
  const split = fig.querySelector(".split");
  const handle = fig.querySelector(".handle");
  const set = (x) => {
    const r = frame.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100));
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    split.style.left = pct + "%";
    handle.style.left = pct + "%";
  };
  let down = false;
  const start = (e) => { down = true; set((e.touches ? e.touches[0] : e).clientX); };
  const move = (e) => { if (down) set((e.touches ? e.touches[0] : e).clientX); };
  const stop = () => { down = false; };
  frame.addEventListener("mousedown", start);
  frame.addEventListener("touchstart", start, { passive: true });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: true });
  window.addEventListener("mouseup", stop);
  window.addEventListener("touchend", stop);
});

// the review rail loops, so the cards are duplicated once
document.querySelectorAll("[data-rail]").forEach((rail) => {
  const track = rail.querySelector(".rail-track");
  track.innerHTML += track.innerHTML;
});

// sections rise in as they hit the viewport
const targets = document.querySelectorAll(
  ".services h2, .svc, .svc-more, .work h2, .work .sub, .ba, .cert, .reviews h2, .stars-big, .chips, .areas h2, .contact-copy, .quote, .stat"
);
targets.forEach((el) => el.setAttribute("data-in", ""));
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }),
  { rootMargin: "-40px" }
);
targets.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); });

// phone menu
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");
if (burger && drawer) {
const closeDrawer = () => { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); };
burger.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", String(open));
});
drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeDrawer));
}

// stat numbers count up the first time they are seen
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    countIO.unobserve(el);
    const to = parseInt(el.dataset.to, 10);
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(to * easeOut(p)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
document.querySelectorAll(".stat b[data-to]").forEach((el) => countIO.observe(el));

// service categories: click one to show its services
document.querySelectorAll(".svc-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.tab;
    document.querySelectorAll(".svc-tab").forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".svc-panel").forEach((p) => p.classList.toggle("active", p.dataset.panel === key));
  });
});
