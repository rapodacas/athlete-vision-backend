import handler from '../../server/handlers/list-teams.js';

export default async function teamsList(req, res) {
  return handler(req, res);
}
