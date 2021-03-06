// Import dependencies
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbConfig = require("../config/database.config.js");
const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require("./user.model")(mongoose);
db.accident = require("./accident.model")(mongoose);
db.event = require("./event.model")(mongoose);
db.panicButton = require("./panicButton.model")(mongoose);
db.rating = require("./rating.model")(mongoose);
db.route = require("./route.model")(mongoose);
db.vehicle = require("./vehicle.model")(mongoose);
db.notification = require("./notification.model")(mongoose);

module.exports = db;