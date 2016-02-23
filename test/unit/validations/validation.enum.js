var assert = require('assert');

var Validator = require('../../../lib/waterline/core/validations');

describe('validations', function() {

  describe('enum', function() {
    var validator;

    before(function() {

      var validations = {
        emailType: {
          type: 'string',
          in: ['work', 'personal'],
        }
      };

      validator = new Validator();
      validator.initialize(validations);
    });

    it('should error if invalid enum is set', function(done) {
      validator.validate({ emailType: 'other' }, function(error) {
        error.message.should.equal("Invalid emailType. Input failed in validation: \'other\'");
        done();
      });
    });

    it('should NOT error if valid enum is set', function(done) {
      validator.validate({ emailType: 'personal' }, function(err) {
        assert.ifError(err);
        done();
      });
    });
  });

});
