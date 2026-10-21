const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
const { GoogleGenAI } = require("@google/genai");

const SBS_KNOWLEDGE = require("./sbs-knowledge");

const app = express();

const PORT = Number(process.env.PORT) || 3000;


// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
    process.env.GEMINI_MODEL || "gemini-3.6-flash";

const SBS_EMAIL =
    process.env.SBS_EMAIL ||
    "sbsengineeringconsultancy@gmail.com";

const RESEND_API_KEY =
    process.env.RESEND_API_KEY;

const FRONTEND_ORIGIN =
    process.env.FRONTEND_ORIGIN || "";


// ============================================================
// ENVIRONMENT CHECK
// ============================================================

if (!GEMINI_API_KEY) {

    console.warn(
        "⚠️ GEMINI_API_KEY is missing. AI chat will remain unavailable until configured."
    );

}

if (!RESEND_API_KEY) {

    console.warn(
        "⚠️ RESEND_API_KEY is missing. Contact email will remain unavailable until configured."
    );

}


// ============================================================
// GEMINI AI
// ============================================================

const ai = GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: GEMINI_API_KEY
    })
    : null;


// ============================================================
// RESEND EMAIL
// ============================================================

const resend = RESEND_API_KEY
    ? new Resend(RESEND_API_KEY)
    : null;


// ============================================================
// CORS
// ============================================================

const allowedOrigins = FRONTEND_ORIGIN
    ? FRONTEND_ORIGIN
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : null;

app.use(
    cors({
        origin: allowedOrigins || true,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
    express.json({
        limit: "1mb"
    })
);


// ============================================================
// KNOWLEDGE BASE
// ============================================================

const SBS_KNOWLEDGE_TEXT =
    JSON.stringify(
        SBS_KNOWLEDGE,
        null,
        2
    );


// ============================================================
// SBS AI SYSTEM INSTRUCTION
// ============================================================

const SBS_SYSTEM_INSTRUCTION = `

You are SBS AI, the official website assistant for
SBS Engineering Consultancy PLC in Ethiopia.


==================================================
SOURCE OF TRUTH
==================================================

For questions about SBS Engineering Consultancy,
use the SBS knowledge base below as the primary source.

Do NOT invent:

- Company facts
- Employees
- Clients
- Projects
- Awards
- Certifications
- Licenses
- Contracts
- Prices
- Dates
- Project outcomes
- Capabilities

If a fact is not contained in the knowledge base,
say that the information is not currently available.

Never pretend that unknown information is known.

Never invent an SBS website URL.

If asked for the website, explain that the visitor
is currently using the SBS website.


==================================================
COMPANY IDENTITY
==================================================

Legal name:

SBS Engineering Consultancy PLC

Established:

2025

Location:

Addis Ababa, Ethiopia

Core sectors:

- Roads
- Bridges
- Topographic Survey
- Urban Infrastructure

Registration:

Grade IV – Road and Drilling Consultant


==================================================
SERVICES
==================================================

Use ONLY the services contained in the knowledge base.

The main services are:

1. Transportation Planning & Feasibility
2. Topographic Survey & Geometric Design
3. Geotechnical & Pavement Engineering
4. Hydrology, Hydraulics & Structures
5. Architectural & Engineering Design
6. Supervision & Contract Administration
7. Environmental & Social Assessment
8. Tender Documents & Cost Estimation
9. Materials Investigation & Testing

Do not invent additional SBS services.


==================================================
PROJECTS
==================================================

The projects listed in the knowledge base come from
the provided SBS company profile.

Do not call them fictional or demonstration projects.

Do not invent additional projects.

If asked how many projects are listed in the profile,
the answer is 11.

If asked about a specific project, only provide information
contained in the knowledge base.


==================================================
ENGINEERING SAFETY
==================================================

You may explain engineering concepts for educational purposes.

However, never present AI output as:

- Final engineering design
- Structural approval
- Construction approval
- Safety certification
- Legal approval
- Site-specific professional engineering judgment

For safety-critical or site-specific decisions,
recommend assessment by a qualified engineer.

Never claim that a building, road, bridge or structure
is safe without appropriate professional assessment.


==================================================
PROJECT / SALES INTENT
==================================================

Watch for genuine project signals such as:

- I need an engineer
- I need a design
- I need structural design
- I need road design
- I need surveying
- I need construction supervision
- I need contract administration
- I need a quotation
- I have a building project
- I want to construct
- I need a consultant

When genuine project intent appears:

1. Answer the user's immediate question.
2. Identify the relevant SBS service.
3. Ask ONE useful qualification question.
4. Guide the visitor toward SBS consultation when appropriate.


==================================================
PROJECT QUALIFICATION
==================================================

Useful information can include:

- Project type
- Project location
- Project size
- Number of floors
- Current project stage
- Required service
- Deadline
- Existing drawings
- Site conditions

Do NOT ask for everything at once.

Ask ONE useful question at a time.


==================================================
PRICING
==================================================

Never invent SBS pricing.

Explain that professional fees may depend on:

- Project type
- Project size
- Complexity
- Location
- Required services
- Project stage
- Scope of work

For quotation requests,
guide the visitor toward contacting SBS.


==================================================
CONVERSATION CONTINUITY
==================================================

Always use previous conversation history.

If the visitor says:

"Tell me more."

"Continue."

"Explain more."

"Why?"

"How?"

"What about columns?"

"Give me an example."

Understand the request from the previous conversation.

Do NOT ask the visitor to repeat the topic
when the topic is already clear.


==================================================
GENERAL ENGINEERING QUESTIONS
==================================================

For educational engineering questions:

Answer directly.

Explain concepts clearly.

Use examples when useful.

For serious design or safety decisions,
recommend professional assessment.


==================================================
COMMUNICATION STYLE
==================================================

Be:

- Professional
- Clear
- Helpful
- Natural
- Concise
- Engineering-oriented
- Business-aware

Do not sound robotic.

Do not repeatedly introduce yourself as SBS AI.

Do not use excessive emojis.


==================================================
RESPONSE LENGTH
==================================================

Simple question:

80–150 words.

Normal engineering question:

150–250 words.

Project question:

150–250 words.

Complex question:

Up to 350 words when necessary.


==================================================
RESPONSE STRUCTURE
==================================================

Most responses should contain:

1. Direct answer
2. Useful explanation
3. ONE appropriate next step

Do not end with multiple questions.


==================================================
FINAL BEHAVIOR
==================================================

End naturally with ONE of:

A. Educational follow-up question

OR

B. Project qualification question

OR

C. SBS consultation direction.


==================================================
SBS KNOWLEDGE BASE
==================================================

${SBS_KNOWLEDGE_TEXT}

==================================================
END KNOWLEDGE BASE
==================================================

`;


// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        aiConfigured: Boolean(ai),

        emailConfigured: Boolean(resend),

        service: "SBS AI",

        status: "online",

        model: GEMINI_MODEL,

        emailProvider: "Resend"

    });

});


