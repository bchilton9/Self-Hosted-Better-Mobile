// mobile.js v12

document.addEventListener("DOMContentLoaded", () => {
  const originalMenu = document.querySelector(".sidebar");
  if (!originalMenu) return;

  // Hide the sidebar and insert our launcher
  originalMenu.style.display = "none";

  const launcherContainer = document.createElement("div");
  launcherContainer.id = "custom-launcher";
  launcherContainer.style.position = "fixed";
  launcherContainer.style.top = "50px";
  launcherContainer.style.left = "0";
  launcherContainer.style.width = "100%";
  launcherContainer.style.zIndex = "1000";
  launcherContainer.style.overflowY = "auto";
  launcherContainer.style.padding = "10px";
  launcherContainer.style.boxSizing = "border-box";

  const groups = Array.from(document.querySelectorAll("li.allGroupsList"));
  const uncategorizedTabs = [];
  const categorizedTabs = {};

  groups.forEach(group => {
    const groupName = group.getAttribute("data-group-name")?.trim();
    const tabs = Array.from(group.querySelectorAll("li.allTabsList"));
    if (!groupName || groupName.toLowerCase() === "uncategorized") {
      uncategorizedTabs.push(...tabs);
    } else {
      categorizedTabs[groupName] = tabs;
    }
  });

  // Generate icon box
  function createIcon(tab) {
    const link = tab.querySelector("a");
    const icon = tab.querySelector("img, i")?.cloneNode(true);
    const name = link.querySelector(".sidebar-tabName")?.textContent?.trim() || "App";

    const iconBox = document.createElement("div");
    iconBox.className = "launcher-icon-box";
    iconBox.onclick = () => link.click();

    const iconContainer = document.createElement("div");
    iconContainer.className = "launcher-icon";

    if (icon) iconContainer.appendChild(icon);
    iconBox.appendChild(iconContainer);

    const label = document.createElement("div");
    label.className = "launcher-label";
    label.textContent = name;
    iconBox.appendChild(label);

    return iconBox;
  }

  function createGroup(name, tabs, collapsible = true) {
    const section = document.createElement("div");
    section.className = "launcher-group";

    if (collapsible) {
      const header = document.createElement("div");
      header.className = "launcher-group-header";
      header.textContent = name;

      const toggle = document.createElement("span");
      toggle.className = "launcher-group-toggle";
      toggle.textContent = "▼";
      header.prepend(toggle);

      header.onclick = () => {
        section.classList.toggle("collapsed");
      };

      section.appendChild(header);
    }

    const grid = document.createElement("div");
    grid.className = "launcher-grid";

    tabs.forEach(tab => grid.appendChild(createIcon(tab)));
    section.appendChild(grid);

    if (collapsible) section.classList.add("collapsed");
    return section;
  }

  // Add uncategorized (always open, no title)
  if (uncategorizedTabs.length > 0) {
    const uncategorizedSection = document.createElement("div");
    uncategorizedSection.className = "launcher-group";

    const grid = document.createElement("div");
    grid.className = "launcher-grid";
    uncategorizedTabs.forEach(tab => grid.appendChild(createIcon(tab)));

    uncategorizedSection.appendChild(grid);
    launcherContainer.appendChild(uncategorizedSection);
  }

  // Add categories
  for (const [category, tabs] of Object.entries(categorizedTabs)) {
    launcherContainer.appendChild(createGroup(category, tabs, true));
  }

  document.body.appendChild(launcherContainer);
});