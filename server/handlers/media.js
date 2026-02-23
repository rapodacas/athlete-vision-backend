// server/handlers/media.js
import supabase from "../../lib/supabase.js";
import { detectEventsFromVideo } from "../../lib/event-detection.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse JSON body
  let body = {};
  try {
    const raw = await new Promise(resolve => {
      let d = "";
      req.on("data", c => (d += c));
      req.on("end", () => resolve(d));
    });
    body = JSON.parse(raw || "{}");
  } catch {}

  const action = body.action;
  if (!action) return res.status(400).json({ error: "Missing action" });

  // -----------------------------
  // UPLOAD
  // -----------------------------
  if (action === "upload") {
    const { playerId, sessionId, category, filename, mimeType } = body;

    if (!playerId || !sessionId || !category || !filename) {
      return res.status(400).json({
        error: "Missing required fields: playerId, sessionId, category, filename"
      });
    }

    const folderPath = `${playerId}/${sessionId}/${category}`;
    const fullPath = `${folderPath}/${filename}`;

    const { data: signed, error: signedError } = await supabase.storage
      .from("media")
      .createSignedUploadUrl(fullPath);

    if (signedError) {
      console.error("Signed URL error:", signedError);
      return res.status(500).json({ error: "Failed to create upload URL" });
    }

    const { data: publicData } = supabase.storage
      .from("media")
      .getPublicUrl(fullPath);

    return res.status(200).json({
      path: fullPath,
      uploadUrl: signed.signedUrl,
      publicUrl: publicData?.publicUrl || null,
      contentType: mimeType || "application/octet-stream"
    });
  }

  // -----------------------------
  // DELETE MEDIA
  // -----------------------------
  if (action === "delete") {
    const { supabasePath } = body;
    if (!supabasePath) return res.status(400).json({ error: "Missing supabasePath" });

    const { error } = await supabase.storage.from("media").remove([supabasePath]);
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ success: true });
  }

  // -----------------------------
  // EVALUATE MEDIA
  // (Your existing evaluation logic goes here)
  // -----------------------------
  if (action === "evaluate") {
    const { frames, category } = body;
    if (!frames || !category) {
      return res.status(400).json({ error: "Missing frames or category" });
    }

    const result = await evaluateFrames(frames, category); // your existing function
    return res.status(200).json(result);
  }

  // -----------------------------
  // DETECT EVENTS
  // -----------------------------
  if (action === "detect-events") {
    const { supabasePath, category } = body;

    if (!supabasePath || !category) {
      return res.status(400).json({ error: "Missing supabasePath or category" });
    }

    try {
      const events = await detectEventsFromVideo(supabasePath, category);
      return res.status(200).json({ events });
    } catch (err) {
      console.error("detect-events error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // -----------------------------
  // TRIM (backend → Fly)
  // -----------------------------
  if (action === "trim") {
    try {
      const flyRes = await fetch(process.env.FLY_TRIM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FLY_API_KEY}`
        },
        body: JSON.stringify(body)
      });

      const result = await flyRes.json();
      return res.status(200).json(result);
    } catch (err) {
      console.error("trim error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // -----------------------------
  // PROCESS (detect → trim)
  // -----------------------------
  if (action === "process") {
    const {
      supabasePath,
      playerId,
      playerName,
      sessionId,
      category,
      filename
    } = body;

    if (!supabasePath || !playerId || !sessionId || !category || !filename) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // 1. Detect events
      const events = await detectEventsFromVideo(supabasePath, category);

      // 2. Call Fly
      const flyRes = await fetch(process.env.FLY_TRIM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FLY_API_KEY}`
        },
        body: JSON.stringify({
          supabasePath,
          playerId,
          playerName,
          sessionId,
          category,
          filename,
          events
        })
      });

      const result = await flyRes.json();
      return res.status(200).json(result);
    } catch (err) {
      console.error("process error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: "Unknown action" });
}
