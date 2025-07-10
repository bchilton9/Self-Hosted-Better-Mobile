console.log("📱 mobile.js loaded!");

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

    console.log("✅ Tabs found! Building iOS-style launcher...");
    createMobileLauncher(tabLinks);
  }

  function createMobileLauncher(links) {
    // Hide the original sidebar
    const sidebar = document.querySelector("aside");
    if (sidebar) sidebar.style.display = "none";

    // Add toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "launcher-toggle";
    toggleBtn.innerHTML = "☰";
    toggleBtn.style.position = "fixed";
    toggleBtn.style.top = "10px";
    toggleBtn.style.left = "10px";
    toggleBtn.style.zIndex = "10000";
    toggleBtn.style.padding = "8px 12px";
    toggleBtn.style.fontSize = "18px";
    toggleBtn.style.border = "none";
    toggleBtn.style.borderRadius = "6px";
    toggleBtn.style.background = "#333";
    toggleBtn.style.color = "#fff";
    toggleBtn.onclick = () => {
      const launcher = document.getElementById("custom-launcher");
      launcher.style.display = launcher.style.display === "flex" ? "none" : "flex";
    };
    document.body.appendChild(toggleBtn);

    // Create launcher overlay
    const launcher = document.createElement("div");
    launcher.id = "custom-launcher";
    launcher.style.position = "fixed";
    launcher.style.top = "0";
    launcher.style.left = "0";
    launcher.style.width = "100vw";
    launcher.style.height = "100vh";
    launcher.style.background = "rgba(0, 0, 0, 0.9)";
    launcher.style.display = "flex";
    launcher.style.flexWrap = "wrap";
    launcher.style.justifyContent = "center";
    launcher.style.alignItems = "flex-start";
    launcher.style.padding = "60px 20px 20px 20px";
    launcher.style.zIndex = "9999";
    launcher.style.overflowY = "auto";
    launcher.style.gap = "20px";

    links.forEach(link => {
      const name = link.querySelector("span")?.textContent?.trim();
      const iconSrc = link.querySelector("img")?.src;
      if (name) {
        const iconButton = document.createElement("div");
        iconButton.className = "launcher-icon";
        iconButton.style.display = "flex";
        iconButton.style.flexDirection = "column";
        iconButton.style.alignItems = "center";
        iconButton.style.width = "70px";
        iconButton.style.cursor = "pointer";
        iconButton.onclick = () => {
          launcher.style.display = "none";
          link.click();
        };

        const img = document.createElement("img");
        img.src = iconSrc || "";
        img.alt = name;
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.borderRadius = "12px";
        img.style.objectFit = "cover";
        img.style.marginBottom = "6px";
        img.style.background = "#fff";

        const label = document.createElement("span");
        label.textContent = name;
        label.style.color = "#fff";
        label.style.fontSize = "12px";
        label.style.textAlign = "center";

        iconButton.appendChild(img);
        iconButton.appendChild(label);
        launcher.appendChild(iconButton);
      }
    });

    document.body.appendChild(launcher);
  }

  waitForTabs();
}