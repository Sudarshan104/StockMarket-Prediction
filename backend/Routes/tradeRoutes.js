const express = require("express");
const router = express.Router();
const { createTrade } = require("../controller/tradeController");

router.post("/", createTrade);

module.exports = router;
