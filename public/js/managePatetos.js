function createRandomSuffix() {
	return Date.now() + '-' + Math.round(Math.random() * 1E9)
}

// new data = new FormData();
// data.append('updatedPerson', "NEW GUY");
// fetch("/api/updatePerson", {
//     method: "POST",
//     body: data,
// });



document.addEventListener('DOMContentLoaded', async () => {
    populatePatetosDiv();
});




async function populatePatetosDiv(){
    const patetos = await getAllPatetos();
    console.log(patetos);

    const managePatetosDiv = document.getElementById('managePatetosDiv');
    
    patetos.forEach(year => {
        const yearDiv = createYearDiv(year);
        managePatetosDiv.appendChild(yearDiv);
    });

    const addYearDiv = createAddYearDiv();
    managePatetosDiv.appendChild(addYearDiv);
}

function createAddYearDiv(){
    const addYearDiv = document.createElement("div");
    addYearDiv.classList.add("addYearDiv", "yearDiv");

    const addYearYear = document.createElement("input");
    addYearYear.placeholder = "Year";
    addYearDiv.appendChild(addYearYear);

    const addYearNickname = document.createElement("input");
    addYearNickname.placeholder = "Nickname";
    addYearDiv.appendChild(addYearNickname);

    const addYearButton = document.createElement("div");
    addYearButton.classList.add("addYearButton");
    addYearButton.innerText = "Lägg till år";
    addYearDiv.appendChild(addYearButton);

    addYearButton.addEventListener("click", async () => {
        const newYear = {
            id: createRandomSuffix(),
            year: addYearYear.value,
            nickname: addYearNickname.value,
            people: [],
        };

        const successfullAdd = await addYear(newYear);
        if (successfullAdd) {
            const newYearDiv = createYearDiv(newYear);
            addYearDiv.parentElement.insertBefore(newYearDiv, addYearDiv);
            addYearYear.value = "";
            addYearNickname.value = "";
        }
    });

    return addYearDiv;
}

function createYearDiv(year){
    const yearDiv = document.createElement("div");
    yearDiv.classList.add("yearDiv");

    const yearTitle = createYearTitle(year);
    yearDiv.appendChild(yearTitle);


    const yearExpandButton = document.createElement("img");
    yearExpandButton.classList.add("yearExpandButton");
    yearExpandButton.src = "/img/icons/down.svg";
    yearDiv.appendChild(yearExpandButton);




    let open = false;
    yearDiv.addEventListener("click", () => {
        open = !open;
        if (open) {
            const PeopleDiv = createPeopleDiv(year);
            yearExpandButton.src = "/img/icons/up.svg";

            yearDiv.appendChild(PeopleDiv);
        } else {
            yearDiv.removeChild(yearDiv.lastChild);
            yearExpandButton.src = "/img/icons/down.svg";
        }
    });

    return yearDiv;
}

function createYearTitle(year){
    const yearTitle = document.createElement("div");
    yearTitle.classList.add("yearTitle");

    const yearTitleText = document.createElement("h2");
    yearTitleText.innerText = year.year;
    yearTitle.appendChild(yearTitleText);

    const yearNickname = document.createElement("h2");
    yearNickname.innerText = year.nickname;
    yearTitle.appendChild(yearNickname);

    const yearRemoveButton = document.createElement("img");
    yearRemoveButton.classList.add("yearRemoveButton");
    yearRemoveButton.src = "/img/icons/delete.svg";
    yearTitle.appendChild(yearRemoveButton);

    yearRemoveButton.addEventListener("click", async (event) => {
        event.stopPropagation();

        const successfullDelete = await deleteYear(year.id);
        if (successfullDelete) {
            yearTitle.parentElement.remove();
        }
    });
    

    return yearTitle;
}

function createPeopleDiv(year){
    const peopleDiv = document.createElement("div");
    peopleDiv.classList.add("peopleDiv");

    const managePeopleDiv = document.createElement('div');
    managePeopleDiv.classList.add('managePeopleDiv');
        year.people.forEach(person => {
            const personDiv = createPersonDiv(person, year);
            managePeopleDiv.appendChild(personDiv);
        });
    peopleDiv.appendChild(managePeopleDiv);

    const addPersonDiv = createAddpersonDiv(year);
    peopleDiv.appendChild(addPersonDiv);

    peopleDiv.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    return peopleDiv;
}

