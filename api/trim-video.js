// api/trim-video.js
import { withCors } from './_cors.js';
import handler from '../server/handlers/trim-video.js';

export default withCors(handler);
