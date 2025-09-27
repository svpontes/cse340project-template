const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* Inventory by classification */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()

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

/* Vehicle detail view */
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

/* Management view */
invCont.buildManagementView = async function (req, res, next) {
  console.log("buildManagementView chamado!")
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* Add classification form */
invCont.buildAddClassification = async function (req, res, next) {
  console.log("buildAddClassification chamado!")
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
  })
}

/* Register classification */

invCont.registerClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const regResult = await invModel.addClassification(classification_name)
  const nav = await utilities.getNav()

  if (regResult) {
    req.flash("success", "New classification added successfully!")
    res.redirect("/inv") // Return to management view
  } else {
    req.flash("error", "Sorry, the classification could not be added.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      error: null,
    })
  }
}

//build add inventory
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add inventory",
      nav,
      classificationList,
      inventoryData: {},
      error:[]
    })
    
  } catch (error) {
    next(error)
  }
  
}
/*
//POST form processing
invCont.registerInventory = async function (req, res, next) {
  let classificationList;
  try {
    const {
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, classification_id, inv_miles,
    } = req.body
    //validation server-side
    const errors = []
    
    if (!inv_make || inv_make.trim().length < 1) errors.push("Enter the vehicle make.")
    if (!inv_model || inv_model.trim().length < 1) errors.push("Enter the vehicle model.")
    if (!inv_year || isNaN(Number(inv_year))) errors.push("Enter a valid year.")
    if (!inv_description || inv_description.trim().length < 10) errors.push("Enter a description (min 10 chars).")
    if (!inv_image || inv_image.trim().length < 1) errors.push("Enter an image path.")
    if (!inv_thumbnail || inv_thumbnail.trim().length < 1) errors.push("Enter a thumbnail path.")
    if (!inv_price || isNaN(Number(inv_price))) errors.push("Enter a valid price.")
    if (!classification_id) errors.push("Choose a classification.")
    if (!inv_miles || inv_miles.trim().length < 1) errors.push("Enter the vehicle miles.")
    
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)

    if (errors.length > 0) {
      return res.status(400).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        inventoryData: req.body,
        errors,
      })
    }
  } catch (error) {
    console.error("Error in registerInventory", error)
    const nav = await utilities.buildClassificationList(req.body.classification_id)
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      inventoryData: req.body,
      errors:["Unexpected Error when adding inventory."]
    })
  }
}*/
//POST form processing
invCont.registerInventory = async function (req, res, next) {
  try {
    const {
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, classification_id, inv_miles, inv_color
    } = req.body

    // validation server-side
    const errors = []
    if (!inv_make || inv_make.trim().length < 1) errors.push("Enter the vehicle make.")
    if (!inv_model || inv_model.trim().length < 1) errors.push("Enter the vehicle model.")
    if (!inv_year || isNaN(Number(inv_year))) errors.push("Enter a valid year.")
    if (!inv_description || inv_description.trim().length < 10) errors.push("Enter a description (min 10 chars).")
    if (!inv_image || inv_image.trim().length < 1) errors.push("Enter an image path.")
    if (!inv_thumbnail || inv_thumbnail.trim().length < 1) errors.push("Enter a thumbnail path.")
    if (!inv_price || isNaN(Number(inv_price))) errors.push("Enter a valid price.")
    if (!classification_id) errors.push("Choose a classification.")
    if (!inv_miles || inv_miles.trim().length < 1) errors.push("Enter the vehicle miles.")
    if (!inv_color || inv_color.trim().length < 1) errors.push("Enter the vehicle color.")

    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)

    if (errors.length > 0) {
      return res.status(400).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        inventoryData: req.body,
        errors,
      })
    }

    // >>>>>> CHAMAR MODEL PARA INSERIR NO BANCO <<<<<<
    const regResult = await invModel.addInventoryModel(
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, classification_id, inv_miles, inv_color
    )

    if (regResult) {
      req.flash("success", "New vehicle added successfully!")
      res.redirect("/inv") // volta para a página de gestão
    } else {
      req.flash("error", "Sorry, the vehicle could not be added.")
      res.status(500).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        inventoryData: req.body,
        errors: ["Database error while adding vehicle."],
      })
    }
  } catch (error) {
    console.error("Error in registerInventory:", error)
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      inventoryData: req.body,
      errors: ["Unexpected error when adding inventory."],
    })
  }
}


module.exports = invCont