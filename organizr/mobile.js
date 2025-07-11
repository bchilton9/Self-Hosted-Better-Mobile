// version: 11.1 🧪

console.log("📱 mobile.js loaded");

if (window.innerWidth < 768) {
  const waitForTabs = (retries = 20) => {
    const tabGroups = document.querySelectorAll("li.allGroupsList");
    const tabLinks = document.querySelectorAll("li.allTabsList");

    if (tabLinks.length === 0 && retries > 0) {
      console.warn("⏳ Waiting for tabs...");
      setTimeout(() => waitForTabs(retries - 1), 500);
      return;
    }

    if (!tabLinks.length) {
      console.error("❌ No tabs found");
      return;
    }

    console.log("✅ Tabs found -- building launcher...");
    buildLauncher(tabGroups);
  };

  const buildLauncher = (groups) => {
    const card = document.createElement("div");
    card.id = "mobile-launcher";
    Object.assign(card.style, {
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.9)", zIndex: 9999, overflowY: "auto", padding: "10px",
      display: "none", fontFamily: "sans-serif"
    });

    groups.forEach(group => {
      const category = group.getAttribute("data-group-name") || "Uncategorized";
      const isUncategorized = category === "Uncategorized";
      const tabs = group.querySelectorAll("li.allTabsList");

      const wrapper = document.createElement("div");
      Object.assign(wrapper.style, {
        margin: "10px", padding: "10px", borderRadius: "10px",
        background: "#1a1a1a", border: "1px solid #444"
      });

      if (!isUncategorized) {
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.cursor = "pointer";
        header.style.marginBottom = "8px";

        const toggle = document.createElement("span");
        toggle.textContent = "▾";
        toggle.style.marginRight = "8px";
        toggle.style.fontSize = "18px";

        const title = document.createElement("h3");
        title.textContent = category;
        Object.assign(title.style, {
          margin: 0, fontSize: "16px", color: "#fff"
        });

        header.append(toggle, title);
        wrapper.appendChild(header);
      }

      const grid = document.createElement("div");
      grid.classList.add("launcher-grid");
      Object.assign(grid.style, {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px"
      });

      tabs.forEach(tab => {
        const a = tab.querySelector("a");
        const label = tab.querySelector(".sidebar-tabName")?.textContent?.trim() || "App";
        const iconImg = tab.querySelector("img");
        const iconFA = tab.querySelector("i.fa");

        const box = document.createElement("div");
        Object.assign(box.style, {
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", background: "#222", borderRadius: "12px",
          padding: "10px", height: "100%", aspectRatio: "1 / 1", cursor: "pointer"
        });

        if (iconImg) {
          const img = document.createElement("img");
          img.src = iconImg.src;
          Object.assign(img.style, { width: "48px", height: "48px", objectFit: "contain", marginBottom: "6px" });
          box.appendChild(img);
        } else if (iconFA) {
          const icon = iconFA.cloneNode(true);
          icon.style.fontSize = "36px";
          icon.style.color = "#fff";
          icon.style.marginBottom = "6px";
          box.appendChild(icon);
        }

        const text = document.createElement("div");
        text.textContent = label;
        Object.assign(text.style, {
          color: "#fff", fontSize: "13px", marginTop: "4px", textAlign: "center"
        });

        box.appendChild(text);
        box.onclick = () => {
          card.style.display = "none";
          a.click();
        };
        grid.appendChild(box);
      });

      wrapper.appendChild(grid);

      if (!isUncategorized) {
        wrapper.querySelector("div").onclick = () => {
          const gridVisible = grid.style.display !== "none";
          grid.style.display = gridVisible ? "none" : "grid";
          wrapper.querySelector("span").textContent = gridVisible ? "▸" : "▾";
        };
      }

      card.appendChild(wrapper);
    });

    document.body.appendChild(card);

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "☰";
    Object.assign(toggleBtn.style, {
      position: "fixed", top: "10px", left: "10px", zIndex: "10000",
      background: "#111", color: "#fff", border: "none",
      borderRadius: "6px", padding: "6px 12px", fontSize: "20px", cursor: "pointer"
    });

    toggleBtn.onclick = () => {
      card.style.display = card.style.display === "none" ? "block" : "none";
    };

    document.body.appendChild(toggleBtn);
    const sidebar = document.querySelector("aside, .side-menu, #side-menu");
    if (sidebar) sidebar.style.display = "none";
  };

  waitForTabs();

  const updateColumns = () => {
    document.querySelectorAll(".launcher-grid").forEach(grid => {
      const cols = window.innerWidth > window.innerHeight ? 6 : 3;
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    });
  };

  window.addEventListener("resize", updateColumns);
  window.addEventListener("orientationchange", updateColumns);
  updateColumns();
}