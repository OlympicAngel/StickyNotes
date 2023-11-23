const mongoose = require("mongoose");

const uri = process.env.DATABASE_URL;
console.log(uri)

async function main() {
  try {
    await mongoose.connect(uri)
    console.log("mongoose Connected!")
  } catch (error) {
    console.log(error)
  }
}

module.exports = main;
