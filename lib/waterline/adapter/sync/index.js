// TODO: probably can eliminate this file
module.exports = {
  migrateDrop: require('./strategies/drop.js'),
  migrateSafe: require('./strategies/safe.js')
};
