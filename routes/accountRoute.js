// Needed Resources 
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// 🔐 Login routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// 📝 Registration routes
router.get("/register", utilities.handleErrors(accountController.buildRegister));


router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// 🧭 Account management view (JWT protected)
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));

module.exports = router;
