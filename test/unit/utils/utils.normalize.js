var assert = require('assert'),
    normalize = require('../../../lib/waterline/utils/normalize');

describe("Normalize utility", function() {

  describe(".criteria()", function() {

    describe("sort", function() {
      it("should default to asc", function() {
        var criteria = normalize.criteria({ sort: "name" });

        assert(criteria.sort.name === 1);
      });

      it("should throw error on invalid order", function() {
        var error;

        try {
          normalize.criteria({ sort: "name up" });
        } catch(e) {
          error = e;
        }

        assert(typeof error !== 'undefined');
      });

      it("should properly normalize valid sort", function() {
        var criteria = normalize.criteria({ sort: "name desc" });

        assert(criteria.sort.name === -1);
      });
    });

  });

  describe(".expandPK()", function() {
    it("casts integers", function() {
      var context = {
        attributes: {
          id: {
            type: 'integer',
            primaryKey: true
          }
        }
      };

      var options = {
        id: '123'
      }

      var result = normalize.expandPK(context, options);

      assert(result.id === 123);
    });

    it("casts uuids", function() {
      var context = {
        attributes: {
          id: {
            type: 'uuid',
            primaryKey: true
          }
        },
        schema: {
          id: {
            type: 'uuid'
          }
        }
      };

      var options = {
        id: 'prefix_0b6c28e0-a117-4a9e-9a0d-60f0992edbee'
      }

      var result = normalize.expandPK(context, options);

      assert(result.id === '0b6c28e0-a117-4a9e-9a0d-60f0992edbee');
    });

    it("casts uuids with capitals", function() {
      var context = {
        attributes: {
          id: {
            type: 'uuid',
            primaryKey: true
          }
        },
        schema: {
          id: {
            type: 'uuid'
          }
        }
      };

      var options = {
        id: '0B6C28E0-A117-4A9E-9A0D-60F0992EDBEE'
      }

      var result = normalize.expandPK(context, options);

      assert(result.id === '0B6C28E0-A117-4A9E-9A0D-60F0992EDBEE');
    });

    it("does not cast uuids with an underlying non-uuid type", function() {
      var context = {
        attributes: {
          id: {
            type: 'uuid',
            primaryKey: true
          }
        },
        schema: {
          id: {
            type: 'text'
          }
        }
      };

      var options = {
        id: 'prefix_0b6c28e0-a117-4a9e-9a0d-60f0992edbee'
      }

      var result = normalize.expandPK(context, options);

      assert(result.id === 'prefix_0b6c28e0-a117-4a9e-9a0d-60f0992edbee');

    });

    it("throws a TypeError when attempting to cast a non-uuid", function() {
      var context = {
        attributes: {
          id: {
            type: 'uuid',
            primaryKey: true
          }
        },
        schema: {
          id: {
            type: 'uuid'
          }
        }
      };

      var options = {
        id: 'hello'
      }

      try {
        normalize.expandPK(context, options);
        throw new Error('wrong error');
      } catch (e) {
        assert(e);
        assert(e instanceof TypeError);
        assert(e.message === "value 'hello' cannot be coerced to UUID");
      }

    });
  });

});
