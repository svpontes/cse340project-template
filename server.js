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

/* ***********************
 * View Engine Templates
 *************************/
app.set("view engine", "ejs")
app.use("expressLayouts")
app.set("layout", "./layouts/layout")


/* ***********************
 * Routes
 *************************/
app.use(static)

//index route
/*app.get("/", function (req, res) {
  res.render("index", {title: "Home"})
})*/

app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

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


/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
/*const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")


/* ***********************
 * view engine and templates
 *************************/
/*app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") //not at views root

/* ***********************
 * Routes
 *************************/
/*

app.use(static)

//index route
app.get("/", baseController.buildHome)//A comment to introduce the route

//codigo anterior
//app.get("/", function (req, res){ res.render("index", {title: "Home"})})

app.use("/inv", inventoryRoute) //composed of three elements: app.use() is an Express function that directs
// the application to use the resources passed in as parameters.
///inv is a keyword in our application, indicating that a route that contains this word will use this route
// file to work with inventory-related processes; "inv" is simply a short version of "inventory".
//inventoryRoute is the variable representing the inventoryRoute.js file which was required (brought into the scope of the server.js file) earlier.

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
/*
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
/*app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})*/
