const mongoose = require("mongoose");

// configuring .env file
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.PORT || 3000;

mongoose.connect(`${process.env.DB_URL}`).then(() => {
  app.listen(port, () => {
    console.log(
      `DB connection successful.. App Running on PORT ${process.env.PORT}`
    );
  });
});
