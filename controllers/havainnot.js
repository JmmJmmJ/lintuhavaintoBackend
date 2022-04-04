const havainnotRouter = require("express").Router();
const Havainto = require("../models/havainto");
const User = require("../models/user");

havainnotRouter.get("/", async (req, res) => {
  const havainnot = await Havainto.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(havainnot);
});

havainnotRouter.get("/:id", (req, res, next) => {
  Havainto.findById(req.params.id)
    .then((havainto) => {
      res.json(havainto);
    })
    .catch((error) => next(error));
});

havainnotRouter.delete("/:id", (request, response, next) => {
  Havainto.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

havainnotRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const user = await User.findById(body.userId);

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

havainnotRouter.put("/:id", (request, response, next) => {
  const { laji, paikka, paiva, aika, maara, kommentit } = request.body;

  Havainto.findByIdAndUpdate(
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
  )
    .then((updatedHavainto) => {
      response.json(updatedHavainto);
    })
    .catch((error) => next(error));
});

module.exports = havainnotRouter;
