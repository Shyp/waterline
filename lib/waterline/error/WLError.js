/**
 * Module dependencies
 */

var _ = require('lodash');
var debug = require('debug')('waterline.error');


/**
 * WLError
 *
 * All errors passed to a query callback in Waterline extend
 * from this base error class.
 *
 * @param  {Object} properties
 * @constructor {WLError}
 */
function WLError(originalError) {
  if (!(this instanceof WLError)) {
    return new WLError(originalError);
  }
  debug('Creating WLError:', originalError);
  this.originalError = originalError;

  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = this.constructor.name;
}

WLError.prototype = Object.create(Error.prototype);
WLError.prototype.constructor = WLError;

// Default properties
WLError.prototype.status = 500;
WLError.prototype.code = 'E_UNKNOWN';
WLError.prototype.message = 'Encountered an unexpected error';
WLError.prototype.reason = 'Encountered an unexpected error';
WLError.prototype.details = '';

module.exports = WLError;
