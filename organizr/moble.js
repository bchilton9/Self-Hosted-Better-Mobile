// Only run mobile tweaks on small screens
if (window.innerWidth <= 768) {
  // Inject mobile.css
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://moble.chilsoft.com/organizr/mobile.css";
  document.head.appendChild(link);

  // Collapse sidebar after clicking a tab
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".side-tab-link").forEach(el => {
      el.addEventListener("click", () => {
        document.querySelector(".slideout-overlay")?.click();
      });
    });
  });

  // Scroll fix for iOS keyboard closing
  window.addEventListener("resize", () => {
    if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      window.scrollTo(0, 0);
    }
  });

  // Optional: Add paste button for iOS (future enhancement)
  // TODO: Implement paste helper if needed
}