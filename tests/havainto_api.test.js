const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");

const api = supertest(app);

const User = require("../models/user");
const Havainto = require("../models/havainto");
const helper = require("./test_helper");

describe("addition of a havainto", () => {
  let token;
  beforeEach(async () => {
    await User.deleteMany({});
    await Havainto.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();

    const response = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });

    token = response.body.token;
  });

  test("a valid haivainto can be added ", async () => {
    const newHavainto = {
      laji: "Talitiainen",
      paikka: "Alajärvi",
      paiva: "2022/1/21",
      aika: "16:01",
      maara: 2,
      kommentit: "Pihalla",
    };

    await api
      .post("/api/havainnot")
      .send(newHavainto)
      .set("Authorization", `bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const havainnotAtEnd = await helper.havainnotInDb();
    expect(havainnotAtEnd).toHaveLength(1);

    const contents = havainnotAtEnd.map((h) => h.laji);
    expect(contents).toContain("Talitiainen");
  });
});

describe("when there is havainto", () => {
  let token;
  beforeEach(async () => {
    await User.deleteMany({});
    await Havainto.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();

    const response = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });

    token = response.body.token;

    const newHavainto = {
      laji: "Talitiainen",
      paikka: "Alajärvi",
      paiva: "2022/1/21",
      aika: "16:01",
      maara: 2,
      kommentit: "Pihalla",
    };

    await api
      .post("/api/havainnot")
      .send(newHavainto)
      .set("Authorization", `bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("all havainnot are returned", async () => {
    const response = await api
      .get("/api/havainnot")
      .set("Authorization", `bearer ${token}`);

    expect(response.body).toHaveLength(1);
  });
});

describe("user creation", () => {
  test("fails if password is too short", async () => {
    const newUser = {
      username: "testi",
      pasword: "p",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const newUser = {
      username: "root",
      name: "Testuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username must be unique");
  });
});
