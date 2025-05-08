/* script.js – shared logic */

document.addEventListener("DOMContentLoaded", () => {
  /* year ---------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* burger -------------------------------------------------------------- */
  const burger = document.querySelector(".menuToggle");
  const nav = document.getElementById("mainNav");
  if (burger && nav) burger.onclick = () => nav.classList.toggle("open");

  /* markdown conversion ------------------------------------------------- */
  const render = el => {
    const src =
      el.tagName === "TEMPLATE" ? el.innerHTML.trim() : el.textContent.trim();
    el.outerHTML = marked.parse(src);
  };
  document.querySelectorAll(".markdown > template, .md").forEach(render);

  /* flip-card gallery + live demo modal -------------------------------- */
  const modal = document.getElementById("demoModal"),
    frame = document.getElementById("demoFrame"),
    closer = document.getElementById("closeDemo");

  /* helper to open modal and lock scroll */
  const openDemo = url => {
    frame.src = url;
    modal.classList.add("show");
    document.body.classList.add("noScroll"); // 🌟 freeze background
  };

  /* helper to close modal and unlock scroll */
  const closeDemo = () => {
    modal.classList.remove("show");
    document.body.classList.remove("noScroll");
    frame.removeAttribute("src"); // stop any media
  };

  /* flip cards --------------------------------------------------------- */
  document.querySelectorAll(".tpl").forEach(card => {
    card.addEventListener("click", () => {
      /* first click → flip */
      if (!card.classList.contains("flip")) {
        card.classList.add("flip");
        return;
      }
      /* second click → open demo */
      openDemo(card.dataset.demo);
      card.classList.remove("flip"); // reset for next time
    });
  });

  /* modal close triggers ----------------------------------------------- */
  closer?.addEventListener("click", closeDemo);
  modal?.addEventListener("click", e => {
    if (e.target === modal) closeDemo(); // click outside iframe
  });
});
