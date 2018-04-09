
module.exports = {

  connect: function() {

    var url = "mongodb://" + config.database_host + ":" + config.database_port;

    logger.info("Connecting to '" + url + "'");

    var promise = MongoClient.connect(url)
    .then(function(client_connection) {

      client_connection = client_connection;

      db = client_connection.db("dijible");

    });

    return promise;
  },

  insert: function(collection_name, object) {

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

  update: function(collection_name, id, object) {
    
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

  get_objects: function(collection_name, filter) {

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

  get_object_by_id: function(collection_name, id) {

    var collection = db.collection(collection_name);

    id = ObjectID(id);

    var promise = collection.findOne(id);

    return promise;
  },

  delete_objects: function(collection_name, filter) {

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
var db = null;
var logger = require("../util/logger").get_logger("database");
var config = require("../config/config");