// version: 3 🐳

console.log("📱 mobile.js loaded!");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  const waitForTabs = (retries = 30) => {
    const tabLinks = Array.from(document.querySelectorAll('a.waves-effect[onclick^="tabActions"]'));
    if (tabLinks.length === 0 && retries > 0) {
      console.warn("⏳ Tabs not found, retrying...");
      setTimeout(() => waitForTabs(retries - 1), 500);
    } else if (tabLinks.length === 0) {
      console.error("❌ Gave up waiting for tab links.");
    } else {
      console.log("✅ Tabs found! Building custom launcher...");
      buildLauncher(tabLinks);
    }
  };

  function buildLauncher(links) {
    const launcherCard = document.createElement("div");
    launcherCard.id = "mobile-launcher";
    launcherCard.style.position = "fixed";
    launcherCard.style.top = "0";
    launcherCard.style.left = "0";
    launcherCard.style.width = "100%";
    launcherCard.style.height = "100%";
    launcherCard.style.background = "rgba(0,0,0,0.95)";
    launcherCard.style.zIndex = "9999";
    launcherCard.style.overflowY = "auto";
    launcherCard.style.padding = "20px";
    launcherCard.style.display = "none";
    launcherCard.style.fontFamily = "sans-serif";

    const categoryMap = {};
    links.forEach(link => {
      const cat = link.getAttribute("data-category") || "Uncategorized";
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(link);
    });

    Object.entries(categoryMap).forEach(([category, items]) => {
      const group = document.createElement("div");
      group.className = "mobile-group";
      group.style.border = "1px solid #444";
      group.style.borderRadius = "10px";
      group.style.marginBottom = "20px";
      group.style.padding = "10px";
      group.style.background = "#111";

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.cursor = "pointer";
      header.style.marginBottom = "10px";

      const toggleIcon = document.createElement("span");
      toggleIcon.textContent = "▾";
      toggleIcon.style.marginRight = "10px";

      const title = document.createElement("h3");
      title.textContent = category;
      title.style.margin = "0";
      title.style.fontSize = "18px";
      title.style.color = "#fff";

      header.appendChild(toggleIcon);
      header.appendChild(title);
      group.appendChild(header);

      const iconGrid = document.createElement("div");
      iconGrid.className = "mobile-grid";
      iconGrid.style.display = "grid";
      iconGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
      iconGrid.style.gap = "16px";

      items.forEach(link => {
        const icon = link.querySelector("img")?.src;
        const label = link.querySelector("span")?.textContent?.trim() || "App";

        const iconWrap = document.createElement("div");
        iconWrap.style.display = "flex";
        iconWrap.style.flexDirection = "column";
        iconWrap.style.alignItems = "center";
        iconWrap.style.justifyContent = "center";
        iconWrap.style.textAlign = "center";
        iconWrap.style.padding = "10px";
        iconWrap.style.background = "#222";
        iconWrap.style.borderRadius = "20px";
        iconWrap.style.color = "#fff";
        iconWrap.style.fontSize = "12px";
        iconWrap.style.cursor = "pointer";

        const img = document.createElement("img");
        img.src = icon || "";
        img.alt = label;
        img.style.width = "48px";
        img.style.height = "48px";
        img.style.marginBottom = "6px";
        img.style.borderRadius = "12px";
        img.onerror = () => {
          img.remove();
          const fallback = document.createElement("div");
          fallback.textContent = label.charAt(0);
          fallback.style.fontSize = "28px";
          fallback.style.marginBottom = "4px";
          iconWrap.insertBefore(fallback, iconWrap.firstChild);
        };

        iconWrap.appendChild(img);
        const text = document.createElement("div");
        text.textContent = label;
        iconWrap.appendChild(text);

        iconWrap.onclick = () => {
          launcherCard.style.display = "none";
          link.click();
        };

        iconGrid.appendChild(iconWrap);
      });

      header.onclick = () => {
        const visible = iconGrid.style.display !== "none";
        iconGrid.style.display = visible ? "none" : "grid";
        toggleIcon.textContent = visible ? "▸" : "▾";
      };

      group.appendChild(iconGrid);
      launcherCard.appendChild(group);
    });

    document.body.appendChild(launcherCard);

    const launcherToggle = document.createElement("button");
    launcherToggle.textContent = "☰";
    launcherToggle.style.position = "fixed";
    launcherToggle.style.top = "10px";
    launcherToggle.style.left = "10px";
    launcherToggle.style.zIndex = "10000";
    launcherToggle.style.background = "#111";
    launcherToggle.style.color = "#fff";
    launcherToggle.style.border = "none";
    launcherToggle.style.borderRadius = "6px";
    launcherToggle.style.padding = "6px 12px";
    launcherToggle.style.fontSize = "20px";
    launcherToggle.style.cursor = "pointer";

    launcherToggle.onclick = () => {
      launcherCard.style.display = launcherCard.style.display === "none" ? "block" : "none";
    };

    // Hide official sidebar
    const officialSidebar = document.querySelector("#side-menu, .side-menu, aside, .sidebar");
    if (officialSidebar) officialSidebar.style.display = "none";

    document.body.appendChild(launcherToggle);
  }

  waitForTabs();
}