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
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont
/*
const invModel = require("../models/inventory-model") //brings the inventory-model.js file into scope and stores its functionality into a invModel variable.
const utilities = require("../utilities/") //brings the utilities > index.js file into scope and stores its functionality into an utilities variable.

const invCont = {} //creates an empty object in the invCont variable.

/* ***************************
 *  Build inventory by classification view
 * ************************** */
//invCont.buildByClassificationId = async function (req, res, next) { // line 9 comments: creates an asynchronous, anonymous function
// which accepts the request and response objects,
    // along with the Express next function as parameters. The function is stored into a named method of buildByClassificationId.
    
    //Line 10 - collects the classification_id that has been sent, as a named parameter, through the URL and stores it into the 
    // classification_id variable.
    /*req is the request object, which the client sends to the server. params is an Express function, used to represent data that
     is passed in the URL from the client to the server. 
    classificationId is the name that was given to the classification_id value in the inventoryRoute.js file (see line 7 of that file). */
  /*const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont

/*Line 11 - calls the getInventoryByClassificationId function (you'll build that next), which is in the inventory-model file and passes the classification_id as a parameter. The function "awaits" the data to be returned, and the data is stored in the data variable.
Line 12 - calls a utility function to build a grid, containing all vehicles within that classification (you'll build this later in this activity). Note that the "data" array is passed in as a parameter. An HTML string, containing a grid, is returned and stored in the grid variable.
Line 13 - calls the function to build the navigation bar for use in the view and stores it in the nav variable.
Line 14 - extracts the name of the classification, which matches the classification_id, from the data returned from the database and stores it in the className variable.
Line 15 - calls the Express render function to return a view to the browser. The view to be returned is named classification, which will be created within an inventory folder, within the already existing views folder.
Line 16 - build the "title" value to be used in the head partial, but you'll notice that it is dynamic to match the data.
Line 17 - contains the nav variable, which will display the navigation bar of the view.
Line 18 - contains the HTML string, containing the - grid - of inventory items.
Line 19 - ends the "render" function which started on line 11.
Line 20 - ends the function started on line 9*/