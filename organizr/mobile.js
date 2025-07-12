// version: 17.7
console.log("📱 mobile.js loaded");

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
      fontFamily: "sans-serif",
      backdropFilter: "blur(6px)",
      display: "none"
    });

    // Add Uncategorized group first (static)
    if (groups["Uncategorized"]) {
      const group = document.createElement("div");
      Object.assign(group.style, {
        border: "1px solid #444",
        borderRadius: "10px",
        marginBottom: "20px",
        padding: "10px",
        background: "#111"
      });

      const iconGrid = createIconGrid(groups["Uncategorized"]);
      group.append(iconGrid);
      launcherCard.append(group);
      delete groups["Uncategorized"];
    }

    // Add all other categories (collapsible)
    Object.entries(groups).forEach(([catName, tabs]) => {
      const group = document.createElement("div");
      Object.assign(group.style, {
        border: "1px solid #444",
        borderRadius: "10px",
        marginBottom: "20px",
        padding: "10px",
        background: "#111"
      });

      const header = document.createElement("div");
      Object.assign(header.style, {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        marginBottom: "10px"
      });
      const toggleIcon = document.createElement("span");
      toggleIcon.textContent = "▾";
      toggleIcon.style.marginRight = "10px";
      const title = document.createElement("h3");
      title.textContent = catName;
      Object.assign(title.style, {
        margin: 0,
        fontSize: "18px",
        color: "#fff"
      });
      header.append(toggleIcon, title);
      group.append(header);

      const iconGrid = createIconGrid(tabs);
      group.append(iconGrid);

      header.onclick = () => {
        const visible = iconGrid.style.display !== "none";
        iconGrid.style.display = visible ? "none" : "grid";
        toggleIcon.textContent = visible ? "▸" : "▾";
      };

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
      cursor: "pointer"
    });
    toggleBtn.onclick = () => {
      launcherCard.style.display =
        launcherCard.style.display === "none" ? "block" : "none";
    };
    document.body.append(toggleBtn);

    sidebar.style.display = "none";

    window.addEventListener("resize", () => {
      document.querySelectorAll(".icon-grid").forEach(grid => {
        grid.style.gridTemplateColumns =
          window.innerWidth > window.innerHeight
            ? "repeat(6, 1fr)"
            : "repeat(3, 1fr)";
      });
    });
  }

  function createIconGrid(tabs) {
    const iconGrid = document.createElement("div");
    iconGrid.className = "icon-grid";
    Object.assign(iconGrid.style, {
      display: "grid",
      gridTemplateColumns:
        window.innerWidth > window.innerHeight
          ? "repeat(6, 1fr)"
          : "repeat(3, 1fr)",
      gap: "16px",
      justifyItems: "center"
    });

    tabs.forEach(link => {
  const hasLabel = link.querySelector("span.sidebar-tabName, span.hide-menu");
  const labelText = hasLabel?.textContent.trim() || link.textContent.trim();
  const iconSrc = link.querySelector("img")?.src || "";
  const faIconClass = link.querySelector("i.fa")?.className || "";
  
  const isInvisibleChar = labelText && labelText.charCodeAt(0) > 60000;
  const isTooShort = !labelText || labelText.length < 2;
  const isPlaceholder = !iconSrc && !faIconClass && isTooShort;

  if (isInvisibleChar || isPlaceholder) return; // ❌ Skip weird icon or phantom link

  // ✅ Continue with building icon

      const iconSrc = link.querySelector("img")?.src;

      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.alignItems = "center";
      wrapper.style.justifyContent = "center";

      const iconBox = document.createElement("div");
      Object.assign(iconBox.style, {
        width: "80px",
        height: "80px",
        background: "#222",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "6px"
      });

      if (iconSrc) {
        const img = document.createElement("img");
        img.src = iconSrc;
        Object.assign(img.style, {
          width: "48px",
          height: "48px",
          objectFit: "contain"
        });
        iconBox.append(img);
      } else {
        const icon = document.createElement("i");
        icon.className = faIconClass || "fa fa-question";
        Object.assign(icon.style, {
          fontSize: "32px",
          color: "#fff"
        });
        iconBox.append(icon);
      }

      const labelEl = document.createElement("div");
      labelEl.textContent = label;
      Object.assign(labelEl.style, {
        color: "#fff",
        fontSize: "12px",
        textAlign: "center",
        maxWidth: "80px",
        wordWrap: "break-word"
      });

      wrapper.append(iconBox, labelEl);

      wrapper.onclick = () => {
        document.getElementById("mobile-launcher").style.display = "none";
        link.click();
      };

      iconGrid.append(wrapper);
    });

    return iconGrid;
  }

  waitForSidebar();
}