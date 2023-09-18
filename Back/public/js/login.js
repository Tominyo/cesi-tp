const registerForm = document.getElementsByClassName("register-form")[0]
const loginForm = document.getElementsByClassName("login-form")[0]
const formContainer = document.getElementById("form-container")
const showRegisterBtn = document.getElementById("show-register")
const showLoginBtn = document.getElementById("show-login")

showRegisterBtn.addEventListener("click", showRegister);
showLoginBtn.addEventListener("click", showLogin);

function showRegister(event) {
    event.preventDefault();
    formContainer.setAttribute("action", "http://localhost:3001/auth/register")
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
}

function showLogin(event) {
    event.preventDefault();
    formContainer.setAttribute("action", "http://localhost:3001/auth/login2")
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
}

window.onload = function() {
    //loginForm.classList.add("hidden")
  };
