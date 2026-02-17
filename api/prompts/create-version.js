// api/prompts/create-version.js
import handler from '../../server/handlers/prompts-create-version.js';

export default async function promptsCreateVersion(req, res) {
  return handler(req, res);
}
