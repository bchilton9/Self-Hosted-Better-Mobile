// Mobile enhancements for Organizr
if (window.innerWidth <= 768) {
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

  // Build launcher from sidebar tabs
  function buildLauncherFromSidebar() {
    const sidebarTabs = document.querySelectorAll('.side-tab-link:not(.slideout-overlay)');
    const launcher = document.createElement("div");
    launcher.className = "mobile-launcher";

    sidebarTabs.forEach(tab => {
      const href = tab.getAttribute('href');
      const icon = tab.querySelector('i')?.className || 'fa fa-cube';
      const label = tab.textContent.trim();

      launcher.innerHTML += `
        <a href="${href}">
          <i class="${icon}"></i>
          <span>${label}</span>
        </a>
      `;
    });

    document.body.appendChild(launcher);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Collapse sidebar after tapping a tab
    document.querySelectorAll(".side-tab-link").forEach(el => {
      el.addEventListener("click", () => {
        document.querySelector(".slideout-overlay")?.click();
      });
    });

    // Build launcher
    buildLauncherFromSidebar();
  });

  // Scroll fix for iOS keyboard closing
  window.addEventListener("resize", () => {
    if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      window.scrollTo(0, 0);
    }
  });
}