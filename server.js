/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const cookieParser = require("cookie-parser")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database')
const flash = require("connect-flash")
const messages = require("express-messages")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")

/* ***********************
 * View Engine Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))



// Flash Messages Middleware
app.use(flash())
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res)
  next()
})

// Body parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 

/* Cookie parser - necessário para JWT */
app.use(cookieParser())
console.log("✅ cookieParser middleware carregado")

/* JWT authorization middleware */
app.use(utilities.checkJWTToken);
console.log("🛡️ Middleware JWT aplicado globalmente");


/* Test route */
app.get("/inv/test", (req, res) => {
    res.send("rota /inv/test funcionando!")
})

/* *************************
 * Rotas públicas (antes do checkJWTToken)
 *************************/
app.use(static)                     
app.use("/inv", inventoryRoute)     
app.get("/", utilities.handleErrors(baseController.buildHome)) 
app.use("/account", accountRoute) // Login, Register etc.

/* *************************
 * JWT Middleware (depois das rotas públicas)
 *************************/
app.use((req, res, next) => {
  console.log("📥 Recebendo cookies:", req.cookies)
  next()
})


/* *************************
 * Outras rotas
 *************************/
app.use(errorRoute)                 // rota para erro intencional 500

/* *************************
 * File Not Found Route - deve ser a última rota normal
 *************************/
app.use((req, res, next) => {
  const err = new Error('Sorry, we appear to have lost that page.')
  err.status = 404
  next(err)
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation*/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`❌ Error at: "${req.originalUrl}": ${err.message}`);

  let message;
  if (err.status === 404) {
    message = err.message
  } else if (err.status === 500) {
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


