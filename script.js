/* script.js – shared logic */

document.addEventListener("DOMContentLoaded", () => {
  /* year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* burger */
  const burger = document.querySelector(".menuToggle");
  const nav = document.getElementById("mainNav");
  if (burger && nav) burger.onclick = () => nav.classList.toggle("open");

  /* markdown conversion
     - any .markdown element that leaves its raw text inside a <template>
     - any .md fragment nested deeper (e.g., inside <details>)
  */
  const render = el => {
    const src =
      el.tagName === "TEMPLATE" ? el.innerHTML.trim() : el.textContent.trim();
    el.outerHTML = marked.parse(src);
  };

  document.querySelectorAll(".markdown > template, .md").forEach(render);
});
