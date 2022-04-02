require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const Havainto = require("./models/havainto");

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("build"));

app.get("/api/havainnot", (req, res) => {
  Havainto.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/havainnot/:id", (req, res, next) => {
  Havainto.findById(req.params.id)
    .then((havainto) => {
      res.json(havainto);
    })
    .catch((error) => next(error));
});

app.delete("/api/havainnot/:id", (request, response, next) => {
  Havainto.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const generateId = () => {
  min = Math.ceil(10);
  max = Math.floor(10000);
  return Math.floor(Math.random() * (max - min) + min);
};

app.post("/api/havainnot", (request, response, next) => {
  const body = request.body;

  const havainto = new Havainto({
    id: generateId(),
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

app.put("/api/havainnot/:id", (request, response, next) => {
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
