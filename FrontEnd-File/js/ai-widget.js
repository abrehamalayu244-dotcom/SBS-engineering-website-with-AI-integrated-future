/* ==========================================
   SBS AI FLOATING ASSISTANT
   Direct navigation to the full AI page
   ========================================== */
(() => {
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "ai.html") return;

  function getAiPagePath() {
    return window.location.pathname.includes("/pages/")
      ? "ai.html"
      : "pages/ai.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".sbs-ai-widget")) return;

    const widget = document.createElement("div");
    widget.className = "sbs-ai-widget";
    widget.innerHTML = `
      <button class="sbs-ai-launcher" id="sbsAiLauncher" aria-label="Open SBS AI Assistant">
        <span class="sbs-ai-launcher-icon">✦</span>
        <span class="sbs-ai-launcher-text">Ask SBS AI</span>
      </button>`;
    document.body.appendChild(widget);

    document.getElementById("sbsAiLauncher")?.addEventListener("click", () => {
      window.location.href = getAiPagePath();
    });

    setTimeout(() => {
      const launcher = document.getElementById("sbsAiLauncher");
      if (!launcher) return;
      try {
        if (!sessionStorage.getItem("sbs-ai-widget-seen")) {
          launcher.classList.add("attention");
          setTimeout(() => launcher.classList.remove("attention"), 4500);
          sessionStorage.setItem("sbs-ai-widget-seen", "true");
        }
      } catch (_) {}
    }, 3500);
  });
})();
