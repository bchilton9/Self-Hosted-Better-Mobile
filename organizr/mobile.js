// mobile.js v2

console.log("📱 mobile.js v2 loaded!");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  function waitForTabs(retries = 20) {
    const tabLinks = document.querySelectorAll('a.waves-effect[onclick^="tabActions"]');
    if (tabLinks.length === 0 && retries > 0) {
      console.warn("⏳ Tabs not found, retrying...");
      setTimeout(() => waitForTabs(retries - 1), 500);
      return;
    }

    if (tabLinks.length === 0) {
      console.error("❌ Gave up waiting for tab links.");
      return;
    }

    console.log("✅ Tabs found! Building mobile launcher...");
    createMobileLauncher(tabLinks);
  }

  function createMobileLauncher(links) {
    // Hide original sidebar
    const sidebar = document.querySelector("aside");
    if (sidebar) sidebar.style.display = "none";

    // Add hamburger toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "launcher-toggle";
    toggleBtn.innerHTML = "☰";
    Object.assign(toggleBtn.style, {
      position: "fixed",
      top: "10px",
      left: "10px",
      zIndex: "10000",
      padding: "4px 8px",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      background: "#222",
      color: "#fff"
    });
    toggleBtn.onclick = () => {
      const launcher = document.getElementById("custom-launcher");
      launcher.style.display = launcher.style.display === "flex" ? "none" : "flex";
    };
    document.body.appendChild(toggleBtn);

    // Create launcher overlay
    const launcher = document.createElement("div");
    launcher.id = "custom-launcher";
    Object.assign(launcher.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.95)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "60px 10px 20px",
      zIndex: "9999",
      overflowY: "auto",
      gap: "12px"
    });

    const categories = {};

    links.forEach(link => {
      const name = link.querySelector("span")?.textContent?.trim();
      const iconSrc = link.querySelector("img")?.src || "";
      const category = link.closest("ul")?.getAttribute("data-category") || "Uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push({ name, iconSrc, onclick: () => link.click() });
    });

    Object.entries(categories).forEach(([catName, items]) => {
      const section = document.createElement("div");
      section.className = "launcher-category";
      section.style.width = "100%";

      const heading = document.createElement("h3");
      heading.textContent = catName;
      heading.style.color = "#fff";
      heading.style.margin = "10px 0 5px";
      heading.style.cursor = "pointer";
      heading.onclick = () => grid.classList.toggle("hidden");

      const grid = document.createElement("div");
      grid.className = "icon-grid";
      Object.assign(grid.style, {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "16px",
        padding: "8px 0"
      });

      items.forEach(({ name, iconSrc, onclick }) => {
        const wrapper = document.createElement("div");
        wrapper.className = "launcher-icon";
        Object.assign(wrapper.style, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80px",
          cursor: "pointer"
        });
        wrapper.onclick = () => {
          launcher.style.display = "none";
          onclick();
        };

        const img = document.createElement("img");
        img.src = iconSrc;
        img.alt = name;
        Object.assign(img.style, {
          width: "60px",
          height: "60px",
          borderRadius: "16px",
          background: "#333",
          padding: "8px",
          objectFit: "contain",
          marginBottom: "6px"
        });

        const label = document.createElement("span");
        label.textContent = name;
        label.style.color = "#fff";
        label.style.fontSize = "12px";
        label.style.textAlign = "center";

        wrapper.appendChild(img);
        wrapper.appendChild(label);
        grid.appendChild(wrapper);
      });

      section.appendChild(heading);
      section.appendChild(grid);
      launcher.appendChild(section);
    });

    document.body.appendChild(launcher);
  }

  waitForTabs();
}