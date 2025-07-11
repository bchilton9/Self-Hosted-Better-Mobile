// version: 13

console.log("📱 mobile.js v13 loaded");

if (window.innerWidth < 768) {
  const waitForTabs = (retries = 20) => {
    const tabGroups = document.querySelectorAll("li.allGroupsList");
    if (!tabGroups.length && retries > 0) {
      console.log("⏳ Waiting for tab groups...");
      setTimeout(() => waitForTabs(retries - 1), 300);
      return;
    }
    if (!tabGroups.length) {
      console.error("❌ No tabs found");
      return;
    }
    console.log("✅ Tabs found");
    buildLauncher(tabGroups);
  };

  function buildLauncher(groups) {
    const launcher = document.createElement("div");
    launcher.id = "mobile-launcher";
    launcher.style = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.95); color: #fff; overflow-y: auto;
      z-index: 9999; display: none; padding: 15px; font-family: sans-serif;
    `;

    groups.forEach(group => {
      const cat = group.getAttribute("data-group-name") || "Uncategorized";
      const links = group.querySelectorAll("li.allTabsList a");

      if (!links.length) return;

      const card = document.createElement("div");
      card.style = `
        background: #111; border: 1px solid #333; border-radius: 10px;
        margin-bottom: 20px; padding: 10px;
      `;

      const header = document.createElement("div");
      header.style = `
        display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;
      `;

      const toggle = document.createElement("span");
      toggle.textContent = cat === "Uncategorized" ? "" : "▾";
      toggle.style = "margin-right: 8px;";

      const title = document.createElement("h3");
      title.textContent = cat === "Uncategorized" ? "" : cat;
      title.style = "margin: 0; font-size: 18px;";

      header.append(toggle, title);
      card.append(header);

      const grid = document.createElement("div");
      grid.style = `
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
      `;
      grid.className = "icon-grid";

      links.forEach(link => {
        const box = document.createElement("div");
        box.style = `
          background: #222; border-radius: 16px; padding: 10px;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; cursor: pointer;
        `;
        box.onclick = () => {
          launcher.style.display = "none";
          link.click();
        };

        const img = link.querySelector("img");
        const fa = link.querySelector("i");

        if (img?.src) {
          const icon = document.createElement("img");
          icon.src = img.src;
          icon.style = "width: 48px; height: 48px; object-fit: contain;";
          box.append(icon);
        } else if (fa?.className) {
          const icon = document.createElement("i");
          icon.className = fa.className;
          icon.style = "font-size: 42px; margin-bottom: 4px;";
          box.append(icon);
        }

        const name = document.createElement("div");
        name.textContent = link.querySelector("span")?.textContent.trim() || "App";
        name.style = "font-size: 12px; text-align: center; margin-top: 6px;";
        box.append(name);

        grid.append(box);
      });

      if (cat !== "Uncategorized") {
        header.onclick = () => {
          const isOpen = grid.style.display !== "none";
          grid.style.display = isOpen ? "none" : "grid";
          toggle.textContent = isOpen ? "▸" : "▾";
        };
      }

      card.append(grid);
      launcher.append(card);
    });

    document.body.append(launcher);

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "☰";
    toggleBtn.style = `
      position: fixed; top: 10px; left: 10px; z-index: 10000;
      background: #111; color: #fff; border: none; border-radius: 6px;
      padding: 6px 12px; font-size: 20px; cursor: pointer;
    `;
    toggleBtn.onclick = () => {
      launcher.style.display = launcher.style.display === "none" ? "block" : "none";
    };
    document.body.append(toggleBtn);

    const sidebar = document.querySelector("aside, .side-menu, #side-menu");
    if (sidebar) sidebar.style.display = "none";

    // Resize for landscape
    const updateColumns = () => {
      const cols = window.innerWidth > window.innerHeight ? 6 : 3;
      document.querySelectorAll(".icon-grid").forEach(grid => {
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      });
    };

    window.addEventListener("resize", updateColumns);
    updateColumns(); // initial call
  }

  waitForTabs();
}
