import { withCors } from '../_cors.js';
import handler from '../../server/handlers/load-players.js';

export default withCors(handler);
