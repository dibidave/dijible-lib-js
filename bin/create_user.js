var logger = require("dijible-lib/util/logger").init_logger("create_user");
var database = require("dijible-lib/connectors/database");
var User = require("../User");

var connection_promises = [];

connection_promises.push(database.connect());

Promise.all(connection_promises)
.then(function() {
  var user = User.create_user(process.argv[2], process.argv[3]);
  return user.save();
}).catch(function(error) {
  logger.fatal(error);
}).then(function() {
  process.exit(0);
});