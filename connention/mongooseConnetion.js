const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO connneted...");
  })
  .catch((err) => {
    console.log("error to connect to the db", err);
  });


