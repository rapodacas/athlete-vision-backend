import { withCors } from '../_cors.js';
import handler from '../../server/handlers/save-players.js';

export default withCors(handler);
