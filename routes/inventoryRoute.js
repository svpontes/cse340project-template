// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const Util = require("../utilities/");
const invValidation = require("../utilities/inventory-validation");
const checkAccountType = require("../utilities/checkAccountType");

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));

// Route for vehicle detail by ID
router.get("/detail/:invId", Util.handleErrors(invController.buildByInvId));

// Inventory Management View
router.get("/", Util.handleErrors(invController.buildManagementView));

// Show form to add classification
router.get("/add-classification", checkAccountType,Util.handleErrors(invController.buildAddClassification));

// Process form to register new classification
router.post("/add-classification",checkAccountType, Util.handleErrors(invController.registerClassification));

// Show form to add inventory
router.get("/add-inventory", checkAccountType,Util.handleErrors(invController.buildAddInventory));

// Process form to register new inventory
router.post("/add-inventory", checkAccountType,Util.handleErrors(invController.registerInventory));

// New route to return inventory as JSON by classification ID
router.get("/getInventory/:classification_id", Util.handleErrors(invController.getInventoryJSON));

// New route to deliver Edit Inventory view
router.get("/edit/:inventory_id", checkAccountType, Util.handleErrors(invController.buildEditInventory));

// Route to process inventory update form
router.post("/update", checkAccountType, Util.handleErrors(invController.updateInventory));

// Route to deliver delete confirmation view
router.get("/delete/:inventory_id", checkAccountType, Util.handleErrors(invController.buildDeleteInventory));

// Route to process delete inventory form
router.post("/delete",  checkAccountType, Util.handleErrors(invController.deleteInventory));


module.exports = router;
