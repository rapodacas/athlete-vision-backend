// api/prompts/list-versions.js
import { withCors } from '../../backend/api/_cors.js';
import handler from '../../server/handlers/prompts-list-versions.js';

export default withCors(handler);
