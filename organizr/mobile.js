console.log("🎉 mobile.js loaded!");

if (window.innerWidth <= 768) {
  console.log("📱 Mobile view detected");

  // Inject CSS
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://moble.chilsoft.com/organizr/mobile.css";
  document.head.appendChild(css);

  const launcherCSS = document.createElement("link");
  launcherCSS.rel = "stylesheet";
  launcherCSS.href = "https://moble.chilsoft.com/organizr/launcher.css";
  document.head.appendChild(launcherCSS);

  // Try to build the launcher once ready
  function buildLauncher() {
    const sidebar = document.querySelector(".side-menu");
    if (!sidebar) {
      console.warn("⚠️ Sidebar container still not found");
      return false;
    }

    const sidebarTabs = sidebar.querySelectorAll('a.waves-effect[href^="javascript:void(0)"]');
    if (!sidebarTabs.length) {
      console.warn("⚠️ Sidebar tabs not found yet");
      return false;
    }

    console.log("✅ Sidebar and tabs found -- building launcher");

    const launcher = document.createElement("div");
    launcher.className = "mobile-launcher";

    sidebarTabs.forEach(tab => {
      const onclick = tab.getAttribute("onclick");
      const nameSpan = tab.querySelector(".sidebar-tabName");
      const label = nameSpan ? nameSpan.textContent.trim() : "Unnamed";
      const icon = tab.querySelector("img")?.src || "";

      const btn = document.createElement("button");
      btn.className = "mobile-launcher-button";
      btn.innerHTML = icon ? `<img src="${icon}" class="launcher-icon"> ${label}` : label;
      btn.onclick = () => tab.click();

      launcher.appendChild(btn);
    });

    document.body.appendChild(launcher);
    return true;
  }

  // 🕵️ Try to find sidebar up to 20 times (once every 500ms)
  let attempts = 0;
  const maxAttempts = 20;
  const pollInterval = setInterval(() => {
    if (buildLauncher()) {
      clearInterval(pollInterval);
    } else {
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        console.error("❌ Gave up waiting for sidebar after 10 seconds");
      }
    }
  }, 500);
}