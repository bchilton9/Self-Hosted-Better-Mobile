// mobile.js v9.2

document.addEventListener("DOMContentLoaded", function () {
  const launcher = document.createElement("div");
  launcher.className = "mobile-launcher";
  document.body.appendChild(launcher);

  const tabGroups = document.querySelectorAll("li.allGroupsList");
  const uncategorized = [];
  const categorized = [];

  tabGroups.forEach((group) => {
    const name = group.dataset.groupName?.trim() || "Uncategorized";
    const tabs = group.querySelectorAll("li.allTabsList");

    const apps = [...tabs].map((tab) => {
      const name = tab.querySelector(".sidebar-tabName")?.textContent.trim() || "";
      const icon = tab.querySelector("img, i")?.cloneNode(true);
      const onclick = tab.querySelector("a")?.getAttribute("onclick");
      return { name, icon, onclick };
    });

    if (name.toLowerCase() === "uncategorized") {
      uncategorized.push(...apps);
    } else {
      categorized.push({ name, apps });
    }
  });

  function createAppGrid(apps) {
    const grid = document.createElement("div");
    grid.className = "app-grid";

    apps.forEach((app) => {
      const button = document.createElement("div");
      button.className = "app-button";
      if (app.icon) button.appendChild(app.icon);
      const label = document.createElement("div");
      label.textContent = app.name;
      label.className = "app-label";
      button.appendChild(label);
      button.onclick = () => {
        if (app.onclick) eval(app.onclick);
      };
      grid.appendChild(button);
    });

    return grid;
  }

  function createCategorySection(name, apps, collapsible = true) {
    const section = document.createElement("div");
    section.className = "category-section";

    const header = document.createElement("div");
    header.className = "category-header";
    header.textContent = name;

    if (collapsible) {
      const toggle = document.createElement("span");
      toggle.textContent = "▾";
      toggle.className = "collapse-toggle";
      header.prepend(toggle);

      header.addEventListener("click", () => {
        grid.classList.toggle("hidden");
        toggle.textContent = grid.classList.contains("hidden") ? "▸" : "▾";
      });
    }

    const grid = createAppGrid(apps);
    if (collapsible) grid.classList.add("collapsible-grid");

    section.appendChild(header);
    section.appendChild(grid);
    return section;
  }

  launcher.innerHTML = ""; // Clear existing content
  launcher.appendChild(createCategorySection("Uncategorized", uncategorized, false));
  categorized.forEach((cat) => {
    launcher.appendChild(createCategorySection(cat.name, cat.apps, true));
  });
});

// Styling
const style = document.createElement("style");
style.textContent = `
  .mobile-launcher {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 1000px;
    padding: 20px;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.65);
    border-radius: 16px;
  }
  .category-section {
    margin-bottom: 30px;
  }
  .category-header {
    font-size: 1.3em;
    margin-bottom: 10px;
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  .collapse-toggle {
    font-size: 1.2em;
    user-select: none;
  }
  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 15px;
  }
  .app-button {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #222;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #eee;
    font-size: 0.9em;
    text-align: center;
  }
  .app-button img, .app-button i {
    max-width: 40%;
    max-height: 40%;
    margin-bottom: 6px;
  }
  .app-label {
    font-size: 0.75em;
    line-height: 1em;
    word-break: break-word;
  }
  .collapsible-grid.hidden {
    display: none;
  }

  @media (orientation: landscape) {
    .app-grid {
      grid-template-columns: repeat(6, 1fr) !important;
    }
  }
`;
document.head.appendChild(style);