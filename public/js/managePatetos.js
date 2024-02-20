// HANDLE ADD PERSON TO PATETOS

const openManagePatetosButton = document.getElementById('openManagePatetosButton');
let managePatetosDiv = document.getElementById('managePatetosDiv');


function stopPropagation(element){
  element.addEventListener('click', () => {
    event.stopPropagation();
  });
}


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
  let addNewYearDiv = createAddNewYearDiv();
  managePatetosYears.appendChild(addNewYearDiv);
}

function createAddNewYearDiv(){
  let addYearDiv = document.createElement("div");
  addYearDiv.classList.add("addNewYearDiv");

  let addNewYearButton = document.createElement("img");
  addNewYearButton.src = "/img/add.svg";
  addNewYearButton.alt = "Addbutton";

  addYearDiv.addEventListener('click', () => {
    let newYear = {
      "id": createRandomSuffix(),
      "year": "New Year",
      "nickname": "Nickname",
      "people": []
    };

    fetch('/api/addNewYearOfPatetos', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({adminKey: adminKey, newYear: newYear})
    })
    .then(response => {
      if (response.status === 409) {
        console.log("Year already exists");
      } else if (!response.ok) {
            throw new Error('Network response was not ok');
      } else {
      let newDiv = createSingleManagePatetDiv(newYear);
      managePatetosDiv.appendChild(newDiv);
      }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  });
  addYearDiv.appendChild(addNewYearButton);

  return addYearDiv;
}

function createSingleManagePatetDiv(year){
    let div = document.createElement("div");
    div.classList.add("manageYearDiv");
  
    let managePeopleDiv = createManagePeopleDiv(year);
    let overviewDiv = createYearOverviewDiv(year, managePeopleDiv);

    div.appendChild(overviewDiv);
    div.appendChild(managePeopleDiv);

    return div;
}

function createYearOverviewDiv(year, managePeopleDiv){
    let overviewDiv = document.createElement("div");
    overviewDiv.classList.add("manageYearOverviewDiv");

    let yearTitle = document.createElement("p");
    yearTitle.classList.add("manageYearYearTitle");
    yearTitle.textContent = year.year;
    overviewDiv.appendChild(yearTitle);

    let yearNickname = document.createElement("p");
    yearNickname.textContent = year.nickname;
    overviewDiv.appendChild(yearNickname);
    
    let controlButtons = document.createElement("div");
    controlButtons.classList.add("controlButtons");

    let removeYearButton = createRemoveYearButton(year);
  
    let modifyYearButton = document.createElement("img");
    modifyYearButton.src = "/img/down.svg";
    modifyYearButton.alt = "ModifyYearbutton";
    modifyYearButton.classList.add("modifyYearButton");
  
  
    let doneButton = document.createElement("img");
    doneButton.src = "/img/checkmark.svg";
    doneButton.alt = "Donebutton";
    doneButton.classList.add("changeYearDoneButton");
    doneButton.classList.add("hidden");
    doneButton.addEventListener('click', async () => {
      // managePeopleDiv.classList.toggle('hidden');
      doneButton.classList.toggle('hidden');
      changeExpandIcon(managePeopleDiv, modifyYearButton);
    });
  
    controlButtons.appendChild(doneButton);
    controlButtons.appendChild(modifyYearButton);
    controlButtons.appendChild(removeYearButton);

    overviewDiv.appendChild(controlButtons);

    [yearTitle, yearNickname].forEach(element => {
      stopPropagation(element);
    });

    overviewDiv.addEventListener('click', async () => {
      if (managePeopleDiv.classList.contains('hidden') && yearTitle.tagName.toLocaleLowerCase() === "p" && yearNickname.tagName.toLocaleLowerCase() === "p") {
        let newInputs = switchPtoInput(yearTitle, yearNickname, overviewDiv);
        yearTitle = newInputs[0];
        yearNickname = newInputs[1];
      } else {
        let newPs = await switchInputToP(year, yearTitle, yearNickname, overviewDiv);
        
        yearTitle = newPs[0];
        yearNickname = newPs[1];
      }
      stopPropagation(yearTitle);
      stopPropagation(yearNickname);

      managePeopleDiv.classList.toggle('hidden');
      doneButton.classList.toggle('hidden');
      changeExpandIcon(managePeopleDiv, modifyYearButton);
    });

    return overviewDiv;
}

function switchPtoInput(yearTitle, yearNickname, overviewDiv){
  let newTitle = document.createElement("input");
  newTitle.value = yearTitle.textContent;
  newTitle.classList = yearTitle.classList;
  stopPropagation(newTitle);
  overviewDiv.replaceChild(newTitle, yearTitle);

  let newNickname = document.createElement("input");
  newNickname.value = yearNickname.textContent;
  newNickname.classList = yearNickname.classList;
  stopPropagation(newNickname);
  overviewDiv.replaceChild(newNickname, yearNickname);
  
  return [newTitle, newNickname];
}

async function switchInputToP(year, yearTitle, yearNickname, overviewDiv){
  let newYear = await updateYearHeader(year, yearTitle.value, yearNickname.value, overviewDiv);
  let newyearTitle = document.createElement("p");
  newyearTitle.textContent = newYear.year;
  newyearTitle.classList = yearTitle.classList;
  overviewDiv.replaceChild(newyearTitle, yearTitle);
  
  let newyearNickname = document.createElement("p");
  newyearNickname.textContent = newYear.nickname;
  newyearNickname.classList = yearNickname.classList;
  overviewDiv.replaceChild(newyearNickname, yearNickname);

  return [newyearTitle, newyearNickname];
}


async function updateYearHeader(year, yearTitle, yearNickname, div){
  
  let newYear = {
    "id": year.id,
    "year": yearTitle,
    "nickname": yearNickname,
  };
  try {
    const response = await fetch('/api/updateYearOfPatetos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({adminKey: adminKey, oldYear: year, newYear: newYear})
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    flashDiv(div, 100);
    return newYear;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}



function changeExpandIcon(managePeopleDiv, modifyYearButton){
  if(managePeopleDiv.classList.contains('hidden')){
    modifyYearButton.src = "/img/down.svg";
  } else {
    modifyYearButton.src = "/img/icons/up.svg";
  }

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
        body: JSON.stringify({adminKey: adminKey, year: year}),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        removeYearButton.parentElement.parentElement.parentElement.removeChild(removeYearButton.parentElement.parentElement);})
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  });

  return removeYearButton;
}


