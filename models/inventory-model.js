const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

//module.exports = { getClassifications }
module.exports = {getClassifications, getInventoryByClassificationId};
/*
const pool = require("../database/") //imports the database connection file (named index.js) from database folder

//get all classification data
async function getClassifications() { //creates a assynchronous function, named getClassifications. Assync functions returns a promise
    
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") // will return (send back) the result of the SQL query
    //which will be sent to the database server using a pool connection, when the resultset (data) or an error, is sent back by the database server. 

}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
/*async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

module.exports = { getClassifications, getInventoryByClassificationId };//exports the function for use elsewhere.

/*
An Explanation
Lines 1-3 - a multi-line comment.
Line 4 - declares an asynchronous function by name and passes a variable, which should contain the classification_id value, as a parameter.
Line 5 - opens a try - catch block.
Lines 6-12 - creates an SQL query to read the inventory and classification information from their respective tables using an INNER JOIN. The query is written using a parameterized statement. The "$1" is a placeholder, which will be replaced by the value shown in the brackets "[]" when the SQL statement is run. The SQL is queried against the database via the database pool. Note the await keyword, which means this query will wait for the information to be returned, where it will be stored in the data variable.
Line 13 - sends the data, as an array of all the rows, back to where the function was called (in the controller).
Line 14 - ends the try and opens the catch, with an error variable being supplied to store any error that may occur.
Line 15 - writes the error, if any, to the console for us to read. We will have to deal with a better error handler in the future.
Line 16 - closes the catch block.
Line 17 - ends the function.
Very important! This function must now be included in the exports at the bottom of the file. If not, it will not be usable by the controller.*/