// api/prompts/list-versions.js
import handler from '../../server/handlers/prompts-list-versions.js';

export default async function promptsListVersions(req, res) {
  return handler(req, res);
}
