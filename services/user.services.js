const Users = require("../models/User");

exports.createUserService = async (data) => {
  return await Users.create(data);
};
exports.getUsersService = async () => {
  return await Users.find({});
};
exports.logInUserService = async (email) => {
  return await Users.findOne({ email });
};
