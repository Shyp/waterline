/**
 * Module dependencies
 */

var WLError = require('./WLError');
var WLUsageError = require('./WLUsageError');
var util = require('util');
var _ = require('lodash');



/**
 * WLValidationError
 *
 * @extends WLError
 */
function WLValidationError (attributes, model) {

  // Ensure valid usage
  if ( typeof attributes !== 'object' ) {
    return new WLUsageError({
      reason: 'An `invalidAttributes` object must be passed into the constructor for `WLValidationError`'
    });
  }

  if (!(this instanceof WLValidationError)) {
    return new WLValidationError(attributes, model);
  }

  // Always apply the 'E_VALIDATION' error code, even if it was overridden.
  this.code = 'E_VALIDATION';

  // Model should always be set.
  // (this should be the globalId of model, or "collection")
  this.model = model;

  this.message = attributes.message;

  if (typeof attributes.rule !== 'undefined') {
    this.rule = attributes.rule;
  }

  if (typeof attributes.data !== 'undefined') {
    this.data = attributes.data;
  }

  if (typeof attributes.actualType !== 'undefined') {
    this.actualType = attributes.actualType;
  }

  if (typeof attributes.expectedType !== 'undefined') {
    this.expectedType = attributes.expectedType;
  }

  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = this.constructor.name;
}

WLValidationError.prototype = Object.create(Error.prototype);
WLValidationError.prototype.constructor = WLValidationError;

module.exports = WLValidationError;
