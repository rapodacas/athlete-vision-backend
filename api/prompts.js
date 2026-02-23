import { withCors } from "./_cors.js";
import handler from "../server/handlers/prompts.js";

export default withCors(handler);
