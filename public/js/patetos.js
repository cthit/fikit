
const sittandeDiv = document.getElementById("sittande");
const patetosDiv = document.getElementById("patetContainerDiv");



// POPULATE PATETOS DIV
function populatePatetosDiv(years){
  patetosDiv.innerHTML = "";
  years.forEach(year => {
    if (year.people.length === 0){return;} else{
      createSinglePatetDiv(year.people, year.year, patetosDiv);
    }
  });
}

function createSinglePatetDiv(sittande, year, parentDiv) {
  let patetDivContainer = document.createElement("div");
  patetDivContainer.classList.add("patetDivContainer");

  let yearTitle = document.createElement("h2");
  yearTitle.textContent = year;
  yearTitle.classList.add("yearTitle");

  let patetDiv = document.createElement("div");
  patetDiv.classList.add("patetDiv");



  let leftDiv = document.createElement("div");
  leftDiv.classList.add("patetSlide");
  let rightDiv = document.createElement("div");
  rightDiv.classList.add("patetSlide");
  let amountOfPeople = 0;

  leftDiv.appendChild(yearTitle);

  sittande.forEach(element => {
    let person = createSittande(element);

    if(amountOfPeople%2 == 0){
      leftDiv.appendChild(person);
    } else{
      rightDiv.appendChild(person);
    }
    amountOfPeople++;
  });
  
  patetDiv.appendChild(leftDiv);
  patetDiv.appendChild(rightDiv);

  patetDivContainer.appendChild(patetDiv);
  parentDiv.appendChild(patetDivContainer);
}

function createSittande(person){
  let personDiv = document.createElement("div");

  personDiv.classList.add("person");

  personDiv.appendChild(createInfoImgDiv(person));
  let postP = document.createElement("p");
  personDiv.appendChild(postP);
  postP.textContent = person.post;
  postP.classList.add("postP");

  return personDiv;
};

function createInfoImgDiv(person){
  let infoImgDiv = document.createElement("div");

  let img = document.createElement("img");
  if (person.imageFile && person.imageFile !== undefined) {
    img.src = 'img/profileImages/' + person.imageFile;
  } else {
    img.src = 'img/logos/FikIT.png';
    img.style.border = "3px solid black";

  }
  img.alt = "Profile picture for" + person.name + '"' + person.nick + '"';

  infoImgDiv.appendChild(img);

  infoImgDiv.appendChild(createInfoDiv(person));
  infoImgDiv.classList.add("infoImgDiv");

  return infoImgDiv;
}

function createInfoDiv(person){
  let infoDiv = document.createElement("div");
  infoDiv.classList.add("infoDiv");
  
  let h3 = document.createElement("h3");
  let description = document.createElement("p");

  infoDiv.appendChild(h3);
  infoDiv.appendChild(description);

  h3.textContent = person.nick;
  description.textContent = person.description;

  return infoDiv;
};


function populateSittandeDiv(sittande){
  createSinglePatetDiv(sittande, "Sittande", sittandeDiv);
}



function getAllPatetos() {
  fetch('/api/getAllPatetos')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    populatePatetosDiv(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
};


function getSittande(){
  fetch('/api/getSittande')
  .then(response => {
    if (response.ok) {
      return response.json();
    } 
    else if (response.status === 404) {
      return [];
    } 
    else {
      throw new Error('Network response was not ok');
    }
  })
  .then(data => {
    if (data.length !== 0) {
      populateSittandeDiv(data.people);
    } else {
      console.log("No sittande found");
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}


getAllPatetos();
getSittande();




