console.log("🎉 mobile.js loaded!");

// Mobile enhancements for Organizr
if (window.innerWidth <= 768) {
  console.log("📱 Mobile view detected");

  // Inject mobile.css for layout fixes
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://moble.chilsoft.com/organizr/mobile.css";
  document.head.appendChild(css);

  // Inject launcher.css for launcher layout
  const launcherCSS = document.createElement("link");
  launcherCSS.rel = "stylesheet";
  launcherCSS.href = "https://moble.chilsoft.com/organizr/launcher.css";
  document.head.appendChild(launcherCSS);

  // Delay launcher build until sidebar is ready
  const interval = setInterval(() => {
    const sidebarTabs = document.querySelectorAll('a.waves-effect[href^="javascript:void(0)"]');

    if (sidebarTabs.length > 0) {
      console.log("✅ Sidebar tabs found, building launcher...");
      clearInterval(interval);

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
    } else {
      console.log("⌛ Sidebar not ready yet, waiting...");
    }
  }, 500);
}