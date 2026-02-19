// api/upload.js
import { withCors } from './_cors.js';
import handler from '../server/handlers/upload.js';

export default withCors(handler);
