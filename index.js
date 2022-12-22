const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const port = process.env.PORT || 8080;
require("colors");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("database connected successful.".red.bold);
  } catch (error) {
    console.log("database not connected");
    console.log(error.message);
    process.exit(1);
  }
};

app.listen(port, () => {
  console.log(`server running at port ${port}`.yellow.bold);
  dbConnect();
});
