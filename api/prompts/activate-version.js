// api/prompts/activate-version.js
import { withCors } from '../../backend/api/_cors.js';
import handler from '../../server/handlers/prompts-activate-version.js';

export default withCors(handler);
