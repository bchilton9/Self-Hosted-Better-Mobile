// mobile.js v17

document.addEventListener("DOMContentLoaded", function () {
  const launcherToggle = document.querySelector(".sidebar-toggle, .fa-bars");
  if (!launcherToggle) return;

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "custom-mobile-launcher";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.zIndex = "9999";
  overlay.style.overflowY = "auto";
  overlay.style.backgroundColor = "rgba(0,0,0,0.85)";
  overlay.style.padding = "1rem";
  overlay.style.display = "none";
  document.body.appendChild(overlay);

  // Get tabs
  const allTabs = document.querySelectorAll(".allTabsList");
  const allGroups = document.querySelectorAll(".allGroupsList");

  const groups = {};
  allGroups.forEach(group => {
    const groupName = group.dataset.groupName?.trim();
    const tabList = group.querySelectorAll(".allTabsList");
    if (groupName && tabList.length) {
      groups[groupName] = Array.from(tabList);
    }
  });

  // Handle Uncategorized
  const categorizedTabs = new Set();
  Object.values(groups).forEach(tabs => {
    tabs.forEach(tab => categorizedTabs.add(tab.id));
  });

  const uncategorizedTabs = Array.from(allTabs).filter(tab => !categorizedTabs.has(tab.id));
  if (uncategorizedTabs.length > 0) {
    groups["_uncategorized"] = uncategorizedTabs;
  }

  // Build UI
  const container = document.createElement("div");
  container.style.maxWidth = "900px";
  container.style.margin = "0 auto";

  const createCard = (tab) => {
    const iconBox = document.createElement("div");
    iconBox.style.width = "80px";
    iconBox.style.height = "80px";
    iconBox.style.margin = "10px";
    iconBox.style.borderRadius = "12px";
    iconBox.style.backgroundColor = "#1e1e1e";
    iconBox.style.display = "flex";
    iconBox.style.flexDirection = "column";
    iconBox.style.alignItems = "center";
    iconBox.style.justifyContent = "center";
    iconBox.style.color = "#fff";
    iconBox.style.fontSize = "12px";
    iconBox.style.textAlign = "center";

    const link = tab.querySelector("a");
    const img = link.querySelector("img");
    const icon = document.createElement("div");
    icon.style.fontSize = "28px";
    icon.style.marginBottom = "4px";

    if (img) {
      const imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = "";
      imgEl.style.width = "36px";
      imgEl.style.height = "36px";
      icon.appendChild(imgEl);
    } else {
      const fa = link.querySelector("i");
      if (fa) {
        icon.innerHTML = `<i class="${fa.className}" style="font-size: 36px;"></i>`;
      }
    }

    const text = document.createElement("div");
    const name = link.textContent?.trim();
    text.textContent = name;
    text.style.fontSize = "12px";

    iconBox.onclick = () => link.click();
    iconBox.appendChild(icon);
    iconBox.appendChild(text);
    return iconBox;
  };

  const createCategory = (name, tabs, collapsible = true) => {
    const section = document.createElement("div");
    section.style.marginBottom = "1.5rem";
    const header = document.createElement("h3");
    header.textContent = name !== "_uncategorized" ? name : "";
    header.style.color = "#fff";
    header.style.fontSize = "16px";
    header.style.cursor = collapsible ? "pointer" : "default";
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.margin = "0 0 0.5rem 0";

    let icon;
    if (collapsible) {
      icon = document.createElement("span");
      icon.textContent = "▾";
      icon.style.marginRight = "8px";
      icon.style.transform = "rotate(0deg)";
      header.prepend(icon);
    }

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(100px, 1fr))";
    grid.style.gap = "8px";

    tabs.forEach(tab => grid.appendChild(createCard(tab)));

    if (collapsible) {
      header.addEventListener("click", () => {
        const isHidden = grid.style.display === "none";
        grid.style.display = isHidden ? "grid" : "none";
        icon.style.transform = isHidden ? "rotate(0deg)" : "rotate(-90deg)";
      });
    }

    section.appendChild(header);
    section.appendChild(grid);
    return section;
  };

  // Append uncategorized first
  if (groups["_uncategorized"]) {
    container.appendChild(createCategory("_uncategorized", groups["_uncategorized"], false));
    delete groups["_uncategorized"];
  }

  // Append other categories
  Object.keys(groups).forEach(group => {
    container.appendChild(createCategory(group, groups[group], true));
  });

  overlay.appendChild(container);

  launcherToggle.addEventListener("click", () => {
    const isVisible = overlay.style.display === "block";
    overlay.style.display = isVisible ? "none" : "block";
  });

  // Hide menu on outside click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
    }
  });
});