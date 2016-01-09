var Validator = require('../../../lib/waterline/core/validations'),
    assert = require('assert');

describe('validations', function() {

  describe('lengths', function() {
    var validator;

    before(function() {

      var validations = {
        firstName: {
          type: 'string',
          minLength: 2
        },
        lastName: {
          type: 'string',
          maxLength: 5
        }
      };

      validator = new Validator();
      validator.initialize(validations);
    });

    describe('minLength', function() {

      it('should validate minLength', function(done) {
        validator.validate({ firstName: 'foo' }, function(errors) {
          assert(!errors);
          done();
        });
      });

      it('should error if length is shorter', function(done) {
        validator.validate({ firstName: 'f' }, function(error) {
          error.message.should.equal("\"minLength\" validation rule failed for input: 'f'");
          done();
        });
      });
    });

    describe('maxLength', function() {

      it('should validate maxLength', function(done) {
        validator.validate({ lastName: 'foo' }, function(errors) {
          assert(!errors);
          done();
        });
      });

      it('should error if length is longer', function(done) {
        validator.validate({ lastName: 'foobar' }, function(error) {
          error.message.should.equal("\"maxLength\" validation rule failed for input: 'foobar'");
          done();
        });
      });
    });

  });
});
