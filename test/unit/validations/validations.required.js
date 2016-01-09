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
      validator.validate({ name: '', employed: true, age: 27 }, function(errors) {
        errors.name.length.should.equal(1);
        errors.name[0].message.should.equal("\"required\" validation rule failed for input: ''");
        assert(errors.name[0].rule === 'required');
        done();
      });
    });

    it('should error if null is set for required string field', function(done) {
      validator.validate({ name: null, employed: true, age: 27 }, function(errors) {
        errors.name.length.should.equal(2);
        errors.name[0].message.should.equal("`name` should be a string (instead of null)");
        errors.name[0].rule.should.equal('string');
        done();
      });
    });

    it('should error if no value is set for required boolean field', function(done) {
      validator.validate({ name: 'Frederick P. Frederickson', age: 27 }, function(errors) {
        assert(errors);
        assert(errors.employed);
        assert(errors.employed[0].rule === 'boolean');
        assert(errors.employed[1].rule === 'required');
        done();
      });
    });

    it('should error if no value is set for required boolean field', function(done) {
      validator.validate({ name: 'Frederick P. Frederickson', age: 27 }, function(errors) {
        assert(errors);
        assert(errors.employed);
        assert(errors.employed[0].rule === 'boolean');
        assert(errors.employed[1].rule === 'required');
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
