import handler from '../../server/handlers/create-teams.js';

export default async function teamsCreate(req, res) {
  return handler(req, res);
}
