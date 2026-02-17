import { withCors } from '../../backend/api/_cors.js';
import handler from '../../server/handlers/load-players.js';

export default withCors(handler);
