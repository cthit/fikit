
const sittandeDiv = document.getElementById("patetContainerDiv");

function createSinglePatetDiv(sittande, parentDiv) {
    let div = document.createElement("div");
    div.classList.add("patetDiv");

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
    img.src = imageUrl;

    infoImgDiv.appendChild(img);

    infoImgDiv.appendChild(createInfoDiv(person));
    infoImgDiv.classList.add("infoImgDiv");

    return infoImgDiv;
}

function createInfoDiv(person){
    let infoDiv = document.createElement("div");
    infoDiv.classList.add("infoDiv");
    
    let h1 = document.createElement("h1");
    let description = document.createElement("p");

    infoDiv.appendChild(h1);
    infoDiv.appendChild(description);

    h1.textContent = person.nick;
    description.textContent = person.description;

    return infoDiv;
};




function getSittande(year) {
    
    fetch('/getSittande', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({year})
    })
    .then(response => {
        if (response.ok) {
          return response.json(); // Parse response JSON
        } else {
          throw new Error('Failed to fetch sittande');
        }
      })
      .then(data => {
        // Handle the data received from the server
        createSinglePatetDiv(data.people, sittandeDiv);
        })
      .catch(error => {
        // Handle errors
        console.error('Error:', error);
      });
};



async function main() {
    years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028]
    getSittande(2023);
}

main();

