/**registration data validation rules*/

const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.
            
  
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.
  
        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("The email you typed exists already! Please use a differente one!")
                }
            }),
      
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty."),
  ]
}

/**Validate check login data */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}



validate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email").trim().isEmail().withMessage("Valid email is required.")
      .custom(async (email, { req }) => {
        const existing = await accountModel.getAccountByEmail(email)
        if (existing && existing.account_id != req.body.account_id) {
          throw new Error("Email already in use.")
        }
      })
  ]
}

validate.checkUpdatedAccount = async (req, res, next) => {
  const errors = validationResult(req);
  const accountData = req.body;
  const nav = await require("./").getNav();

  if (!errors.isEmpty()) {
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData
    });
  }
  next()
};

validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 12 }).withMessage("Password must be at least 12 characters.")
      .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter.")
      .matches(/[0-9]/).withMessage("Password must contain a number.")
      .matches(/[^A-Za-z0-9]/).withMessage("Password must contain a special character.")
  ]
}

validate.checkPassword = async (req, res, next) => {
  const errors = validationResult(req);
  const accountData = await accountModel.getAccountById(req.body.account_id);
  const nav = await require("./").getNav();

  if (!errors.isEmpty()) {
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData,
    })
  }
  next()
}

module.exports = validate