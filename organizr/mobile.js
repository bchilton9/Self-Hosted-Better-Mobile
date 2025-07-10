console.log("🎉 mobile.js loaded!");

// Mobile enhancements for Organizr
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

  // Wait for DOM to be ready
  window.addEventListener("load", () => {
    console.log("🚀 DOM ready, building launcher...");

    // Build launcher from sidebar
    const sidebarTabs = document.querySelectorAll('.side-tab-link:not(.slideout-overlay)');
    console.log("🔍 Found tabs:", sidebarTabs.length);

    if (!sidebarTabs.length) {
      console.warn("❌ No sidebar tabs found. Launcher not built.");
      return;
    }

    const launcher = document.createElement("div");
    launcher.className = "mobile-launcher";

    sidebarTabs.forEach(tab => {
      const href = tab.getAttribute("href");
      const icon = tab.querySelector("i")?.outerHTML || "";
      const text = tab.textContent.trim();
      const button = document.createElement("a");
      button.className = "launcher-button";
      button.href = href;
      button.innerHTML = `${icon}<span>${text}</span>`;
      launcher.appendChild(button);
    });

    document.body.appendChild(launcher);
    console.log("✅ Launcher added to page.");
  });
}