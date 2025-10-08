'use strict' 
 
 // Get a list of items in inventory based on the classification_id 
 let classificationList = document.querySelector("#classificationList")
 classificationList.addEventListener("change", function () { 
  let classification_id = classificationList.value 
  console.log(`classification_id is: ${classification_id}`) 
  let classIdURL = "/inv/getInventory/"+classification_id 
  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   console.log(data); 
   buildInventoryList(data); 
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 
 })

 // Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
 let inventoryDisplay = document.getElementById("inventoryDisplay"); 
 // Set up the table labels 
 let dataTable = '<thead>'; 
 dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
 dataTable += '</thead>'; 
 // Set up the table body 
 dataTable += '<tbody>'; 
 // Iterate over all vehicles in the array and put each in a row 
 data.forEach(function (element) { 
  console.log(element.inv_id + ", " + element.inv_model); 
  dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
  dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
  dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
 }) 
 dataTable += '</tbody>'; 
 // Display the contents in the Inventory Management view 
 inventoryDisplay.innerHTML = dataTable; 
}

function changeThumbnail(thumbClicked) {
        const mainImage = document.getElementById('main-image');
        
        // 1. Obtém o caminho da imagem FULL (alta resolução)
        const pathFullimg = thumbClicked.getAttribute('data-full-src');
        console.log('Caminho de alta resolução buscado:', pathFullimg);
        // 2. Troca o src da imagem principal.
        // NOTA: É CRUCIAL que a sua tag IMG principal no EJS tenha o ID 'imagem-principal'
        mainImage.src = pathFullimg;
        
        // 3. Gestão da classe "ativa" para destaque visual
        const thumb = document.querySelectorAll('.thumbimg');
        thumb.forEach(thumbnail => {
            thumbnail.classList.remove('active');
        });
        thumbClicked.classList.add('active');
}