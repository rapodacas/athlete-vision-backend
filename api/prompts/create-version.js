// api/prompts/create-version.js
import { withCors } from '../../backend/api/_cors.js';
import handler from '../../server/handlers/prompts-create-version.js';

export default withCors(handler);