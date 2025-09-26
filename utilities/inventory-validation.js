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