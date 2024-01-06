let localContacts;
let localTasks;

async function init() {
  await includeHTML();
  await loadContacts();
  await getToDos();
  await setHeaderInitials();
  await setProfileBadgeEventListener();
  await setActiveNavLink();
  showContactList();
  showContactsForSingleLetter();
}

async function loadContacts() {
  const keyToSearch = "contacts";
  let contacts = await getItem(keyToSearch);
  localContacts = JSON.parse(contacts);
}

async function getToDos() {
  let tasks = JSON.parse(await getItem("tasks"));
  localTasks = tasks;
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  toast.innerHTML = message;
  toast.classList.add("show-toast");

  setTimeout(() => {
    toast.classList.remove("show-toast");
  }, 3000);
}

function openAddContactModal() {
  const addContactModal = document.querySelector(".add-contact-modal");
  addContactModal.classList.add("open");
  const overlay = document.querySelector(".overlay");
  overlay.classList.remove("d-none");
}

function openEditModal() {
  const editModal = document.querySelector(".edit-contact-modal");
  editModal.classList.add("open");
  const overlay = document.querySelector(".overlay");
  overlay.classList.remove("d-none");
}

function closeModal(event, modalType) {
  event.preventDefault();
  const openModals = document.querySelectorAll(".open");
  openModals.forEach((modal) => {
    modal.classList.remove("open");
  });

  const modal = document.querySelector(`.${modalType}-contact-modal`);
  modal.classList.remove("open");
  const overlay = document.querySelector(".overlay");
  overlay.classList.add("d-none");
  document.body.style.overflow = "auto";
  const deleteModal = document.querySelector(".delete-modal");
  deleteModal.classList.add("d-none");
}

function closeUserDetails() {
  const editModal = document.querySelector(".user-details");
  editModal.classList.remove("open");
  document.body.style.overflow = "auto";
}

const assigneeColors = [
  "#FF7A00",
  "#FF5EB3",
  "#9747FF",
  "#9327FF",
  "#00BEE8",
  "#1FD7C1",
  "#FF745E",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#C3FF2B",
  "#FFE62B",
  "#FF4646",
  "#FFBB2B",
];

async function handleCreateContact(event) {
  event.preventDefault();
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const newContact = createNewContact(nameInput, emailInput, phoneInput);
  saveContact(newContact);
  showToast("✅ Contact added");
  clearInputs(nameInput, emailInput, phoneInput);
  closeModal(event, "add");
  showContactList();
  showContactsForSingleLetter();
}

function createNewContact(nameInput, emailInput, phoneInput) {
  const randomColor =
    assigneeColors[Math.floor(Math.random() * assigneeColors.length)];

  return {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    color: randomColor,
    id: Date.now() + Math.floor(Math.random() * 100),
  };
}

async function saveContact(contact) {
  localContacts.push(contact);
  await setItem("contacts", localContacts);
}

function clearInputs(...inputs) {
  inputs.forEach((input) => (input.value = ""));
}

function getInitialLetters() {
  return localContacts.map((contact) => contact.name[0]);
}

function getUniqueLetters() {
  let letters = getInitialLetters();
  let uniqueLetters = new Set(letters);
  return [...uniqueLetters].sort();
}

function showContactDetails(id) {
  const detailsContainer = document.querySelector(".user-details");
  detailsContainer.classList.add("open");

  const clickedContact = localContacts.find((contact) => contact.id === id);
  updateDetailsUI(clickedContact);
  updateButtonsUI(id);

  if (window.innerWidth <= 924) {
    document.body.style.overflow = "hidden";
  }
}

function updateDetailsUI(contact) {
  const nameDiv = document.querySelector(".details-name");
  const initialsDiv = document.querySelector(".details-badge");
  const emailDiv = document.querySelector(".details-email-content");
  const phoneDiv = document.querySelector(".details-phone-number");

  const initials = generateInitials(contact.name);

  nameDiv.innerHTML = contact.name;
  initialsDiv.innerHTML = initials;
  initialsDiv.style.background = contact.color;
  emailDiv.innerHTML = contact.email;
  phoneDiv.innerHTML = contact.phone;
}

function updateButtonsUI(id) {
  const editDiv = document.querySelector(".insert-edit-btn");
  const deleteDiv = document.querySelector(".insert-delete-btn");
  const btnWrapper = document.querySelector(".edit-contact-btn-wrapper");

  editDiv.innerHTML = createEditButton(id);
  deleteDiv.innerHTML = createDeleteButton(id);
  btnWrapper.innerHTML = createEditButtonWrapper(id);
}

