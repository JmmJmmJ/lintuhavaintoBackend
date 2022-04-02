const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

let havainnot = [
  {
    id: "1",
    laji: "Harakka",
    paikka: "Alajärvi",
    paiva: "30.3.2022",
    aika: "16:05",
    maara: 4,
    kommentit: "Lumi sadetta",
  },
  {
    id: "2",
    laji: "Varis",
    paikka: "Seinäjoki",
    paiva: "29.3.2022",
    aika: "12.24",
    maara: 3,
    kommentit: "Lunta",
  },
];

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/api/havainnot", (req, res) => {
  res.json(havainnot);
});

app.delete("/api/havainnot/:id", (request, response) => {
  const id = Number(request.params.id);
  havainnot = havainnot.filter((havainto) => havainto.id !== id);

  response.status(204).end();
});

app.post("/api/havainnot", (request, response) => {
  const body = request.body;

  if (!body.laji) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const havainto = {
    id: Math.random() * 1000,
    laji: body.laji,
    paikka: body.paikka,
    paiva: body.paiva,
    aika: body.aika,
    maara: body.maara,
    kommentit: body.kommentti,
  };

  havainnot = havainnot.concat(havainto);

  response.json(havainto);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
