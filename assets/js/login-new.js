const STORAGE_TOKEN = "V2EKVKFM9O99OC501HIARH82FGY2SQSIN8JU7MDJ";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

let currentUser;
let localUsers;

async function init() {
  loadUsers();
}

async function loadUsers() {
  const keyToSearch = "users";
  let users = await getItem(keyToSearch);
  localUsers = JSON.parse(users);
}

function togglePassword() {
  let passwordInput = document.getElementById("password-input");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}

/** loginUser collects and validates user login data,
 * then triggers either a successful login or a failed login based on the outcome. Errors are handled using handleError.*/
async function loginUser() {
  const inputEmail = document.querySelector(".email-input").value;
  const inputPassword = document.querySelector(".password-input").value;
  try {
    const userData = JSON.parse(await getItem("users"));
    const user = findUser(userData, inputEmail, inputPassword);
    if (user) {
      handleSuccessfulLogin(user);
      console.log("login");
    } else {
      handleFailedLogin();
    }
  } catch (error) {
    handleError(error);
  }
}

// The findUser function searches for a user in a dataset (userData) based on input email and password.
//It returns a user if their email matches the input email, and their password matches the input password or passes a local password check.
function findUser(userData, inputEmail, inputPassword) {
  const user = userData.find(
    (user) => user.email === inputEmail && user.password === inputPassword
  );
  return user;
}

//The handleSuccessfulLogin function processes a successful
//user login on a website by storing the user's name, displaying a "Login Successful" popup, and redirecting to 'summary.html' after a 900-millisecond delay.
function handleSuccessfulLogin(user) {
  currentUser = user.name;
  localStorage.setItem("currentUser", currentUser);
  showToast("✅ Login successfull!");
  setTimeout(() => {
    window.location.href = "summary.html";
  }, 2000);
}

/**create a error message */
function handleFailedLogin() {
  showToast("⛔ Wrong email or password.");
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  toast.innerHTML = message;
  toast.classList.add("open");

  setTimeout(() => {
    toast.classList.remove("open");
  }, 5000);
}

// create a error message
function handleError(response) {
  showToast("Something went wrong :(");
  console.error(
    "Fehler beim Abrufen des Elements. Statuscode:",
    response.status
  );
  throw new Error("Fehler beim Abrufen des Elements.");
}

/**go to privacy_policy.html */
function redirectToPrivacyPolicy() {
  window.location.href = "privacy_policy.html";
}

/**go to legal_notice.html */
function redirectToLegalNotice() {
  window.location.href = "legal_notice.html";
}

/**go to SignUp.html */
function redirectToSignUp() {
  window.location.href = "sign-up.html";
}

/**go to summary.html */
function openSummaryHtml() {
  const targetUrl = "./summary.html";
  window.location.href = targetUrl;
  currentUser = "Guest";
  localStorage.setItem("currentUser", currentUser);
}

/**go to login.html */
function goBackToLogin() {
  window.location.href = "login.html";
}

/**go to iforgotmypassword.html*/
function redirectToForgotPassword() {
  const targetUrl = "../../iforgotmypassword.html";
  window.location.href = targetUrl;
}
