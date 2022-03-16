const express = require("express");
const chirpsRouter = require("./chirps");

let router = express.Router();

//* Current route is /api
router.use("/chirps", chirpsRouter);

module.exports = router;
