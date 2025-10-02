function checkAccountType(req, res, next) {
  const accountType = res.locals.accountData?.account_type;

  if (res.locals.loggedin && (accountType === "Employee" || accountType === "Admin")) {
    return next();
  }

  req.flash("error", "Access denied. You must be logged in as an Employee or Admin.");
  return res.redirect("/account/login");
}

module.exports = checkAccountType;
