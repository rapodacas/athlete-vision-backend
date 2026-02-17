// api/prompts/list-versions.js
import { withCors } from './_cors.js';
import handler from '../../server/handlers/prompts-list-versions.js';

export default withCors(handler);
