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
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const data = await pool.query(sql, [classification_name]);
    return data.rows[0];
  } catch (error) {  
    console.error("addClassification error:", error);
    return null;
  }
}

//Add inventory model
async function addInventoryModel(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, classification_id, inv_miles, inv_color) {
  
  try {
    const sql = `INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, classification_id, inv_miles, inv_color
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9, $10) RETURNING inv_id;`
    const values = [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, classification_id, inv_miles, inv_color]
    const result = await pool.query(sql, values)
    return result.rows[0]

  } catch (error) {
    throw error
  }
}

  
//module.exports = { getClassifications }
module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventoryModel}