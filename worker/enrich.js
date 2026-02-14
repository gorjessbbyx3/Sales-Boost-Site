export default {
  async fetch(request, env) {
    // Only accept POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST required" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const { text } = await request.json();
      if (!text || typeof text !== "string") {
        return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        messages: [
          {
            role: "system",
            content:
              'Extract business info from this webpage text. Return ONLY valid JSON with these fields (leave empty string if not found): { "phone": "", "email": "", "address": "", "vertical": "", "ownerName": "", "notes": "" }. For vertical use one of: restaurant, retail, salon, auto, medical, services, ecommerce, other. Return ONLY the JSON object, nothing else.',
          },
          {
            role: "user",
            content: text.slice(0, 3000),
          },
        ],
      });

      const aiText = response.response || "";
      // Extract JSON from response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return new Response(JSON.stringify({ error: "No JSON in AI response" }), {
          status: 422,
          headers: { "Content-Type": "application/json" },
        });
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(parsed), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || "Internal error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
