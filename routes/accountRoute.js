// Needed Resources 
const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")


// Route for the path that will be sent when the "My Account" is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/*Route for Registration view (GET)*/
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/**Route POST to process data***/
//router.post("/register", utilities.handleErrors(accountController.processRegistration));
//router.post(...)
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router