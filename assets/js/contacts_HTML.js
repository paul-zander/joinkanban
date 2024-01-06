function showContactList() {
  let initialLetters = getUniqueLetters();

  const contactList = document.getElementById("contact-list");

  contactList.innerHTML = "";
  for (let i = 0; i < initialLetters.length; i++) {
    contactList.innerHTML += /*html*/ `
          <div>
              <div class="single-contact-list-header">
               ${initialLetters[i]}   
              </div>
              <div class="contact-letter-wrapper contacts-letter-${initialLetters[i]}" id="${initialLetters[i]}">
              <!-- hier kommen contacts mit jeweiligem Anfangsbuchstaben rein -->
              </div>
          </div>
      `;
  }
}

function showContactsForSingleLetter() {
  const allContactWrapper = document.querySelectorAll(
    ".contact-letter-wrapper"
  );

  for (let i = 0; i < allContactWrapper.length; i++) {
    const contacts = localContacts.filter(
      (contact) =>
        contact.name.charAt(0).toUpperCase() === allContactWrapper[i].id
    );

    const contactDivs = generateContactDivs(contacts);

    allContactWrapper[i].innerHTML = contactDivs.join("");
  }
}

function generateContactDivs(contacts) {
  let contactDivs = contacts.map((contact) => {
    return /*html*/ `
          <div class="contact-wrapper" id="${
            contact.id
          }" onclick="showContactDetails(${contact.id})">
            <div class="contact-wrapper-left" style="background:${
              contact.color
            }">${generateInitials(contact.name)}</div>
            <div class="contact-wrapper-right">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-email">${contact.email}</div>
            </div>
          </div>
        `;
  });

  return contactDivs;
}

function createEditButton(id) {
  return `
    <div class="details-edit" onclick="editContact(${id})">
        <img src="./assets/img/edit.svg" alt="" />
        <span>Edit</span>
    </div>
    `;
}

function createDeleteButton(id) {
  return `
    <div class="details-delete" onclick="deleteContact(event, ${id})">
        <img src="./assets/img/delete.svg" alt="" />
        <span>Delete</span>
    </div>
    `;
}

function createEditButtonWrapper(id) {
  return `
    <div class="delete-btn" onclick="deleteContact(event, ${id})">Delete</div>
    <div class="save-btn" onclick="updateContact(event, ${id})">
        Save <img src="./assets/img/check.svg" alt="" />
    </div>
  `;
}
