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

    console.log("✅ Tabs found! Building custom launcher...");
    createMobileLauncher(tabLinks);
  }

  function createMobileLauncher(links) {
    const launcher = document.createElement("div");
    launcher.id = "custom-launcher";
    launcher.style.position = "fixed";
    launcher.style.bottom = "20px";
    launcher.style.left = "20px";
    launcher.style.zIndex = "9999";
    launcher.style.background = "rgba(0,0,0,0.85)";
    launcher.style.padding = "10px";
    launcher.style.borderRadius = "8px";
    launcher.style.maxHeight = "50vh";
    launcher.style.overflowY = "auto";
    launcher.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    launcher.style.color = "#fff";

    launcher.innerHTML = `<strong style="display:block;margin-bottom:6px;">Launcher</strong>`;

    links.forEach(link => {
      const name = link.querySelector("span")?.textContent?.trim();
      if (name) {
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.style.display = "block";
        btn.style.margin = "4px 0";
        btn.style.width = "100%";
        btn.style.padding = "6px";
        btn.style.background = "#333";
        btn.style.border = "1px solid #555";
        btn.style.borderRadius = "4px";
        btn.style.color = "#fff";
        btn.style.textAlign = "left";
        btn.style.fontSize = "14px";
        btn.onclick = () => link.click();
        launcher.appendChild(btn);
      }
    });

    document.body.appendChild(launcher);
  }

  waitForTabs();
}