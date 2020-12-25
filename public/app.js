"use strict";

let socket = io.connect();

// check this und mach es richtig: https://www.youtube.com/watch?v=b91XgdyX-SM
// min 59:10

const submitButton = document.querySelector("#submit-btn");
submitButton.addEventListener("click", registerUser);

async function registerUser(event) {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    await fetch('/users/register', {
        method: "POST",
        
        body: JSON.stringify({
            username: username,
            password: password
        }),

        headers: {
            "Content-type": "application/json"
        }
    })
    // Converting to JSON 
    // .then(response => response.json()) 
    
    // Displaying results to console 
    .then(response => console.log(response)); 
}

// let loginBtn = document.querySelector('.login');
// loginBtn.addEventListener("click", login);

// const baseUrl = "http://127.0.0.1:3000";

// let login = function(event){
//     fetch(baseUrl)
//     .then((res) => res.json())
//     .then((content) => {
//         output.innerHTML = JSON.stringify(content, "\n", 2);
//     })
//     .catch((err) => console.error);
// }
let username;

const loginButton = document.querySelector("#login-btn");
loginButton.addEventListener("click", loginUser);

let token;
async function loginUser(event) {
    event.preventDefault();
    username = document.querySelector('#username-login').value;
    let password = document.querySelector('#password-login').value;

    let result = await fetch('/users/login', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username,
            password
        })
    })
    .then((res) => res.json())
    .then((res) => token = res)
    .then((res) => console.log(res));

    console.log("log token: ", token);
}

const getPostbtn = document.querySelector(".getPost");
getPostbtn.addEventListener("click", getPost);

async function getPost(event) {
    let auth = "Bearer " + token.token;
    console.log("log token: ", auth);

    let result = await fetch('/posts', {
        method: 'GET',

        headers: {
            'Content-Type': 'application/json',
            'authorization': auth
        },
    })
    .then(response => response.json())
    .then(data => console.log(data));
}


let createHighscore = function () {

}

let createNews = function () {

}