const STORAGE_TOKEN = "V2EKVKFM9O99OC501HIARH82FGY2SQSIN8JU7MDJ";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";
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

function togglePassword(input) {
  let passwordInput = document.getElementById(`${input}-password-input`);
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

/** It takes a key and value as input parameters.
    Constructs a payload object with key, value, and a token.
    Sends a POST request to a storage URL (STORAGE_URL) with the payload as JSON.
    It returns a Promise that resolves to the response from the storage server as JSON. */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}
/** It takes a key as an input parameter.
    Constructs a URL for fetching data, including the key and a token.
    Sends a GET request to the storage URL with the constructed URL.
    It returns a Promise that resolves to the value associated with the key, or it throws an error if the data with the key is not found */
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

/**back to login.html */
function goBackToLogin() {
  window.location.href = "login.html";
}

/**go to privacy_policy.html */
function redirectToPrivacyPolicy() {
  window.location.href = "privacy_policy.html";
}

/* go to legal_notice.html */
function redirectToLegalNotice() {
  window.location.href = "legal_notice.html";
}
