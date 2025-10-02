// Needed Resources 
const express = require("express")
const router = express.Router();
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const accountValidation = require("../utilities/account-validation")
const Util = require("../utilities")

//  Login routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Registration routes
router.get("/register", utilities.handleErrors(accountController.buildRegister));


router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

//  Account management view (JWT protected)
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));


// Rota GET para entregar a view de atualização
router.get("/update/:account_id", Util.handleErrors(accountController.buildUpdateAccount));

// Rota POST para atualizar dados da conta
router.post("/update",
  accountValidation.updateAccountRules(),
  accountValidation.checkUpdatedAccount,
  Util.handleErrors(accountController.updateAccount)
)

// Rota POST para atualizar senha
router.post("/update-password",
  accountValidation.passwordRules(),
  accountValidation.checkPassword,
  Util.handleErrors(accountController.updatePassword)
)

router.get("/logout", (req, res) => {
  res.clearCookie("jwt"); // remove o cookie do token
  req.flash("success", "You have successfully logged out.");
  res.redirect("/"); // redireciona para a home
})



module.exports = router;
