/**
 * Aggregate Queries Adapter Normalization
 */

var async = require('async'),
    normalize = require('../utils/normalize'),
    hasOwnProperty = require('../utils/helpers').object.hasOwnProperty;

module.exports = {

  // If an optimized createEach exists, use it, otherwise use an asynchronous loop with create()
  createEach: function(valuesList, cb) {
    var self = this,
        connName,
        adapter;

    // Normalize Arguments
    cb = normalize.callback(cb);

    // Build Default Error Message
    var err = "No createEach() or create() method defined in adapter!";

    // Custom user adapter behavior
    if(hasOwnProperty(this.dictionary, 'createEach')) {
      connName = this.dictionary.createEach;
      adapter = this.connections[connName]._adapter;

      if(hasOwnProperty(adapter, 'createEach')) {
        return adapter.createEach(connName, this.collection, valuesList, cb);
      }
    }

    // Default behavior
    // WARNING: Not transactional!  (unless your data adapter is)
    var results = [];

    // Find the connection to run this on
    if(!hasOwnProperty(this.dictionary, 'create')) return cb(new Error(err));

    connName = this.dictionary.create;
    adapter = this.connections[connName]._adapter;

    if(!hasOwnProperty(adapter, 'create')) return cb(new Error(err));

    async.forEachSeries(valuesList, function (values, cb) {
      adapter.create(connName, self.collection, values, function(err, row) {
        if(err) return cb(err);
        results.push(row);
        cb();
      });
    }, function(err) {
      if(err) return cb(err);
      cb(null, results);
    });
  },
};
