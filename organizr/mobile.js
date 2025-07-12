// version: 15.1 📱

console.log("📱 mobile.js v15 loaded");

if (window.innerWidth < 768) {
  console.log("📱 Mobile view detected");

  function waitForTabs(retries = 30) {
    const tabLinks = document.querySelectorAll("li.allTabsList");
    if (!tabLinks.length && retries > 0) {
      console.warn("⏳ Waiting for tabs...");
      setTimeout(() => waitForTabs(retries - 1), 300);
      return;
    }
    if (!tabLinks.length) {
      console.error("❌ Tabs not found");
      return;
    }

    console.log("✅ Tabs loaded");
    buildLauncher();
  }

  function buildLauncher() {
    const allGroups = document.querySelectorAll("li.allGroupsList");
    const categorized = {};
    let uncategorized = [];

    allGroups.forEach(group => {
      const cat = group.dataset.groupName?.trim();
      const tabs = group.querySelectorAll("li.allTabsList");
      if (!cat || cat === "null") {
        uncategorized = [...uncategorized, ...tabs];
      } else {
        if (!categorized[cat]) categorized[cat] = [];
        categorized[cat].push(...tabs);
      }
    });

    const launcher = document.createElement("div");
    launcher.id = "mobile-launcher";
    Object.assign(launcher.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.85)",
      zIndex: 9999,
      overflowY: "auto",
      padding: "12px",
      display: "none"
    });

    const createIconGrid = (tabs, collapsible = true) => {
      const box = document.createElement("div");
      Object.assign(box.style, {
        border: "1px solid #444",
        borderRadius: "12px",
        marginBottom: "16px",
        padding: "12px",
        background: "#111"
      });

      const grid = document.createElement("div");
      grid.className = "mobile-icon-grid";

      Object.assign(grid.style, {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
        justifyItems: "center",
        gap: "16px"
      });

      tabs.forEach(tab => {
        const a = tab.querySelector("a");
        const name = a?.querySelector(".sidebar-tabName")?.textContent.trim() || "Unknown";
        const img = a?.querySelector("img");
        const icon = document.createElement("div");
        Object.assign(icon.style, {
          width: "70px",
          height: "70px",
          background: "#222",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          color: "#fff",
          position: "relative"
        });

        if (img?.src) {
          const image = document.createElement("img");
          image.src = img.src;
          Object.assign(image.style, {
            width: "40px",
            height: "40px",
            objectFit: "contain"
          });
          icon.appendChild(image);
        } else {
          const faIcon = a.querySelector("i.fa");
          if (faIcon) {
            const clone = faIcon.cloneNode(true);
            Object.assign(clone.style, { fontSize: "28px" });
            icon.appendChild(clone);
          } else {
            icon.textContent = name.charAt(0);
          }
        }

        const wrapper = document.createElement("div");
        Object.assign(wrapper.style, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "6px"
        });

        const label = document.createElement("div");
        label.textContent = name;
        Object.assign(label.style, {
          color: "#fff",
          fontSize: "12px",
          maxWidth: "90px",
          wordWrap: "break-word"
        });

        wrapper.appendChild(icon);
        wrapper.appendChild(label);
        wrapper.onclick = () => {
          launcher.style.display = "none";
          a.click();
        };

        grid.appendChild(wrapper);
      });

      if (collapsible) {
        const title = document.createElement("h3");
        title.textContent = tabs[0]?.closest("li.allGroupsList")?.dataset.groupName || "Category";
        Object.assign(title.style, {
          color: "#fff",
          fontSize: "16px",
          margin: "0 0 10px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer"
        });

        const toggle = document.createElement("span");
        toggle.textContent = "▾";
        toggle.style.marginRight = "8px";

        title.prepend(toggle);
        title.onclick = () => {
          const open = grid.style.display !== "none";
          grid.style.display = open ? "none" : "grid";
          toggle.textContent = open ? "▸" : "▾";
        };

        box.append(title, grid);
      } else {
        box.append(grid);
      }

      return box;
    };

    // Add uncategorized first
    if (uncategorized.length) {
      launcher.appendChild(createIconGrid(uncategorized, false));
    }

    for (const [cat, tabs] of Object.entries(categorized)) {
      launcher.appendChild(createIconGrid(tabs, true));
    }

    document.body.appendChild(launcher);

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "☰";
    Object.assign(toggleBtn.style, {
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
      cursor: "pointer"
    });

    toggleBtn.onclick = () => {
      launcher.style.display = launcher.style.display === "none" ? "block" : "none";
    };

    document.body.appendChild(toggleBtn);
  }

  waitForTabs();
}
