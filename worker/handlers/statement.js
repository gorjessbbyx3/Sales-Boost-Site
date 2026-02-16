/**
 * Statement analysis handler — comprehensive AI-powered merchant statement review
 * Uses Cloudflare Workers AI (free tier) for both text and image analysis
 */
import { runAI, parseJSON, jsonResponse } from "../helpers.js";

const VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";

const ANALYSIS_PROMPT = `You are an expert merchant services consultant analyzing a merchant processing statement. Carefully examine every detail provided.

Your task:
1. Identify ALL hidden fees, junk fees, inflated rates, and unnecessary charges
2. Calculate or estimate the merchant's effective rate (total fees / total volume)
3. Compare to the industry average effective rate (typically 2.2-2.8% for most retail/restaurant)
4. Estimate how much they are overpaying per month
5. Provide specific, actionable recommendations

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no backticks, no commentary):
{
  "summary": "One sentence summary of findings",
  "effectiveRate": "X.XX%",
  "industryAverage": "X.XX%",
  "estimatedOverpay": "$XXX",
  "monthlyVolume": "$XX,XXX",
  "hiddenFees": [
    {
      "name": "Fee name",
      "amount": "$XX.XX",
      "severity": "high|medium|low",
      "explanation": "Why this fee is problematic and what it should be"
    }
  ],
  "recommendations": [
    "Specific actionable recommendation"
  ],
  "overallGrade": "A|B|C|D|F"
}

Grade scale: A = excellent rates, B = slightly above average, C = moderately overcharged, D = significantly overcharged, F = severely overcharged.

If the data is limited, still provide your best analysis. Processors almost always include unnecessary fees — identify at least a few areas of concern.`;

export async function handleAnalyzeStatement(body, env) {
  const { text, imageBase64, imageType } = body;

  if (!text && !imageBase64) {
    return jsonResponse({ error: "Missing 'text' or 'imageBase64' field" }, 400);
  }

  try {
    let raw;

    if (imageBase64 && imageType) {
      // Image-based analysis using vision model
      const imageBytes = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
      const response = await env.AI.run(VISION_MODEL, {
        messages: [
          {
            role: "user",
            content: [
              { type: "image", image: [...imageBytes] },
              { type: "text", text: ANALYSIS_PROMPT + "\n\nAnalyze this merchant processing statement image thoroughly." },
            ],
          },
        ],
        max_tokens: 2048,
      });
      raw = response.response || "";
    } else {
      // Text-based analysis
      raw = await runAI(env, ANALYSIS_PROMPT, `Here is the merchant processing statement text to analyze:\n\n${text.slice(0, 8000)}`, 2048);
    }

    const parsed = parseJSON(raw);

    if (!parsed) {
      return jsonResponse({
        error: "Failed to parse analysis",
        raw: raw.slice(0, 500),
        // Return a fallback structure so the UI doesn't break
        summary: "Unable to fully parse statement. Please try again or contact us for manual review.",
        effectiveRate: "N/A",
        industryAverage: "2.5%",
        estimatedOverpay: "N/A",
        monthlyVolume: "N/A",
        hiddenFees: [],
        recommendations: ["Contact TechSavvy Hawaii at (808) 767-5460 for a free manual review."],
        overallGrade: "C",
      });
    }

    // Ensure required fields exist
    return jsonResponse({
      summary: parsed.summary || "Analysis complete.",
      effectiveRate: parsed.effectiveRate || "N/A",
      industryAverage: parsed.industryAverage || "2.5%",
      estimatedOverpay: parsed.estimatedOverpay || "N/A",
      monthlyVolume: parsed.monthlyVolume || "N/A",
      hiddenFees: Array.isArray(parsed.hiddenFees) ? parsed.hiddenFees : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      overallGrade: parsed.overallGrade || "C",
    });
  } catch (err) {
    return jsonResponse({
      error: "Analysis failed — please try again",
      summary: "Analysis encountered an error. Please try re-uploading or contact us.",
      effectiveRate: "N/A",
      industryAverage: "2.5%",
      estimatedOverpay: "N/A",
      monthlyVolume: "N/A",
      hiddenFees: [],
      recommendations: ["Call (808) 767-5460 for a free manual statement review."],
      overallGrade: "C",
    });
  }
}
