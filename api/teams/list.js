import { withCors } from '../_cors.js';
import handler from '../../server/handlers/list-teams.js';

export default withCors(handler);
