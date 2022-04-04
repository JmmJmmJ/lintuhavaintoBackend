const Havainto = require("../models/havainto");
const User = require("../models/user");

const initialHavainnot = [
  {
    laji: "Harakka",
    paikka: "Alajärvi",
    paiva: "2022/3/30",
    aika: "16:05",
    maara: 4,
    kommentit: "Lumi sadetta",
  },
  {
    laji: "Varis",
    paikka: "Alajärvi",
    paiva: "2022/3/29",
    aika: "12.24",
    maara: 3,
    kommentit: "Lunta",
  },
];

const havainnotInDb = async () => {
  const havainnot = await Havainto.find({});
  return havainnot.map((hav) => hav.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialHavainnot,
  havainnotInDb,
  usersInDb,
};
