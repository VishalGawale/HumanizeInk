// api/humanize.js
// This runs on Vercel's server — users never see this file or your API key

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  // Basic validation
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
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, // stored safely in Vercel
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",// free and powerful model
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `You are a ruthless AI writing editor. Your job: make AI-generated text sound like it was written by an actual human.

You know every AI tell:
- Significance inflation ("pivotal moment", "testament to", "evolving landscape")
- Promotional fluff ("vibrant", "groundbreaking", "nestled", "breathtaking")
- Superficial -ing phrases ("highlighting", "underscoring", "showcasing")
- Vague attributions ("experts argue", "observers note", "industry reports")
- Soulless structure (rule of three, "not just X but Y", "catalyst/partner/foundation")
- Chatbot artifacts ("Great question!", "I hope this helps!", "Let me know if...")
- Generic conclusions ("the future looks bright", "exciting times lie ahead")
- Filler phrases ("In order to", "It is important to note that", "At this point in time")
- Excessive hedging ("could potentially possibly be argued")
- Copula avoidance ("serves as", "functions as", "stands as" use "is")
- Em dash overuse, curly quotes, emoji bullet points
- Every sentence same length and structure

Your rewrite rules:
1. Cut the fluff. Be direct. Use "is" not "serves as".
2. Add personality. React to things. Have opinions where appropriate.
3. Vary rhythm. Short punchy sentences. Then longer ones.
4. Be specific. Replace vague claims with concrete details.
5. Let some mess in. Perfect structure feels algorithmic.

IMPORTANT: Respond with ONLY valid JSON. No markdown. No backticks. No explanation. Just the JSON object.

{
  "humanized": "the rewritten text here",
  "changes": ["change description 1", "change description 2", "change description 3"],
  "score_before": 85,
  "score_after": 12
}

score_before and score_after are AI-ness scores from 0 (pure human) to 100 (pure AI slop).
Keep changes list to 4-6 bullets. Be specific and punchy.`
          },
          {
            role: "user",
            content: `Humanize this text:\n\n${text}`
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
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
