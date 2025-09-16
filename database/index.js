const { Pool } = require("pg")//imports the "Pool" functionality from the "pg" package. 10 is the default number. Allow multiple site visitors to be interacting with the databas at time
require("dotenv").config() //imports dotenv package to deal with sensitive info (datbase location, connection credentials )
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool //creates a local pool variable to hold the functionality of the "pool" conection
if (process.env.NODE_ENV == "development") {  //test to see if the code exixts in a dev environment
  pool = new Pool({ //creates a instance of pool from the imported pool class (const {pool})
      connectionString: process.env.DATABASE_URL,//indicates how the pool will connect to the database (using a connectionString) the string value
    //is stored in a name - value par, which is in the .env file locally, and in a environment variable  on a remote server
    ssl: { //the ssl (secure socket layer) is used in the connection to the database, but in a remote connection, and exists in our dev environment
      rejectUnauthorized: false,//tells the server to not reject our connection, because our connection happens in the same system an their connection is secure
    },
})

// Added for troubleshooting queries
// during development
module.exports = {
  async query(text, params) { //exports an asynchronous query function that accepts the text of the query and any parameters
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  }, //When the query is run it will add the SQL to the console.log - if the query fails, it will console log the SQL text to the console as an error.
}
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL, //indicates the value of the connection string will be found in an environment variable. In the production environment, such a variable will not be stored in our .env file, but in the server's settings.
  })
  module.exports = pool //exports the pool object to be used whenever a database connection is needed. OBS: This is for the production environment, which means the queries will not be entered into the console.
} //end of else structure