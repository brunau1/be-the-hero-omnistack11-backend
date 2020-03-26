const express = require("express");
const routes = express.Router();
const OngController = require("./controllers/Ong.controller");
const IncidentController = require("./controllers/Incident.controller");
const ProfileController = require("./controllers/Profile.controller");
const SessionController = require("./controllers/Session.controller");

routes.post("/sessions", SessionController.create);

routes.get("/ongs", OngController.index);
routes.post("/ongs", OngController.create);

routes.get("/profile", ProfileController.index);

routes.get("/incidents", IncidentController.index);
routes.post("/incidents", IncidentController.create);
routes.delete("/incidents/:id", IncidentController.destroy);

module.exports = routes;
