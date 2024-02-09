
const loginButton = document.getElementById('openLoginButton');
const loginDiv = document.getElementById('loginDiv');
const submitLoginButton = document.getElementById('submitLoginButton');
const openCreatePostButton = document.getElementById('openCreatePostButton');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

let adminButtons = document.getElementsByClassName('adminButton');

let adminKey = null;
let username = null;



loginButton.addEventListener('click', () => {
    loginDiv.classList.toggle('hidden');
});




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
        console.log("Login successful");
        adminKey = data.adminKey;
        username = usernameInput.value;
        userIsLoggedIn();
    })
}

function userIsLoggedIn(){
    loginDiv.classList.add('hidden');   
    usernameInput.value = '';
    passwordInput.value = '';

    for (const button of adminButtons) { // show all admin buttons
        button.classList.remove('hidden');
    }
};

submitLoginButton.addEventListener('click', login);
