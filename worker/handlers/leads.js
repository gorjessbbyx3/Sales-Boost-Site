/**
 * Lead enrichment & statement extraction handlers
 */
import { runAI, parseJSON, jsonResponse, s, validateVertical } from "../helpers.js";

export async function handleEnrich(body, env) {
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

export async function handleExtractStatement(body, env) {
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
