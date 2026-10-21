document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // SBS ENGINEERING CONSULTANCY
  // MAIN JAVASCRIPT
  // ============================================================


  // ============================================================
  // CONFIGURATION
  // ============================================================

  /*
   * The backend may run on the same domain or a separate deployment.
   *
   * IMPORTANT:
   * When developing with VS Code Live Server on port 5500,
   * same-origin API requests use the deployed website domain.
   *
   * Therefore we explicitly point API requests to port 3000.
   *
   * For a separate backend, define window.SBS_API_BASE_URL before main.js loads.
   */

 const SBS_API_BASE_URL =
  window.SBS_API_BASE_URL || ((location.hostname === "localhost" || location.hostname === "127.0.0.1") ? "http://localhost:3000" : location.origin);


  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (menuButton && nav) {

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", () => {

      const open =
        nav.classList.toggle("active");

      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );

      menuButton.setAttribute(
        "aria-label",
        open
          ? "Close navigation"
          : "Open navigation"
      );

      menuButton.textContent =
        open ? "×" : "☰";

    });


    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("active");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

        menuButton.setAttribute(
          "aria-label",
          "Open navigation"
        );

        menuButton.textContent = "☰";

      });

    });

  }


  // ============================================================
  // SCROLL TO TOP
  // ============================================================

  const scrollBtn =
    document.getElementById("scrollTop");

  if (scrollBtn) {

    const updateScrollButton = () => {

      scrollBtn.classList.toggle(
        "show",
        window.scrollY > 450
      );

    };

    window.addEventListener(
      "scroll",
      updateScrollButton,
      { passive: true }
    );

    updateScrollButton();

    scrollBtn.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }


  // ============================================================
  // REVEAL ANIMATIONS
  // ============================================================

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries, obs) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add("show");

              obs.unobserve(entry.target);

            }

          });

        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach(el => {
      observer.observe(el);
    });

  } else {

    revealElements.forEach(el => {
      el.classList.add("show");
    });

  }


  // ============================================================
  // DETAIL MODAL
  // ============================================================

  const modal =
    document.getElementById("detailModal");

  if (modal) {

    const title =
      modal.querySelector(
        "[data-modal-title]"
      );

    const kicker =
      modal.querySelector(
        "[data-modal-kicker]"
      );

    const body =
      modal.querySelector(
        "[data-modal-body]"
      );

    const closeButtons =
      modal.querySelectorAll(
        "[data-modal-close]"
      );


    // ------------------------------------------------------------
    // OPEN MODAL
    // ------------------------------------------------------------

    const openModal = (trigger) => {

      if (!title || !body) {
        return;
      }


      title.textContent =
        trigger.dataset.title ||
        "SBS Engineering Consultancy";


      if (kicker) {

        kicker.textContent =
          trigger.dataset.kicker ||
          "Details";

      }


      const description = trigger.dataset.description || "";
      const longDescription = trigger.dataset.long || "";
      const sections = trigger.dataset.sections
        ? trigger.dataset.sections.split("||").map(section => {
            const [heading, ...items] = section.split("|");
            const listItems = items.filter(Boolean).map(item => `<li>${escapeHtml(item)}</li>`).join("");
            return `<section class="detail-section"><h3>${escapeHtml(heading)}</h3>${listItems ? `<ul class="detail-list">${listItems}</ul>` : ""}</section>`;
          }).join("")
        : "";
      const list = trigger.dataset.list
        ? trigger.dataset.list.split("|").map(item => `<li>${escapeHtml(item)}</li>`).join("")
        : "";
      const images = trigger.dataset.images
        ? trigger.dataset.images.split("|").filter(Boolean).map((src, index) =>
            `<figure class="detail-image"><img src="${escapeHtml(src)}" alt="Project detail image ${index + 1}" loading="lazy"></figure>`
          ).join("")
        : "";

      body.innerHTML = `
        ${images ? `<div class="detail-gallery">${images}</div>` : ""}
        <div class="detail-summary"><p>${escapeHtml(description)}</p></div>
        ${longDescription ? `<p class="detail-long">${escapeHtml(longDescription)}</p>` : ""}
        ${sections || (list ? `<section class="detail-section"><h3>Key Scope</h3><ul class="detail-list">${list}</ul></section>` : "")}
      `;


      modal.classList.add("open");

      modal.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "modal-open"
      );


      const close =
        modal.querySelector(
          ".detail-close"
        );

      close?.focus();

    };


    // ------------------------------------------------------------
    // CLOSE MODAL
    // ------------------------------------------------------------

    const closeModal = () => {

      modal.classList.remove("open");

      modal.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "modal-open"
      );

    };


    // ------------------------------------------------------------
    // DETAIL BUTTONS
    // ------------------------------------------------------------

    document
      .querySelectorAll("[data-detail]")
      .forEach(trigger => {

        trigger.addEventListener(
          "click",
          () => openModal(trigger)
        );

      });


    // ------------------------------------------------------------
    // CLOSE BUTTONS
    // ------------------------------------------------------------

    closeButtons.forEach(button => {

      button.addEventListener(
        "click",
        closeModal
      );

    });


    // ------------------------------------------------------------
    // CLICK OUTSIDE MODAL
    // ------------------------------------------------------------

    modal.addEventListener(
      "click",
      event => {

        if (event.target === modal) {

          closeModal();

        }

      }
    );


    // ------------------------------------------------------------
    // ESCAPE KEY
    // ------------------------------------------------------------

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          modal.classList.contains("open")
        ) {

          closeModal();

        }

      }
    );

  }


  // ============================================================
  // REAL SBS CONTACT FORM
  // ============================================================

  const form =
    document.getElementById("contactForm");

  if (form) {

    const status =
      document.getElementById(
        "formStatus"
      );


    const submitButton =
      form.querySelector(
        'button[type="submit"]'
      );


    // ------------------------------------------------------------
    // STATUS HELPER
    // ------------------------------------------------------------

    const setStatus = (
      text,
      type
    ) => {

      if (!status) {
        return;
      }

      status.textContent = text;

      status.className =
        `form-status ${type}`;

    };


    // ------------------------------------------------------------
    // CONTACT FORM SUBMISSION
    // ------------------------------------------------------------

    form.addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        // ========================================================
        // GET FORM VALUES
        // ========================================================

        const name =
          document
            .getElementById("name")
            ?.value
            .trim();


        const email =
          document
            .getElementById("email")
            ?.value
            .trim();


        const phone =
          document
            .getElementById("phone")
            ?.value
            .trim();


        const service =
          document
            .getElementById("service")
            ?.value
            .trim();


        const message =
          document
            .getElementById("message")
            ?.value
            .trim();


        // ========================================================
        // VALIDATION
        // ========================================================

        if (
          !name ||
          name.length < 2
        ) {

          setStatus(
            "Please enter your full name.",
            "error"
          );

          document
            .getElementById("name")
            ?.focus();

          return;

        }


        if (
          !email ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email)
        ) {

          setStatus(
            "Please enter a valid email address.",
            "error"
          );

          document
            .getElementById("email")
            ?.focus();

          return;

        }


        if (
          !phone ||
          phone.length < 7
        ) {

          setStatus(
            "Please enter a valid phone number.",
            "error"
          );

          document
            .getElementById("phone")
            ?.focus();

          return;

        }


        if (!service) {

          setStatus(
            "Please select a service.",
            "error"
          );

          document
            .getElementById("service")
            ?.focus();

          return;

        }


        if (
          !message ||
          message.length < 10
        ) {

          setStatus(
            "Please describe your project briefly.",
            "error"
          );

          document
            .getElementById("message")
            ?.focus();

          return;

        }


        // ========================================================
        // DISABLE FORM
        // ========================================================

        if (submitButton) {

          submitButton.disabled = true;

          submitButton.dataset.originalText =
            submitButton.textContent;

          submitButton.textContent =
            "Sending...";

        }


        setStatus(
          "Sending your request to SBS Engineering Consultancy...",
          "loading"
        );


        // ========================================================
        // SEND TO NODE.JS BACKEND
        // ========================================================

        try {

        

          const response =
            await fetch(
              `${SBS_API_BASE_URL}/api/contact`,
              {

                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                  name: name,

                  email: email,

                  phone: phone,

                  projectType: service,

                  location:
                    "Not provided",

                  message: message

                })

              }
            );


          // ======================================================
          // SAFELY READ SERVER RESPONSE
          // ======================================================

          const contentType =
            response.headers.get(
              "content-type"
            ) || "";


          let data = null;


          if (
            contentType.includes(
              "application/json"
            )
          ) {

            data =
              await response.json();

          } else {

            const text =
              await response.text();

            console.error(
              "SBS server returned non-JSON response:",
              text
            );

            throw new Error(
              `Server returned an unexpected response (${response.status}).`
            );

          }


          // ======================================================
          // CHECK SERVER ERROR
          // ======================================================

          if (
            !response.ok ||
            !data ||
            !data.success
          ) {

            throw new Error(
              data?.error ||
              "Unable to send your request."
            );

          }


          // ======================================================
          // SUCCESS
          // ======================================================

        


          setStatus(
            "Thank you. Your message has been sent successfully to SBS Engineering Consultancy. The team will contact you soon.",
            "success"
          );


          // ======================================================
          // CLEAR FORM
          // ======================================================

          form.reset();


        } catch (error) {

          console.error(
            "======================================"
          );

          console.error(
            "❌ SBS CONTACT FORM ERROR"
          );

          console.error(
            "======================================"
          );

          console.error(error);


          // ======================================================
          // USER MESSAGE
          // ======================================================

          setStatus(
            "We could not send your message right now. Please try again or contact SBS directly.",
            "error"
          );


        } finally {

          // ========================================================
          // RE-ENABLE FORM
          // ========================================================

          if (submitButton) {

            submitButton.disabled =
              false;

            submitButton.textContent =
              submitButton.dataset.originalText ||
              "Send Message";

          }

        }

      }
    );

  }


  // ============================================================
  // ESCAPE HTML
  // ============================================================

  function escapeHtml(value) {

    return String(value)

      .replaceAll(
        "&",
        "&amp;"
      )

      .replaceAll(
        "<",
        "&lt;"
      )

      .replaceAll(
        ">",
        "&gt;"
      )

      .replaceAll(
        '"',
        "&quot;"
      )

      .replaceAll(
        "'",
        "&#039;"
      );

  }

});



/* Force video first-frame preview across all browsers */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sidama-media-item video").forEach(video => {
    // If metadata is already loaded, seek immediately
    const seek = () => { try { video.currentTime = 0.1; } catch(e){} };

    if (video.readyState >= 1) seek();
    else video.addEventListener("loadedmetadata", seek, { once: true });

    // Fallback if the file failed to load
    video.addEventListener("error", () => {
      const fig = video.closest(".sidama-media-item");
      if (fig) {
        fig.classList.add("sidama-media-error");
        fig.insertAdjacentHTML("beforeend",
          '<span class="sidama-media-error-msg">Video unavailable</span>');
      }
    });
  });
});

// ============================================================
// DETERMINE SBS AI PAGE PATH
// ============================================================

function getAiPagePath() {

  const path =
    window.location.pathname;


  /*
   * If the current page is already
   * inside /pages/
   */

  if (
    path.includes("/pages/")
  ) {

    return "ai.html";

  }


  /*
   * If the current page is
   * index.html / root
   */

  return "pages/ai.html";

}