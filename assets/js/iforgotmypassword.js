const STORAGE_TOKEN = "V2EKVKFM9O99OC501HIARH82FGY2SQSIN8JU7MDJ";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

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
//replaces the password which is saved in the JSON
async function resetPassword() {
  const email = document.getElementById("email").value;
  if (!isValidEmail(email)) {
    createPopup("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    return;
  }
  try {
    const usersData = JSON.parse(await getItem("users"));
    const userWithEmail = usersData.find((user) => user.email === email);
    if (userWithEmail) {
      redirectToResetPasswordPage();
    } else {
      createPopup("Die E-Mail-Adresse wurde nicht gefunden.");
    }
  } catch (e) {
    console.error("Fehler beim Überprüfen der E-Mail-Adresse:", e);
  }
}

// go to reset password page
function redirectToResetPasswordPage() {
  window.location.href = "resetPassword.html";
}
//The isValidEmail function checks whether a given email string is a valid email address using a regular expression, and it returns true if the email is valid and false if it's not.
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
//checks whether the specified email address exists in the JSON
async function checkEmailExistence(email) {
  try {
    const usersData = JSON.parse(await getItem("users"));
    const userWithEmail = usersData.find((user) => user.email === email);
    if (userWithEmail) {
      alert(
        "Die E-Mail-Adresse wurde gefunden. Das Passwort wird zurückgesetzt."
      );
      resetPassword(email);
    } else {
      alert("Die E-Mail-Adresse wurde nicht gefunden.");
    }
  } catch (e) {
    console.error("Fehler beim Überprüfen der E-Mail-Adresse:", e);
  }
}

//creates a password where the user can create it via the input fields and then save it to local storage
async function changePassword() {
  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("password").value;
  if (!isValidEmail(email)) {
    alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    return;
  }
  try {
    if (localStorage.getItem(email)) {
      alert(
        "Diese E-Mail-Adresse wurde bereits verwendet. Bitte verwenden Sie eine andere."
      );
      return;
    }
    localStorage.setItem(email, newPassword);
    alert("Ihr neues Passwort wurde erfolgreich gespeichert.");
    window.location.href = "../../login.html";
  } catch (e) {
    console.error(
      "Fehler beim Speichern des neuen Passworts im Local Storage:",
      e
    );
  }
}
// create a popup window
function createPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    document.body.removeChild(popup);
  }, 2000); // Das Pop-up wird nach 2 Sekunden automatisch geschlossen
}
/**The sendPasswordResetEmail function simply redirects the user's browser to the 'resetPassword.html' page when invoked, presumably for handling password reset functionality. */
async function sendPasswordResetEmail(email) {
  const targetUrl = "resetPassword.html";
  window.location.href = targetUrl;
}
//go back to login.html
function goBackToLogin() {
  const targetUrl = "../../login.html";
  window.location.href = targetUrl;
}
