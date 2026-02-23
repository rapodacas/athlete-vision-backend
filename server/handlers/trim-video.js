// handlers/trim-video.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { supabasePath, playerId, sessionId, category, filename } = req.body || {};

  if (!supabasePath || !playerId || !sessionId || !category || !filename) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const flyUrl = "https://trim-video-service.fly.dev/";

    const flyRes = await fetch(flyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FLY_API_KEY}`
      },
      body: JSON.stringify({
        supabasePath,
        playerId,
        sessionId,
        category,
        filename
      })
    });

    const data = await flyRes.json();

    return res.status(flyRes.status).json(data);

  } catch (err) {
    console.error("trim-video error", err);
    return res.status(500).json({ error: err.message });
  }
};
