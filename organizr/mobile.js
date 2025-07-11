// mobile.js v2 – iOS-style launcher with collapsible categories and grouped cards

console.log("📱 mobile.js v2 loaded");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  function waitForTabs(retries = 30) {
    const tabLinks = document.querySelectorAll('a.waves-effect[onclick^="tabActions"]');
    if (tabLinks.length === 0 && retries > 0) {
      console.warn("⏳ Tabs not found, retrying...");
      setTimeout(() => waitForTabs(retries - 1), 400);
      return;
    }

    if (tabLinks.length === 0) {
      console.error("❌ Gave up waiting for tab links.");
      return;
    }

    console.log("✅ Tabs found! Building custom launcher...");
    createMobileLauncher(tabLinks);
  }

  function createMobileLauncher(links) {
    // Hide the original sidebar menu
    const sidebar = document.querySelector("#side-menu") || document.querySelector(".sidebar") || document.querySelector("aside");
    if (sidebar) sidebar.style.display = "none";

    // Create hamburger menu toggle
    const menuToggle = document.createElement("button");
    menuToggle.textContent = "☰";
    menuToggle.id = "mobileLauncherToggle";
    menuToggle.style.position = "absolute";
    menuToggle.style.left = "10px";
    menuToggle.style.top = "8px";
    menuToggle.style.zIndex = "9999";
    menuToggle.style.fontSize = "24px";
    menuToggle.style.background = "transparent";
    menuToggle.style.color = "#fff";
    menuToggle.style.border = "none";
    menuToggle.style.cursor = "pointer";
    document.body.appendChild(menuToggle);

    const launcher = document.createElement("div");
    launcher.id = "custom-launcher";
    launcher.style.position = "fixed";
    launcher.style.top = "0";
    launcher.style.left = "0";
    launcher.style.width = "100%";
    launcher.style.height = "100%";
    launcher.style.overflowY = "auto";
    launcher.style.background = "rgba(0,0,0,0.95)";
    launcher.style.padding = "60px 10px 20px";
    launcher.style.display = "none";
    launcher.style.zIndex = "9998";

    const categories = {};

    links.forEach(link => {
      const name = link.querySelector("span")?.textContent?.trim() || "Unknown";
      const icon = link.querySelector("img")?.src || "";
      const cat = link.getAttribute("data-category") || "Uncategorized";

      if (!categories[cat]) categories[cat] = [];
      categories[cat].push({ name, icon, link });
    });

    for (const [category, items] of Object.entries(categories)) {
      const wrapper = document.createElement("div");
      wrapper.className = "category-wrapper";
      wrapper.style.marginBottom = "20px";
      wrapper.style.background = "#111";
      wrapper.style.borderRadius = "12px";
      wrapper.style.padding = "10px";

      const heading = document.createElement("h3");
      heading.textContent = category;
      heading.style.color = "#fff";
      heading.style.fontSize = "18px";
      heading.style.display = "flex";
      heading.style.alignItems = "center";
      heading.style.marginBottom = "10px";

      const collapseIcon = document.createElement("span");
      collapseIcon.textContent = "▾";
      collapseIcon.style.marginRight = "10px";
      collapseIcon.style.cursor = "pointer";
      collapseIcon.style.userSelect = "none";

      heading.prepend(collapseIcon);
      wrapper.appendChild(heading);

      const grid = document.createElement("div");
      grid.className = "icon-grid";
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = "repeat(3, 1fr)";
      grid.style.gap = "15px";

      items.forEach(({ name, icon, link }) => {
        const iconWrap = document.createElement("div");
        iconWrap.style.display = "flex";
        iconWrap.style.flexDirection = "column";
        iconWrap.style.alignItems = "center";
        iconWrap.style.justifyContent = "center";

        const iconBtn = document.createElement("button");
        iconBtn.style.width = "64px";
        iconBtn.style.height = "64px";
        iconBtn.style.borderRadius = "18px";
        iconBtn.style.border = "none";
        iconBtn.style.background = "#222";
        iconBtn.style.padding = "6px";
        iconBtn.style.display = "flex";
        iconBtn.style.alignItems = "center";
        iconBtn.style.justifyContent = "center";
        iconBtn.style.boxShadow = "0 0 5px rgba(0,0,0,0.4)";
        iconBtn.style.cursor = "pointer";

        if (icon) {
          const img = document.createElement("img");
          img.src = icon;
          img.alt = name;
          img.style.maxWidth = "100%";
          img.style.maxHeight = "100%";
          img.style.objectFit = "contain";
          iconBtn.appendChild(img);
        } else {
          iconBtn.textContent = name[0];
          iconBtn.style.color = "#fff";
          iconBtn.style.fontSize = "22px";
        }

        iconBtn.onclick = () => link.click();

        const label = document.createElement("span");
        label.textContent = name;
        label.style.color = "#fff";
        label.style.fontSize = "13px";
        label.style.marginTop = "6px";
        label.style.textAlign = "center";

        iconWrap.appendChild(iconBtn);
        iconWrap.appendChild(label);
        grid.appendChild(iconWrap);
      });

      collapseIcon.onclick = () => {
        if (grid.style.display === "none") {
          grid.style.display = "grid";
          collapseIcon.textContent = "▾";
        } else {
          grid.style.display = "none";
          collapseIcon.textContent = "▸";
        }
      };

      wrapper.appendChild(grid);
      launcher.appendChild(wrapper);
    }

    document.body.appendChild(launcher);

    menuToggle.onclick = () => {
      launcher.style.display = launcher.style.display === "none" ? "block" : "none";
    };
  }

  waitForTabs();
}