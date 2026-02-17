import { withCors } from './_cors.js';
import handler from '../../server/handlers/delete-media.js';

export default withCors(handler);