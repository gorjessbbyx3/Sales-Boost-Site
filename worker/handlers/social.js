/**
 * Social media calendar handlers — Instagram & Facebook
 *
 * Routes:
 *   POST /social-ideas         — Generate a month's worth of post ideas
 *   POST /social-visual-prompt — Generate detailed image-gen prompt for one post
 *   POST /social-caption       — Refine/expand a caption with hashtags + CTA
 */
import { runAI, parseJSON, jsonResponse } from "../helpers.js";

const BRAND_CONTEXT = `
TechSavvy Hawaii is a local Honolulu business that offers:
- Zero-fee credit card processing for small businesses (Hawaii merchants pay $0 in card fees through dual pricing/cash discount)
- Free websites for merchants who switch
- Premium web design packages
- Custom software & POS integrations

Target audience: small business owners in Honolulu — restaurants, retail shops,
coffee shops, salons, food trucks, and service businesses on Oahu.

Brand voice: friendly, local, helpful, "small business champion".
Mix Aloha/Hawaii vibe with practical money-saving messaging.
Avoid corporate finance jargon.
`;

export async function handleSocialIdeas(body, env) {
  const { month, count = 8, startDate, themes } = body;
  if (!startDate) {
    return jsonResponse({ error: "Missing startDate (YYYY-MM-DD)" }, 400);
  }

  const prompt = `You are a social media content strategist for Tech Savvy Hawaii.

${BRAND_CONTEXT}

Generate ${count} fresh, scroll-stopping post ideas for ${month || "the upcoming month"} that mix:
- Educational tips (how merchants save on fees)
- Local Hawaii spotlights (featured customers, Oahu small biz love)
- Behind-the-scenes (team, install days, customer wins)
- Promotional (free website offer, zero-fee processing)
- Community/holiday (Hawaii holidays, May Day, Aloha Friday, etc.)

Spread the ${count} posts across the month starting ${startDate}, distributing dates 3-5 days apart.

For each post return:
- platform: "instagram" | "facebook" | "both"
- scheduledDate: YYYY-MM-DD (within the month)
- scheduledTime: HH:MM (best posting times: 09:00, 12:00, 17:00, 19:00)
- title: short hook headline (under 60 chars)
- contentIdea: one-sentence brief explaining the concept
- caption: full ready-to-post copy (3-6 sentences, Hawaii voice, with line breaks)
- hashtags: space-separated relevant hashtags including #TechSavvyHawaii
- callToAction: specific CTA (DM, link in bio, visit, etc.)
- visualPrompt: detailed image generation prompt (describe scene, style, mood, colors, composition for Midjourney/DALL-E)

${themes ? `Lean into these themes: ${themes}` : ""}

Return ONLY valid JSON: { "ideas": [ ... ${count} objects ... ] }`;

  const raw = await runAI(env, prompt, `Plan ${count} posts starting ${startDate}.`, 4096);
  const parsed = parseJSON(raw);

  if (!parsed?.ideas?.length) {
    return jsonResponse({ error: "Failed to parse ideas", raw: raw.slice(0, 500) }, 500);
  }

  return jsonResponse({ ideas: parsed.ideas });
}

export async function handleSocialVisualPrompt(body, env) {
  const { title, contentIdea, caption, platform } = body;
  if (!title && !contentIdea && !caption) {
    return jsonResponse({ error: "Need title, contentIdea, or caption" }, 400);
  }

  const aspect = platform === "instagram" ? "square (1:1) or vertical (4:5)" : "landscape (1.91:1) or square";

  const prompt = `You are an art director for Tech Savvy Hawaii's social media.

${BRAND_CONTEXT}

Generate ONE detailed image generation prompt suitable for Midjourney, DALL-E, or Stable Diffusion.

Post context:
- Title/hook: ${title || "(none)"}
- Brief: ${contentIdea || "(none)"}
- Caption: ${caption ? caption.slice(0, 400) : "(none)"}
- Platform: ${platform || "both"} (aspect ratio: ${aspect})

Rules for the prompt:
- Vivid, specific subject and scene
- Hawaii/Oahu setting cues where natural (palms, ocean light, koa wood, hibiscus, local biz storefronts)
- Modern photo or illustration style — NO stock-photo cliché
- Specify lighting (golden hour, morning light, soft natural)
- Specify color palette (warm tropical, ocean blues, sunset oranges)
- Composition note (close-up, flat lay, wide shot)
- Add aspect ratio at end (--ar 1:1, --ar 4:5, or --ar 1.91:1)
- Keep prompt under 80 words, single paragraph, no line breaks

Return ONLY valid JSON: { "visualPrompt": "..." }`;

  const raw = await runAI(env, prompt, "Generate the visual prompt now.", 512);
  const parsed = parseJSON(raw);

  if (!parsed?.visualPrompt) {
    return jsonResponse({ error: "Failed to parse prompt", raw: raw.slice(0, 500) }, 500);
  }

  return jsonResponse({ visualPrompt: parsed.visualPrompt });
}

export async function handleSocialCaption(body, env) {
  const { title, contentIdea, platform, draft } = body;
  if (!title && !contentIdea && !draft) {
    return jsonResponse({ error: "Need title, contentIdea, or draft" }, 400);
  }

  const prompt = `You are TechSavvy Hawaii's social media copywriter.

${BRAND_CONTEXT}

Write ${platform === "instagram" ? "an Instagram" : platform === "facebook" ? "a Facebook" : "a cross-platform"} post.

Inputs:
- Title/hook: ${title || "(none)"}
- Brief: ${contentIdea || "(none)"}
- Draft (refine if provided): ${draft || "(none)"}

Rules:
- 3-6 short paragraphs with line breaks
- Open with a hook line
- Hawaii/local voice (Aloha, mahalo, sprinkle in but don't overdo)
- One clear CTA
- 8-12 relevant hashtags including #TechSavvyHawaii #ZeroFeeProcessing #HawaiiSmallBusiness

Return ONLY valid JSON: { "caption": "...", "hashtags": "...", "callToAction": "..." }`;

  const raw = await runAI(env, prompt, "Write the post.", 1024);
  const parsed = parseJSON(raw);

  if (!parsed?.caption) {
    return jsonResponse({ error: "Failed to parse caption", raw: raw.slice(0, 500) }, 500);
  }

  return jsonResponse(parsed);
}
