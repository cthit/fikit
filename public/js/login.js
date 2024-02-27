
const loginButton = document.getElementById('openLoginButton');
const loginDiv = document.getElementById('loginDiv');
const submitLoginButton = document.getElementById('submitLoginButton');
const openCreatePostButton = document.getElementById('openCreatePostButton');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

let adminButtons = document.getElementsByClassName('adminButton');

let isLoggedIn = false;
let adminKey = null;
let username = null;



loginButton.addEventListener('click', () => {
    if (!isLoggedIn) {
        loginDiv.classList.remove('hidden');
    } else {
        logout();
    }
});


function logout() {
    isLoggedIn = false;
    adminKey = null;
    localStorage.removeItem('adminKey');
    for (const button of adminButtons) {
        button.classList.add('hidden');
    }
    loginButton.textContent = 'Logga in';
    // toggleRemovePostButton();
}

function login() {
    const loginCredentials = {
        username: usernameInput.value,
        password: passwordInput.value
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginCredentials)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        adminKey = data.adminKey;
        username = usernameInput.value;

        localStorage.setItem('adminKey', adminKey);
        console.log("Login successful");

        userIsLoggedIn();
        
    })
}

function testAdminKeyOnLoad() {
    adminKey = localStorage.getItem('adminKey');
    // console.log('adminKey: ', adminKey);
    if (adminKey) {
        fetch('/testAdminKey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({adminKey})
        })
        .then(response => {
            if (response.status === 200) {
                userIsLoggedIn();
            }
            if (response.status === 401) {
                localStorage.removeItem('adminKey');
            } else if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response;
        }) 
    }
}


function userIsLoggedIn(){
    isLoggedIn = true;
    loginDiv.classList.add('hidden');   
    
    loginButton.textContent = 'Logga ut';

    usernameInput.value = '';
    passwordInput.value = '';

    for (const button of adminButtons) { // show all admin buttons
        button.classList.remove('hidden');
    }

    // toggleRemovePostButton();
};



submitLoginButton.addEventListener('click', login);
testAdminKeyOnLoad();
