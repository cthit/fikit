// HANDLE ADD PERSON TO PATETOS

const openManagePatetosButton = document.getElementById('openManagePatetosButton');
let managePatetosDiv = document.getElementById('managePatetosDiv');





function getManagePatetos(){
  fetch('/api/getAllPeople')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(years => {
    populateManagePatetosDiv(years);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

function populateManagePatetosDiv(years) {
  years.forEach(year => {
    let yearDiv = createSingleManagePatetDiv(year);
    managePatetosDiv.appendChild(yearDiv);
  });
}

function createSingleManagePatetDiv(year){
    let div = document.createElement("div");
    div.classList.add("manageYearDiv");
  
    let managePeopleDiv = createManagePeopleDiv(year);
    let overviewDiv = createYearOverviewDiv(year, managePeopleDiv);

    div.appendChild(overviewDiv);
    div.appendChild(managePeopleDiv);

    overviewDiv.addEventListener('click', () => {
      managePeopleDiv.classList.toggle('hidden');
    });



    return div;
}

function createYearOverviewDiv(year, managePeopleDiv){
    let div = document.createElement("div");
    div.classList.add("manageYearOverviewDiv");

    let yearTitle = document.createElement("p");
    yearTitle.textContent = year.year;
    div.appendChild(yearTitle);

    let yearNickname = document.createElement("p");
    yearNickname.textContent = year.nickname;
    div.appendChild(yearNickname);

  

    let moodifyYearButton = document.createElement("div");
    moodifyYearButton.textContent = "Moodify";
    moodifyYearButton.classList.add("moodifyYearButton");
    div.appendChild(moodifyYearButton);

    let removeYearButton = createRemoveYearButton(year);
    removeYearButton.addEventListener('click', () => {
    });   
    div.appendChild(removeYearButton);


    return div;
}

function createRemoveYearButton(year){
  let removeYearButton = document.createElement("img");
  removeYearButton.src = "/img/remove.svg";
  removeYearButton.alt = "Removebutton";
  removeYearButton.classList.add("removeYearButton");
  removeYearButton.addEventListener('click', () => {
    event.stopPropagation();

    fetch('/api/removeYearOfPatetos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({year: year.year}),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        parentElement.removeChild(removeYearButton);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  });

  return removeYearButton;
}


function createManagePeopleDiv(year){
  let yearPeople = document.createElement("div");

  year.people.forEach(person => {
    yearPeople.appendChild(createManagePersonDiv(person, year, yearPeople));
  });

  yearPeople.classList.add("managePeopleDiv");
  yearPeople.classList.add("hidden");

  return yearPeople
}


function createManagePersonDiv(person, year, parentdiv) {
    let div = document.createElement("div");
    div.classList.add("singleManagePersonDiv");

    let name = document.createElement("input");
    name.value = person.name;
    div.appendChild(name);

    let nick = document.createElement("input");
    nick.value = person.nick;
    div.appendChild(nick);

    let post = document.createElement("input");
    post.value = person.post;
    div.appendChild(post);

    let description = document.createElement("input");
    description.value = person.description;
    div.appendChild(description);

    let doneButton = CreateChangePersonDoneButton(name, nick, post, description, person, year);
    let removeButton = CreateRemovePersonButton(person, year, parentdiv);
    let controllButtons = document.createElement("div");
    controllButtons.classList.add("changePersonControllButtons");
    controllButtons.appendChild(doneButton);
    controllButtons.appendChild(removeButton);
    div.appendChild(controllButtons);

    return div;
}

function CreateChangePersonDoneButton(name, nick, post, description, person, year){
  let doneButton = document.createElement("img");
    doneButton.src = "/img/checkmark.svg";
    doneButton.alt = "Donebutton";

    doneButton.classList.add("changePersonDoneButton");
    doneButton.addEventListener('click', () => {
        let newPerson = {
            name: name.value,
            nick: nick.value,
            post: post.value,
            description: description.value
        }
        fetch('/api/updatePerson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({oldPerson: person, newPerson: newPerson, year: year.year}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    });

    return doneButton;
}

function CreateRemovePersonButton(person, year, parentdiv){
  let removeButton = document.createElement("img");
  removeButton.src = "/img/remove.svg";
  removeButton.alt = "Removebutton";

  removeButton.classList.add("removePersonButton");
  removeButton.addEventListener('click', () => {
      fetch('/api/removePersonFromPatetos', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({person: person, year: year.year}),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          parentdiv.removeChild(removeButton.parentElement);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  });

  return removeButton;
} 


getManagePatetos();