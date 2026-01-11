/* script.js – shared logic */

document.addEventListener("DOMContentLoaded", () => {
  /* year ---------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* burger -------------------------------------------------------------- */
  const burger = document.querySelector(".menuToggle");
  const nav = document.getElementById("mainNav");
  if (burger && nav) burger.onclick = () => nav.classList.toggle("open");

  const pages = {
    home: { path: "pages/home.html", title: "Hire Joe Rice · Services Hub" },
    web: { path: "pages/web.html", title: "Web Design · Hire Joe Rice" },
    it: { path: "pages/it.html", title: "IT Services · Hire Joe Rice" },
    km: {
      path: "pages/km.html",
      title: "Knowledge-Management & SOPs · Hire Joe Rice",
    },
    "tech-writing": {
      path: "pages/tech-writing.html",
      title: "Technical Writing · Hire Joe Rice",
    },
    resume: { path: "pages/resume.html", title: "Resume Writing · Hire Joe Rice" },
    ai: { path: "pages/ai.html", title: "AI Coaching · Hire Joe Rice" },
  };

  const frame = document.getElementById("pageFrame");

  const renderMarkdown = scope => {
    if (!window.marked) return;
    const render = el => {
      const src =
        el.tagName === "TEMPLATE" ? el.innerHTML.trim() : el.textContent.trim();
      el.outerHTML = marked.parse(src);
    };
    scope.querySelectorAll(".markdown > template, .md").forEach(render);
  };

  const initDemoModal = scope => {
    const modal = scope.querySelector("#demoModal");
    const demoFrame = scope.querySelector("#demoFrame");
    const closer = scope.querySelector("#closeDemo");
    if (!modal || !demoFrame) return;

    const openDemo = url => {
      demoFrame.src = url;
      modal.classList.add("show");
      document.body.classList.add("noScroll");
    };

    const closeDemo = () => {
      modal.classList.remove("show");
      document.body.classList.remove("noScroll");
      demoFrame.removeAttribute("src");
    };

    scope.querySelectorAll(".tpl").forEach(card => {
      card.addEventListener("click", () => {
        if (!card.classList.contains("flip")) {
          card.classList.add("flip");
          return;
        }
        openDemo(card.dataset.demo);
        card.classList.remove("flip");
      });
    });

    closer?.addEventListener("click", closeDemo);
    modal?.addEventListener("click", e => {
      if (e.target === modal) closeDemo();
    });
  };

  const loadPage = async (pageKey, anchor) => {
    const page = pages[pageKey] || pages.home;
    if (!frame) return;
    document.title = page.title;
    const response = await fetch(page.path);
    const html = await response.text();
    frame.innerHTML = html;
    renderMarkdown(frame);
    initDemoModal(frame);
    const anchorTarget = anchor ? `#${anchor}` : location.hash;
    if (anchorTarget) {
      const target = frame.querySelector(anchorTarget);
      target?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const parseRoute = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get("page");
    if (pageParam) {
      return { pageKey: pageParam, anchor: location.hash.replace("#", "") };
    }

    const rawHash = location.hash.replace("#", "");
    if (rawHash) {
      const [hashPage, anchor] = rawHash.split(":");
      if (pages[hashPage]) {
        return { pageKey: hashPage, anchor };
      }
    }

    return { pageKey: "home" };
  };

  const handleRoute = () => {
    const { pageKey, anchor } = parseRoute();
    loadPage(pageKey, anchor);
  };

  handleRoute();
  window.addEventListener("hashchange", handleRoute);
});
