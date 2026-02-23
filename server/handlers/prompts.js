// server/handlers/prompts.js
import {
  createPromptVersion,
  activatePromptVersion,
  rollbackPrompt,
  getPromptVersions
} from "../../lib/prompts/versioning.js";

export default async function handler(req, res) {
  // -----------------------------
  // GET → list versions
  // -----------------------------
  if (req.method === "GET") {
    const { action, category } = req.query || {};

    if (action === "list") {
      if (!category) {
        return res.status(400).json({ error: "Missing category" });
      }

      try {
        const versions = await getPromptVersions(category);
        return res.status(200).json({ versions });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(400).json({ error: "Unknown GET action" });
  }

  // -----------------------------
  // POST → create/activate/rollback
  // -----------------------------
  if (req.method === "POST") {
    let body = {};
    try {
      const raw = await new Promise(resolve => {
        let d = "";
        req.on("data", c => (d += c));
        req.on("end", () => resolve(d));
      });
      body = JSON.parse(raw || "{}");
    } catch {}

    const {
      category,
      subcategories,
      systemPrompt,
      userPromptTemplate,
      version,
      action
    } = req.body || {};

    if (!action) return res.status(400).json({ error: "Missing action" });
    if (!category) return res.status(400).json({ error: "Missing category" });
    
    try {
      switch (action) {
        case "create-version":
          if (!subcategories || !systemPrompt || !userPromptTemplate) {
            return res.status(400).json({ error: "Missing required fields" });
          }
          return res.status(200).json({
            version: await createPromptVersion(body)
          });

        case "activate-version":
          if (!version) return res.status(400).json({ error: "Missing version" });
          await activatePromptVersion(category, version);
          return res.status(200).json({ success: true });

        case "rollback":
          return res.status(200).json({
            version: await rollbackPrompt(category)
          });

        default:
          return res.status(400).json({ error: "Unknown POST action" });
      }
    } catch (err) {
      console.log(`${action} error: ${err}`)
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
