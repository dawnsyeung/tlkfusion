(() => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-btn");
  const navSearch = document.getElementById("nav-search");
  const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const toast = document.getElementById("toast");
  const printBtn = document.getElementById("print-btn");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function getCopyText(block) {
    const node = block.querySelector(".copy-text");
    if (!node) return "";
    if (node.tagName === "UL" || node.tagName === "OL") {
      return Array.from(node.querySelectorAll("li"))
        .map((li) => `• ${li.textContent.trim()}`)
        .join("\n");
    }
    return node.innerText.replace(/\n{3,}/g, "\n\n").trim();
  }

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      if (button) {
        const original = button.textContent;
        button.textContent = "Copied";
        button.classList.add("copied");
        window.setTimeout(() => {
          button.textContent = original;
          button.classList.remove("copied");
        }, 1400);
      }
      showToast("Copied to clipboard");
    } catch {
      showToast("Copy failed — select text manually");
    }
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      const block = button.closest("[data-copy-block]");
      if (!block) return;
      copyText(getCopyText(block), button);
    });
  });

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (navSearch) {
    navSearch.addEventListener("input", () => {
      const q = navSearch.value.trim().toLowerCase();
      navLinks.forEach((link) => {
        const hay = `${link.textContent} ${link.dataset.keywords || ""}`.toLowerCase();
        link.classList.toggle("nav-hidden", Boolean(q) && !hay.includes(q));
      });
    });
  }

  function setActiveNav() {
    const y = window.scrollY + 120;
    let current = sections[0];
    for (const section of sections) {
      if (section.offsetTop <= y) current = section;
    }
    navLinks.forEach((link) => {
      const match = current && link.getAttribute("href") === `#${current.id}`;
      link.classList.toggle("active", Boolean(match));
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }
})();
