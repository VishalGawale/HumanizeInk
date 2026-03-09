export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "No text provided" });
  }

  if (text.length > 5000) {
    return res.status(400).json({ error: "Text too long. Max 5000 characters." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `You are an AI writing editor. Rewrite AI-generated text to sound human.

Remove these patterns:
- Significance inflation: "pivotal moment", "testament to", "evolving landscape"
- Fluff words: "vibrant", "groundbreaking", "nestled", "breathtaking"
- Fake depth: "-ing" phrases like "highlighting", "underscoring", "showcasing"
- Vague sources: "experts argue", "observers note", "industry reports"
- Chatbot phrases: "Great question!", "I hope this helps!", "Let me know if..."
- Weak endings: "the future looks bright", "exciting times lie ahead"
- Filler: "In order to", "It is important to note that"
- Use "is" instead of "serves as", "functions as", "stands as"

Rules for rewriting:
1. Be direct and specific
2. Vary sentence length - mix short and long
3. Add personality and opinions where natural
4. Use simple words over complex ones

You MUST respond with ONLY a raw JSON object. No markdown. No backticks. No explanation before or after. Start your response with { and end with }

Example response format:
{"humanized":"rewritten text goes here","changes":["removed fluff word X","replaced serves as with is","cut generic conclusion"],"score_before":82,"score_after":15}`
          },
          {
            role: "user",
            content: `Humanize this text and respond with only JSON:\n\n${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Groq API error:", errData);
      return res.status(500).json({ error: "AI service error. Please try again." });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // Clean up the response aggressively
    let clean = raw.trim();

    // Remove markdown code blocks if present
    clean = clean.replace(/^```json\s*/i, "");
    clean = clean.replace(/^```\s*/i, "");
    clean = clean.replace(/\s*```$/i, "");
    clean = clean.trim();

    // Find the first { and last } to extract just the JSON
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      console.error("No JSON found in response:", clean);
      return res.status(500).json({ error: "Could not parse response. Try again." });
    }

    clean = clean.substring(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(clean);

    // Make sure required fields exist
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