const invModel = require("../models/inventory-model") //requires the inventory-model file, so it can be used to get data from the database.
const Util = {} //creates an empty Util object. Just as you did earlier in the base controller.
//Constructs the nav HTML unordered list

Util.getNav = async function (req, res, next) { //creates an asynchronous function, which accepts the request, response and next methods as parameters. 
// The function is then stored in a getNav variable of the Util object.
    let data = await invModel.getClassifications() //calls the getClassifications() function from the inventory-model file and stores the returned resultset into the data variable.
    let list = "<ul>" //creates a JavaScript variable named list and assigns a string to it. In this case, the string is the opening of an HTML unordered list. Note the use of let. 
    // This is because the value will be changed as the upcoming lines of the function are processed.
    list += '<li><a href="/" title = "Home page">HOME</a></li>' //the list variable has an addition string added to what already exists. Note the use of +=, which is the JavaScript 
    // append operator. In this instance a new list item, containing a link to the index route, is added to the unordered list.
    data.rows.forEach((row) => { //uses a forEach loop to move through the rows of the data array one at a time. For each row, the row is assigned to a row variable and is used in the function.
        list += "<li>" //appends an opening list item to the string in the list variable.
        list += //appends the code that is found on lines 14 through 20 as a string to the list variable.
            '<a href="/inv/type/' + //the classification_id value found in the row from the array. It is being added into the link route.
            row.classification_id + //the classification_name value found in the row from the array. It is being added into the title attribute.
            row.classification_id +
      '" title="See our inventory of ' + //a string that includes the beginning of an HTML anchor. The + sign is the JavaScript concatenation operator, used to join two strings together. 
      // The value in the href attribute is part of a route that will be watched for in an Express router.
      row.classification_name + //the last part of the string forming the opening HTML anchor tag.
      ' vehicles">' +//the classification_name from the row being displayed between the opening and closing HTML anchor tags. This is the display name in the navigation bar.
      row.classification_name +
      "</a>" //the closing HTML anchor tag.
    list += "</li>" //the closing list item tag being added to the list variable.
    })
    list += "</li>"
    return list //the ending of the forEach loop and enclosed anonymous function.//
    }
module.exports = Util    