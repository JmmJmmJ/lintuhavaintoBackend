const havainnotRouter = require("express").Router();
const Havainto = require("../models/havainto");

havainnotRouter.get("/", (req, res) => {
  Havainto.find({}).then((result) => {
    res.json(result);
  });
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

havainnotRouter.post("/", (request, response, next) => {
  const body = request.body;

  const havainto = new Havainto({
    laji: body.laji,
    paikka: body.paikka,
    paiva: body.paiva,
    aika: body.aika,
    maara: body.maara,
    kommentit: body.kommentti,
  });

  havainto
    .save()
    .then((savedHavainto) => {
      response.json(savedHavainto);
    })
    .catch((error) => next(error));
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
