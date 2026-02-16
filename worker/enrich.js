/**
 * enrich.js — Tech Savvy Hawaii AI Worker (Multi-Route)
 * Cloudflare Workers AI powered endpoints for lead enrichment,
 * sales tools, content generation, training, and operations.
 *
 * Routes:
 *   POST /enrich    — Extract structured lead data from raw text
 *   POST /pitch     — Generate tailored 30-second pitch script
 *   POST /objection — Generate rebuttal for merchant objections
 *   POST /score     — Score a lead 1-100 for outreach priority
 *   POST /email     — Generate personalized follow-up email
 *   POST /sms       — Generate short follow-up text message
 *   POST /summarize  — Summarize long content with key numbers
 *   POST /quiz      — Generate training quiz from content
 *   POST /roleplay  — Simulate merchant conversation scenario
 *   POST /classify  — Classify inbound message by intent
 *   POST /extract-statement — Parse merchant processing statements
 *
 * Deploy: cd worker && npx wrangler deploy
 */

const MODEL = "@cf/meta/llama-3.1-8b-instruct";

const ALLOWED_ORIGINS = [
  "https://techsavvyhawaii.com",
  "https://www.techsavvyhawaii.com",
  "https://tech-savvy-hawaii.replit.app",
  "http://localhost:5000",
  "http://localhost:3000",
];

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    // GET / — health check (no auth required)
    if (request.method === "GET" && path === "/") {
      return jsonResponse({
        service: "Tech Savvy Hawaii AI Worker",
        status: "online",
        model: MODEL,
        routes: [
          "POST /enrich",
          "POST /pitch",
          "POST /objection",
          "POST /score",
          "POST /email",
          "POST /sms",
          "POST /summarize",
          "POST /quiz",
          "POST /roleplay",
          "POST /classify",
          "POST /extract-statement",
          "POST /chat",
        ],
      }, 200, allowedOrigin);
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "POST required" }, 405, allowedOrigin);
    }

    // Auth: require shared secret on all POST routes
    const workerKey = env.WORKER_KEY || "";
    const providedKey = request.headers.get("X-Worker-Key") || "";
    if (workerKey && providedKey !== workerKey) {
      return jsonResponse({ error: "Unauthorized" }, 401, allowedOrigin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, allowedOrigin);
    }

    const handlers = {
      "/enrich": handleEnrich,
      "/pitch": handlePitch,
      "/objection": handleObjection,
      "/score": handleScore,
      "/email": handleEmail,
      "/sms": handleSms,
      "/summarize": handleSummarize,
      "/quiz": handleQuiz,
      "/roleplay": handleRoleplay,
      "/classify": handleClassify,
      "/extract-statement": handleExtractStatement,
      "/chat": handleChat,
    };

    // Legacy: POST to / still runs enrich for backward compat
    const handler = handlers[path] || (path === "/" ? handleEnrich : null);

    if (!handler) {
      return jsonResponse({ error: `Unknown route: ${path}` }, 404, allowedOrigin);
    }

    try {
      const response = await handler(body, env);
      // Inject correct CORS origin at router level
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      return response;
    } catch (err) {
      return jsonResponse({ error: "Internal processing error" }, 500, allowedOrigin);
    }
  },
};

// ---------------------------------------------------------------------------
// /enrich — Extract structured lead data from raw text
// ---------------------------------------------------------------------------

