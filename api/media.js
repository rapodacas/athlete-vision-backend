// api/media.js
import { withCors } from "./_cors.js";
import handler from "../server/handlers/media.js";

export default withCors(handler);
