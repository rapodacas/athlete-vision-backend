// api/prompts/activate-version.js
import handler from '../../server/handlers/prompts-activate-version.js';

export default async function promptsActivateVersion(req, res) {
  return handler(req, res);
}
