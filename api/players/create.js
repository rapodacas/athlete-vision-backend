import handler from '../../server/handlers/create-player.js';

export default async function playersCreate(req, res) {
  return handler(req, res);
}