function createManagePeopleDiv(year){
  let managePeopleDiv = document.createElement("div");
  managePeopleDiv.classList.add("hidden");

  let yearPeopleDiv = document.createElement("div");
  year.people.forEach(person => {
    yearPeopleDiv.appendChild(createManagePersonDiv(person, year, yearPeopleDiv));
  });

  yearPeopleDiv.classList.add("managePeopleDiv");

  let addPersonDiv = createAddPersonDiv(year, yearPeopleDiv);
  
  managePeopleDiv.appendChild(yearPeopleDiv);
  managePeopleDiv.appendChild(addPersonDiv);

  return managePeopleDiv
}


function createManagePersonDiv(person, year, parentdiv) {
    let div = document.createElement("div");
    div.classList.add("singleManagePersonDiv");

    let nameInput = document.createElement("input");
    nameInput.value = person.name;
    div.appendChild(nameInput);

    let nickInput = document.createElement("input");
    nickInput.value = person.nick;
    div.appendChild(nickInput);

    let postInput = document.createElement("input");
    postInput.value = person.post;
    div.appendChild(postInput);

    let descriptionTextArea = document.createElement("textarea");
    descriptionTextArea.value = person.description;
    div.appendChild(descriptionTextArea);

    [nameInput, nickInput, postInput, descriptionTextArea].forEach(element => {
      element.addEventListener('change', () => {
        // element.style.backgroundColor = "rgba(50, 0, 0, 0.5)";
        element.style.outline = "3px solid rgba(180, 0, 0, 0.8)";
      });
    });

    let doneButton = CreateChangePersonDoneButton(nameInput, nickInput, postInput, descriptionTextArea, person, year);
    let removeButton = CreateRemovePersonButton(person, year, parentdiv);
    let controlButtons = document.createElement("div");
    controlButtons.classList.add("controlButtons");
    controlButtons.appendChild(doneButton);
    controlButtons.appendChild(removeButton);
    div.appendChild(controlButtons);

    return div;
}

function CreateChangePersonDoneButton(nameInput, nickInput, postInput, descriptionTextArea, person, year){
  let doneButton = document.createElement("img");
    doneButton.src = "/img/checkmark.svg";
    doneButton.alt = "Donebutton";
    doneButton.classList.add("changePersonDoneButton");

    doneButton.addEventListener('click', () => {
        let newPerson = {
            id: person.id,
            name: nameInput.value,
            nick: nickInput.value,
            post: postInput.value,
            description: descriptionTextArea.value
        }
        fetch('/api/updatePerson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({adminKey : adminKey, oldPerson: person, newPerson: newPerson, year: year}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            flashDiv(doneButton.parentElement.parentElement, 100);
          })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    });

    return doneButton;
}

function CreateRemovePersonButton(person, year){
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
          body: JSON.stringify({adminKey: adminKey, person: person, year: year}),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          console.log(removeButton.parentElement.parentElement.parentElement);
          console.log(removeButton.parentElement.parentElement);
          removeButton.parentElement.parentElement.parentElement.removeChild(removeButton.parentElement.parentElement);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  });

  return removeButton;
} 

function createAddPersonDiv(year, managePeopleDiv){
  let addPersonDiv = document.createElement("div");
  addPersonDiv.classList.add("addPersonDiv");

  let addPersonButton = document.createElement("img");
  addPersonButton.src = "/img/add.svg";
  addPersonButton.alt = "Addbutton";

  addPersonButton.addEventListener('click', () => {
    let newPerson = {
      "id": createRandomSuffix(),
      "name": "Name",
      "nick": "Nick",
      "post": "Post",
      "description": "Description"
    };

    fetch('/api/addPersonToPatetos', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({adminKey: adminKey, newPerson: newPerson, year})
    })
    .then(response => {
      if (response.status === 409) {
        console.log("Person already exists");
      } else if (!response.ok) {
            throw new Error('Network response was not ok');
      } else {
        let newDiv = createManagePersonDiv(newPerson, year.year, addPersonDiv.parentElement);
        managePeopleDiv.appendChild(newDiv);
      }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  });
  addPersonDiv.appendChild(addPersonButton );

  return addPersonDiv;
}


function flashDiv(div, time){
  div.classList.add("changedPerson");
  setTimeout(function() {
      div.classList.remove("changedPerson");
  }, time); // milliseconds
}

function createRandomSuffix(){
  let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  return uniqueSuffix;
}

getManagePatetos();