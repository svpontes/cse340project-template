const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()

  if (!data || data.length === 0) {
    return next(new Error("No vehicles found for this classification."))
  }

  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicle = await invModel.getVehicleById(inv_id)
  const nav = await utilities.getNav()

  if (!vehicle) {
    return next(new Error("Vehicle not found!"))
  }

  res.render("./inventory/vehicleDetails", {
    title: vehicle.inv_make + " " + vehicle.inv_model,
    nav,
    vehicle,
  })
}

/*Render view for add classification*/
async function buildClassification(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    error: null
  })
  
}

/*add clasification Submission process*/
async function registerClassification(req, res, next) {
  const { classification_name } = req.body
  const regResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()
  
  if (regResult) {
    req.flash("New classification added successfully!")
    res.redirect("/inv") //return to managment view
  } else {
    req.flash(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      error: null
    })
  }
  
}


module.exports = { invCont , buildClassification, registerClassification}