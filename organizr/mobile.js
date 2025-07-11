// version: 14 📱

console.log("📱 mobile.js loaded!");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  const waitForTabs = (retries = 30) => {
    const tabGroups = document.querySelectorAll("li.allGroupsList");
    if (tabGroups.length === 0 && retries > 0) {
      console.warn("⏳ Waiting for tabs...");
      setTimeout(() => waitForTabs(retries - 1), 300);
      return;
    }
    if (tabGroups.length === 0) {
      console.error("❌ Tabs not found.");
      return;
    }
    console.log("✅ Tabs found, building launcher...");
    buildLauncher(tabGroups);
  };

  function buildLauncher(groupElements) {
    const launcher = document.createElement("div");
    launcher.id = "mobile-launcher";
    Object.assign(launcher.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.85)",
      zIndex: 9999,
      overflowY: "auto",
      padding: "16px",
      display: "none",
    });

    const categories = {};

    groupElements.forEach(group => {
      const catName = group.dataset.groupName || "Uncategorized";
      const links = group.querySelectorAll("li.allTabsList a[onclick^='tabActions']");
      if (!categories[catName]) categories[catName] = [];
      links.forEach(link => categories[catName].push(link));
    });

    const uncategorized = categories["Uncategorized"] || [];
    delete categories["Uncategorized"];

    // Add Uncategorized first
    if (uncategorized.length > 0) {
      const uncategorizedBlock = createCategoryBlock("Uncategorized", uncategorized, true);
      launcher.appendChild(uncategorizedBlock);
    }

    // Add all other categories
    Object.entries(categories).forEach(([cat, links]) => {
      const block = createCategoryBlock(cat, links, false);
      launcher.appendChild(block);
    });

    document.body.appendChild(launcher);

    const toggle = document.createElement("button");
    toggle.textContent = "☰";
    Object.assign(toggle.style, {
      position: "fixed",
      top: "10px",
      left: "10px",
      zIndex: 10000,
      background: "#111",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "6px 12px",
      fontSize: "20px",
      cursor: "pointer",
    });
    toggle.onclick = () => {
      launcher.style.display = launcher.style.display === "none" ? "block" : "none";
    };
    document.body.appendChild(toggle);
  }

  function createCategoryBlock(name, links, forceOpen) {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "24px";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.marginBottom = "8px";
    header.style.cursor = forceOpen ? "default" : "pointer";

    const title = document.createElement("h3");
    title.textContent = name === "Uncategorized" ? "" : name;
    Object.assign(title.style, {
      fontSize: "16px",
      color: "#fff",
      margin: 0,
    });

    const toggleIcon = document.createElement("span");
    toggleIcon.textContent = "▾";
    toggleIcon.style.color = "#fff";
    toggleIcon.style.marginLeft = "8px";

    if (!forceOpen) header.appendChild(toggleIcon);
    header.appendChild(title);
    wrapper.appendChild(header);

    const grid = document.createElement("div");
    Object.assign(grid.style, {
      display: "grid",
      gap: "10px",
      gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
      justifyItems: "center",
    });

    links.forEach(link => {
      const name = link.querySelector("span.sidebar-tabName")?.textContent.trim() || "App";
      const iconSrc = link.querySelector("img")?.src;
      const icon = document.createElement("div");

      Object.assign(icon.style, {
        width: "80px",
        height: "80px",
        background: "#222",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "36px",
        color: "#fff",
        cursor: "pointer",
      });

      if (iconSrc) {
        const img = document.createElement("img");
        img.src = iconSrc;
        img.style.maxWidth = "70%";
        img.style.maxHeight = "70%";
        icon.appendChild(img);
      } else {
        const fallbackIcon = link.querySelector("i.fa");
        if (fallbackIcon) {
          const fa = fallbackIcon.className;
          icon.innerHTML = `<i class="${fa}" style="font-size: 28px;"></i>`;
        } else {
          icon.textContent = name.charAt(0);
        }
      }

      const box = document.createElement("div");
      Object.assign(box.style, {
        textAlign: "center",
        color: "#fff",
      });

      const label = document.createElement("div");
      label.textContent = name;
      Object.assign(label.style, {
        fontSize: "12px",
        marginTop: "4px",
      });

      box.appendChild(icon);
      box.appendChild(label);
      box.onclick = () => {
        document.getElementById("mobile-launcher").style.display = "none";
        link.click();
      };

      grid.appendChild(box);
    });

    wrapper.appendChild(grid);

    if (!forceOpen) {
      grid.style.display = "grid";
      header.onclick = () => {
        const shown = grid.style.display === "grid";
        grid.style.display = shown ? "none" : "grid";
        toggleIcon.textContent = shown ? "▸" : "▾";
      };
    }

    return wrapper;
  }

  waitForTabs();
}