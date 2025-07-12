// version: 15 🐳

console.log("📱 mobile.js loaded!");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  const waitForTabs = (retries = 30) => {
    const groups = document.querySelectorAll("li.allGroupsList");
    if (groups.length === 0 && retries > 0) {
      console.warn("⏳ Tabs not found, retrying...");
      setTimeout(() => waitForTabs(retries - 1), 500);
      return;
    }
    if (groups.length === 0) {
      console.error("❌ Gave up waiting for tab groups.");
      return;
    }
    console.log("✅ Tabs found! Building launcher...");
    buildLauncher(groups);
  };

  function buildLauncher(groupElements) {
    const launcherCard = document.createElement("div");
    launcherCard.id = "mobile-launcher";
    Object.assign(launcherCard.style, {
      position: "fixed", top: "0", left: "0", width: "100%",
      height: "100%", background: "rgba(0,0,0,0.9)",
      zIndex: "9999", overflowY: "auto", padding: "10px"
    });

    const uncategorizedTabs = [];
    const categorizedGroups = [];

    groupElements.forEach(group => {
      const catName = group.getAttribute("data-group-name") || "Uncategorized";
      const links = group.querySelectorAll("li.allTabsList a[onclick^='tabActions']");

      if (catName === "Uncategorized") {
        links.forEach(link => uncategorizedTabs.push(link));
      } else {
        categorizedGroups.push({ name: catName, links });
      }
    });

    // Add Uncategorized first, not collapsible
    if (uncategorizedTabs.length) {
      const uncategorizedGroup = document.createElement("div");
      Object.assign(uncategorizedGroup.style, {
        marginBottom: "20px",
        background: "#111", borderRadius: "10px", padding: "10px"
      });

      const grid = document.createElement("div");
      Object.assign(grid.style, {
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
        gap: "12px", justifyItems: "center"
      });

      uncategorizedTabs.forEach(link => {
        const iconWrap = buildIcon(link);
        grid.appendChild(iconWrap);
      });

      uncategorizedGroup.appendChild(grid);
      launcherCard.appendChild(uncategorizedGroup);
    }

    // Add categorized sections
    categorizedGroups.forEach(group => {
      const wrapper = document.createElement("div");
      Object.assign(wrapper.style, {
        marginBottom: "20px",
        background: "#111", borderRadius: "10px", padding: "10px"
      });

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.cursor = "pointer";
      header.style.marginBottom = "8px";

      const toggleIcon = document.createElement("span");
      toggleIcon.textContent = "▾";
      toggleIcon.style.marginRight = "8px";

      const title = document.createElement("div");
      title.textContent = group.name;
      title.style.fontSize = "16px";
      title.style.color = "#fff";

      header.appendChild(toggleIcon);
      header.appendChild(title);
      wrapper.appendChild(header);

      const grid = document.createElement("div");
      Object.assign(grid.style, {
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
        gap: "12px", justifyItems: "center"
      });

      group.links.forEach(link => {
        const iconWrap = buildIcon(link);
        grid.appendChild(iconWrap);
      });

      header.onclick = () => {
        const visible = grid.style.display !== "none";
        grid.style.display = visible ? "none" : "grid";
        toggleIcon.textContent = visible ? "▸" : "▾";
      };

      wrapper.appendChild(grid);
      launcherCard.appendChild(wrapper);
    });

    document.body.appendChild(launcherCard);

    // Menu Toggle Button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "☰";
    Object.assign(toggleBtn.style, {
      position: "fixed", top: "10px", left: "10px",
      zIndex: "10000", background: "#111",
      color: "#fff", border: "none", borderRadius: "6px",
      padding: "6px 12px", fontSize: "20px", cursor: "pointer"
    });
    toggleBtn.onclick = () => {
      launcherCard.style.display = launcherCard.style.display === "none" ? "block" : "none";
    };
    document.body.appendChild(toggleBtn);
  }

  function buildIcon(link) {
    const label = link.querySelector("span.sidebar-tabName")?.textContent.trim()
      || link.querySelector("span.hide-menu")?.textContent.trim()
      || "App";

    const iconBox = document.createElement("div");
    Object.assign(iconBox.style, {
      width: "80px", height: "80px",
      background: "#222", borderRadius: "12px",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative"
    });

    const img = link.querySelector("img");
    const icon = img ? document.createElement("img") : document.createElement("i");

    if (img) {
      icon.src = img.src;
      Object.assign(icon.style, { width: "48px", height: "48px", objectFit: "contain" });
    } else {
      const faClass = link.querySelector("i.fa")?.className || "fa fa-question";
      icon.className = faClass;
      Object.assign(icon.style, { fontSize: "32px", color: "#fff" });
    }

    iconBox.appendChild(icon);

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";
    wrapper.appendChild(iconBox);

    const labelEl = document.createElement("div");
    labelEl.textContent = label;
    Object.assign(labelEl.style, {
      color: "#fff", fontSize: "12px", textAlign: "center", maxWidth: "80px", wordWrap: "break-word"
    });

    wrapper.appendChild(labelEl);

    wrapper.onclick = () => {
      document.getElementById("mobile-launcher").style.display = "none";
      link.click();
    };

    return wrapper;
  }

  waitForTabs();
}