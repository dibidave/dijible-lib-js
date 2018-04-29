var Database_Object = require("./Database_Object");
var database = require("./connectors/database");
var bcrypt = require("bcryptjs");

const collection_name = "Users";
const salt_rounds = 14;

const User = {

  set_password(password) {
    this.password = bcrypt.hashSync(password, salt_rounds);
  }

};

exports.create_user = function(username, password) {

  var user = Database_Object.create_database_object(null, collection_name);
  Object.assign(user, User);

  user.username = username;
  user.password = bcrypt.hashSync(password, salt_rounds);

  return user;
};

exports.get_user_by_credentials = function(username, password) {

  var filter = {
    username: username
  };

  var promise = database.get_objects(null, collection_name, filter)
  .then(function(users_JSON) {

    if(users_JSON.length < 1) {
      return null;
    }

    if(!bcrypt.compareSync(password, users_JSON[0].password)) {
      return null;
    }

    var user = Database_Object.create_database_object(null, collection_name);
    Object.assign(user, User);
    user.from_JSON(users_JSON[0]);

    return user;
  });

  return promise;
};

exports.get_user_by_username = function(username) {

  var filter = {
    username: username
  };

  var promise = database.get_objects(null, collection_name, filter)
  .then(function(users_JSON) {

    if(users_JSON.length < 1) {
      return null;
    }

    var user = Database_Object.create_database_object(null, collection_name);
    Object.assign(user, User);
    user.from_JSON(users_JSON[0]);

    return user;
  });

  return promise;
};

exports.get_user_by_id = function(user_id) {

  var promise = database.get_object_by_id(null, collection_name, user_id)
  .then(function(user_JSON) {

    var user = Database_Object.create_database_object(null, collection_name);
    Object.assign(user, User);
    user.from_JSON(user_JSON);

    return user;
  });

  return promise;
};