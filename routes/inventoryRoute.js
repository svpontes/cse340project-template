// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/") // <- Corrigido: importando o Util

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId))

// Route for vehicle detail by ID
router.get("/detail/:invId", Util.handleErrors(invController.buildByInvId))

module.exports = router
