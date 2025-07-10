console.log("🎉 mobile.js loaded!");

// Only run on mobile
if (window.innerWidth <= 768) {
  // Inject stylesheets
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://moble.chilsoft.com/organizr/mobile.css";
  document.head.appendChild(css);

  const launcherCSS = document.createElement("link");
  launcherCSS.rel = "stylesheet";
  launcherCSS.href = "https://moble.chilsoft.com/organizr/launcher.css";
  document.head.appendChild(launcherCSS);

  // Wait for sidebar to load before building launcher
  const waitForTabs = setInterval(() => {
    const tabs = document.querySelectorAll('.side-tab-link');
    if (tabs.length > 0) {
      clearInterval(waitForTabs);
      console.log("✅ Sidebar tabs found -- building launcher");
      buildLauncherFromSidebar(tabs);
    } else {
      console.log("⏳ Waiting for sidebar tabs...");
    }
  }, 300);

  function buildLauncherFromSidebar(tabs) {
    const launcher = document.createElement("div");
    launcher.className = "mobile-launcher";

    tabs.forEach(tab => {
      const href = tab.getAttribute("href");
      const label = tab.querySelector(".name")?.textContent || "Tab";
      const icon = tab.querySelector("i")?.outerHTML || "📄";

      const btn = document.createElement("a");
      btn.href = href;
      btn.className = "launcher-button";
      btn.innerHTML = `<div class="icon">${icon}</div><div class="label">${label}</div>`;
      launcher.appendChild(btn);
    });

    document.body.appendChild(launcher);
  }
}