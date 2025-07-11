// version: 5.1 🐳

console.log("📱 mobile.js loaded!");

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
    sidebar.querySelectorAll("*").forEach(el => {
      if (el.matches("li.nav-small-cap, .nav-small-cap")) {
        const text = el.textContent.trim();
        if (text) currentCat = text;
      } else if (el.matches('a.waves-effect[onclick^="tabActions"]')) {
        groups.push({ cat: currentCat, linkEl: el });
      }
    });

    const launcherCard = document.createElement("div");
    launcherCard.id = "mobile-launcher";
    Object.assign(launcherCard.style, {
      position: "fixed", top: "0", left: "0", width: "100%",
      height: "100%", background: "rgba(0,0,0,0.95)",
      zIndex: "9999", overflowY: "auto", padding: "20px",
      display: "none", fontFamily: "sans-serif"
    });

    const catOrder = [...new Set(groups.map(g => g.cat))];
    catOrder.forEach(catName => {
      const items = groups.filter(g => g.cat === catName).map(g => g.linkEl);
      if (!items.length) return;

      const group = document.createElement("div");
      Object.assign(group.style, {
        border: "1px solid #444", borderRadius: "10px",
        marginBottom: "20px", padding: "10px", background: "#111"
      });

      const header = document.createElement("div");
      Object.assign(header.style, {
        display: "flex", alignItems: "center", cursor: "pointer",
        marginBottom: "10px"
      });
      const toggleIcon = document.createElement("span");
      toggleIcon.textContent = "▾";
      Object.assign(toggleIcon.style, {
        marginRight: "10px", fontSize: "16px", color: "#fff"
      });
      const title = document.createElement("h3");
      title.textContent = catName;
      Object.assign(title.style, { margin: 0, fontSize: "18px", color: "#fff" });
      header.append(toggleIcon, title);
      group.append(header);

      const iconGrid = document.createElement("div");
      Object.assign(iconGrid.style, {
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px"
      });

      items.forEach(link => {
        const label = link.querySelector("span.sidebar-tabName")?.textContent.trim() || link.textContent.trim();
        const iconSrc = link.querySelector("img")?.src;
        const iconWrap = document.createElement("div");
        Object.assign(iconWrap.style, {
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#222", borderRadius: "20px",
          padding: "12px", cursor: "pointer",
          width: "100%", aspectRatio: "1", boxSizing: "border-box"
        });

        const img = document.createElement("img");
        img.src = iconSrc || "";
        Object.assign(img.style, {
          width: "48px", height: "48px", marginBottom: "6px", borderRadius: "12px"
        });
        img.onerror = () => {
          img.remove();
          const fallback = document.createElement("div");
          fallback.textContent = label.charAt(0);
          Object.assign(fallback.style, { fontSize: "28px", marginBottom: "4px", color: "#fff" });
          iconWrap.prepend(fallback);
        };
        iconWrap.append(img);

        const text = document.createElement("div");
        text.textContent = label;
        Object.assign(text.style, {
          color: "#fff", fontSize: "12px", textAlign: "center", wordBreak: "break-word"
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
      position: "fixed", top: "10px", left: "10px",
      zIndex: "10000", background: "#111",
      color: "#fff", border: "none", borderRadius: "6px",
      padding: "6px 12px", fontSize: "20px", cursor: "pointer"
    });
    toggleBtn.onclick = () => {
      launcherCard.style.display = launcherCard.style.display === "none" ? "block" : "none";
    };
    document.body.append(toggleBtn);

    sidebar.style.display = "none";
  }

  waitForSidebar();
}