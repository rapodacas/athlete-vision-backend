import { withCors } from '../../backend/api/_cors.js';
import handler from '../../server/handlers/create-player.js';

export default withCors(handler);