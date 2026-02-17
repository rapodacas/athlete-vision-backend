import handler from '../../server/handlers/delete-media.js';

export default async function mediaDelete(req, res) {
  return handler(req, res);
}