// ============================================================
// CONTACT / PROJECT LEAD
// ============================================================

app.post("/api/contact", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            projectType,
            location,
            message
        } = req.body || {};


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (!name || !email || !message) {

            return res.status(400).json({

                success: false,

                error:
                    "Name, email and message are required."

            });

        }


        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string"
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Invalid contact information."

            });

        }


        if (
            name.length > 100 ||
            email.length > 200 ||
            message.length > 5000
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "One or more fields are too long."

            });

        }


        // ----------------------------------------------------
        // BASIC EMAIL VALIDATION
        // ----------------------------------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {

            return res.status(400).json({

                success: false,

                error:
                    "Please provide a valid email address."

            });

        }


        // ----------------------------------------------------
        // RESEND CHECK
        // ----------------------------------------------------

        if (!resend) {

            return res.status(503).json({

                success: false,

                error:
                    "Contact email is not configured yet. Please configure RESEND_API_KEY on the server."

            });

        }


        // ----------------------------------------------------
        // EMAIL SUBJECT
        // ----------------------------------------------------

        const emailSubject =
            `New SBS Website Project Lead - ${name.trim()}`;


        // ----------------------------------------------------
        // EMAIL CONTENT
        // ----------------------------------------------------

        const emailText = `

NEW SBS WEBSITE PROJECT LEAD

==============================

Name:
${name.trim()}

Email:
${email.trim()}

Phone:
${phone || "Not provided"}

Project Type:
${projectType || "Not provided"}

Location:
${location || "Not provided"}

Message:

${message.trim()}

==============================

Source:
SBS Engineering Consultancy Website

        `.trim();


        // ----------------------------------------------------
        // SEND EMAIL THROUGH RESEND
        // ----------------------------------------------------

        const { data, error } =
            await resend.emails.send({

                from:
                    "SBS Engineering Consultancy <onboarding@resend.dev>",

                to: [
                    SBS_EMAIL
                ],

                replyTo:
                    email.trim(),

                subject:
                    emailSubject,

                text:
                    emailText

            });


        // ----------------------------------------------------
        // RESEND ERROR
        // ----------------------------------------------------

        if (error) {

            console.error(
                "❌ Resend email error:",
                error.message || error
            );

            return res.status(500).json({

                success: false,

                error:
                    "We could not send your project information right now. Please try again."

            });

        }


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------


        return res.json({

            success: true,

            message:
                "Your project information has been sent to SBS Engineering Consultancy."

        });


    } catch (error) {

        console.error(
            "❌ Contact email error:",
            error?.message || error
        );


        return res.status(500).json({

            success: false,

            error:
                "We could not send your project information right now. Please try again."

        });

    }

});


// ============================================================
// AI CHAT
// ============================================================

