const Havainto = require("../models/havainto");
const User = require("../models/user");

const havainnotInDb = async () => {
  const havainnot = await Havainto.find({});
  return havainnot.map((hav) => hav.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  havainnotInDb,
  usersInDb,
};
