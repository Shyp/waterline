var assert = require('assert');
require('should');

var Waterline = require('../../lib/waterline');

describe('Waterline Collection', function() {

  describe('validations', function() {
    var waterline = new Waterline(),
        User;

    before(function(done) {

      // Extend for testing purposes
      var Model = Waterline.Collection.extend({
        identity: 'user',
        connection: 'my_foo',
        types: {
          password: function(val) {
            return val === this.passwordConfirmation;
          }
        },
        attributes: {
          name: {
            type: 'string',
            required: true
          },

          email: {
            type: 'email'
          },

          sex: {
            type: 'string',
            enum: ['male', 'female']
          },

          username: {
            type: 'string',
            contains: function() {
              return this.name;
            }
          },

          password: {
            type: 'password'
          }
        }
      });

      waterline.loadCollection(Model);

      var connections = {
        'my_foo': {
          adapter: 'foobar'
        }
      };

      // Fixture Adapter Def
      var adapterDef = { create: function(con, col, values, cb) { return cb(null, values); }};
      waterline.initialize({ adapters: { foobar: adapterDef }, connections: connections }, function(err, colls) {
        if(err) done(err);
        User = colls.collections.user;
        done();
      });
    });

    it('should work with valid data', function(done) {
      User.create({ name: 'foo bar', email: 'foobar@gmail.com'}, function(err, user) {
        assert(!err);
        done();
      });
    });

    it('should error with invalid data', function(done) {
      User.create({ name: '', email: 'foobar@gmail.com'}, function(err, user) {
        assert(!user);
        err.message.should.equal("\"required\" validation rule failed for input: ''");
        done();
      });
    });

    it('should support valid enums on strings', function(done) {
      User.create({ name: 'foo', sex: 'male' }, function(err, user) {
        assert(!err);
        assert(user.sex === 'male');
        done();
      });
    });

    it('should error with invalid enums on strings', function(done) {
      User.create({ name: 'foo', sex: 'other' }, function(err, user) {
        assert(!user);
        err.message.should.equal("\"in\" validation rule failed for input: 'other'");
        done();
      });
    });

    it('should work with valid username', function(done) {
      User.create({ name: 'foo', username: 'foozball_dude' }, function(err, user) {
        assert(!err);
        done();
      });
    });

    it('should error with invalid username', function(done) {
      User.create({ name: 'foo', username: 'baseball_dude' }, function(err, user) {
        assert(!user);
        err.message.should.equal("\"contains\" validation rule failed for input: 'baseball_dude'");
        done();
      });
    });

    it('should support custom type functions with the model\'s context', function(done) {
      User.create({ name: 'foo', sex: 'male', password: 'passW0rd', passwordConfirmation: 'passW0rd' }, function(err, user) {
        assert(!err);
        done();
      });
    });

    it('should error with invalid input for custom type', function(done) {
      User.create({ name: 'foo', sex: 'male', password: 'passW0rd' }, function(err, user) {
        assert(!user);
        err.message.should.equal("`password` should be a password (instead of \"passW0rd\", which is a string)");
        done();
      });
    });

  });
});
