const express = require("express");
const router = express.Router();

// intencional route for error 500
router.get("/trigger-error", (req, res, next) => {
  const err = new Error("Oh no! There was a crash. Maybe try a different route?");
  err.status = 500;
  next(err);
});

module.exports = router;
