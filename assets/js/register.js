let localUsers;

async function init() {
  loadUsers();
}

async function loadUsers() {
  const keyToSearch = "users";
  let users = await getItem(keyToSearch);
  localUsers = JSON.parse(users);
}

/** creates a pop up window with the message for the user*/
function createPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    document.body.removeChild(popup);
  }, 1000); // Das Pop-up wird nach 1 Sekunden automatisch geschlossen
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  toast.innerHTML = message;
  toast.classList.add("open");

  setTimeout(() => {
    toast.classList.remove("open");
  }, 5000);
}

function checkPasswordValidation() {
  const userPassword = document.getElementById("pw-password-input").value;
  const confirmUserPassword = document.getElementById(
    "confirm-password-input"
  ).value;

  if (userPassword !== confirmUserPassword) {
    showToast("⛔ The passwords do not match. Please check your entry.");
    return false;
  }

  return true;
}

/**The register function disables the registration button, collects user data, updates storage, resets the form, briefly displays a message, and then redirects to 'login.html'. */
async function register(event) {
  event.preventDefault();
  // registerBtn.disabled = true;
  const userName = document.getElementById("name-input").value;
  const userEmail = document.getElementById("email-input").value;
  const userPassword = document.getElementById("pw-password-input").value;
  const confirmUserPassword = document.getElementById(
    "confirm-password-input"
  ).value;

  if (!checkPasswordValidation()) {
    // Wenn die Passwortvalidierung fehlschlägt, hier abbrechen
    return;
  }
  // START: Müssen Usern Farben zugewiesen werden? Daher erstmal auskommentiert
  // const randomColor =
  //   assigneeColors[Math.floor(Math.random() * assigneeColors.length)];
  // END: Müssen Usern Farben zugewiesen werden? Daher erstmal auskommentiert
  localUsers.push({
    email: userEmail,
    password: userPassword,
    name: userName,
    id: localUsers.length + 1,
    // color: randomColor,
  });
  await setItem("users", localUsers);

  showToast("✅ Registered successfully");
  resetForm();
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}
/**Empties the input fields */
function resetForm() {
  userName = "";
  userEmail = "";
  userPassword = "";
  confirmUserPassword = "";
}

// const assigneeColors = [
//   "#FF7A00",
//   "#FF5EB3",
//   "#9747FF",
//   "#9327FF",
//   "#00BEE8",
//   "#1FD7C1",
//   "#FF745E",
//   "#FFA35E",
//   "#FC71FF",
//   "#FFC701",
//   "#0038FF",
//   "#C3FF2B",
//   "#FFE62B",
//   "#FF4646",
//   "#FFBB2B",
// ];
