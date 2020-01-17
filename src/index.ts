import express from "express";
import env from "dotenv";

env.config();

const app = express();
app.get("/", (req, res) => {
  res.send("its working");
});

if (process.env.PORT) {
  console.log("Listening on port", process.env.PORT);
  app.listen(process.env.PORT);
}
