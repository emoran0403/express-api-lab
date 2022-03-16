const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/index"); // goes to the routes directory where it finds the index.js file, which holds the other routes in the project

let app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("client"));

app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.send("you didn't make it!");
});

let port = 3000;
app.listen(port, () => console.log(`Chirper Server is up and running on port: ${port}`));
