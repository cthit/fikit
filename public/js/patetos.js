
const sittandeDiv = document.getElementById("sittande");
const patetosDiv = document.getElementById("patetContainerDiv");



// POPULATE PATETOS DIV
function populatePatetosDiv(years){
  patetosDiv.innerHTML = "";
  years.forEach(year => {
    createSinglePatetDiv(year.people, year.year, patetosDiv);
  });
}

function createSinglePatetDiv(sittande, year, parentDiv) {
  let div = document.createElement("div");
  div.classList.add("patetDiv");

  let yearTitle = document.createElement("h2");
  yearTitle.textContent = year;
  yearTitle.classList.add("yearTitle");
  div.appendChild(yearTitle);

  let leftDiv = document.createElement("div");
  leftDiv.classList.add("patetSlide");
  let rightDiv = document.createElement("div");
  rightDiv.classList.add("patetSlide");
  let amountOfPeople = 0;

  sittande.forEach(element => {
    let person = createSittande(element);

    if(amountOfPeople%2 == 0){
      leftDiv.appendChild(person);
    } else{
      rightDiv.appendChild(person);
    }
    amountOfPeople++;
  });
  
  div.appendChild(leftDiv);
  div.appendChild(rightDiv);
  parentDiv.appendChild(div);
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
  let imageUrl = 'img/profilePictures/' + person.nick + '.jpg';
  img.onerror = function(){
    img.src = 'img/logos/FikIT.png';
    img.style.border = "3px solid black";
    // img.style.borderRadius = ".1rem";
  };
  img.src = imageUrl;

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
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    populateSittandeDiv(data.people);
    // console.log(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}


getAllPatetos();
getSittande();




