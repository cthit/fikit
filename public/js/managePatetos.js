function createRandomSuffix() {
	return Date.now() + '-' + Math.round(Math.random() * 1E9)
}



document.addEventListener('DOMContentLoaded', async () => {
    populatePatetosDiv();
});




async function populatePatetosDiv(){
    const patetos = await getAllPatetos();

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
    addYearButton.classList.add("addYearButton", "button");
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

    const yearExpandButton = document.createElement("img");
    yearExpandButton.classList.add("yearExpandButton");
    yearExpandButton.src = "/img/icons/down.svg";

    const PeopleDiv = createPeopleDiv(year);


    let open = false;
    yearDiv.addEventListener("click", () => {
        open = !open;
        if (open) {
            PeopleDiv.classList.remove("hidden");
            // const PeopleDiv = createPeopleDiv(year);
            yearExpandButton.classList.add("hidden");
            yearDiv.appendChild(PeopleDiv);
        } else {
            PeopleDiv.classList.add("hidden");
            // yearDiv.removeChild(yearDiv.lastChild);
            yearExpandButton.classList.remove("hidden");
        }
    });

    yearDiv.appendChild(yearTitle);
    yearDiv.appendChild(yearExpandButton);


    return yearDiv;
}




function createYearTitle(year){
    const yearTitle = document.createElement("div");
    yearTitle.classList.add("yearTitle");

    const yearTitleText = document.createElement("input");
    yearTitleText.classList.add("yearTitleText");
    yearTitleText.value = year.year;
    yearTitle.appendChild(yearTitleText);

    const yearNickname = document.createElement("input");
    yearNickname.classList.add("yearNickname");
    yearNickname.value = year.nickname;
    yearTitle.appendChild(yearNickname);
    

    const yearButtonGroup = document.createElement("div");
    yearButtonGroup.classList.add("yearButtonGroup");
    yearTitle.appendChild(yearButtonGroup);

    const yearUpdateButton = document.createElement("div");
    yearUpdateButton.classList.add("yearUpdateButton", "button", "hidden");
    yearUpdateButton.innerText = "Uppdatera";
    yearButtonGroup.appendChild(yearUpdateButton);

    const yearRemoveButton = document.createElement("div");
    yearRemoveButton.classList.add("yearRemoveButton", "button");
    yearRemoveButton.innerText = "Ta bort";
    yearButtonGroup.appendChild(yearRemoveButton);

    yearTitleText.addEventListener("input", () => {
        if (yearTitleText.value !== year.year) {
            yearTitleText.classList.add("changedField");
            yearUpdateButton.classList.remove("hidden");
        } else {
            yearTitleText.classList.remove("changedField");
            if (yearNickname.value === year.nickname) yearUpdateButton.classList.add("hidden");
        }
    });

    yearNickname.addEventListener("input", () => {
        if (yearNickname.value !== year.nickname) {
            yearNickname.classList.add("changedField");
            yearUpdateButton.classList.remove("hidden");
        } else {
            yearNickname.classList.remove("changedField");
            if (yearTitleText.value === year.year) yearUpdateButton.classList.add("hidden");
        }
    });



    yearUpdateButton.addEventListener("click", async (event) => {
        const updatedYear = {
            year: yearTitleText.value,
            nickname: yearNickname.value,
            id: year.id,
        };

        const successfullUpdate = await updateYear(updatedYear);
        if (successfullUpdate) {
            flashDiv(yearTitle, "green");

            yearUpdateButton.classList.add("hidden");
        } else {
            flashDiv(yearTitle, "red");

            yearTitleText.value = year.year;
            yearNickname.value = year.nickname;
        }
        yearTitleText.classList.remove("changedField");
        yearNickname.classList.remove("changedField");
    });

    yearRemoveButton.addEventListener("click", async (event) => {
        event.stopPropagation();

        const successfullDelete = await deleteYear(year.id);
        if (successfullDelete) {
            yearButtonGroup.parentElement.remove();
        }
    });

    [yearTitleText, yearNickname, yearUpdateButton].forEach(input => {
        input.addEventListener("click", (event) => { event.stopPropagation(); });
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
    else personImage.src =  "/img/icons/upload.svg";

    personDiv.appendChild(personImage);

    const personName = document.createElement("input");
    personName.placeholder = "Namn";
    personName.value = person.name;
    personDiv.appendChild(personName);

    const personNickname = document.createElement("input");
    personNickname.placeholder = "Nick";
    personNickname.value = person.nick;
    personDiv.appendChild(personNickname);

    const personPost = document.createElement("input");
    personPost.placeholder = "Post";
    personPost.value = person.post;
    personDiv.appendChild(personPost);

    const personDescription = document.createElement("textarea");
    personDescription.placeholder = "Beskrivning";
    personDescription.value = person.description;
    personDiv.appendChild(personDescription);

    const yearButtonGroup = document.createElement("div");
    yearButtonGroup.classList.add("yearButtonGroup");
    personDiv.appendChild(yearButtonGroup);

    const personUpdateButton = document.createElement("div");
    personUpdateButton.classList.add("personUpdateButton", "button", "invisible");
    personUpdateButton.innerText = "Uppdatera";
    yearButtonGroup.appendChild(personUpdateButton);


    const personDeleteButton = document.createElement("div");
    personDeleteButton.classList.add("personDeleteButton", "button");
    personDeleteButton.innerText = "Ta bort";
    yearButtonGroup.appendChild(personDeleteButton);

    personImage.addEventListener("click", async () => {
        personImageInput.click();
    });

    personImageInput.addEventListener("change", async () => {
        personImage.src = URL.createObjectURL(personImageInput.files[0]);
        personUpdateButton.classList.remove("invisible");
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
            flashDiv(personDiv, "green");
            personUpdateButton.classList.add("invisible");
            [personName, personNickname, personPost, personDescription].forEach(input => {
                input.classList.remove("changedField");
            });

        } else {
            flashDiv(personDiv, "red");

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

    [personName, personNickname, personPost, personDescription].forEach(input => {
        input.addEventListener("input", (event) => { 
        if (personName.value === person.name && personNickname.value === person.nick && personPost.value === person.post && personDescription.value === person.description && personImageInput.files.length === 0) {
                personUpdateButton.classList.add("invisible");
            }
        });
    });

    personName.addEventListener("input", () => {
        if (personName.value !== person.name) {
            personUpdateButton.classList.remove("invisible");
            personName.classList.add("changedField");
        } else {
            personName.classList.remove("changedField");
        }
    });

    personNickname.addEventListener("input", () => {
        if (personNickname.value !== person.nick) {
            personUpdateButton.classList.remove("invisible");
            personNickname.classList.add("changedField");
        } else {
            personNickname.classList.remove("changedField");
        }
    });

    personPost.addEventListener("input", () => {
        if (personPost.value !== person.post) {
            personUpdateButton.classList.remove("invisible");
            personPost.classList.add("changedField");
        } else {
            personPost.classList.remove("changedField");
        }
    });

    personDescription.addEventListener("input", () => {
        if (personDescription.value !== person.description) {
            personUpdateButton.classList.remove("invisible");
            personDescription.classList.add("changedField");
        } else {
            personDescription.classList.remove("changedField");
        }
    });


    return personDiv;
}

function createAddpersonDiv(year){
    const addPersonDiv = document.createElement("div");
    addPersonDiv.classList.add("addPersonDiv", "personDiv");

    const div = document.createElement("div");
    div.classList.add("invisible");
    addPersonDiv.appendChild(div);

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
    addPersonButton.classList.add("addPersonButton", "button");
    addPersonButton.innerText = "Lägg till person";
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
    const response = await fetch('/api/updatePerson', {
        method: 'POST',
        body: data,
    });

    if (response.ok) {
        console.log('Person updated:');
        return true;
    } else {
        console.error('Error updating person:', response);
        return false;
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



function flashDiv(div, color, time = 70){
    const originalColor = div.style.backgroundColor;
    div.style.backgroundColor = color;
    setTimeout(() => {
        div.style.backgroundColor = originalColor;
    }, time);
}