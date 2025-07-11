// mobile.js v11
document.addEventListener("DOMContentLoaded", () => {
  const launcher = document.createElement("div");
  launcher.id = "mobile-launcher";
  document.body.appendChild(launcher);

  const toggleButton = document.querySelector(".hamburger");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      launcher.classList.toggle("open");
    });
  }

  const groups = [...document.querySelectorAll(".allGroupsList")];
  const uncategorizedTabs = [...document.querySelectorAll(".allTabsList")].filter(
    tab => !tab.closest(".allGroupsList")
  );

  function createIcon(tab) {
    const name = tab.querySelector(".sidebar-tabName")?.textContent?.trim() || "App";
    const iconImg = tab.querySelector("img");
    const iconFA = tab.querySelector("i");

    const iconBox = document.createElement("div");
    iconBox.className = "mobile-icon";

    if (iconImg) {
      const img = document.createElement("img");
      img.src = iconImg.src;
      img.alt = name;
      iconBox.appendChild(img);
    } else if (iconFA) {
      const fa = iconFA.cloneNode(true);
      iconBox.appendChild(fa);
    } else {
      const fallback = document.createElement("div");
      fallback.className = "fa fa-cube";
      iconBox.appendChild(fallback);
    }

    const label = document.createElement("div");
    label.className = "mobile-label";
    label.textContent = name;

    const wrapper = document.createElement("div");
    wrapper.className = "mobile-icon-wrapper";
    wrapper.appendChild(iconBox);
    wrapper.appendChild(label);

    wrapper.addEventListener("click", () => tab.querySelector("a").click());

    return wrapper;
  }

  function renderGroup(name, tabs, collapsible = true) {
    const container = document.createElement("div");
    container.className = "mobile-group";

    if (collapsible) {
      const header = document.createElement("div");
      header.className = "mobile-header";
      header.innerHTML = `<span class="caret">▼</span> ${name}`;
      header.addEventListener("click", () => {
        iconGrid.classList.toggle("collapsed");
        header.querySelector(".caret").textContent = iconGrid.classList.contains("collapsed") ? "▶" : "▼";
      });
      container.appendChild(header);
    }

    const iconGrid = document.createElement("div");
    iconGrid.className = "mobile-grid";
    tabs.forEach(tab => iconGrid.appendChild(createIcon(tab)));
    container.appendChild(iconGrid);

    launcher.appendChild(container);
  }

  if (uncategorizedTabs.length) {
    renderGroup("", uncategorizedTabs, false);
  }

  groups.forEach(group => {
    const name = group.dataset.groupName || "Group";
    const tabs = [...group.querySelectorAll(".allTabsList")];
    if (tabs.length) renderGroup(name, tabs);
  });
});