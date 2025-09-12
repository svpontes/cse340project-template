--Insert ( Tony, Stark, tony@starkent.com, Iam1ronM@n, client )

INSERT INTO account(
	account_id, 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password, 
    account_type
)

VALUES (
	1, 
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n',
	'Client'
);


--Modify the Tony Stark record to change the account_type to "Admin".
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

--Delete the Tony Stark record from the database.
DELETE FROM account
WHERE account_id = 1;

-- 4 - Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors"
UPDATE inventory
SET inv_description = REPLACE (inv_description, 'small interiors', 'huge interior')
WHERE inv_id = 10;

--Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category
SELECT
	I.inv_make, I.inv_model, C.classification_name
FROM inventory AS I
INNER JOIN classification AS C
	ON 
	I.classification_id = C.classification_id
WHERE 
	C.classification_name = 'Sport';

-- 6 - Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns
UPDATE inventory
SET
    inv_image = REPLACE(inv_image, '/', 'vehicles'),
    inv_thumbnails = REPLACE(inv_thumbnail, '/', 'vehicles'),