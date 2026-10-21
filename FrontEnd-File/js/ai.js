/* ==========================================
   SBS AI
   Production AI Interface
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("aiForm");
    const input = document.getElementById("aiInput");
    const messages = document.getElementById("aiMessages");
    const typing = document.getElementById("aiTyping");
    const sendButton = document.getElementById("aiSend");
    const clearButton = document.getElementById("clearChat");
    const suggestions = document.querySelectorAll(".ai-suggestion");

    if (!form || !input || !messages) {
        console.warn("SBS AI: Required elements not found.");
        return;
    }


    /* ==========================================
       API CONFIGURATION
       ========================================== */

    const API_BASE_URL =
    window.SBS_API_BASE_URL || ((location.hostname === "localhost" || location.hostname === "127.0.0.1") ? "http://localhost:3000" : location.origin);

const API_URL =
    `${API_BASE_URL}/api/chat`;


    /* ==========================================
       CONTACT PAGE
       ========================================== */

    function getContactPagePath() {

        const path = window.location.pathname;

        if (path.includes("/pages/")) {
            return "contact.html";
        }

        return "pages/contact.html";
    }


    /* ==========================================
       CONVERSATION MEMORY
       ========================================== */

    let conversationHistory = [];


    /* ==========================================
       ESCAPE HTML
       ========================================== */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* ==========================================
       DETECT PROJECT / CONTACT INTENT
       ========================================== */

    function detectContactIntent(text) {

        const message = String(text).toLowerCase();

        const intentWords = [

            "i need",
            "i want",
            "my project",
            "our project",
            "project",
            "build",
            "building",
            "construct",
            "construction",
            "design",
            "structural design",
            "architectural design",
            "road design",
            "survey",
            "gis",
            "consultant",
            "consultancy",
            "engineer",
            "engineering service",
            "quotation",
            "quote",
            "boq",
            "price",
            "pricing",
            "cost",
            "supervision",
            "project management",
            "contact sbs",
            "contact",
            "hire",
            "work with sbs"
        ];

        return intentWords.some(word =>
            message.includes(word)
        );

    }


    /* ==========================================
       ADD CONTACT CTA
       ========================================== */

    function addContactCTA() {

        /*
         * Prevent duplicate CTA buttons.
         */

        if (
            messages.querySelector(".sbs-ai-contact-card")
        ) {
            return;
        }


        const card =
            document.createElement("div");

        card.className =
            "sbs-ai-contact-card";


        card.innerHTML = `

            <div class="sbs-ai-contact-icon">
                ✦
            </div>

            <div class="sbs-ai-contact-content">

                <strong>
                    Ready to discuss your project?
                </strong>

                <p>
                    Send your project details directly
                    to SBS Engineering Consultancy.
                </p>

                <a
                    href="${getContactPagePath()}"
                    class="sbs-ai-contact-button"
                >
                    Contact SBS
                    <span>→</span>
                </a>

            </div>

        `;


        messages.appendChild(card);


        messages.scrollTo({

            top: messages.scrollHeight,

            behavior: "smooth"

        });

    }


    /* ==========================================
       ADD MESSAGE TO SCREEN
       ========================================== */

    function addMessage(type, text) {

        const message =
            document.createElement("div");

        message.className =
            `ai-message ${type}`;


        const content =
            document.createElement("div");

        content.className =
            "ai-message-content";


        const escapedText =
            escapeHtml(text);


        /*
         * Basic Markdown formatting.
         */

        const formatted =
            escapedText

                .replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                )

                .replace(
                    /\*(.*?)\*/g,
                    "<em>$1</em>"
                )

                .replace(
                    /\n\n/g,
                    "<br><br>"
                )

                .replace(
                    /\n/g,
                    "<br>"
                );


        content.innerHTML =
            formatted;


        message.appendChild(content);

        messages.appendChild(message);


        messages.scrollTo({

            top: messages.scrollHeight,

            behavior: "smooth"

        });

    }


    /* ==========================================
       SHOW ERROR
       ========================================== */

    function showError(errorMessage) {

        addMessage(
            "assistant",
            `I'm sorry, but I couldn't process your request right now.

Please try again in a moment.

If the problem continues, you can contact SBS Engineering Consultancy directly.`
        );

        console.error(
            "SBS AI:",
            errorMessage
        );

    }


    /* ==========================================
       SEND MESSAGE TO AI
       ========================================== */

    async function sendMessage(question) {

        const cleanQuestion =
            question.trim();


        if (!cleanQuestion) {
            return;
        }


        /* ======================================
           ADD USER MESSAGE
           ====================================== */

        addMessage(
            "user",
            cleanQuestion
        );


        /* ======================================
           SAVE USER MESSAGE
           ====================================== */

        conversationHistory.push({

            role: "user",

            content: cleanQuestion

        });


        input.value = "";

        input.style.height = "auto";


        sendButton.disabled = true;

        input.disabled = true;


        /* ======================================
           SHOW TYPING
           ====================================== */

        typing.classList.add("active");

        messages.appendChild(typing);


        messages.scrollTo({

            top: messages.scrollHeight,

            behavior: "smooth"

        });


        try {


            /* ==================================
               SEND REQUEST
               ================================== */

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        message:
                            cleanQuestion,

                        history:
                            conversationHistory

                    })

                });


            /* ==================================
               READ RESPONSE SAFELY
               ================================== */

            const rawResponse =
                await response.text();


            let data = {};

            try {

                data =
                    rawResponse
                        ? JSON.parse(rawResponse)
                        : {};

            } catch (jsonError) {

                throw new Error(
                    `Server returned an invalid response (${response.status}).`
                );

            }


            /* ==================================
               REMOVE TYPING
               ================================== */

            typing.classList.remove(
                "active"
            );


            /* ==================================
               CHECK ERROR
               ================================== */

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(

                    data.error ||
                    `Request failed with status ${response.status}`

                );

            }


            /* ==================================
               CHECK AI ANSWER
               ================================== */

            if (!data.answer) {

                throw new Error(
                    "The AI returned an empty response."
                );

            }




            /* ==================================
               SAVE AI RESPONSE
               ================================== */

            conversationHistory.push({

                role: "assistant",

                content:
                    data.answer

            });


            /* ==================================
               DISPLAY AI RESPONSE
               ================================== */

            addMessage(

                "assistant",

                data.answer

            );


            /* ==================================
               CONTACT SBS CTA
               ==================================

               Only show this when the
               visitor appears to have
               project/contact intent.
            */

            if (
                detectContactIntent(
                    cleanQuestion
                )
            ) {

                setTimeout(() => {

                    addContactCTA();

                }, 350);

            }


        } catch (error) {

            typing.classList.remove(
                "active"
            );


            /*
             * Remove failed user message
             * from conversation history.
             */

            if (
                conversationHistory.length > 0 &&
                conversationHistory[
                    conversationHistory.length - 1
                ].role === "user"
            ) {

                conversationHistory.pop();

            }


            console.error(
                "SBS AI request failed:",
                error
            );


            showError(
                error.message
            );


        } finally {

            sendButton.disabled =
                false;

            input.disabled =
                false;

            input.focus();

        }

    }


    /* ==========================================
       FORM SUBMISSION
       ========================================== */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            sendMessage(
                input.value
            );

        }
    );


    /* ==========================================
       SUGGESTED QUESTIONS
       ========================================== */

    suggestions.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const question =
                    button.dataset.question;


                if (!question) {
                    return;
                }


                sendMessage(
                    question
                );

            }
        );

    });


    /* ==========================================
       CLEAR CHAT
       ========================================== */

    clearButton?.addEventListener(
        "click",
        () => {

            conversationHistory = [];


            messages.innerHTML = `

                <div class="ai-message assistant">

                    <div class="ai-message-content">

                        <strong>
                            Conversation cleared.
                        </strong>

                        <br><br>

                        What would you like to explore
                        about SBS Engineering Consultancy
                        or engineering?

                    </div>

                </div>

            `;


            input.focus();



        }
    );


    /* ==========================================
       AUTO RESIZE TEXTAREA
       ========================================== */

    input.addEventListener(
        "input",
        () => {

            input.style.height =
                "auto";

            input.style.height =
                Math.min(
                    input.scrollHeight,
                    120
                ) + "px";

        }
    );


    /* ==========================================
       ENTER TO SEND
       SHIFT + ENTER = NEW LINE
       ========================================== */

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                form.requestSubmit();

            }

        }
    );


    /* ==========================================
       SBS AI READY
       ========================================== */

    

});
/* ==========================================
   INPUT RING — stop rotation when typing
   ========================================== */

const inputWrapper = document.querySelector(".ai-input-wrapper");

if (inputWrapper && input) {

    const updateRingState = () => {

        if (input.value.trim().length > 0) {
            inputWrapper.classList.add("has-value");
        } else {
            inputWrapper.classList.remove("has-value");
        }

    };

    input.addEventListener("input", updateRingState);
    input.addEventListener("focus", updateRingState);
    input.addEventListener("blur", updateRingState);

    updateRingState();

}