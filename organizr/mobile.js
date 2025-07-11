// version 5
console.log("📱 mobile.js v3 loaded!");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  function waitForSidebar(retries = 20) {
    const sidebar = document.querySelector("#sidebarnav");
    if (!sidebar && retries > 0) {
      console.warn("⏳ Sidebar not found yet, retrying...");
      setTimeout(() => waitForSidebar(retries - 1), 300);
      return;
    }
    if (!sidebar) {
      console.error("❌ Failed to find sidebar");
      return;
    }
    console.log("✅ Sidebar found!");
    parseTabs(sidebar);
  }

  function parseTabs(sidebar) {
    const launcher = document.createElement("div");
    launcher.id = "mobile-launcher";
    launcher.style.position = "fixed";
    launcher.style.top = "0";
    launcher.style.left = "0";
    launcher.style.width = "100%";
    launcher.style.height = "100%";
    launcher.style.background = "rgba(0, 0, 0, 0.95)";
    launcher.style.zIndex = "9999";
    launcher.style.overflowY = "auto";
    launcher.style.padding = "20px";
    launcher.style.display = "none";

    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "☰";
    toggleBtn.style.position = "fixed";
    toggleBtn.style.top = "10px";
    toggleBtn.style.left = "10px";
    toggleBtn.style.zIndex = "10000";
    toggleBtn.style.background = "#222";
    toggleBtn.style.color = "#fff";
    toggleBtn.style.border = "none";
    toggleBtn.style.borderRadius = "5px";
    toggleBtn.style.padding = "10px 14px";
    toggleBtn.style.fontSize = "18px";
    toggleBtn.style.boxShadow = "0 0 5px #000";
    toggleBtn.onclick = () => {
      launcher.style.display = launcher.style.display === "none" ? "block" : "none";
    };

    const groups = Array.from(sidebar.querySelectorAll("li.nav-small-cap"));
    groups.forEach((groupHeader, i) => {
      const groupName = groupHeader.textContent.trim() || "Uncategorized";
      const groupContainer = document.createElement("div");
      groupContainer.className = "category-box";
      groupContainer.style.marginBottom = "25px";
      groupContainer.style.border = "1px solid #555";
      groupContainer.style.borderRadius = "10px";
      groupContainer.style.padding = "10px";
      groupContainer.style.background = "#111";

      const titleRow = document.createElement("div");
      titleRow.style.display = "flex";
      titleRow.style.alignItems = "center";
      titleRow.style.marginBottom = "10px";

      const collapseBtn = document.createElement("span");
      collapseBtn.textContent = "🔽";
      collapseBtn.style.cursor = "pointer";
      collapseBtn.style.marginRight = "10px";
      collapseBtn.style.fontSize = "16px";

      const title = document.createElement("strong");
      title.textContent = groupName;
      title.style.fontSize = "16px";
      title.style.color = "#fff";

      titleRow.appendChild(collapseBtn);
      titleRow.appendChild(title);
      groupContainer.appendChild(titleRow);

      const buttonGrid = document.createElement("div");
      buttonGrid.style.display = "grid";
      buttonGrid.style.gridTemplateColumns = "repeat(3, 1fr)";
      buttonGrid.style.gap = "10px";

      collapseBtn.onclick = () => {
        buttonGrid.style.display = buttonGrid.style.display === "none" ? "grid" : "none";
        collapseBtn.textContent = buttonGrid.style.display === "none" ? "▶️" : "🔽";
      };

      let tab = groupHeader.nextElementSibling;
      while (tab && !tab.classList.contains("nav-small-cap")) {
        const link = tab.querySelector('a[onclick^="tabActions"]');
        if (link) {
          const label = link.querySelector("span")?.textContent?.trim();
          const icon = link.querySelector("img")?.getAttribute("src") || "";

          const btn = document.createElement("div");
          btn.style.background = "#222";
          btn.style.border = "1px solid #444";
          btn.style.borderRadius = "12px";
          btn.style.textAlign = "center";
          btn.style.padding = "10px";
          btn.style.color = "#fff";
          btn.style.fontSize = "12px";
          btn.style.cursor = "pointer";
          btn.style.aspectRatio = "1/1";
          btn.style.display = "flex";
          btn.style.flexDirection = "column";
          btn.style.justifyContent = "center";
          btn.style.alignItems = "center";

          if (icon) {
            const img = document.createElement("img");
            img.src = icon;
            img.alt = label;
            img.style.width = "36px";
            img.style.height = "36px";
            img.style.marginBottom = "5px";
            img.style.objectFit = "contain";
            btn.appendChild(img);
          }

          const name = document.createElement("div");
          name.textContent = label;
          name.style.overflow = "hidden";
          name.style.textOverflow = "ellipsis";
          name.style.whiteSpace = "nowrap";
          btn.appendChild(name);

          btn.onclick = () => {
            link.click();
            launcher.style.display = "none";
          };

          buttonGrid.appendChild(btn);
        }

        tab = tab.nextElementSibling;
      }

      groupContainer.appendChild(buttonGrid);
      launcher.appendChild(groupContainer);
    });

    document.body.appendChild(toggleBtn);
    document.body.appendChild(launcher);
  }

  waitForSidebar();
}