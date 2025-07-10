console.log("🎉 mobile.js loaded!");

if (window.innerWidth <= 768) {
  console.log("📱 Mobile view detected");

  // Inject mobile.css
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://moble.chilsoft.com/organizr/mobile.css";
  document.head.appendChild(css);

  // Inject launcher.css
  const launcherCSS = document.createElement("link");
  launcherCSS.rel = "stylesheet";
  launcherCSS.href = "https://moble.chilsoft.com/organizr/launcher.css";
  document.head.appendChild(launcherCSS);

  // Launcher build function
  function buildLauncher() {
    const sidebarTabs = document.querySelectorAll('a.waves-effect[href^="javascript:void(0)"]');
    if (sidebarTabs.length === 0) {
      console.log("⏳ Waiting for sidebar tabs...");
      return;
    }

    console.log("✅ Sidebar tabs found, building launcher");
    const launcher = document.createElement("div");
    launcher.className = "mobile-launcher";

    sidebarTabs.forEach(tab => {
      const href = tab.getAttribute("onclick") || "";
      const nameSpan = tab.querySelector(".sidebar-tabName");
      const label = nameSpan ? nameSpan.textContent.trim() : "Unnamed";
      const icon = tab.querySelector("img")?.src || "";

      const btn = document.createElement("button");
      btn.className = "mobile-launcher-button";
      btn.innerHTML = icon ? `<img src="${icon}" alt="" class="launcher-icon"> ${label}` : label;
      btn.onclick = () => tab.click();

      launcher.appendChild(btn);
    });

    document.body.appendChild(launcher);
  }

  // Wait for sidebar to exist, then observe for tab links
  const waitForSidebar = new MutationObserver(() => {
    const sidebar = document.querySelector(".side-menu");
    if (sidebar) {
      console.log("👀 Sidebar found, watching for tab links");
      waitForSidebar.disconnect();

      const tabWatcher = new MutationObserver(() => {
        const tabs = document.querySelectorAll('a.waves-effect[href^="javascript:void(0)"]');
        if (tabs.length > 0) {
          tabWatcher.disconnect();
          buildLauncher();
        }
      });

      tabWatcher.observe(sidebar, { childList: true, subtree: true });
    }
  });

  waitForSidebar.observe(document.body, { childList: true, subtree: true });
}