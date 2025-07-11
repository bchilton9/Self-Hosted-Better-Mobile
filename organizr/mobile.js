// version: 10 🐳

console.log("📱 mobile.js loaded!");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  const waitForTabs = (retries = 30) => {
    const groups = document.querySelectorAll("li.allGroupsList");
    if (!groups.length && retries > 0) {
      console.warn("⏳ Waiting for tab groups...");
      setTimeout(() => waitForTabs(retries - 1), 500);
      return;
    }
    if (!groups.length) {
      console.error("❌ Tab groups not found.");
      return;
    }
    console.log("✅ Tab groups found");
    buildLauncher(groups);
  };

  function buildLauncher(groupEls) {
    const launcher = document.createElement("div");
    launcher.id = "mobile-launcher";
    Object.assign(launcher.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.85)",
      zIndex: 9999,
      overflowY: "auto",
      padding: "20px",
      display: "none",
      fontFamily: "sans-serif",
    });

    const categorized = [];

    groupEls.forEach(groupEl => {
      const cat = groupEl.getAttribute("data-group-name")?.trim() || "Uncategorized";
      const tabLinks = [...groupEl.querySelectorAll("li.allTabsList a.waves-effect")];

      if (!tabLinks.length) return;

      categorized.push({ cat, tabLinks });
    });

    // Move Uncategorized to top
    categorized.sort((a, b) => (a.cat === "Uncategorized" ? -1 : b.cat === "Uncategorized" ? 1 : 0));

    categorized.forEach(({ cat, tabLinks }) => {
      const groupBox = document.createElement("div");
      Object.assign(groupBox.style, {
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
        marginBottom: "10px",
        cursor: cat === "Uncategorized" ? "default" : "pointer",
      });

      const toggleIcon = document.createElement("span");
      toggleIcon.textContent = "▾";
      toggleIcon.style.marginRight = "10px";
      toggleIcon.style.display = cat === "Uncategorized" ? "none" : "inline";

      const title = document.createElement("h3");
      title.textContent = cat;
      Object.assign(title.style, {
        margin: 0,
        fontSize: "18px",
        color: "#fff",
      });

      header.append(toggleIcon, title);
      groupBox.append(header);

      const grid = document.createElement("div");
      grid.className = "icon-grid";

      Object.assign(grid.style, {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
        gap: "12px",
        justifyItems: "center",
      });

      tabLinks.forEach(link => {
        const label = link.querySelector(".sidebar-tabName")?.textContent.trim() || link.textContent.trim();
        const iconSrc = link.querySelector("img")?.src || "";
        if (!label) return;

        const wrap = document.createElement("div");
        Object.assign(wrap.style, {
          width: "72px",
          height: "72px",
          background: "#222",
          borderRadius: "18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
        });

        const img = document.createElement("img");
        img.src = iconSrc;
        Object.assign(img.style, {
          width: "32px",
          height: "32px",
          objectFit: "contain",
          marginBottom: "4px",
        });

        const txt = document.createElement("div");
        txt.textContent = label;
        Object.assign(txt.style, {
          fontSize: "10px",
          color: "#fff",
          lineHeight: "12px",
          maxWidth: "64px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        });

        wrap.onclick = () => {
          launcher.style.display = "none";
          link.click();
        };

        wrap.appendChild(img);
        wrap.appendChild(txt);
        grid.appendChild(wrap);
      });

      groupBox.appendChild(grid);

      if (cat !== "Uncategorized") {
        header.onclick = () => {
          const shown = grid.style.display !== "none";
          grid.style.display = shown ? "none" : "grid";
          toggleIcon.textContent = shown ? "▸" : "▾";
        };
      }

      launcher.appendChild(groupBox);
    });

    document.body.appendChild(launcher);

    // Toggle button
    const toggle = document.createElement("button");
    toggle.textContent = "☰";
    Object.assign(toggle.style, {
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
    toggle.onclick = () => {
      launcher.style.display = launcher.style.display === "none" ? "block" : "none";
    };

    document.body.appendChild(toggle);

    // Hide original sidebar
    const sidebar = document.querySelector("aside, .side-menu, #side-menu");
    if (sidebar) sidebar.style.display = "none";

    // Auto adjust layout on orientation change
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        document.querySelectorAll(".icon-grid").forEach(grid => {
          grid.style.gridTemplateColumns =
            window.innerWidth > window.innerHeight ? "repeat(6, 1fr)" : "repeat(auto-fit, minmax(80px, 1fr))";
        });
      }, 500);
    });
  }

  waitForTabs();
}