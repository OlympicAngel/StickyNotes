const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const note = new Schema({
  note_txt: {
    type: String,
    required: true,
  },
  note_time: {
    type: String,
    required: true,
  },
  note_date: {
    type: String,
    required: true,
  }
});

//argument 1 - name of collection
//argument 2 - Schema Model
module.exports = mongoose.model('notes', note);