app.post("/api/chat", async (req, res) => {

    try {

        const {
            message,
            history
        } = req.body || {};


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Please provide a valid message."

            });

        }


        const cleanMessage =
            message.trim();


        if (cleanMessage.length > 4000) {

            return res.status(400).json({

                success: false,

                error:
                    "Message is too long."

            });

        }


        // ----------------------------------------------------
        // GEMINI CONFIGURATION CHECK
        // ----------------------------------------------------

        if (!ai) {

            return res.status(503).json({

                success: false,

                error:
                    "SBS AI is not configured yet. Please configure GEMINI_API_KEY on the server."

            });

        }


        // ----------------------------------------------------
        // BUILD CONVERSATION HISTORY
        // ----------------------------------------------------

        const contents = [];


        if (Array.isArray(history)) {

            for (const item of history) {

                if (
                    !item ||
                    typeof item.content !== "string" ||
                    !item.content.trim()
                ) {

                    continue;

                }


                const role =
                    item.role === "assistant" ||
                    item.role === "model"
                        ? "model"
                        : "user";


                contents.push({

                    role,

                    parts: [

                        {
                            text:
                                item.content
                                    .trim()
                                    .slice(0, 4000)
                        }

                    ]

                });

            }

        }


        // ----------------------------------------------------
        // REMOVE INVALID LEADING MODEL MESSAGE
        // ----------------------------------------------------

        while (
            contents.length > 0 &&
            contents[0].role === "model"
        ) {

            contents.shift();

        }


        // ----------------------------------------------------
        // NORMALIZE CONSECUTIVE ROLES
        // ----------------------------------------------------

        const normalizedContents = [];

        for (const item of contents) {

            const previous =
                normalizedContents[
                    normalizedContents.length - 1
                ];

            if (
                previous &&
                previous.role === item.role
            ) {

                previous.parts[0].text +=
                    "\n\n" +
                    item.parts[0].text;

            } else {

                normalizedContents.push({

                    role: item.role,

                    parts: [

                        {
                            text:
                                item.parts[0].text
                        }

                    ]

                });

            }

        }


        // ----------------------------------------------------
        // ADD CURRENT MESSAGE
        // ----------------------------------------------------

        const last =
            normalizedContents[
                normalizedContents.length - 1
            ];


        const lastText =
            last?.parts?.[0]?.text || "";


        if (
            !last ||
            last.role !== "user" ||
            lastText !== cleanMessage
        ) {

            if (
                last &&
                last.role === "user"
            ) {

                last.parts[0].text +=
                    "\n\n" +
                    cleanMessage;

            } else {

                normalizedContents.push({

                    role: "user",

                    parts: [

                        {
                            text:
                                cleanMessage
                        }

                    ]

                });

            }

        }


        // ----------------------------------------------------
        // LIMIT HISTORY
        // ----------------------------------------------------

        const limitedContents =
            normalizedContents.slice(-20);


        // ----------------------------------------------------
        // FINAL SAFETY CHECK
        // ----------------------------------------------------

        if (
            limitedContents.length === 0 ||
            limitedContents[limitedContents.length - 1].role !== "user"
        ) {

            limitedContents.push({

                role: "user",

                parts: [

                    {
                        text:
                            cleanMessage
                    }

                ]

            });

        }


        // ----------------------------------------------------
        // GEMINI REQUEST
        // ----------------------------------------------------

        const response =
            await ai.models.generateContent({

                model:
                    GEMINI_MODEL,

                contents:
                    limitedContents,

                config: {

                    systemInstruction:
                        SBS_SYSTEM_INSTRUCTION,

                    temperature:
                        0.4,

                    maxOutputTokens:
                        1500

                }

            });


        // ----------------------------------------------------
        // EXTRACT ANSWER
        // ----------------------------------------------------

        const answer =
            typeof response.text === "string"
                ? response.text.trim()
                : "";


        if (!answer) {

            throw new Error(
                "Gemini returned an empty response."
            );

        }


        // ----------------------------------------------------
        // SUCCESS LOG
        // ----------------------------------------------------


        return res.json({

            success: true,

            answer

        });


    } catch (error) {

        // ----------------------------------------------------
        // DETAILED SERVER-SIDE ERROR
        // ----------------------------------------------------

        console.error(
            "❌ SBS AI error:",
            error?.message || error
        );

        if (error?.status) {

            console.error(
                "Gemini status:",
                error.status
            );

        }

        if (error?.code) {

            console.error(
                "Gemini code:",
                error.code
            );

        }


        return res.status(500).json({

            success: false,

            error:
                "SBS AI could not process your request right now. Please try again."

        });

    }

});


// ============================================================
// STATIC FRONTEND
// ============================================================

const FRONTEND_PATH =
    path.join(
        __dirname,
        "SBS-Engineering-Website-FINAL-POLISHED-Copy"
    );


app.use(
    express.static(FRONTEND_PATH)
);


// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {

   

});