// controllers/accountController.js
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    firstname: req.body?.firstname || "",
    lastname: req.body?.lastname || "",
    email: req.body?.email || "",
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10) // assíncrono
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      firstname: account_firstname,
      lastname: account_lastname,
      email: account_email,
      errors: null,
    })
  }

  // Salvar no banco
  let regResult
  try {
    regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  } catch (error) {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      firstname: account_firstname,
      lastname: account_lastname,
      email: account_email,
      errors: null,
    })
  }

  // Se sucesso
  if (regResult) {
    req.flash("notice", `Congratulations, you're registered! ${account_firstname}, Please log in.`)
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      firstname: account_firstname,
      lastname: account_lastname,
      email: account_email,
      errors: null,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }
