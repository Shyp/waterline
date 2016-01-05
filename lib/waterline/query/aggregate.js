/**
 * Aggregate Queries
 */

var async = require('async'),
    _ = require('lodash'),
    usageError = require('../utils/usageError'),
    utils = require('../utils/helpers'),
    callbacks = require('../utils/callbacksRunner'),
    Deferred = require('./deferred'),
    hasOwnProperty = utils.object.hasOwnProperty;

module.exports = {

  /**
   * Create an Array of records
   *
   * @param {Array} array of values to create
   * @param {Function} callback
   * @return Deferred object if no callback
   */

  createEach: function(valuesList, cb) {
    var self = this;

    // Handle Deferred where it passes criteria first
    if(arguments.length === 3) {
      var args = Array.prototype.slice.call(arguments);
      cb = args.pop();
      valuesList = args.pop();
    }

    // Return Deferred or pass to adapter
    if(typeof cb !== 'function') {
      return new Deferred(this, this.createEach, {}, valuesList);
    }

    // Validate Params
    var usage = utils.capitalize(this.identity) + '.createEach(valuesList, callback)';

    if(!valuesList) return usageError('No valuesList specified!', usage, cb);
    if(!Array.isArray(valuesList)) return usageError('Invalid valuesList specified (should be an array!)', usage, cb);
    if(typeof cb !== 'function') return usageError('Invalid callback specified!', usage, cb);

    // Remove all undefined values
    valuesList = _.remove(valuesList, undefined);

    var errStr = _validateValues(_.cloneDeep(valuesList));
    if(errStr) return usageError(errStr, usage, cb);

    var records = [];

    function create(value, next) {
      self.create(value, function(err, record) {
        if(err) return next(err);
        records.push(record);
        next();
      });
    }

    async.map(valuesList, create, function(err) {
      if(err) return cb(err);
      cb(null, records);
    });
  },

};


/**
 * Validate valuesList
 *
 * @param {Array} valuesList
 * @return {String}
 * @api private
 */

function _validateValues(valuesList) {
  var err;

  for(var i=0; i < valuesList.length; i++) {
    if(valuesList[i] !== Object(valuesList[i])) {
      err = 'Invalid valuesList specified (should be an array of valid values objects!)';
    }
  }

  return err;
}


/**
 * Validate values and add in default values
 *
 * @param {Object} record
 * @param {Function} cb
 * @api private
 */

function _validate(record, cb) {
  var self = this;

  // Set Default Values if available
  for(var key in self.attributes) {
    if(!record[key] && record[key] !== false && hasOwnProperty(self.attributes[key], 'defaultsTo')) {
      var defaultsTo = self.attributes[key].defaultsTo;
      record[key] = typeof defaultsTo === 'function' ? defaultsTo.call(record) : _.clone(defaultsTo);
    }
  }

  // Cast values to proper types (handle numbers as strings)
  record = self._cast.run(record);

  async.series([

    // Run Validation with Validation LifeCycle Callbacks
    function(next) {
      callbacks.validate(self, record, true, next);
    },

    // Before Create Lifecycle Callback
    function(next) {
      callbacks.beforeCreate(self, record, next);
    }

  ], function(err) {
    if(err) return cb(err);

    // Automatically add updatedAt and createdAt (if enabled)
    if (self.autoCreatedAt) record.createdAt = new Date();
    if (self.autoUpdatedAt) record.updatedAt = new Date();

    cb();
  });
}
