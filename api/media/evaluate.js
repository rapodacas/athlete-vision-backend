import { withCors } from './_cors.js';
import handler from '../../server/handlers/evaluate-media.js';

export default withCors(handler);
