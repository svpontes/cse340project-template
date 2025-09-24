// Needed Resources 
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route for the path that will be sent when the "My Account" is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin))

module.exports = router