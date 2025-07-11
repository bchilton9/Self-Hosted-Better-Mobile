// version: 9 🐳

console.log("📱 mobile.js loaded!");

if (window.innerWidth < 768 || screen.width < 768) {
  console.log("📱 Mobile view detected");

  const waitForTabs = (retries = 30) => {
    const groups = document.querySelectorAll("li.allGroupsList[data-group-name]");
    if (!groups.length && retries > 0) {
      console.warn("⏳ Sidebar groups not found, retrying...");
      setTimeout(() => waitForTabs(retries - 1), 500);
      return;
    }
    if (!groups.length) {
      console.error("❌ Gave up waiting for tab groups.");
      return;
    }
    console.log("✅ Tab groups found!");
    buildLauncher(groups);
  };

  function buildLauncher(groupEls) {
    const launcherCard = document.createElement("div");
    launcherCard.id = "mobile-launcher";
    Object.assign(launcherCard.style, {
      position: "fixed", top: "0", left: "0", width: "100%",
      height: "100%", background: "rgba(0,0,0,0.85)",
      zIndex: "9999", overflowY: "auto", padding: "20px",
      display: "none", fontFamily: "sans-serif"
    });

    groupEls.forEach(groupEl => {
      const catName = groupEl.dataset.groupName?.trim() || "Uncategorized";
      const tabs = groupEl.querySelectorAll("ul li.allTabsList");
      if (!tabs.length) return;

      const section = document.createElement("div");
      Object.assign(section.style, {
        border: "1px solid #444", borderRadius: "12px",
        marginBottom: "20px", padding: "10px", background: "#111"
      });

      const header = document.createElement("div");
      Object.assign(header.style, {
        display: "flex", alignItems: "center", cursor: "pointer",
        marginBottom: "10px"
      });
      const toggleIcon = document.createElement("span");
      toggleIcon.textContent = "▾";
      toggleIcon.style.marginRight = "10px";
      const title = document.createElement("h3");
      title.textContent = catName;
      Object.assign(title.style, { margin: 0, fontSize: "18px", color: "#fff" });
      header.append(toggleIcon, title);
      section.append(header);

      const iconGrid = document.createElement("div");
      iconGrid.className = "icon-grid";
      Object.assign(iconGrid.style, {
        display: "grid",
        gridTemplateColumns: window.innerWidth > window.innerHeight ? "repeat(6, 1fr)" : "repeat(3, 1fr)",
        gap: "16px"
      });

      tabs.forEach(tab => {
        const link = tab.querySelector("a.waves-effect");
        const label = link?.querySelector("span.sidebar-tabName")?.textContent.trim()
          || link?.innerText?.trim()
          || "App";
        const iconSrc = link?.querySelector("img")?.src;

        const iconWrap = document.createElement("div");
        Object.assign(iconWrap.style, {
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", background: "#222", borderRadius: "16px",
          padding: "12px", cursor: "pointer", aspectRatio: "1 / 1"
        });

        const img = document.createElement("img");
        img.src = iconSrc || "";
        Object.assign(img.style, {
          width: "48px", height: "48px", marginBottom: "6px", borderRadius: "10px"
        });

        img.onerror = () => {
          img.remove();
          const fallback = document.createElement("div");
          fallback.textContent = label.charAt(0);
          Object.assign(fallback.style, { fontSize: "28px", marginBottom: "4px", color: "#fff" });
          iconWrap.prepend(fallback);
        };

        iconWrap.appendChild(img);

        const text = document.createElement("div");
        text.textContent = label;
        Object.assign(text.style, {
          color: "#fff", fontSize: "12px", textAlign: "center", wordBreak: "break-word"
        });
        iconWrap.appendChild(text);

        iconWrap.onclick = () => {
          launcherCard.style.display = "none";
          link.click();
        };

        iconGrid.appendChild(iconWrap);
      });

      header.onclick = () => {
        const isVisible = iconGrid.style.display !== "none";
        iconGrid.style.display = isVisible ? "none" : "grid";
        toggleIcon.textContent = isVisible ? "▸" : "▾";
      };

      section.appendChild(iconGrid);
      launcherCard.appendChild(section);
    });

    document.body.appendChild(launcherCard);

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "☰";
    Object.assign(toggleBtn.style, {
      position: "fixed", top: "10px", left: "10px",
      zIndex: "10000", background: "#111", color: "#fff",
      border: "none", borderRadius: "6px", padding: "6px 12px",
      fontSize: "20px", cursor: "pointer"
    });
    toggleBtn.onclick = () => {
      launcherCard.style.display = launcherCard.style.display === "none" ? "block" : "none";
    };
    document.body.appendChild(toggleBtn);

    // Hide the original sidebar
    const side = document.querySelector("aside, .side-menu, #side-menu");
    if (side) side.style.display = "none";
  }

  waitForTabs();
}