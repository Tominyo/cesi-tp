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
        color: document.getElementById("color").value,
        options: document.getElementById("options").value
    }

    if(enteredLodgingsData.nom  !== "" && enteredLodgingsData.color !== ""){
        // On ajoute le nouvel élement à la liste
        //lodgings.push(enteredLodgingsData)
        //console.log(lodgings)

        postData("api/logements/", { name: enteredLodgingsData.nom, colorId: parseInt(enteredLodgingsData.color) }).then((data) => {
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
               Couleur: document.createElement("input"),
               Options: document.createElement("input") 
           }
   
           const newDiv = document.createElement("div")
   
           const newButtons = {
               Supprimer: document.createElement("input"),
               Modifier: document.createElement("input")
           }
   
           for(const [key, value] of Object.entries(newInputs))
           {
               value.setAttribute("type", "text");
               value.setAttribute("id", `${key}OfLodging${lodging.id}`)
   
               key === "Nom" && value.setAttribute("value", lodging.name)
               key === "Couleur" && value.setAttribute("value", lodging.color.name)
               key === "Options" && value.setAttribute("value", lodging.options)
   
               newDiv.appendChild(value)
               document.getElementById("allLodgings").appendChild(newDiv);
           }
   
           for(const [key, value] of Object.entries(newButtons))
           {
               value.setAttribute("type", "button");
               value.setAttribute("class", key);
               value.setAttribute("id", lodging.id);
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
    lodgings.forEach((lodging) => {
        //const userPositionInArray = lodgings.indexOf(lodging);    
        //lodging.id === parseInt(id) && lodgings.splice(userPositionInArray, 1);

        if(lodging.id === parseInt(id))
        {
            fetch(`/api/logements/${id}`, {
                method: 'delete'
            }).then((response) => {
                showAllLodgings();
               console.log(response)
            })
           .catch(function(err) {
                // Error :(
                console.log(err)
            });
        }

    })

}

function editLodging(id) {
    console.log("Edit Lodging")

    const newInputs = {
        nom: document.getElementById(`NomOfLodging${id}`).value,
        color: document.getElementById(`CouleurOfLodging${id}`).value,
        //options: document.getElementById(`optionsOfLodging${id}`).value
    }

    lodgings.forEach((lodging) => {
        if(lodging.id === parseInt(id))
        {
            //lodging.nom = newInputs.nom;
            //lodging.color = newInputs.color;
            //lodging.options = newInputs.options;

            putData(`api/logements/${id}`, { name: newInputs.nom, colorId: parseInt(newInputs.color) }).then((data) => {
                console.log(data); // JSON data parsed by `data.json()` call
                showAllLodgings()
            });
        }
    })

    showAllLodgings();
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