// controllers/accountController.js
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()
console.log("jwt e dotenv carregados no accountController")

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

async function accountLogin(req, res) {
  console.log("🔐 accountLogin iniciado");

  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    console.log("❌ Nenhuma conta encontrada para:", account_email);
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    const match = await bcrypt.compare(account_password, accountData.account_password);
    if (!match) {
      console.log("❌ Senha incorreta para:", account_email);
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    delete accountData.account_password;
    console.log("✅ Login bem-sucedido para:", account_email);

    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000,
    });

    console.log("🍪 Cookie JWT criado");
    return res.redirect("/account");
  } catch (error) {
    console.error("❌ Erro no login:", error.message);
    req.flash("error", "Login failed. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}



/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  const nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    accountData
  });
}

async function updateAccount (req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

  if (updateResult) {
    req.flash("success", "Account information updated successfully.");
  } else {
    req.flash("error", "Update failed. Please try again.");
  }

  const accountData = await accountModel.getAccountById(account_id);
  const nav = await utilities.getNav();

  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    accountData
  });
};

//change client password

async function updatePassword(req, res, next) {
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("success", "Password updated successfully.");
    } else {
      req.flash("error", "Password update failed.");
    }

    const accountData = await accountModel.getAccountById(account_id);
    const nav = await utilities.getNav();

    res.render("account/accountManagement", {
      title: "Account Management",
      nav,
      accountData
    });
  } catch (error) {
    req.flash("error", "Unexpected error. Please try again.");
    res.redirect(`/account/update/${account_id}`);
  }
};




module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccount, updateAccount, updatePassword }