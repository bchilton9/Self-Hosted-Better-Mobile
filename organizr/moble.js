// Only run on mobile
if (window.innerWidth <= 768) {
  // Inject mobile CSS
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://moble.chilsoft.com/organizr/mobile.css";
  document.head.appendChild(link);

  // Auto-collapse sidebar after tab tap
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".side-tab-link").forEach(el => {
      el.addEventListener("click", () => {
        document.querySelector(".slideout-overlay")?.click();
      });
    });
  });

  // Scroll fix after iOS keyboard closes
  window.addEventListener("resize", () => {
    if (document.activeElement.tagName !== "INPUT") {
      window.scrollTo(0, 0);
    }
  });
}