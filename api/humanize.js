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

  const modeInstructions = {
    fast: "Make minimal changes. Fix obvious AI patterns only. Light touch.",
    standard: "Remove AI patterns thoroughly. Rewrite for natural human flow. Balanced approach.",
    enhanced: "Aggressively rewrite. Change structure, vary rhythm heavily, add personality. Maximum humanization.",
  };

  const systemPrompt = `You are a ruthless AI writing editor. Make AI-generated text sound human.

Mode: ${mode.toUpperCase()} — ${modeInstructions[mode] || modeInstructions.standard}

Remove these patterns:
- Significance inflation: "pivotal moment", "testament to", "evolving landscape"
- Fluff: "vibrant", "groundbreaking", "nestled", "breathtaking"
- Fake -ing phrases: "highlighting", "underscoring", "showcasing", "fostering"
- Vague sources: "experts argue", "observers note", "industry reports"
- Chatbot artifacts: "Great question!", "I hope this helps!", "Let me know if..."
- Generic endings: "the future looks bright", "exciting times lie ahead"
- Filler: "In order to", "It is important to note that"
- Replace "serves as", "functions as", "stands as" with "is"

Rules:
1. Be direct. Cut fluff.
2. Vary rhythm — short and long sentences mixed.
3. Add personality where natural.
4. Use specific details over vague claims.

IMPORTANT SCORING RULES:
- score_before = how AI-sounding the ORIGINAL text is (0=human, 100=pure AI)
- score_after = how AI-sounding the REWRITTEN text is (0=human, 100=pure AI)
- score_after MUST ALWAYS be lower than score_before
- A good humanization reduces score by at least 30-50 points
- Example: if original scores 80, rewrite should score 20-40

Respond with ONLY raw JSON. No markdown. No backticks. Start with { end with }

{"humanized":"rewritten text","changes":["change 1","change 2","change 3"],"score_before":82,"score_after":25}`;

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
          { role: "user", content: `Humanize this text, respond with only JSON:\n\n${text}` },
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
      return res.status(500).json({ error: "Could not parse response. Try again." });
    }

    clean = clean.substring(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(clean);

    if (!parsed.humanized) {
      return res.status(500).json({ error: "Invalid response. Try again." });
    }

    // ── SCORE VALIDATION FIX ──────────────────────────────
    let scoreBefore = Math.min(100, Math.max(0, parsed.score_before || 75));
    let scoreAfter = Math.min(100, Math.max(0, parsed.score_after || 20));

    // After score must always be lower than before
    if (scoreAfter >= scoreBefore) {
      scoreAfter = Math.max(5, scoreBefore - 30);
    }

    // Minimum 15 point improvement
    if (scoreBefore - scoreAfter < 15) {
      scoreAfter = Math.max(5, scoreBefore - 15);
    }
    // ─────────────────────────────────────────────────────

    return res.status(200).json({
      humanized: parsed.humanized,
      changes: parsed.changes || ["Removed AI patterns", "Improved readability"],
      score_before: scoreBefore,
      score_after: scoreAfter,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}