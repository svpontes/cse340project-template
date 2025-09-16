const pool = require("../database/") //imports the database connection file (named index.js) from database folder

//get all classification data
async function getClassifications() { //creates a assynchronous function, named getClassifications. Assync functions returns a promise
    
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") // will return (send back) the result of the SQL query
    //which will be sent to the database server using a pool connection, when the resultset (data) or an error, is sent back by the database server. 

}

module.exports = {getClassifications}//exports the function for use elsewhere.