import { withCors } from '../../backend/api/_cors.js';
import handler from '../../server/handlers/evaluate-media.js';

export default withCors(handler);
