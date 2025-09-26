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


/*Function to get vehicle details when user click at link */
//get vehicle by ID

async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM inventory WHERE inv_id = $1",
      [inv_id]
    )
    return data.rows[0] //that will return one vehicle
  } catch (error) {
    console.error("getVehicleById error ", error)
  }
}

//Add classification model
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING*"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch {
    
    console.error("addClassification error:", error)
    return null
  }
  
}


//module.exports = { getClassifications }
module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};