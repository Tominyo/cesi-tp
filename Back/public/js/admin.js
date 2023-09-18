//const users = [{id: 1, nom: "Jean", prenom: "Pierre", age:  25}]
var lodgings = []
const validateButton = document.getElementById("validate")

validateButton.addEventListener("click", addLodging);

showAllLodgings();

function updateOrDeleteLodging() {
    const deleteButtons = document.querySelectorAll(".Supprimer")
    const editButtons = document.querySelectorAll(".Modifier")

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => deleteLodging(button.id));
    })
    editButtons.forEach((button) => {
        button.addEventListener("click", () => editLodging(button.id));
    })
}

function addLodging(e) {
    e.preventDefault()

    const enteredLodgingsData = {
        //id: lodgings.length !== 0 ? lodgings[lodgings.length-1].id + 1 : 1,
        nom: document.getElementById("nom").value,
    }

    const selectedColor = document.querySelector('input[name="drone"]:checked').value;
    var selectedOptions = []
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

    for (var i = 0; i < checkboxes.length; i++) {
    selectedOptions.push(checkboxes[i].value)
    }

    if(enteredLodgingsData.nom  !== ""){
        // On ajoute le nouvel élement à la liste
        //lodgings.push(enteredLodgingsData)
        //console.log(lodgings)

        let mapData = {
            name: enteredLodgingsData.nom,
            colorId: selectedColor,
            options: selectedOptions
        }

        console.log(mapData)

        postData("api/logements/", mapData).then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            showAllLodgings()
        });
    }
}

function showAllLodgings() {
        // url (required), options (optional)
    fetch('api/logements/', {
        method: 'get'
    }).then(async (response) => {

        // On retrouve les logements
       lodgings = await response.json()

       console.log(lodgings)

       lodgings.forEach(element => {
        console.log(element)
       });

       document.getElementById("allLodgings").innerHTML = "";
       lodgings.forEach(lodging => {
           const newInputs = {
               Nom: document.createElement("input"),
           }
   
           const newDiv = document.createElement("div")

           const newColors = {
            Huey: document.createElement("input"),
            Dewey: document.createElement("input"),
            Saumon: document.createElement("input")
           }

           const newOptions = {
            TV: document.createElement("input"),
            Internet: document.createElement("input"),
            }
   
           const newButtons = {
               Supprimer: document.createElement("input"),
               Modifier: document.createElement("input")
           }

           newDiv.classList.add("list-item")
   
           for(const [key, value] of Object.entries(newInputs))
           {
               value.setAttribute("type", "text");
               value.setAttribute("id", `${key}OfLodging-${lodging.id}`)
   
               key === "Nom" && value.setAttribute("value", lodging.name)
               key === "Couleur" && value.setAttribute("value", lodging.color.name)
               key === "Options" && value.setAttribute("value", lodging.options)
   
               newDiv.appendChild(value)
               document.getElementById("allLodgings").appendChild(newDiv);
           }

           for(const [key, value] of Object.entries(newColors))
           {
            const newDivContainer = document.createElement("div")

            // D'abord le label
               const label = document.createElement("label");
               const newDivColor = document.createElement("div") 

               if(key === "Huey")
               {
                label.setAttribute("for","huey");
                label.textContent = "Huey"

                value.setAttribute("id", "huey");
                value.setAttribute("type", "radio");
                value.setAttribute("value", "huey");

                // Si la couleur est la même on assigne le checked
                if(lodging.colorId === "huey")
                    value.checked = true;
                
                newDivColor.classList.add("radio-btn");
                newDivColor.classList.add("huey");
                
               } 

               if(key === "Dewey")
               {
                label.setAttribute("for","dewey");
                label.textContent = "Dewey"

                value.setAttribute("id", "dewey");
                value.setAttribute("type", "radio");
                value.setAttribute("value", "dewey");

                if(lodging.colorId === "dewey")
                    value.checked = true;
                
                newDivColor.classList.add("radio-btn");
                newDivColor.classList.add("dewey");
               }

               if(key === "Saumon")
               {
                label.setAttribute("for","saumon");
                label.textContent = "Saumon"

                value.setAttribute("id", "saumon");
                value.setAttribute("type", "radio");
                value.setAttribute("value", "saumon");

                if(lodging.colorId === "saumon")
                    value.checked = true;
                
                newDivColor.classList.add("radio-btn");
                newDivColor.classList.add("saumon");
               }

               value.setAttribute("name", `radiogroup-${lodging.id}`);
   
                newDivContainer.appendChild(newDivColor)
                newDivContainer.appendChild(label)
                newDivContainer.appendChild(value)

               newDiv.appendChild(newDivContainer)
               document.getElementById("allLodgings").appendChild(newDiv);
           }

           for(const [key, value] of Object.entries(newOptions))
           {
            const newDivPreferences = document.createElement("div")

            // D'abord le label
               const label = document.createElement("label");
               if(key === "TV")
               {
                label.setAttribute("for","tv");
                label.textContent = "TV"
               } 
               if(key === "Internet")
               {
                label.setAttribute("for","internet");
                label.textContent = "Internet"
               }

            // Ensuite on crée sa checkbox
               value.setAttribute("type", "checkbox");
               value.setAttribute("id", `Checkbox${key}OfLodging-${lodging.id}`)
            
               console.log("HELOOOOOOOo")
               console.log(lodging.options)
                   
               if(lodging.options.length > 0)
               {
                lodging.options.forEach(option => {

                    if(key === "TV")
                    {
                        console.log("option.id:" + option.id)
                        if(option.id === "tv")
                        value.checked = true;
                    }

                    if(key === "Internet")
                    {
                        console.log("option.id:" + option.id)
                        if(option.id === "internet")
                        value.checked = true;
                    }


                });

          
               }

    
                newDivPreferences.appendChild(label)
                newDivPreferences.appendChild(value)

               newDiv.appendChild(newDivPreferences)
               document.getElementById("allLodgings").appendChild(newDiv);
           }

              
           for(const [key, value] of Object.entries(newButtons))
           {
               value.setAttribute("type", "button");
               value.setAttribute("class", key);
               value.setAttribute("id", `Button${key}Of-${lodging.id}`);
               value.setAttribute("value", key);
   
               newDiv.appendChild(value)
           }
   
           updateOrDeleteLodging();
       })

    })
   .catch(function(err) {
        // Error :(
        console.log(err)
    });

}

function deleteLodging(id) {
    console.log("Delete Lodging")
    //const buttonId = id.charAt(id.length - 1)
    const buttonId = id.split('-')[1]

    lodgings.forEach((lodging) => {
        //const userPositionInArray = lodgings.indexOf(lodging);    
        //lodging.id === parseInt(id) && lodgings.splice(userPositionInArray, 1);
        console.log("SKRRRRTss")
        console.log(lodging.id)
        console.log(id.charAt(id.length - 1))
        if(lodging.id === parseInt(buttonId))
        {
            console.log("REUSSI")
            deleteData(`api/logements/${buttonId}`).then((data) => {
                console.log(data); // JSON data parsed by `data.json()` call
                showAllLodgings()
            });

        }

    })

}

function editLodging(id) {

    //const buttonId = id.charAt(id.length - 1)
    const buttonId = id.split('-')[1]

    console.log("Edit Lodging")
    console.log(`NomOfLodging-${buttonId}`)

    const newInputs = {
        nom: document.getElementById(`NomOfLodging-${buttonId}`).value,
                                      
        //color: document.getElementById(`CouleurOfLodging${buttonId}`).value,
        //options: document.getElementById(`optionsOfLodging${id}`).value
    }

    const newColorInput = document.querySelector(`input[name=radiogroup-${buttonId}]:checked`)

    //const newOptions = document.querySelectorAll(`input[type=checkbox]`)
    const tvOption = document.getElementById(`CheckboxTVOfLodging-${buttonId}`).checked
    const internetOption = document.getElementById(`CheckboxInternetOfLodging-${buttonId}`).checked
    let listOptions = []

    if(tvOption)
    {
        listOptions.push({"id": "tv"})
    }

    if(internetOption)
    {
        listOptions.push({"id": "internet"})
    }

    const options = {
        "TV": tvOption,
        "Internet": internetOption
    }

    console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs")
    console.log(listOptions)
    console.log(newColorInput.value) 
    lodgings.forEach((lodging) => {

        if(lodging.id === parseInt(buttonId))
        {
            //lodging.nom = newInputs.nom;
            //lodging.color = newInputs.color;
            //lodging.options = newInputs.options;

            putData(`api/logements/${buttonId}`, { name: newInputs.nom, colorId: newColorInput.value, options: listOptions }).then((data) => {
                console.log("ACT77777")
                console.log(options)
                console.log(data); // JSON data parsed by `data.json()` call

                // On Actualise dans le then()
                showAllLodgings();
            });
        }
    })

    //showAllLodgings();
}

// Example POST method implementation:
async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  // Example PUT method implementation:
async function putData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async function getData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin" : "http://localhost:3000",
        "Access-Control-Allow-Credentials" : true,
        "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers" : "Origin, Content-Type, Accept"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

    // Example PUT method implementation:
async function deleteData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }