async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

function redirectToPrivacyPolicy() {
  window.location.href = "./privacy_policy.html";
}

function redirectToLegalNotice() {
  window.location.href = "./legal_notice.html";
}

function backButton() {
  window.location.href = "./privacy_policy.html";
}

document.addEventListener("DOMContentLoaded", function () {
  // Hinzufügen des Event-Listeners auf das Fenster
  window.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
});

function handleMouseDown() {
  // Speichern Sie den Zustand des Kontaktlisten-Divs vor dem Klick
  window.clickedInsideContactList = false;
}

function handleMouseUp(event) {
  let contactList = document.getElementById("contactList");
  let addContactButton = document.getElementById("addNewContact");
  let imgElement = document.querySelector(".add-task-show-contacts-btn");

  // Überprüfen Sie, ob das Klicken innerhalb des Kontaktlisten-Divs erfolgt ist
  if (contactList.contains(event.target) || event.target === addContactButton) {
    window.clickedInsideContactList = true;
  } else {
    window.clickedInsideContactList = false;
  }

  // Überprüfen Sie, ob das Kontaktlisten-Div geöffnet ist und ob außerhalb geklickt wurde
  if (
    contactList.style.display === "block" &&
    addContactButton.style.display === "flex" &&
    !window.clickedInsideContactList
  ) {
    contactList.style.display = "none";
    addContactButton.style.display = "none";
    imgElement.src = "./assets/img/arrow_drop_down.svg";
  }
  renderContactBadges();
}
