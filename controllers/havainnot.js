const havainnotRouter = require("express").Router();
const Havainto = require("../models/havainto");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

havainnotRouter.get("/", async (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  console.log(decodedToken.id);
  const users = await User.findOne({ id: decodedToken.id }).populate(
    "havainnot",
    {
      laji: 1,
      paikka: 1,
      paiva: 1,
      aika: 1,
      maara: 1,
      kommentit: 1,
    }
  );

  res.json(users.havainnot);
});

havainnotRouter.delete("/:id", async (request, response, next) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  havaintoToRemove = await Havainto.findById(request.params.id);

  if (decodedToken.id === havaintoToRemove.user._id.toString()) {
    await Havainto.findByIdAndRemove(request.params.id);
  } else {
    return response.status(404).json({ error: "havainto not found" });
  }

  response.status(204).end();
});

havainnotRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const havainto = new Havainto({
    laji: body.laji,
    paikka: body.paikka,
    paiva: body.paiva,
    aika: body.aika,
    maara: body.maara,
    kommentit: body.kommentti,
    user: user._id,
  });

  const savedHavainto = await havainto.save();
  user.havainnot = user.havainnot.concat(savedHavainto._id);
  await user.save();

  response.status(201).json(savedHavainto);
});

havainnotRouter.put("/:id", async (request, response, next) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  havaintoToUpdate = await Havainto.findById(request.params.id);

  if (decodedToken.id === havaintoToUpdate.user._id.toString()) {
    const { laji, paikka, paiva, aika, maara, kommentit } = request.body;

    const updatedHavainto = await Havainto.findByIdAndUpdate(
      request.params.id,
      {
        laji,
        paikka,
        paiva,
        aika,
        maara,
        kommentit,
      },
      { new: true, runValidators: true, context: "query" }
    );

    response.json(updatedHavainto);
  } else {
    return response.status(404).json({ error: "havainto not found" });
  }
});

module.exports = havainnotRouter;
