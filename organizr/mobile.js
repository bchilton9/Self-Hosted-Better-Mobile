// version: 16 🐳

console.log("📱 mobile.js loaded!");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  const waitForSidebar = (retries = 30) => {
    const groups = {};
    const uncategorized = [];

    const sidebarRoot = document.querySelectorAll(".allGroupsList");
    if (!sidebarRoot.length && retries > 0) {
      console.warn("⏳ Sidebar not ready, retrying...");
      return setTimeout(() => waitForSidebar(retries - 1), 500);
    }
    if (!sidebarRoot.length) return console.error("❌ Sidebar failed to load.");

    sidebarRoot.forEach(group => {
      const cat = group.getAttribute("data-group-name")?.trim() || "Uncategorized";
      const tabs = group.querySelectorAll("li.allTabsList");
      tabs.forEach(tab => {
        const link = tab.querySelector("a.waves-effect");
        if (cat === "Uncategorized") {
          uncategorized.push(link);
        } else {
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(link);
        }
      });
    });

    buildLauncher(groups, uncategorized);
  };

  const buildLauncher = (groups, uncategorized) => {
    const launcher = document.createElement("div");
    launcher.id = "mobile-launcher";
    Object.assign(launcher.style, {
      position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
      background: "rgba(0,0,0,0.9)", zIndex: "9999", overflowY: "auto",
      padding: "20px", fontFamily: "sans-serif", display: "none"
    });

    const addSection = (title, items, collapsible = true) => {
      const box = document.createElement("div");
      box.style.border = "1px solid #444";
      box.style.borderRadius = "10px";
      box.style.marginBottom = "20px";
      box.style.background = "#111";

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.padding = "10px";
      header.style.cursor = collapsible ? "pointer" : "default";

      const icon = document.createElement("span");
      icon.textContent = "▾";
      icon.style.marginRight = "10px";
      icon.style.display = collapsible ? "inline-block" : "none";

      const label = document.createElement("h3");
      label.textContent = title;
      Object.assign(label.style, { margin: 0, fontSize: "16px", color: "#fff" });

      header.append(icon, label);
      box.appendChild(header);

      const grid = document.createElement("div");
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(90px, 1fr))";
      grid.style.gap = "12px";
      grid.style.padding = "10px";

      items.forEach(link => {
        const tabName = link.querySelector(".sidebar-tabName")?.textContent.trim() || "App";
        const iconSrc = link.querySelector("img")?.src;
        const faIcon = link.querySelector("i.fa");

        const wrapper = document.createElement("div");
        wrapper.style.background = "#222";
        wrapper.style.borderRadius = "16px";
        wrapper.style.padding = "10px";
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "center";
        wrapper.style.cursor = "pointer";
        wrapper.style.aspectRatio = "1/1";

        const icon = document.createElement("div");
        icon.style.fontSize = "28px";
        icon.style.marginBottom = "8px";

        if (iconSrc) {
          const img = document.createElement("img");
          img.src = iconSrc;
          img.style.width = "48px";
          img.style.height = "48px";
          img.style.borderRadius = "10px";
          icon.appendChild(img);
        } else if (faIcon) {
          const clone = faIcon.cloneNode(true);
          clone.style.fontSize = "36px";
          clone.style.color = "#fff";
          icon.appendChild(clone);
        } else {
          icon.textContent = tabName.charAt(0);
          icon.style.color = "#fff";
        }

        const text = document.createElement("div");
        text.textContent = tabName;
        text.style.fontSize = "12px";
        text.style.color = "#fff";
        text.style.marginTop = "4px";
        text.style.textAlign = "center";

        wrapper.onclick = () => {
          launcher.style.display = "none";
          link.click();
        };

        wrapper.appendChild(icon);
        wrapper.appendChild(text);
        grid.appendChild(wrapper);
      });

      if (collapsible) {
        header.onclick = () => {
          const isHidden = grid.style.display === "none";
          grid.style.display = isHidden ? "grid" : "none";
          icon.textContent = isHidden ? "▾" : "▸";
        };
      }

      box.appendChild(grid);
      launcher.appendChild(box);
    };

    // Uncategorized at top, static
    if (uncategorized.length) {
      addSection(" ", uncategorized, false);
    }

    // Add all other categories
    for (const [cat, items] of Object.entries(groups)) {
      addSection(cat, items, true);
    }

    document.body.appendChild(launcher);

    const toggle = document.createElement("button");
    toggle.textContent = "☰";
    Object.assign(toggle.style, {
      position: "fixed", top: "10px", left: "10px",
      zIndex: "10000", background: "#111",
      color: "#fff", border: "none", borderRadius: "6px",
      padding: "6px 12px", fontSize: "20px", cursor: "pointer"
    });
    toggle.onclick = () => {
      launcher.style.display = launcher.style.display === "block" ? "none" : "block";
    };

    document.body.appendChild(toggle);

    const sidebar = document.querySelector("aside, .side-menu, #side-menu");
    if (sidebar) sidebar.style.display = "none";
  };

  waitForSidebar();
}