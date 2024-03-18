var menuItems = [
    { text: "Manage images", href: "/allImages.html", image: "/img/icons/filterImages.svg", visibleTo: ["admin", "pr"]},
    { text: "Manage People", href: "/managePeople.html", image: "/img/icons/group.svg", visibleTo: ["admin", "pr"]}
];






let closeButtons = document.getElementsByClassName('closeButton');

let committeeInfo;


function createIcon() {
    let link = document.createElement('link');
    link.rel = 'icon';
    link.href = committeeInfo.logo;
    return link;
}


function createRandomSuffix(){
    let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    return uniqueSuffix;
}

async function getCommitteeInfo() {
    return await fetch('/api/commitee/getCommitteeInfo').then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else return response.json();
    }).then(data => {
        return data;
    });
}


for (const button of closeButtons) {
    button.addEventListener('click', () => {
        button.parentNode.classList.toggle('hidden');
    });
};


function createHeader() {
    let header = document.createElement('header');

    let logo = document.createElement('img');
    logo.src = committeeInfo.logo;
    logo.alt = 'Logo of ' + committeeInfo.name;
    header.appendChild(logo);

    let title = document.createElement('h1');
    title.textContent = committeeInfo.name;
    header.appendChild(title);


    const optionsMenu = createOptionsMenu();
    header.appendChild(optionsMenu);

    return header;
}

function createOptionsMenu() {
    let optionsMenu = document.createElement('nav');
    optionsMenu.id = 'optionsMenu';
    optionsMenu.classList.add('optionsMenu');

    if (document.title !== 'FikIT') {
        const homebutton = document.createElement('a');
        homebutton.classList.add('button');
        homebutton.href = '/';
        homebutton.textContent = 'Hem';
        optionsMenu.appendChild(homebutton);
    }

    if (document.title !== 'FikIT - Hantera Pateter') {
        let openManagePatetosButton = document.createElement('a');
        openManagePatetosButton.id = 'openManagePatetosButton';
        openManagePatetosButton.href = 'managepatetos.html';
        openManagePatetosButton.classList.add('adminButton', 'hidden', 'button');
        openManagePatetosButton.textContent = 'Hantera pateter';
        optionsMenu.appendChild(openManagePatetosButton);

        let openCreatePostButton = document.createElement('div');
        openCreatePostButton.id = 'openCreatePostButton';
        openCreatePostButton.classList.add('hidden', 'adminButton', 'button');
        openCreatePostButton.textContent = 'Skapa inlägg';

        openCreatePostButton.addEventListener('click', () => { 
            createPostDiv.classList.toggle('hidden');
        });

        optionsMenu.appendChild(openCreatePostButton);
    }

    let openLoginButton = document.createElement('div');
    openLoginButton.id = 'openLoginButton';
    openLoginButton.classList.add('button');
    if (isLoggedIn) openLoginButton.textContent = 'Logga ut';
    else openLoginButton.textContent = 'Logga in';
    optionsMenu.appendChild(openLoginButton);

    if (isLoggedIn) { // hide all buttons except openLoginButton when user logs out
        let buttons = Array.from(optionsMenu.querySelectorAll('.button'));
        buttons = buttons.slice(0, -1);
        buttons = buttons.forEach(button => button.classList.remove('hidden'));
    }

    openLoginButton.addEventListener('click', () => {
        if (!isLoggedIn) {
            loginDiv.classList.remove('hidden');
        } else {
            logout();
        }
    });



    return optionsMenu;
}


function createFooter() {
    let footer = document.createElement('footer');

    const socialMediaDiv = document.createElement('div');
    socialMediaDiv.classList.add('socialMedia');
    committeeInfo.socialMedia.forEach(media => {
        const a = document.createElement('a');
        a.href = media.url;
        const img = document.createElement('img');
        img.src = media.logo;
        img.alt = media.name;
        a.appendChild(img);
        socialMediaDiv.appendChild(a);
    });
    footer.appendChild(socialMediaDiv);


    const createdBy = document.createElement('p');
    createdBy.textContent = 'Skapad av ';
    const createdByLink = document.createElement('a');
    createdByLink.href = 'https://github.com/erikpersson0884';
    createdByLink.textContent = 'Göken';
    createdBy.appendChild(createdByLink);
    createdBy.appendChild(document.createTextNode(' '));
    const createdByImage = document.createElement('img');
    createdByImage.src = 'img/logos/Goken-pa-market.png';
    footer.appendChild(createdBy);

    const contactdiv = document.createElement('div');
    committeeInfo.contact.forEach(contact => {
        if (contact.type === 'email') {
            const a = document.createElement('a');
            a.href = 'mailto:' + contact.value;
            a.textContent = contact.value;
            contactdiv.appendChild(a);
        } else if (contact.type === 'phone') {
            const p = document.createElement('p');
            p.textContent = contact.value;
            contactdiv.appendChild(p);
        } 
    });
    footer.appendChild(contactdiv);

    return footer;
}


document.addEventListener('DOMContentLoaded', async () => {
    committeeInfo = await getCommitteeInfo();

    document.head.appendChild(createIcon());


    let header = createHeader();
    let footer = createFooter();

    document.body.prepend(header);
    document.body.appendChild(footer);
});