var assert = require('assert');
require('should');

var Validator = require('../../../lib/waterline/core/validations');

describe('validations', function() {

  describe('types', function() {
    var validator;

    before(function() {

      var validations = {
        name: { type: 'string' },
        age: { type: 'integer' },
        group: { type: 'enum' }
      };

      validator = new Validator();
      validator.initialize(validations);
    });

    it('should validate string type', function(done) {
      validator.validate({ name: 'foo bar' }, function(errors) {
        assert(!errors);
        done();
      });
    });

    it('should validate enum type', function(done) {
      validator.validate({ group: 'foo' }, function(errors) {
        console.log(errors);
        assert(!errors);
        done();
      });
    });

    it('should validate integer type', function(done) {
      validator.validate({ age: 27 }, function(errors) {
        assert(!errors);
        done();
      });
    });

    it('should error if string passed to integer type', function(done) {
      validator.validate({ age: 'foo bar' }, function(error) {
        error.message.should.equal('`age` should be a integer (instead of "foo bar", which is a string)');
        done();
      });
    });

  });
});
