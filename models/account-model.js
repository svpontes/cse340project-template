/*Model account*/
const pool = require("../database")

/*Register new account*/
async function registerAccount(firstname, lastname, email, password) {
    try {
        const sql = `INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *`;
        return await pool.query(sql, [firstname, lastname, email, password])
    } catch (error) {
        return error.message
    }
}
/*checking existing email function */
/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {registerAccount, checkExistingEmail}