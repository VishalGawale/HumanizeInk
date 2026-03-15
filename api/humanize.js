export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, mode = "standard" } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No text provided" });
  }

  if (text.length > 5000) {
    return res.status(400).json({ error: "Text too long. Max 5000 characters." });
  }

  // Different system prompts per mode
  const modeInstructions = {
    fast: `Make minimal changes. Fix obvious AI patterns only. Keep most of the original wording. Light touch.`,
    standard: `Remove AI patterns thoroughly. Rewrite for natural human flow. Balanced approach.`,
    enhanced: `Aggressively rewrite the entire text. Change structure, vary rhythm heavily, add personality and opinions. Maximum humanization.`,
  };

  const systemPrompt = `You are a ruthless AI writing editor. Your job: make AI-generated text sound like it was written by an actual human.

Mode: ${mode.toUpperCase()} — ${modeInstructions[mode] || modeInstructions.standard}

Remove these AI patterns:
- Significance inflation: "pivotal moment", "testament to", "evolving landscape", "marking a shift"
- Promotional fluff: "vibrant", "groundbreaking", "nestled", "breathtaking", "stunning"
- Fake depth -ing phrases: "highlighting", "underscoring", "showcasing", "fostering", "cultivating"
- Vague sources: "experts argue", "observers note", "industry reports suggest"
- Chatbot artifacts: "Great question!", "I hope this helps!", "Let me know if..."
- Generic endings: "the future looks bright", "exciting times lie ahead", "journey toward excellence"
- Filler: "In order to", "It is important to note that", "At this point in time"
- Copula avoidance: replace "serves as", "functions as", "stands as" with "is"
- Em dash overuse, emoji bullets, curly quotes
- Rule of three patterns and synonym cycling

Rewrite rules:
1. Be direct. Cut fluff. Use simple words.
2. Vary rhythm — short punchy sentences mixed with longer ones.
3. Add personality and opinions where natural.
4. Use "I" or specific examples when appropriate.
5. Let some natural imperfection in.

IMPORTANT: Respond with ONLY a raw JSON object. No markdown. No backticks. Start with { end with }.

{"humanized":"rewritten text here","changes":["change 1","change 2","change 3"],"score_before":82,"score_after":15}

score_before and score_after = AI-ness from 0 (human) to 100 (pure AI slop).
Keep changes to 4-6 bullets, specific and punchy.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1500,
        temperature: mode === "enhanced" ? 0.9 : mode === "fast" ? 0.5 : 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Humanize this text and respond with only JSON:\n\n${text}` },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Groq API error:", errData);
      return res.status(500).json({ error: "AI service error. Please try again." });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    let clean = raw.trim();
    clean = clean.replace(/^```json\s*/i, "");
    clean = clean.replace(/^```\s*/i, "");
    clean = clean.replace(/\s*```$/i, "");
    clean = clean.trim();

    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      console.error("No JSON found in response:", clean);
      return res.status(500).json({ error: "Could not parse response. Try again." });
    }

    clean = clean.substring(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(clean);

    if (!parsed.humanized) {
      return res.status(500).json({ error: "Invalid response format. Try again." });
    }

    return res.status(200).json({
      humanized: parsed.humanized,
      changes: parsed.changes || ["Removed AI patterns", "Improved readability"],
      score_before: parsed.score_before || 75,
      score_after: parsed.score_after || 20,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
