import handler from '../../server/handlers/evaluate-media.js';

export default async function mediaEvaluate(req, res) {
  return handler(req, res);
}
