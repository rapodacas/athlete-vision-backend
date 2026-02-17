import { withCors } from '../../backend/api/_cors.js';
import handler from '../../server/handlers/create-teams.js';

export default withCors(handler);
