/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');



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
  this.originalError = originalError;
}

// Default properties
WLError.prototype.status = 500;
WLError.prototype.code = 'E_UNKNOWN';
WLError.prototype.message = 'Encountered an unexpected error';
WLError.prototype.reason = 'Encountered an unexpected error';
WLError.prototype.details = '';

module.exports = WLError;
