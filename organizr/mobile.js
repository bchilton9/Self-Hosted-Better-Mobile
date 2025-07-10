console.log("🎉 mobile.js loaded!");

// Only run on mobile
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

  // Function to build the launcher
  function buildLauncherFromSidebar(tabs) {
    if (document.querySelector(".mobile-launcher")) return;
    console.log("✅ Tabs found -- building launcher");
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

  // Fallback: poll until tabs are found
  const pollTabs = setInterval(() => {
    const tabs = document.querySelectorAll(".side-tab-link");
    if (tabs.length > 0) {
      clearInterval(pollTabs);
      console.log("✅ Tabs found by polling");
      buildLauncherFromSidebar(tabs);
    } else {
      console.log("⏳ Still waiting for tabs...");
    }
  }, 500);

  // Also observe whole document for robustness
  const observer = new MutationObserver(() => {
    const tabs = document.querySelectorAll(".side-tab-link");
    if (tabs.length > 0) {
      observer.disconnect();
      console.log("✅ Tabs found by observer");
      buildLauncherFromSidebar(tabs);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}