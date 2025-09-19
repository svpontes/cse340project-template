const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 *
 * *************** */
let pool
if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  // Adicionado para solucionar problemas de consultas durante o desenvolvimento
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    },
  }
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL, //postgresql://cse340:mfTWGfLQW7oK107TbUBB0jE3yOOCdseH@dpg-d345k2nfte5s73eg6me0-a.frankfurt-postgres.render.com/cse340_0gi7
  })
  module.exports = pool
}