// version: 8.1 📱

console.log("📱 mobile.js v8 loaded!");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  const waitForSidebar = (retries = 30) => {
    const sidebar = document.querySelector("aside, .side-menu, #side-menu");
    if (!sidebar && retries > 0) {
      console.warn("⏳ Sidebar not found, retrying...");
      setTimeout(() => waitForSidebar(retries - 1), 500);
      return;
    }
    if (!sidebar) {
      console.error("❌ Gave up waiting for sidebar.");
      return;
    }
    console.log("✅ Sidebar found! Extracting tabs and categories...");
    buildLauncher(sidebar);
  };

  function buildLauncher(sidebar) {
    const groups = [];
    let currentCat = "Uncategorized";

    sidebar.querySelectorAll("li, a.waves-effect").forEach(el => {
      if (el.classList.contains("nav-small-cap")) {
        const title = el.textContent.trim();
        if (title) currentCat = title;
      } else if (el.matches('a.waves-effect[onclick^="tabActions"]')) {
        groups.push({ cat: currentCat, el });
      }
    });

    const launcher = document.createElement("div");
    launcher.id = "mobile-launcher";
    Object.assign(launcher.style, {
      position: "fixed", top: 0, left: 0, width: "100%",
      height: "100%", background: "#000", overflowY: "auto",
      zIndex: 9999, padding: "20px", display: "none",
      fontFamily: "sans-serif"
    });

    const catOrder = [...new Set(groups.map(g => g.cat))];

    catOrder.forEach(cat => {
      const container = document.createElement("div");
      container.className = "launcher-category";
      Object.assign(container.style, {
        marginBottom: "20px", background: "#111",
        borderRadius: "10px", padding: "10px", border: "1px solid #333"
      });

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.cursor = "pointer";
      header.style.marginBottom = "10px";

      const toggle = document.createElement("span");
      toggle.textContent = "▾";
      toggle.style.marginRight = "8px";
      toggle.style.fontSize = "18px";

      const title = document.createElement("h3");
      title.textContent = cat;
      Object.assign(title.style, {
        margin: 0, color: "#fff", fontSize: "18px"
      });

      const grid = document.createElement("div");
      grid.className = "icon-grid";
      Object.assign(grid.style, {
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: "14px"
      });

      groups.filter(g => g.cat === cat).forEach(({ el }) => {
        const label = el.querySelector("span.sidebar-tabName")?.textContent.trim() || el.textContent.trim();
        const icon = el.querySelector("img")?.src;

        const wrapper = document.createElement("div");
        Object.assign(wrapper.style, {
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", background: "#222", borderRadius: "16px",
          padding: "10px", textAlign: "center", color: "#fff", cursor: "pointer"
        });

        if (icon) {
          const img = document.createElement("img");
          img.src = icon;
          Object.assign(img.style, {
            width: "48px", height: "48px", marginBottom: "6px", borderRadius: "10px"
          });
          wrapper.appendChild(img);
        } else {
          const fallback = document.createElement("div");
          fallback.textContent = label.charAt(0);
          Object.assign(fallback.style, {
            width: "48px", height: "48px", background: "#333",
            color: "#fff", fontSize: "20px", borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "6px"
          });
          wrapper.appendChild(fallback);
        }

        const name = document.createElement("div");
        name.textContent = label;
        name.style.fontSize = "12px";
        wrapper.appendChild(name);

        wrapper.onclick = () => {
          launcher.style.display = "none";
          el.click();
        };

        grid.appendChild(wrapper);
      });

      header.onclick = () => {
        const visible = grid.style.display !== "none";
        grid.style.display = visible ? "none" : "grid";
        toggle.textContent = visible ? "▸" : "▾";
      };

      header.append(toggle, title);
      container.append(header, grid);
      launcher.appendChild(container);
    });

    document.body.appendChild(launcher);

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "☰";
    Object.assign(toggleBtn.style, {
      position: "fixed", top: "10px", left: "10px", zIndex: "10000",
      background: "#111", color: "#fff", border: "none",
      borderRadius: "6px", padding: "6px 12px", fontSize: "20px",
      cursor: "pointer"
    });
    toggleBtn.onclick = () => {
      launcher.style.display = launcher.style.display === "none" ? "block" : "none";
    };
    document.body.appendChild(toggleBtn);

    sidebar.style.display = "none";
  }

  waitForSidebar();
}