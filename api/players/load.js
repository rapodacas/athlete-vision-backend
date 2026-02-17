import handler from '../../server/handlers/load-players.js';

export default async function playersLoad(req, res) {
  return handler(req, res);
}
