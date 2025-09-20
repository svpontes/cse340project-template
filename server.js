/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const utilities = require("./utilities/")

/* ***********************
 * View Engine Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* *************************
 * Routes
 *************************/
app.use(static)                     // rotas estáticas
app.use("/inv", inventoryRoute)     // rotas do inventário
app.use(errorRoute)                 // rota para erro intencional 500
app.get("/", utilities.handleErrors(baseController.buildHome)) // página inicial

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
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* ***********************
 * Express Error Handler
 * Deve estar após todas as rotas
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

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
