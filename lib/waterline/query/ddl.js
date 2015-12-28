/**
 * DDL Queries
 */

module.exports = {

  /**
   * Describe a collection
   */

  describe: function(cb) {
    this.adapter.describe(cb);
  },

  /**
   * Drop a table/set/etc
   */

  drop: function(cb) {
    this.adapter.drop(cb);
  }

};
