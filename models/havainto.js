const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

const havaintoSchema = new mongoose.Schema({
  laji: { type: String, required: true },
  paikka: String,
  paiva: { type: Date, required: true },
  aika: String,
  maara: String,
  kommentit: String,
});

havaintoSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Havainto", havaintoSchema);
