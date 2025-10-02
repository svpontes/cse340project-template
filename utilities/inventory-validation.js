/**Server side validation */
const { body, validationResult } = require("express-validator")
const utilities = require("./")

const classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 }).withMessage("Please provide a classification name")
            .matches(/^[A-Za-z0-9]+$/).withMessage("No spaces or special characters allowed.")
    ]
}

const classificationData = async (req, resizeBy, next) => {
    
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            tittle: "Add Classification",
            nav,
            error: null
            
        })
    }
}

const checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    classification_id,
    inv_miles,
    inv_color
  } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      classification_id,
      inv_miles,
      inv_color
    });
    return;
  }
  next();
};

const inventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 1 }).withMessage("Make is required."),
    body("inv_model").trim().isLength({ min: 1 }).withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year."),
    body("inv_description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters."),
    body("inv_image").trim().isLength({ min: 1 }).withMessage("Image path is required."),
    body("inv_thumbnail").trim().isLength({ min: 1 }).withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Enter a valid price."),
    body("classification_id").isInt().withMessage("Choose a valid classification."),
    body("inv_miles").trim().isLength({ min: 1 }).withMessage("Miles is required."),
    body("inv_color").trim().isLength({ min: 1 }).withMessage("Color is required.")
  ];
};

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const {
    inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, classification_id, inv_miles, inv_color
  } = req.body;

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      inventoryData: req.body,
      errors: errors.array()
    });
    return;
  }
  next();
};
