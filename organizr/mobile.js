(function () {
  console.log("📱 mobile.js loaded!");
  if (!/Mobi|Android/i.test(navigator.userAgent)) return;

  document.addEventListener("DOMContentLoaded", () => {
    console.log("📱 Mobile view detected");

    const interval = setInterval(() => {
      const tabs = document.querySelectorAll('a[onclick^="tabActions"]');
      if (tabs.length > 0) {
        clearInterval(interval);
        console.log("✅ Tabs found! Building custom launcher...");
        buildLauncher(Array.from(tabs));
      }
    }, 500);

    function buildLauncher(tabLinks) {
      // Remove original sidebar
      const sidebar = document.querySelector(".sidebar") || document.querySelector("#side-menu") || document.querySelector("aside");
      if (sidebar) sidebar.style.display = "none";

      // Build toggle button
      const toggleBtn = document.createElement("div");
      toggleBtn.innerHTML = "☰";
      toggleBtn.id = "mobileLauncherToggle";
      toggleBtn.style.position = "fixed";
      toggleBtn.style.top = "10px";
      toggleBtn.style.left = "10px";
      toggleBtn.style.zIndex = "9999";
      toggleBtn.style.fontSize = "24px";
      toggleBtn.style.background = "#333";
      toggleBtn.style.color = "#fff";
      toggleBtn.style.padding = "8px 12px";
      toggleBtn.style.borderRadius = "8px";
      toggleBtn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.5)";
      toggleBtn.style.cursor = "pointer";
      document.body.appendChild(toggleBtn);

      // Build overlay launcher
      const launcher = document.createElement("div");
      launcher.id = "mobileLauncher";
      launcher.style.position = "fixed";
      launcher.style.top = "0";
      launcher.style.left = "0";
      launcher.style.width = "100%";
      launcher.style.height = "100%";
      launcher.style.background = "rgba(0,0,0,0.95)";
      launcher.style.color = "#fff";
      launcher.style.zIndex = "9998";
      launcher.style.display = "none";
      launcher.style.overflowY = "auto";
      launcher.style.padding = "20px";
      launcher.style.boxSizing = "border-box";
      launcher.style.fontFamily = "sans-serif";
      document.body.appendChild(launcher);

      toggleBtn.onclick = () => {
        launcher.style.display = launcher.style.display === "none" ? "block" : "none";
      };

      // Organize tabs by category
      const categories = {};
      tabLinks.forEach((link) => {
        const tabName = link.textContent.trim();
        const category = link.closest("ul")?.previousElementSibling?.textContent?.trim() || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(link);
      });

      // Build categorized app icon grid
      for (const [category, links] of Object.entries(categories)) {
        const section = document.createElement("div");
        section.style.marginBottom = "20px";

        const header = document.createElement("h2");
        header.textContent = category;
        header.style.fontSize = "18px";
        header.style.marginBottom = "10px";
        header.style.cursor = "pointer";
        header.style.userSelect = "none";
        section.appendChild(header);

        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(3, 1fr)";
        grid.style.gap = "15px";
        grid.classList.add("launcher-grid");
        section.appendChild(grid);

        links.forEach((link) => {
          const app = document.createElement("div");
          app.style.textAlign = "center";
          app.style.padding = "10px";
          app.style.background = "#222";
          app.style.borderRadius = "16px";
          app.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
          app.style.transition = "transform 0.2s ease";
          app.style.cursor = "pointer";
          app.onclick = () => link.click();

          const img = link.querySelector("img");
          if (img) {
            const icon = document.createElement("img");
            icon.src = img.src;
            icon.style.width = "40px";
            icon.style.height = "40px";
            icon.style.borderRadius = "10px";
            icon.style.marginBottom = "6px";
            app.appendChild(icon);
          }

          const label = document.createElement("div");
          label.textContent = link.textContent.trim();
          label.style.fontSize = "14px";
          label.style.whiteSpace = "nowrap";
          label.style.overflow = "hidden";
          label.style.textOverflow = "ellipsis";
          app.appendChild(label);

          grid.appendChild(app);
        });

        header.onclick = () => {
          grid.style.display = grid.style.display === "none" ? "grid" : "none";
        };

        launcher.appendChild(section);
      }
    }
  });
})();