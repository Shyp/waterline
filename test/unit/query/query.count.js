var Waterline = require('../../../lib/waterline'),
    assert = require('assert');

describe('Collection Query', function() {

  describe('.count()', function() {
    var query;

    before(function(done) {

      var waterline = new Waterline();
      var Model = Waterline.Collection.extend({
        identity: 'user',
        connection: 'foo',
        attributes: {
          name: {
            type: 'string',
            defaultsTo: 'Foo Bar'
          },
          doSomething: function() {}
        }
      });

      waterline.loadCollection(Model);

      // Fixture Adapter Def
      var adapterDef = { count: function(con, col, criteria, cb) { return cb(null, 1); }};

      var connections = {
        'foo': {
          adapter: 'foobar'
        }
      };

      waterline.initialize({ adapters: { foobar: adapterDef }, connections: connections }, function(err, colls) {
        if(err) return done(err);
        query = colls.collections.user;
        done();
      });
    });

    it('should return an error if you try to get a count', function(done) {
      query.count({ name: 'foo'}, {}, function(err, count) {
        assert.deepEqual(err.message, 'count() is unsupported');
        done();
      });
    });
  });
});
