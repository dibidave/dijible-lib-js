var database = require("./connectors/database");

const Database_Object = {

  save() {

    var self = this;

    var promise = null;

    var collection_name = this._metadata.collection_name;

    if(this._id === undefined) {
      promise = database.insert(this._metadata.user_id, collection_name,
        this.to_JSON())
      .then(function(sample_id) {
        self._id = sample_id;
        return self;
      });
    }
    else {
      promise = database.update(this._metadata.user_id, collection_name,
        this._id,
        this.to_JSON())
      .then(function() {
        return self;
      });
    }

    return promise;
  },

  to_JSON() {

    var JSON_object = {};
    
    for(var property in this) {

      if(typeof this[property] === 'function') {
        continue;
      }

      if(property === '_metadata') {
        continue;
      }

      JSON_object[property] = this[property];
    }

    return JSON_object;
  },

  from_JSON(JSON_object) {

    Object.assign(this, JSON_object);
  }
};

module.exports.create_database_object = function(user_id, collection_name) {

  var database_object = Object.assign({}, Database_Object);
  database_object._metadata = {
    collection_name: collection_name,
    user_id: user_id
  };

  this.created_on = new Date();
  this.deleted_on = null;

  return database_object;
};

module.exports.Database_Object = Database_Object;