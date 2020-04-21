const User = require('../../models/user.js');
var mongoose = require('mongoose');

const {transformUser} = require('./merge.js')


module.exports = {
  me: async (args, req) => {
    try {
        const user = await User.findById(req.session.userid);
        if (!user) {
          throw new Error('user not found');
        }

        return transformUser(user);
    } catch (err) {
      throw err;
    }
  },
  userByEmail : async (args, req) => {
    try {
      var queryParams = {
        email: args.email
      }
      const user = await User.findOne(queryParams);

      if (!user) {
        throw new Error('user not found');
      }
      return transformUser(user);
    } catch (err) {
      throw err;
    }
  }
}
