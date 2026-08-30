(() => {
  "use strict";

  // Sticky header shadow on scroll
  const header = document.getElementById("site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile menu
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    const openMenu = () => {
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900) closeMenu();
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // Active state for in-page nav links (homepage sections + kodukord TOC)
  const sections = document.querySelectorAll("main [id]");
  const navAnchors = document.querySelectorAll('.toc-sidebar a, .toc-pills a, .nav-links a[href^="#"]');
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const setActive = (id) => {
      navAnchors.forEach((a) => {
        const match = a.getAttribute("href") === `#${id}`;
        a.classList.toggle("is-active", match);
      });
    };
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }

  // Keep active TOC pill scrolled into view on mobile
  const activePillObserver = new MutationObserver(() => {
    const activePill = document.querySelector(".toc-pills a.is-active");
    if (activePill) activePill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });
  const pillsScroll = document.querySelector(".toc-pills-scroll");
  if (pillsScroll) {
    activePillObserver.observe(pillsScroll, { attributes: true, subtree: true, attributeFilter: ["class"] });
  }
})();
