// version: 9.1 🐳
console.log("📱 mobile.js v9 loaded");

if (window.innerWidth < 768) {
  const waitForSidebar = (retries = 30) => {
    const sidebar = document.querySelector("aside, .side-menu, #side-menu");
    if (!sidebar && retries > 0) {
      setTimeout(() => waitForSidebar(retries - 1), 300);
      return;
    }
    if (!sidebar) return;
    buildLauncher(sidebar);
  };

  function buildLauncher(sidebar) {
    const groups = {};
    document.querySelectorAll("li.allGroupsList").forEach(group => {
      const cat = group.getAttribute("data-group-name") || "Uncategorized";
      group.querySelectorAll("li.allTabsList a.waves-effect").forEach(tab => {
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(tab);
      });
    });

    // Also include any stray uncategorized tabs
    document.querySelectorAll("a.waves-effect[onclick^='tabActions']").forEach(tab => {
      if (!tab.closest("li.allTabsList")) return;
      const parentGroup = tab.closest("li.allGroupsList");
      if (!parentGroup) {
        if (!groups["Uncategorized"]) groups["Uncategorized"] = [];
        groups["Uncategorized"].push(tab);
      }
    });

    const launcherCard = document.createElement("div");
    launcherCard.id = "mobile-launcher";
    Object.assign(launcherCard.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      zIndex: "9999",
      overflowY: "auto",
      padding: "20px",
      display: "none",
      fontFamily: "sans-serif",
      backdropFilter: "blur(6px)",
    });

    Object.entries(groups).forEach(([catName, tabs]) => {
      if (!tabs.length) return;

      const group = document.createElement("div");
      Object.assign(group.style, {
        border: "1px solid #444",
        borderRadius: "10px",
        marginBottom: "20px",
        padding: "10px",
        background: "#111",
      });

      const header = document.createElement("div");
      Object.assign(header.style, {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        marginBottom: "10px",
      });
      const toggleIcon = document.createElement("span");
      toggleIcon.textContent = "▾";
      toggleIcon.style.marginRight = "10px";
      const title = document.createElement("h3");
      title.textContent = catName;
      Object.assign(title.style, {
        margin: 0,
        fontSize: "18px",
        color: "#fff",
      });
      header.append(toggleIcon, title);
      group.append(header);

      const iconGrid = document.createElement("div");
      iconGrid.className = "icon-grid";
      Object.assign(iconGrid.style, {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
        gap: "16px",
        justifyItems: "center",
      });

      tabs.forEach(link => {
        const label = link.querySelector("span.sidebar-tabName, span.hide-menu")?.textContent.trim() || link.textContent.trim();
        const iconSrc = link.querySelector("img")?.src;
        const iconWrap = document.createElement("div");
        Object.assign(iconWrap.style, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "80px",
          height: "80px",
          background: "#222",
          borderRadius: "16px",
          cursor: "pointer",
        });

        const img = document.createElement("img");
        img.src = iconSrc || "";
        Object.assign(img.style, {
          width: "40px",
          height: "40px",
          marginBottom: "6px",
          borderRadius: "10px",
        });
        img.onerror = () => {
          img.remove();
          const fallback = document.createElement("div");
          fallback.textContent = label.charAt(0);
          Object.assign(fallback.style, {
            fontSize: "28px",
            marginBottom: "4px",
            color: "#fff",
          });
          iconWrap.prepend(fallback);
        };
        iconWrap.append(img);

        const text = document.createElement("div");
        text.textContent = label;
        Object.assign(text.style, {
          color: "#fff",
          fontSize: "12px",
          textAlign: "center",
        });
        iconWrap.append(text);

        iconWrap.onclick = () => {
          launcherCard.style.display = "none";
          link.click();
        };

        iconGrid.append(iconWrap);
      });

      header.onclick = () => {
        const visible = iconGrid.style.display !== "none";
        iconGrid.style.display = visible ? "none" : "grid";
        toggleIcon.textContent = visible ? "▸" : "▾";
      };

      group.append(iconGrid);
      launcherCard.append(group);
    });

    document.body.append(launcherCard);

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "☰";
    Object.assign(toggleBtn.style, {
      position: "fixed",
      top: "10px",
      left: "10px",
      zIndex: "10000",
      background: "#111",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "6px 12px",
      fontSize: "20px",
      cursor: "pointer",
    });
    toggleBtn.onclick = () => {
      launcherCard.style.display =
        launcherCard.style.display === "none" ? "block" : "none";
    };
    document.body.append(toggleBtn);

    sidebar.style.display = "none";

    // Resize listener to reset grid layout
    window.addEventListener("resize", () => {
      document.querySelectorAll(".icon-grid").forEach(grid => {
        grid.style.gridTemplateColumns =
          window.innerWidth > window.innerHeight
            ? "repeat(6, 1fr)"
            : "repeat(auto-fit, minmax(80px, 1fr))";
      });
    });
  }

  waitForSidebar();
}