async function handleEnrich(body, env) {
  const { text } = body;
  if (!text || text.length < 5) {
    return jsonResponse({ error: "Missing or too short 'text' field" }, 400);
  }

  const prompt = `You are a lead extraction assistant for a merchant services company (Tech Savvy Hawaii).
Given raw text scraped from a business website or typed as field notes, extract the following fields.
Return ONLY valid JSON — no markdown, no explanation, no backticks.

Fields to extract:
- phone: business phone number (string, empty if not found)
- email: business email address (string, empty if not found)
- address: full street address (string, empty if not found)
- vertical: business type — one of: restaurant, retail, salon, auto_repair, food_truck, bar, hotel, medical, fitness, other
- ownerName: owner or manager name if mentioned (string, empty if not found)
- businessName: business name (string, empty if not found)
- notes: 1-2 sentence summary of what the business does (string)`;

  const raw = await runAI(env, prompt, text.slice(0, 4000));
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({
      error: "Failed to parse AI response",
      raw: raw.slice(0, 500),
      phone: "", email: "", address: "", vertical: "other",
      ownerName: "", businessName: "", notes: "",
    });
  }

  return jsonResponse({
    phone: s(parsed.phone),
    email: s(parsed.email).toLowerCase(),
    address: s(parsed.address),
    vertical: validateVertical(parsed.vertical),
    ownerName: s(parsed.ownerName),
    businessName: s(parsed.businessName),
    notes: s(parsed.notes),
  });
}

// ---------------------------------------------------------------------------
// /pitch — Generate tailored 30-second pitch script
// ---------------------------------------------------------------------------

