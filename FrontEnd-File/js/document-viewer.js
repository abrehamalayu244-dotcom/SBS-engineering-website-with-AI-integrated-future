
(() => {
  "use strict";

  function initializeDocumentViewer() {
    const viewer = document.getElementById("documentViewer");
    const viewerImage = document.getElementById("documentViewerImage");
    const closeButton = document.getElementById("documentViewerClose");

    if (!viewer || !viewerImage || !closeButton) {
      return;
    }

    let previousFocus = null;

    function openViewer(imagePath, trigger) {
      if (!imagePath) return;

      previousFocus = trigger;

      viewerImage.src = imagePath;
      viewer.classList.add("is-open");
      viewer.setAttribute("aria-hidden", "false");
      viewer.removeAttribute("inert");

      document.body.classList.add("document-viewer-open");

      closeButton.focus();
    }

    function closeViewer() {
      if (!viewer.classList.contains("is-open")) return;

      viewer.classList.remove("is-open");
      viewer.setAttribute("aria-hidden", "true");
      viewer.setAttribute("inert", "");

      document.body.classList.remove("document-viewer-open");

      // Clear the displayed image after closing.
      viewerImage.removeAttribute("src");

      // Return keyboard focus to the button that opened the viewer.
      if (previousFocus && previousFocus.isConnected) {
        previousFocus.focus();
      }

      previousFocus = null;
    }

    // Open the corresponding document without showing the text modal.
    document.querySelectorAll("[data-document-viewer]").forEach((button) => {
      button.addEventListener("click", () => {
        const imagePath = button.dataset.image;
        openViewer(imagePath, button);
      });
    });

    // Close with the X button.
    closeButton.addEventListener("click", closeViewer);

    // Close when the user clicks the dark background.
    viewer.addEventListener("click", (event) => {
      if (event.target === viewer) {
        closeViewer();
      }
    });

    // Close with Escape.
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        viewer.classList.contains("is-open")
      ) {
        closeViewer();
      }
    });

    // Prevent Tab navigation from moving behind the open viewer.
    viewer.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || !viewer.classList.contains("is-open")) {
        return;
      }

      event.preventDefault();
      closeButton.focus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDocumentViewer);
  } else {
    initializeDocumentViewer();
  }
})();
