const utilities = require("../utilities/") //imports an index.js file (which does not yet exist) from a utilities folder (which does not yet exist) 
// which is one level above the current location inside the controllers folder.
const baseControler = {} //creates an empty object named baseController

baseControler.buildHome = async function (req, res) { //creates an anonymous, asynchronous function and assigns the function to buildHome which acts as a method of the baseController object
    /* In short, this is similar in concept to creating a method within a class, where baseController would be the class name and buildHome 
    would be the method. Being asynchronous, it does not block (stop) the application from executing 
    while it awaits the results of the function to be returned. The function itself accepts the request and response objects as parameters.*/

    const nav = await utilities.getNav() /*calls a getNav() function that will be found in the utilities > index.js file. The results, when returned 
    (notice the "await" keyword), will be stored into the nav variable. */
    res.render("index", {tittle: "Home", nav}) /*is the Express command to use EJS to send the index view back to the client, 
    using the response object. The index view will need the "title" name - value pair, and the nav variable. 
    The nav variable will contain the string of HTML code to render this dynamically generated navigation bar.*/
    
}

module.exports = baseControler //exports the baseController object for use elsewhere.