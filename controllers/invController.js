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
//Deliver inventory management function
/* Management view */
invCont.buildManagementView = async function (req, res, next) {
  console.log("buildManagementView chamado!")
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id); // coleta o ID da URL

  let nav = await utilities.getNav();

  // busca os dados do item no banco
  const itemData = await invModel.getInventoryById(inv_id);

  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();

  const inv_id = parseInt(Array.isArray(req.body.inv_id) ? req.body.inv_id[0] : req.body.inv_id);
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}
/* ***************************
 *  Build Delete Inventory Confirmation View
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id); // coleta o ID da URL

  let nav = await utilities.getNav();

  // busca os dados do item no banco
  const itemData = await invModel.getInventoryById(inv_id);

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/delete-confirmation", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  });
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id); // coleta o ID do item

  const deleteResult = await invModel.deleteInventory(inv_id); // função do model (próxima etapa)

  if (deleteResult) {
    req.flash("success", "The vehicle was successfully deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("error", "Sorry, the delete failed.");
    res.redirect(`/inv/delete/${inv_id}`); // redireciona para a view de confirmação
  }
};




module.exports = invCont