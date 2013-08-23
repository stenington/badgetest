module.exports = process.env.TEST_COV
  ? require('./lib-cov/badgetest')
  : require('./lib/badgetest');