// server/handlers/prompts-list-versions.js
import { getPromptVersions } from "../../lib/prompts/versioning.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const category = url.searchParams.get("category");

  if (!category) {
    return res.status(400).json({ error: "Missing category" });
  }

  try {
    const { versions } = await getPromptVersions(category);
    return res.status(200).json(versions);
  } catch (err) {
    console.error("list-versions error:", err);
    return res.status(500).json({ error: err.message });
  }
}
