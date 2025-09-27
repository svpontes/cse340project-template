// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/") // <- Corrigido: importando o Util

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId))

// Route for vehicle detail by ID
router.get("/detail/:invId", Util.handleErrors(invController.buildByInvId))

// views/inventory/management.ejs managment view
router.get("/", Util.handleErrors(invController.buildManagementView))

// show form
router.get("/add-classification", Util.handleErrors(invController.buildAddClassification))

//method post to register new classification
router.post("/add-classification", Util.handleErrors(invController.registerClassification))


//show add inventory form
router.get("/add-inventory", Util.handleErrors(invController.buildAddInventory))

//process add inventory form
router.post("/add-inventory", Util.handleErrors(invController.registerInventory))

module.exports = router
