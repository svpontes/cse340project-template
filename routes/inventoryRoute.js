// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;

// Needed Resources 
/*const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

/**An Explanation
Line 1 - a comment for the lines to follow.
Line 2 - brings Express into the scope of the file.
Line 3 - uses Express to create a new Router object. Remember in lesson 2 that using separate 
router files for specific elements of the application would keep the server.js file smaller and more manageable? That's what we're doing.
Line 4 - brings the inventory controller into this router document's scope to be used. */

//route to build inventory by classification view
/*Router.get("/type/:classificationId", invController.buildByClassificationId);
module.exports = router;*/