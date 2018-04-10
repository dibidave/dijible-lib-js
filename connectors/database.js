
module.exports = {

  connect: function() {

    var url = "mongodb://" + config.database_host + ":" + config.database_port;

    logger.info("Connecting to '" + url + "'");

    var promise = MongoClient.connect(url)
    .then(function(response) {

      client_connection = response;

      dbs["root"] = client_connection.db("dijible");

      return dbs["root"].collection("Users").find({}).toArray();
    }).then(function(users) {

      for(var user_index = 0; user_index < users.length;
        user_index++) {

        var user = users[user_index];

        var user_id = user._id.toHexString();

        dbs[user_id] = client_connection.db(user_id);
      }
    });

    return promise;
  },

  insert: function(user_id, collection_name, object) {

    var db = get_db(user_id);

    var collection = db.collection(collection_name);

    for(var property in object) {
      if(property.endsWith("_id")) {
        try {
          object[property] = ObjectID(object[property]);
        }
        catch (error) {

        }
      }
    }

    var promise = collection.insertOne(object)
    .then(function(result) {
      return result.insertedId;
    });

    return promise;
  },

  update: function(user_id, collection_name, id, object) {

    var db = get_db(user_id);
    
    var collection = db.collection(collection_name);

    id = ObjectID(id);

    for(var property in object) {
      if(property.endsWith("_id")) {
        try {
          object[property] = ObjectID(object[property]);
        }
        catch (error) {

        }
      }
    }

    var promise = collection.replaceOne(
    {
        "_id": id
    },
    object);

    return promise;
  },

  get_objects: function(user_id, collection_name, filter) {

    var db = get_db(user_id);

    var collection = db.collection(collection_name);

    if(filter === undefined) {
      filter = {};
    }

    for(var property in filter) {
      if(property.endsWith("_id")) {
        try {
          filter[property] = ObjectID(filter[property]);
        }
        catch (error) {

        }
      }
    }

    var promise = collection.find(filter).toArray();

    return promise;
  },

  get_object_by_id: function(user_id, collection_name, id) {

    var db = get_db(user_id);

    var collection = db.collection(collection_name);

    id = ObjectID(id);

    var promise = collection.findOne(id);

    return promise;
  },

  delete_objects: function(user_id, collection_name, filter) {

    var db = get_db(user_id);

    var collection = db.collection(collection_name);

    for(var property in object) {
      if(property.endsWith("_id")) {
        try {
          object[property] = ObjectID(object[property]);
        }
        catch (error) {

        }
      }
    }

    if(filter === undefined) {
      filter = {};
    }

    var promise = collection.deleteMany(filter);

    return promise;
  }
}

var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var client_connection = null;
var dbs = {};
var logger = require("../util/logger").get_logger("database");
var config = require("../config/config");

var get_db = function(user_id) {

  try {
    user_id = user._id.toHexString();
  }
  catch(e) {

  }

  var db = null;

  if(user_id === null) {
    db = dbs["root"];
  }
  else {
    db = dbs[user_id];
  }

  return db;
};