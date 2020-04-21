const authResolver = require('./auth.js');
const goalsResolver = require('./goals.js');
const usersResolver = require('./users.js');
const friendsResolver = require('./friends.js');

const rootResolver = {
  ...authResolver,
  ...goalsResolver,
  ...usersResolver,
  ...friendsResolver
}

module.exports = rootResolver;
