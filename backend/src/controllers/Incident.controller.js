const connection = require("../database/connection");

async function index(req, res) {
  const { page = 1 } = req.query;
  const [count] = await connection("incidents").count();
  const incidents = await connection("incidents")
    //relaciona a tabela de ongs e incidents de acordo com o id
    //retorna os dados da ong correspondente
    .join("ongs", "ongs.id", "=", "incidents.ong_id")
    .limit(5)
    .offset((page - 1) * 5)
    .select([
      "incidents.*",
      "ongs.name",
      "ongs.email",
      "ongs.whatsapp",
      "ongs.city",
      "ongs.uf"
    ]);
  res.header("X-Total-Count", count["count(*)"]);
  return res.json(incidents);
}

async function create(req, res) {
  const { title, description, value } = req.body;
  const ong_id = req.headers.authorization;

  //pega o id do primeiro registro do array
  const [id] = await connection("incidents").insert({
    title,
    description,
    value,
    ong_id
  });
  return res.json({ id });
}

async function destroy(req, res) {
  const { id } = req.params;
  const ong_id = req.headers.authorization;
  const incident = await connection("incidents")
    .where("id", id)
    .select("ong_id")
    .first();
  if (incident.ong_id != ong_id)
    return res.status(401).json({ error: "Operation not permitted" });

  await connection("incidents")
    .where("id", id)
    .delete();
  //status 204: success, but no content
  return res.status(204).send();
}

module.exports = { index, create, destroy };