function createPersonDiv(person, year){
    const personDiv = document.createElement("div");
    personDiv.classList.add("personDiv");

    const personImageInput = document.createElement("input");
    personImageInput.classList.add("hidden");
    personImageInput.type = "file";
    personDiv.appendChild(personImageInput);

    const personImage = document.createElement("img");
    personImage.classList.add("personImage");

    if (person.imageFile) personImage.src = "/img/profileImages/" + person.imageFile;
    else personImage.src =  "/img/icons/profilePicture.svg";

    personDiv.appendChild(personImage);

    const personName = document.createElement("input");
    personName.value = person.name;
    personDiv.appendChild(personName);

    const personNickname = document.createElement("input");
    personNickname.value = person.nick;
    personDiv.appendChild(personNickname);

    const personPost = document.createElement("input");
    personPost.value = person.post;
    personDiv.appendChild(personPost);

    const personDescription = document.createElement("textarea");
    personDescription.value = person.description;
    personDiv.appendChild(personDescription);


    const personUpdateButton = document.createElement("div");
    personUpdateButton.classList.add("personUpdateButton");
    personUpdateButton.innerText = "Update";
    personDiv.appendChild(personUpdateButton);


    const personDeleteButton = document.createElement("div");
    personDeleteButton.classList.add("personDeleteButton");
    personDeleteButton.innerText = "Delete";
    personDiv.appendChild(personDeleteButton);

    personImage.addEventListener("click", async () => {
        personImageInput.click();
    });

    personImageInput.addEventListener("change", async () => {
        personImage.src = URL.createObjectURL(personImageInput.files[0]);
    });




    personUpdateButton.addEventListener("click", async () => {
        const updatedPerson = {
            id: person.id,
            name: personName.value,
            nick: personNickname.value,
            post: personPost.value,
            description: personDescription.value,
        };

        const data = new FormData();
        data.append('updatedPerson', JSON.stringify(updatedPerson));
        data.append('personImage', personImageInput.files[0]);
        data.append('yearId', year.id);
        data.append('adminKey', adminKey);

        const successfullUpdate = await updatePerson(data);
        if (successfullUpdate) {
            flashDiv(personDiv);
        } else {
            personName.value = person.name;
            personNickname.value = person.nick;
            personPost.value = person.post;
            personDescription.value = person.description;
        }
    });

    personDeleteButton.addEventListener("click", async () => {
        const successfullDelete = await deletePerson(person.id, year.id);
        if (successfullDelete) {
            personDiv.remove();
        }
    });


    return personDiv;
}

function createAddpersonDiv(year){
    const addPersonDiv = document.createElement("div");
    addPersonDiv.classList.add("addPersonDiv", "personDiv");

    const addPersonName = document.createElement("input");
    addPersonName.placeholder = "Name";
    addPersonDiv.appendChild(addPersonName);

    const addPersonNickname = document.createElement("input");
    addPersonNickname.placeholder = "Nickname";
    addPersonDiv.appendChild(addPersonNickname);

    const addPersonPost = document.createElement("input");
    addPersonPost.placeholder = "Post";
    addPersonDiv.appendChild(addPersonPost);

    const addPersonDescription = document.createElement("textarea");
    addPersonDescription.placeholder = "Description";
    addPersonDiv.appendChild(addPersonDescription);

    const addPersonButton = document.createElement("div");
    addPersonButton.classList.add("addPersonButton");
    addPersonButton.innerText = "Add";
    addPersonDiv.appendChild(addPersonButton);

    addPersonButton.addEventListener("click", async () => {
        const newPerson = {
            id: createRandomSuffix(),
            name: addPersonName.value,
            nick: addPersonNickname.value,
            post: addPersonPost.value,
            description: addPersonDescription.value,
        };

        const successfullAdd = await addPerson(newPerson, year.id);
        if (successfullAdd) {
            const newPersonDiv = createPersonDiv(newPerson, year);
            addPersonDiv.parentElement.insertBefore(newPersonDiv, addPersonDiv);
            addPersonName.value = "";
            addPersonNickname.value = "";
            addPersonPost.value = "";
            addPersonDescription.value = "";
        }
    }
    );  

    return addPersonDiv;
}



async function getAllPatetos(){
    return await fetch('/api/getAllPeople').then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
    ).then(patetos => {
        console.log('Data fetched:', patetos);
        return patetos;
    }
    ).catch(error => {
        console.error('Error fetching data:', error);
    }
    );
}

async function addPerson(newPerson, yearId){
    return fetch('/api/addPerson', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPerson, yearId, adminKey }),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }
    ).then(response => {
        console.log('Data fetched:', response);
        return true;
    }
    ).catch(error => {
        console.error('Error fetching data:', error);
        return false;
    }
    );
}

async function deletePerson(personId, yearId){
    return fetch('/api/deletePerson', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personId, yearId, adminKey }),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }
    ).then(response => {
        console.log('Data fetched:', response);
        return true;
    }
    ).catch(error => {
        console.error('Error fetching data:', error);
        return false;
    }
    );
}

async function updatePerson(data){
    console.log(data)
    const response = await fetch('/api/updatePerson', {
        method: 'POST',
        body: data,
    });

    if (response.ok) {
        console.log('Person updated:');
        return true;
    } else {
        return false;
        console.error('Error updating person:', response);
    }
}


async function addYear(newYear){
    const response = await fetch('/api/addYear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newYear, adminKey }),
    });

    if (response.ok) {
        console.log('Year added:', newYear);
        return true;
    } else {
        console.error('Error adding year:', response);
        return false;
    }
}

async function deleteYear(yearId){
    const response = await fetch('/api/deleteYear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yearId, adminKey }),
    });

    if (response.ok) {
        console.log('Year deleted:', yearId);
        return true;
    } else {
        console.error('Error deleting year:', response);
        return false;
    }
}


async function updateYear(updatedYear){
    const response = await fetch('/api/updateYear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedYear, adminKey }),
    });

    if (response.ok) {
        console.log('Year updated:', updatedYear);
        return true;
    } else {
        console.error('Error updating year:', response);
        return false;
    }
}



function flashDiv(div){
    div.classList.add("flashingDiv");
    setTimeout(() => {
        div.classList.remove("flashingDiv");
    }, 500);
}