async function handlePitch(body, env) {
  const { vertical, painPoints, businessName, ownerName } = body;
  if (!vertical) {
    return jsonResponse({ error: "Missing 'vertical' field" }, 400);
  }

  const prompt = `You are a sales coach for Tech Savvy Hawaii, a merchant services company in Hawaii.
Generate a natural, confident 30-second pitch script for a merchant services consultant walking into a business.

Rules:
- Speak like a real person, not a corporate robot
- Lead with value, not features
- Reference their specific industry pain points
- Keep it under 100 words
- Include a soft ask at the end (review their current setup, not a hard close)
- Return ONLY valid JSON with these fields:
  - opening: the first line to break the ice (string)
  - pitch: the main value proposition (string)
  - ask: the closing question/soft ask (string)
  - tips: array of 2-3 delivery tips (string array)`;

  const context = `Business type: ${vertical}
${businessName ? `Business name: ${businessName}` : ""}
${ownerName ? `Owner/contact: ${ownerName}` : ""}
${painPoints ? `Known pain points: ${painPoints}` : ""}`;

  const raw = await runAI(env, prompt, context);
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /objection — Generate rebuttal for merchant objections
// ---------------------------------------------------------------------------

async function handleObjection(body, env) {
  const { objection, vertical, context } = body;
  if (!objection) {
    return jsonResponse({ error: "Missing 'objection' field" }, 400);
  }

  const prompt = `You are a sales trainer for Tech Savvy Hawaii, a merchant services company.
A merchant has raised an objection. Generate a professional, empathetic rebuttal.

Use the Acknowledge-Clarify-Resolve framework:
1. Acknowledge their concern (show you heard them)
2. Clarify the real issue behind the objection
3. Resolve with a specific, practical response

Rules:
- Be respectful, never dismissive
- Use concrete numbers or examples when possible
- Keep each section 1-3 sentences
- Return ONLY valid JSON:
  - acknowledge: empathy statement (string)
  - clarify: clarifying question or reframe (string)
  - resolve: the rebuttal with proof/example (string)
  - followUp: a question to re-engage them (string)
  - category: objection type — one of: price, timing, loyalty, trust, indifference (string)`;

  const input = `Objection: "${objection}"
${vertical ? `Business type: ${vertical}` : ""}
${context ? `Additional context: ${context}` : ""}`;

  const raw = await runAI(env, prompt, input);
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /score — Score a lead 1-100 for outreach priority
// ---------------------------------------------------------------------------

async function handleScore(body, env) {
  const { vertical, monthlyVolume, currentProcessor, painPoints, notes } = body;

  const prompt = `You are a lead scoring engine for Tech Savvy Hawaii, a merchant services company.
Score this lead from 1-100 based on conversion likelihood and potential revenue.

Scoring factors (weight):
- Vertical fit (20%): restaurants, bars, auto repair, salons score highest
- Monthly volume (25%): higher volume = higher score
- Current processor (20%): Square/Stripe/Toast users are easier to convert than legacy processors
- Pain points (25%): more pain = more urgency to switch
- Completeness of info (10%): more data = easier to close

Return ONLY valid JSON:
- score: number 1-100
- grade: A (80-100), B (60-79), C (40-59), D (20-39), F (1-19)
- factors: object with each factor name and its individual score (0-100)
- recommendation: one of "hot_lead", "warm_lead", "nurture", "low_priority"
- reasoning: 1-2 sentence explanation`;

  const input = `Vertical: ${vertical || "unknown"}
Monthly volume: ${monthlyVolume || "unknown"}
Current processor: ${currentProcessor || "unknown"}
Pain points: ${painPoints || "none specified"}
Notes: ${notes || "none"}`;

  const raw = await runAI(env, prompt, input);
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /email — Generate personalized follow-up email
// ---------------------------------------------------------------------------

async function handleEmail(body, env) {
  const { ownerName, businessName, vertical, context, tone } = body;
  if (!businessName) {
    return jsonResponse({ error: "Missing 'businessName' field" }, 400);
  }

  const prompt = `You are a sales copywriter for Tech Savvy Hawaii, a merchant services company in Hawaii.
Write a personalized follow-up email to a merchant you recently visited or spoke with.

Rules:
- Keep it under 150 words
- Warm, professional tone (not corporate or salesy)
- Reference something specific about their business
- Include one clear call-to-action
- Sign off as the agent (use "your Tech Savvy Hawaii rep" if no name given)
- Return ONLY valid JSON:
  - subject: email subject line (string)
  - body: the full email text (string)
  - callToAction: what you want them to do (string)`;

  const input = `Recipient: ${ownerName || "Business Owner"}
Business: ${businessName}
Industry: ${vertical || "local business"}
Context: ${context || "Initial visit follow-up"}
Tone: ${tone || "friendly and professional"}`;

  const raw = await runAI(env, prompt, input);
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /sms — Generate short follow-up text message
// ---------------------------------------------------------------------------

async function handleSms(body, env) {
  const { ownerName, businessName, context, tone } = body;
  if (!businessName) {
    return jsonResponse({ error: "Missing 'businessName' field" }, 400);
  }

  const prompt = `You are a sales rep for Tech Savvy Hawaii, a merchant services company.
Write a brief, friendly follow-up text message to a merchant.

Rules:
- MAX 160 characters (SMS limit)
- Casual but professional
- Include one clear next step
- No emojis unless tone is "casual"
- Return ONLY valid JSON:
  - message: the SMS text (string, max 160 chars)
  - charCount: character count (number)`;

  const input = `To: ${ownerName || "there"}
Business: ${businessName}
Context: ${context || "follow-up after visit"}
Tone: ${tone || "friendly"}`;

  const raw = await runAI(env, prompt, input);
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /summarize — Summarize long content with key numbers
// ---------------------------------------------------------------------------

async function handleSummarize(body, env) {
  const { text, focus } = body;
  if (!text || text.length < 20) {
    return jsonResponse({ error: "Missing or too short 'text' field" }, 400);
  }

  const prompt = `You are a business analyst for Tech Savvy Hawaii, a merchant services company.
Summarize the following content concisely, pulling out key numbers, facts, and actionable insights.

Rules:
- Keep summary under 200 words
- Highlight dollar amounts, percentages, dates, and names
- Note anything relevant to merchant services or payment processing
- Return ONLY valid JSON:
  - summary: concise summary (string)
  - keyNumbers: array of important numbers/stats found (string array)
  - keyNames: array of people/business names found (string array)
  - actionItems: array of potential next steps or opportunities (string array)
  ${focus ? `- Focus especially on: ${focus}` : ""}`;

  const raw = await runAI(env, prompt, text.slice(0, 4000));
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /quiz — Generate training quiz from content
// ---------------------------------------------------------------------------

async function handleQuiz(body, env) {
  const { content, topic, difficulty } = body;
  if (!content && !topic) {
    return jsonResponse({ error: "Need 'content' or 'topic' field" }, 400);
  }

  const prompt = `You are a training quiz generator for CashSwipe Classroom, the training platform for Tech Savvy Hawaii merchant services agents.

Generate a 5-question multiple-choice quiz to test knowledge.

Rules:
- Each question has 4 options (A, B, C, D)
- One correct answer per question
- Mix difficulty: 2 easy, 2 medium, 1 hard
- Questions should be practical and scenario-based when possible
- Return ONLY valid JSON:
  - title: quiz title (string)
  - questions: array of 5 objects, each with:
    - question: the question text (string)
    - options: object with keys A, B, C, D and string values
    - correct: the correct letter (string)
    - explanation: why that answer is correct (string)`;

  const input = content
    ? `Generate quiz based on this content:\n${content.slice(0, 3000)}`
    : `Generate quiz on topic: ${topic}\nDifficulty: ${difficulty || "mixed"}`;

  const raw = await runAI(env, prompt, input, 1024);
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /roleplay — Simulate merchant conversation scenario
// ---------------------------------------------------------------------------

async function handleRoleplay(body, env) {
  const { scenario, vertical, agentMessage } = body;
  if (!scenario && !agentMessage) {
    return jsonResponse({ error: "Need 'scenario' or 'agentMessage'" }, 400);
  }

  const prompt = `You are a roleplay simulator for training merchant services sales agents at Tech Savvy Hawaii.
You play the role of a business owner who is being approached by a payment processing sales rep.

Character rules:
- Stay in character as the business owner at all times
- Be realistic — not immediately hostile but not a pushover
- Show real concerns business owners have (fees, contracts, switching hassle)
- React naturally to what the agent says
- If the agent does well, gradually warm up
- If the agent is pushy or uses jargon, push back

Return ONLY valid JSON:
- merchantResponse: what the business owner says (string)
- mood: current merchant mood — one of: skeptical, curious, annoyed, interested, ready_to_talk, walking_away (string)
- innerThought: what the merchant is really thinking (string, for training feedback)
- coachTip: advice for the agent on how to handle this moment (string)`;

  const input = scenario
    ? `Scenario setup: ${scenario}\nMerchant industry: ${vertical || "general retail"}\n${agentMessage ? `Agent says: "${agentMessage}"` : "Agent just walked in."}`
    : `Agent says: "${agentMessage}"\nMerchant industry: ${vertical || "general retail"}`;

  const raw = await runAI(env, prompt, input);
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /classify — Classify inbound message by intent
// ---------------------------------------------------------------------------

async function handleClassify(body, env) {
  const { message, source } = body;
  if (!message) {
    return jsonResponse({ error: "Missing 'message' field" }, 400);
  }

  const prompt = `You are an intake classifier for Tech Savvy Hawaii, a merchant services company.
Classify this inbound message by intent and priority.

Return ONLY valid JSON:
- intent: one of: new_lead, support_request, partnership_inquiry, billing_question, cancellation, complaint, spam, general_inquiry (string)
- priority: one of: urgent, high, normal, low (string)
- summary: 1-sentence summary of what they need (string)
- suggestedAction: what to do next (string)
- sentiment: one of: positive, neutral, negative, angry (string)`;

  const input = `Message: "${message.slice(0, 2000)}"
${source ? `Source: ${source}` : ""}`;

  const raw = await runAI(env, prompt, input);
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /extract-statement — Parse merchant processing statements
// ---------------------------------------------------------------------------

async function handleExtractStatement(body, env) {
  const { text } = body;
  if (!text || text.length < 20) {
    return jsonResponse({ error: "Missing or too short 'text' field" }, 400);
  }

  const prompt = `You are a merchant statement analyst for Tech Savvy Hawaii, a merchant services company.
Parse this merchant processing statement text and extract key financial data.

Extract these fields (use 0 or empty string if not found):
- processorName: who processes their cards (string)
- monthlyVolume: total monthly processing volume in dollars (number)
- totalFees: total monthly fees charged (number)
- effectiveRate: total fees / total volume as percentage (number, e.g. 3.2)
- transactionCount: number of transactions (number)
- averageTicket: average transaction size (number)
- interchangeFees: interchange/wholesale fees (number)
- processorMarkup: processor's markup fees (number)
- monthlyFees: fixed monthly fees like statement fee, PCI fee, etc. (number)
- cardBreakdown: object with visa, mastercard, amex, discover volumes if found
- contractEndDate: end date of current contract if mentioned (string)
- earlyTerminationFee: ETF amount if mentioned (number)
- potentialSavings: estimated monthly savings if switched to cash discount (number, estimate as totalFees * 0.7)
- annualSavings: potentialSavings * 12 (number)
- notes: any other important observations (string)

Return ONLY valid JSON.`;

  const raw = await runAI(env, prompt, text.slice(0, 4000), 1024);
  const parsed = parseJSON(raw);

  if (!parsed) {
    return jsonResponse({ error: "Failed to parse", raw: raw.slice(0, 500) });
  }

  return jsonResponse(parsed);
}

// ---------------------------------------------------------------------------
// /chat — Public website chat (free via Workers AI)
// ---------------------------------------------------------------------------

async function handleChat(body, env) {
  const { message, systemPrompt } = body;
  if (!message || typeof message !== "string" || message.length > 2000) {
    return jsonResponse({ error: "Message required (max 2000 chars)" }, 400);
  }

  const defaultSystem = `You are a helpful assistant for TechSavvy Hawaii, a zero-fee payment processing company.
TechSavvy offers: zero processing fees (customers pay a small surcharge), one-time $399 terminal cost,
no monthly fees, no contracts, and a free custom website for all processing customers.
Be friendly, concise, and professional. Keep answers under 150 words.
If asked about specific pricing or contracts, direct them to call (808) 767-5460.`;

  const raw = await runAI(env, systemPrompt || defaultSystem, message, 512);
  return jsonResponse({ reply: raw });
}

// ---------------------------------------------------------------------------
// AI Runner
// ---------------------------------------------------------------------------

async function runAI(env, systemPrompt, userMessage, maxTokens = 512) {
  const response = await env.AI.run(MODEL, {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: maxTokens,
    temperature: 0.1,
  });
  return response.response || "";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseJSON(raw) {
  if (!raw || typeof raw !== "string") return null;
  const cleaned = raw.trim();
  // Attempt 1: direct parse
  try { return JSON.parse(cleaned); } catch {}
  // Attempt 2: extract JSON object from surrounding text
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) {
    try { return JSON.parse(m[0]); } catch {}
    // Attempt 3: fix common LLM JSON issues (trailing commas, single quotes)
    try {
      const fixed = m[0]
        .replace(/,\s*([}\]])/g, "$1")       // trailing commas
        .replace(/'/g, '"')                    // single quotes
        .replace(/(\w+)\s*:/g, '"$1":')        // unquoted keys
        .replace(/""+/g, '"');                  // double-double quotes
      return JSON.parse(fixed);
    } catch {}
  }
  return null;
}

function s(val) {
  if (!val || typeof val !== "string") return "";
  return val.trim().replace(/\n/g, " ");
}

const VALID_VERTICALS = [
  "restaurant", "retail", "salon", "auto_repair", "food_truck",
  "bar", "hotel", "medical", "fitness", "other",
];

function validateVertical(v) {
  if (!v) return "other";
  const lower = v.toLowerCase().replace(/[\s-]/g, "_");
  return VALID_VERTICALS.includes(lower) ? lower : "other";
}

function corsHeaders(origin = "https://techsavvyhawaii.com") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Worker-Key",
  };
}

function jsonResponse(data, status = 200, origin = "https://techsavvyhawaii.com") {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}
