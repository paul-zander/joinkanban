const STORAGE_TOKEN = "V2EKVKFM9O99OC501HIARH82FGY2SQSIN8JU7MDJ";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

let currentUser;
/**The getItem function constructs a URL with a key, fetches data from that URL,
 * handles the response to retrieve data, and parses the data, returning it,
 *  allowing retrieval of data associated with the provided key from a remote storage source. */
async function getItem(key) {
  const url = buildStorageUrl(key);
  const response = await fetchItem(url);
  const responseData = await handleResponse(response);
  return parseData(responseData);
}

//The buildStorageUrl function constructs a URL for accessing data in a storage, appending a key and a token as parameters.
function buildStorageUrl(key) {
  return `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
}
//The fetchItem function retrieves data from a specified URL, handling errors with the handleError function if the response is not successful, and it returns the response object.
async function fetchItem(url) {
  const response = await fetch(url);
  if (!response.ok) {
    handleError(response);
  }
  return response;
}
//This function is designed to handle responses from an asynchronous operation, typically a network request.
async function handleResponse(response) {
  const responseData = await response.json();
  if (!responseData.data) {
    throw new Error(`Konnte Daten nicht finden.`);
  }
  return responseData.data.value;
}
//The parseData function attempts to parse JSON data. If successful, it returns the parsed data; if there's an error, it logs the error and rethrows it.
function parseData(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Fehler beim Parsen der Daten:", error);
    throw error;
  }
}
// create a error message
function handleError(response) {
  console.error(
    "Fehler beim Abrufen des Elements. Statuscode:",
    response.status
  );
  throw new Error("Fehler beim Abrufen des Elements.");
}
//checks the password stored in localstorage via email
function checkLocalPassword(email, password) {
  const storedPassword = localStorage.getItem(email);
  if (storedPassword === password) {
    return true;
  }
  const resetPasswordData = JSON.parse(localStorage.getItem("resetpassword"));
  if (
    resetPasswordData &&
    resetPasswordData.email === email &&
    resetPasswordData.password === password
  ) {
    return true;
  }
  return false;
}
/** loginUser collects and validates user login data,
 * then triggers either a successful login or a failed login based on the outcome. Errors are handled using handleError.*/
async function loginUser() {
  const inputEmail = document.querySelector(".email-input").value;
  const inputPassword = document.querySelector(".password-input").value;
  try {
    const userData = await getItem("users");
    const user = findUser(userData, inputEmail, inputPassword);
    if (user) {
      handleSuccessfulLogin(user);
    } else {
      handleFailedLogin();
    }
  } catch (error) {
    handleError(error);
  }
}
//The findUser function searches for a user in a dataset (userData) based on input email and password.
//It returns a user if their email matches the input email, and their password matches the input password or passes a local password check.
function findUser(userData, inputEmail, inputPassword) {
  return userData.find(
    (user) =>
      user.email === inputEmail &&
      (user.password === inputPassword ||
        checkLocalPassword(inputEmail, inputPassword))
  );
}

//The handleSuccessfulLogin function processes a successful
//user login on a website by storing the user's name, displaying a "Login Successful" popup, and redirecting to 'summary.html' after a 900-millisecond delay.
function handleSuccessfulLogin(user) {
  currentUser = user.name;
  localStorage.setItem("currentUser", currentUser);
  createPopup("Login successfull!");
  setTimeout(() => {
    window.location.href = "summary.html";
  }, 900);
}
/**create a error message */
function handleFailedLogin() {
  createPopup("Wrong email or password.");
}
/**produces an error message for the function createmodal */
function handleError(error) {
  console.error("Fehler bei der Anmeldung:", error);
  createModal("Bei der Anmeldung ist ein Fehler aufgetreten.");
}
/**The createModal function generates a modal (popup) with a provided message.
 * It creates the modal structure, including a close button and the message.
 * If the document's body exists, it appends these elements to it and displays the modal. */
function createModal(message) {
  const modal = createModalElement();
  const modalContent = createModalContent();
  const closeButton = createCloseButton(modal);
  const modalMessage = createModalMessage(message);

  if (document.body) {
    appendElements(modalContent, [closeButton, modalMessage]);
    appendElements(document.body, [modal]);
    showModal(modal);
  } else {
  }
}

function createModalElement() {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  return modal;
}
/**creates an html with the css class modal */
function createModalContent() {
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  return modalContent;
}
/**The createCloseButton function creates a close button for a modal (popup). This button is created as a span element with a CSS class "close" and an "x" symbol */
function createCloseButton(modal) {
  const closeButton = document.createElement("span");
  closeButton.classList.add("close");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modal);
  });
  return closeButton;
}

function createModalMessage(message) {
  const modalMessage = document.createElement("p");
  modalMessage.textContent = message;
  return modalMessage;
}
/**The appendElements function adds a list of HTML elements to a parent HTML element. */
function appendElements(parent, elements) {
  elements.forEach((element) => {
    parent.appendChild(element);
  });
}
/* creates a pop up window with the message for the user*/
function createPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    document.body.removeChild(popup);
  }, 1000); // Das Pop-up wird nach 1 Sekunde automatisch geschlossen
}
/**modal gets a css property dislpay block */
function showModal(modal) {
  modal.style.display = "block";
}

createModal("Anmeldung erfolgreich!");
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
  window.location.href = "SignUp.html";
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
