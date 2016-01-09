var assert = require('assert');
require('should');

var Validator = require('../../../lib/waterline/core/validations');

describe('validations', function() {

  describe('required', function() {
    var validator;

    before(function() {

      var validations = {
        name: {
          type: 'string',
          required: true
        },
        employed: {
          type: 'boolean',
          required: true
        },
        age: { type: 'integer' }
      };

      validator = new Validator();
      validator.initialize(validations);
    });

    it('should error if no value is set for required string field', function(done) {
      validator.validate({ name: '', employed: true, age: 27 }, function(error) {
        error.should.have.properties({
          message: "\"required\" validation rule failed for input: ''",
          rule: 'required',
          data: '',
        });
        done();
      });
    });

    it('should error if null is set for required string field', function(done) {
      validator.validate({ name: null, employed: true, age: 27 }, function(error) {
        error.should.have.properties({
          message: "`name` should be a string (instead of null)",
          data: null,
          actualType: 'object',
          expectedType: 'string',
        });
        done();
      });
    });

    it('should error if no value is set for required boolean field', function(done) {
      validator.validate({ name: 'Frederick P. Frederickson', age: 27 }, function(error) {
        error.message.should.equal("`employed` should be a boolean (instead of null)");
        done();
      });
    });

    it('should NOT error if all required values are set', function(done) {
      validator.validate({ name: 'Foo Bar', employed: true, age: 27 }, function(errors) {
        assert(!errors);
        done();
      });
    });

  });

});
