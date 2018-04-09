var logger = require("../util/logger").init_logger("test_database");
var Database_Object = require("../Database_Object");
var database = require("../connectors/database");

database.connect()
.then(function() {

  return Database_Object.create_database_object("object_type");
}).then(function(account) {

  console.log(JSON.stringify(account));
  console.log(account.to_JSON());
  process.exit(0);

});