function editContact(id) {
  openEditModal();
  const contactToBeEdited = localContacts.find((contact) => contact.id === id);
  const badge = document.querySelector(".edit-badge-wrapper");
  const editNameInput = document.getElementById("edit-name");
  const editEmailInput = document.getElementById("edit-email");
  const editPhoneInput = document.getElementById("edit-phone");
  badge.innerHTML = generateInitials(contactToBeEdited.name);
  badge.style.background = contactToBeEdited.color;
  editNameInput.value = contactToBeEdited.name;
  editEmailInput.value = contactToBeEdited.email;
  editPhoneInput.value = contactToBeEdited.phone;
}

async function updateContact(event, id) {
  event.preventDefault();
  const contactToBeEdited = localContacts.find((contact) => contact.id === id);

  const inputValues = getEditInputValues();

  contactToBeEdited.name = inputValues.updatedName;
  contactToBeEdited.email = inputValues.updatedEmail;
  contactToBeEdited.phone = inputValues.updatedPhone;

  await setItem("contacts", localContacts);
  showToast("✅ Contact updated");
  closeModal(event, "edit");
  showContactDetails(id);
  showContactList();
  showContactsForSingleLetter();
}

function getEditInputValues() {
  const editNameInput = document.getElementById("edit-name");
  const editEmailInput = document.getElementById("edit-email");
  const editPhoneInput = document.getElementById("edit-phone");

  const inputValues = {
    updatedName: editNameInput.value,
    updatedEmail: editEmailInput.value,
    updatedPhone: editPhoneInput.value,
  };

  return inputValues;
}

function hideUserDetails() {
  const userDetailsModal = document.querySelector(".user-details");
  userDetailsModal.classList.add("d-none");
}

/* START: Code for delete modal */

const deleteModal = document.querySelector(".delete-modal");
const deleteTaskBtn = document.querySelector(".delete-modal-delete-btn");
const cancelDeleteBtn = document.querySelector(".delete-modal-cancel-btn");
let currentContactId;

function addClickListener(element, eventType, eventHandler) {
  element.addEventListener(eventType, eventHandler);
}

function removeListeners() {
  removeClickListener(deleteTaskBtn, "click", deleteTaskFunction);
  removeClickListener(cancelDeleteBtn, "click", cancelDeleteFunction);
}

function removeClickListener(element, eventType, eventHandler) {
  element.removeEventListener(eventType, eventHandler);
}

function deleteContact(event, contactId) {
  const overlay = document.querySelector(".overlay");
  overlay.classList.toggle("d-none");
  toggleDeleteModal();
  currentContactId = contactId;
  addClickListener(deleteTaskBtn, "click", deleteTaskFunction);
  addClickListener(cancelDeleteBtn, "click", cancelDeleteFunction);
}

async function deleteTaskFunction(event) {
  const contact = localContacts.find(
    (contact) => +contact.id === +currentContactId
  );
  deleteContactFromLocalContacts(contact);
  await setItem("contacts", localContacts);
  await deleteContactFromTasks(contact.id);
  showToast("✅ Contact deleted");
  toggleDeleteModal();
  hideOverlay();
  removeListeners();
  closeDetailsUI();
  document.body.style.overflow = "auto";
  closeModal(event, "edit");
  showContactList();
  showContactsForSingleLetter();
}

function deleteContactFromLocalContacts(contact) {
  const index = localContacts.indexOf(contact);
  localContacts.splice(index, 1);
}

function hideOverlay() {
  const overlay = document.querySelector(".overlay");
  overlay.classList.toggle("d-none");
}

function closeDetailsUI() {
  const detailsContainer = document.querySelector(".user-details");
  detailsContainer.classList.remove("open");
}

function cancelDeleteFunction() {
  const overlay = document.querySelector(".overlay");
  overlay.classList.toggle("d-none");
  toggleDeleteModal();
  removeListeners();
}

function toggleDeleteModal() {
  deleteModal.classList.toggle("d-none");
}

async function deleteContactFromTasks(id) {
  const updatedLocalTasks = localTasks.map((task) => {
    task.assignees = task.assignees.filter((assignee) => assignee.id !== id);
    return task;
  });

  await setItem("tasks", updatedLocalTasks);
}

/* END: Code for delete modal */
