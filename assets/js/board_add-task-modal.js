initAddTaskModal();

/**
 * Initializes the "Add Task" modal, including loading contacts and tasks and rendering contact badges.
 */
async function initAddTaskModal() {
  await loadContacts();
  await loadTasks();
  await renderContactsInAddTaskModal();
}

/**
 * Loads contacts and stores them in the addTaskLocalContacts variable.
 */
async function loadContacts() {
  const keyToSearch = "contacts";
  let contacts = await getItem(keyToSearch);
  addTaskLocalContacts = JSON.parse(contacts);
}

/**
 * Loads tasks and stores them in the addTaskLocalTasks variable.
 */
async function loadTasks() {
  const keyToSearch = "tasks";
  let tasks = await getItem(keyToSearch);
  addTaskLocalTasks = JSON.parse(tasks);
}

let addTaskLocalContacts;
let addTaskLocalTasks;
const title = document.querySelector(".add-task-modal-headline");
const description = document.querySelector(".add-task-description-textarea");
const dueDate = document.querySelector(".add-task-date-input");
let category;
let priority;
let newSubtasks = [];
let contacts = [];
let columnCategory;

/**
 * Creates a new task based on user input and adds it to the tasks list.
 */
async function createNewTask() {
  await loadTasks();
  let newTask = {
    title: title.value,
    description: description.value,
    dueDate: dueDate.value,
    label: category,
    priority: priority,
    subtasks: newSubtasks,
    assignees: contacts,
    id: addTaskLocalTasks.length + 1,
    category: columnCategory,
  };
  addTaskLocalTasks.push(newTask);
  // await setNewIdsForTasks(addTaskLocalTasks);
  await setItem("tasks", JSON.stringify(addTaskLocalTasks));
  showToast("✅ Task added to board");
  resetRequiredWrapper();
  resetRequiredMessages();
  closeAddTaskModal();
  clearNewTask();
  renderCards();
}

function closeAddTaskModal() {
  const addTaskModal = document.querySelector(".add-task-modal");
  const overlay = document.querySelector(".overlay");
  addTaskModal.classList.toggle("is-active");
  overlay.classList.toggle("hidden");
}

/**
 * Clears the input fields and resets selected options in the "Add Task" modal.
 */
function clearNewTask() {
  title.value = "";
  description.value = "";
  dueDate.value = "";
  priority = undefined;
  newSubtasks = [];
  contacts = [];
  resetPriorityButtons();
  resetAssigneesWrapper();
  resetContactBadges();
  resetCategory();
  resetSubtasks();
}

/**
 * Resets the selected category in the "Add Task" modal.
 */
function resetCategory() {
  const selectedCategoryBtn = document.querySelector(".select-category");
  selectedCategoryBtn.innerHTML = "Select task category";
}

/**
 * Resets the selected assignees in the "Add Task" modal.
 */
function resetAssigneesWrapper() {
  const assigneeWrappers = document.querySelectorAll(
    ".add-task-contacts-wrapper"
  );
  assigneeWrappers.forEach((assigneeWrapper) => {
    assigneeWrapper.classList.remove("add-task-contacts-wrapper-selected");
  });

  const checkboxes = document.querySelectorAll(".contacts-row-checkbox");
  checkboxes.forEach(
    (checkbox) => (checkbox.src = "./assets/img/checkbox.svg")
  );
}

/**
 * Resets the contact badges in the "Add Task" modal.
 */
function resetContactBadges() {
  const contactBadgesWrapper = document.querySelector(
    ".add-task-contact-badges-container"
  );
  contactBadgesWrapper.innerHTML = "";
}

/**
 * Resets the selected subtasks in the "Add Task" modal.
 */
function resetSubtasks() {
  const subtasksWrapper = document.querySelector(".added-subtasks");
  subtasksWrapper.innerHTML = "";
  addTaskSubtaskInput.value = "";
  clearButtonWrapper.style.display = "none";
  divider.style.display = "none";
  addSubtaskIcon.style.display = "none";
  startInputIcon.style.display = "flex";
}

/**
 * Resets the selected priority in the "Add Task" modal.
 */
function resetPriorityButtons() {
  const btnUrgent = document.querySelector(".add-task-edit-urgent");
  const btnMedium = document.querySelector(".add-task-edit-medium");
  const urgentImg = document.querySelector(".add-task-edit-urgent img");
  const mediumImg = document.querySelector(".add-task-edit-medium img");
  const lowImg = document.querySelector(".add-task-edit-low img");
  const btnLow = document.querySelector(".add-task-edit-low");
  btnUrgent.classList.remove("urgently-selected");
  btnMedium.classList.remove("medium-selected");
  btnLow.classList.remove("low-selected");
  urgentImg.src = "./assets/img/highprio.svg";
  mediumImg.src = "./assets/img/mediumprio.svg";
  lowImg.src = "./assets/img/lowprio.svg";
}

// renderContactsInAddTaskModal();

// Priority Buttons
const btnUrgent = document.querySelector(".add-task-edit-urgent");
const btnMedium = document.querySelector(".add-task-edit-medium");
const btnLow = document.querySelector(".add-task-edit-low");

btnUrgent.addEventListener("click", () => {
  changeColorOfPriorityBtnAddTaskModal("Urgent");
  priority = "Urgent";
});

btnMedium.addEventListener("click", () => {
  changeColorOfPriorityBtnAddTaskModal("Medium");
  priority = "Medium";
});

btnLow.addEventListener("click", () => {
  changeColorOfPriorityBtnAddTaskModal("Low");
  priority = "Low";
});

/**
 * Changes the color of the priority button in the "Add Task" modal.
 * @param {string} priority - The selected priority (Urgent, Medium, or Low).
 */
function changeColorOfPriorityBtnAddTaskModal(priority) {
  const btnUrgent = document.querySelector(".add-task-edit-urgent");
  const btnMedium = document.querySelector(".add-task-edit-medium");
  const btnLow = document.querySelector(".add-task-edit-low");
  const urgentImg = document.querySelector(".add-task-edit-urgent img");
  const mediumImg = document.querySelector(".add-task-edit-medium img");
  const lowImg = document.querySelector(".add-task-edit-low img");

  resetBackgroundColor(btnUrgent, btnMedium, btnLow);
  resetButtons(urgentImg, mediumImg, lowImg);
  selectedPriority(
    priority,
    btnUrgent,
    btnMedium,
    btnLow,
    urgentImg,
    mediumImg,
    lowImg
  );
}

function selectedPriority(
  priority,
  btnUrgent,
  btnMedium,
  btnLow,
  urgentImg,
  mediumImg,
  lowImg
) {
  if (priority === "Urgent") {
    btnUrgent.classList.add("urgently-selected");
    urgentImg.src = "./assets/img/urgent-white.svg";
    //   task.priority = "Urgent";
  } else if (priority === "Medium") {
    btnMedium.classList.add("medium-selected");
    mediumImg.src = "./assets/img/medium-white.svg";
    //   task.priority = "Medium";
  } else if (priority === "Low") {
    btnLow.classList.add("low-selected");
    lowImg.src = "./assets/img/low-white.svg";
    //   task.priority = "Low";
  }
}

function resetButtons(urgentImg, mediumImg, lowImg) {
  urgentImg.src = "./assets/img/highprio.svg";
  mediumImg.src = "./assets/img/mediumprio.svg";
  lowImg.src = "./assets/img/lowprio.svg";
}

function resetBackgroundColor(btnUrgent, btnMedium, btnLow) {
  btnUrgent.classList.remove("urgently-selected");
  btnMedium.classList.remove("medium-selected");
  btnLow.classList.remove("low-selected");
}

// END: Code for priority buttons

// START: Code for assigned-to section

/**
 * Renders the contacts in the "Add Task" modal.
 */
async function renderContactsInAddTaskModal() {
  const assigneesBadgesWrapper = document.querySelector(
    ".add-task-assigned-to-badges"
  );
  assigneesBadgesWrapper.innerHTML = "";
  for (let i = 0; i < addTaskLocalContacts.length; i++) {
    const name = addTaskLocalContacts[i].name;
    const initials = generateInitials(name);
    const color = addTaskLocalContacts[i].color;
    assigneesBadgesWrapper.innerHTML += /*html*/ `
        <div class="add-task-contacts-wrapper" id="add-task-contacts-wrapper-${addTaskLocalContacts[i].id}" onclick="markContactsInAddTaskDropdown(${addTaskLocalContacts[i].id})">
            <div class="add-task-contacts-row">
                <div class="assignee" style="background: ${color}">
                    <div class="assignee-initals">${initials}</div>
                </div>
                <div class="assignee-name">${name}</div>
            </div>
            <img id="add-task-contacts-row-checkbox${addTaskLocalContacts[i].id}" class="contacts-row-checkbox" src="./assets/img/checkbox.svg" alt="">
        </div>
    `;
  }
}

/**
 * Renders the contact badges in the "Add Task" modal.
 */
function renderAddTaskContactBadges() {
  const contactBadgesWrapper = document.querySelector(
    ".add-task-contact-badges-container"
  );
  contactBadgesWrapper.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    const name = contacts[i].name;
    const initials = generateInitials(name);
    const color = contacts[i].color;
    contactBadgesWrapper.innerHTML += /*html*/ `
            <div class="assignee" style="background: ${color}">${initials}</div>
        `;
  }
}

/**
 * Toggles the visibility of contacts in the "Add Task" modal.
 */
function toggleContactsInAddTaskModal() {
  const assigneesBadgesWrapper = document.querySelector(
    ".add-task-assigned-to-badges"
  );
  const imgElement = document.querySelector(".add-task-show-contacts-btn");
  // const addContactBtn = document.querySelector(".add-task-add-contact-btn");
  const contactBadges = document.querySelector(
    ".add-task-contact-badges-container"
  );
  assigneesBadgesWrapper.classList.toggle("d-none");
  contactBadges.classList.toggle("d-none");
  // addContactBtn.classList.toggle("d-none");
  if (assigneesBadgesWrapper.classList.contains("d-none")) {
    imgElement.src = "./assets/img/arrow_drop_down.svg";
  } else {
    imgElement.src = "./assets/img/arrow_drop_up.svg";
  }
}

/**
 * Marks or unmarks contacts in the "Add Task" modal when selected.
 * @param {number} i - The index of the contact being marked.
 */
function markContactsInAddTaskDropdown(i) {
  const contactWrapper = document.getElementById(
    `add-task-contacts-wrapper-${i}`
  );
  contactWrapper.classList.toggle("add-task-contacts-wrapper-selected");
  const checkboxOfContact = document.getElementById(
    `add-task-contacts-row-checkbox${i}`
  );
  if (contactWrapper.classList.contains("add-task-contacts-wrapper-selected")) {
    checkboxOfContact.src = "./assets/img/checkbox-checked-white.svg";
  } else {
    checkboxOfContact.src = "./assets/img/checkbox.svg";
  }
  const selectedContact = addTaskLocalContacts.find(
    (contact) => contact.id === i
  );
  contacts.includes(selectedContact)
    ? contacts.splice(contacts.indexOf(selectedContact), 1)
    : contacts.push(selectedContact);
  renderAddTaskContactBadges();
}

// Search Bar for Contacts
const searchBarContacts = document.querySelector(".add-task-assigned-to-input");
const addTaskContactRows = document.querySelectorAll(".add-task-contacts-row");
const contactWrapper = document.querySelector(".add-task-assigned-to-badges");
const addContacktBtn = document.querySelector(".add-task-add-contact-btn");
const imgElement = document.querySelector(".add-task-show-contacts-btn");

searchBarContacts.addEventListener("click", () => {
  contactWrapper.classList.toggle("d-none");
  // addContactBtn.classList.toggle("d-none");
  if (contactWrapper.classList.contains("d-none")) {
    imgElement.src = "./assets/img/arrow_drop_down.svg";
  } else {
    imgElement.src = "./assets/img/arrow_drop_up.svg";
  }
});

searchBarContacts.addEventListener("keyup", (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll(".add-task-contacts-row").forEach((contactRow) => {
    const contactName = contactRow
      .querySelector(".assignee-name")
      .textContent.toLowerCase();

    if (contactName.indexOf(term) !== -1) {
      contactRow.closest(".add-task-contacts-wrapper").style.display = "flex";
    } else {
      contactRow.closest(".add-task-contacts-wrapper").style.display = "none";
    }
  });
});

// const categoryDiv = document.querySelector('.add-task-category-wrapper');

/**
 * Toggles the visibility of categories in the "Add Task" modal.
 */
function toggleCategoriesInAddTaskModal() {
  const categoryOptions = document.querySelector(".category-options");
  categoryOptions.classList.toggle("d-block");
  const categoryArrow = document.querySelector(".add-task-show-categories-btn");
  if (categoryOptions.classList.contains("d-block")) {
    categoryArrow.src = "./assets/img/arrow_drop_up.svg";
  } else {
    categoryArrow.src = "./assets/img/arrow_drop_down.svg";
  }
}

// User Story and Technical Task Buttons
const userStoryBtn = document.querySelector(".add-task-category-user-story");
const technicalTaskBtn = document.querySelector(
  ".add-task-category-technical-task"
);
const selectedCategoryBtn = document.querySelector(".select-category");
const categoryOptionsWrapper = document.querySelector(".category-options");
const categoryArrow = document.querySelector(".add-task-show-categories-btn");

userStoryBtn.addEventListener("click", () => setCategory("User Story"));
technicalTaskBtn.addEventListener("click", () => setCategory("Technical Task"));

function setCategory(selectedCategory) {
  selectedCategoryBtn.innerHTML = selectedCategory;
  category = selectedCategory;
  categoryOptionsWrapper.classList.remove("d-block");
  categoryOptionsWrapper.classList.add("d-none");
  categoryArrow.src = "./assets/img/arrow_drop_down.svg";
}

// END: Code for category section

const subtasksWrapper = document.querySelector(".add-task-edit-subtasks");
const inputDiv = document.querySelector(".add-task-subtasks-input-wrapper");
const addTaskSubtaskInput = document.querySelector(".add-task-subtasks-input");
const clearButtonWrapper = document.querySelector(".add-task-clear-wrapper");
const divider = document.querySelector(".add-task-subtasks-icons-divider");
const addSubtaskIcon = document.querySelector(".add-task-subtasks-icon-add");
const startInputIcon = document.querySelector(".add-task-subtasks-plus-icon");

/**
 * Focuses the input field for subtasks.
 */
function focusSubtaskInput() {
  document.querySelector(".add-task-subtasks-input").focus();
}

/**
 * Updates display elements based on whether the subtask input is empty.
 * @param {boolean} isEmpty - Indicates whether the subtask input is empty.
 */
function updateDisplayElements(isEmpty) {
  const clearButtonWrapper = document.querySelector(".add-task-clear-wrapper");
  const divider = document.querySelector(".add-task-subtasks-icons-divider");
  const addSubtaskIcon = document.querySelector(".add-task-subtasks-icon-add");
  const startInputIcon = document.querySelector(".add-task-subtasks-plus-icon");

  clearButtonWrapper.style.display = isEmpty ? "none" : "flex";
  divider.style.display = isEmpty ? "none" : "flex";
  addSubtaskIcon.style.display = isEmpty ? "none" : "flex";
  startInputIcon.style.display = isEmpty ? "flex" : "none";
}

/**
 * Handles the subtask input, listens for input changes, and updates display elements.
 */
function handleSubtaskInput() {
  const addTaskSubtaskInput = document.querySelector(
    ".add-task-subtasks-input"
  );
  const clearButtonWrapper = document.querySelector(".add-task-clear-wrapper");

  addTaskSubtaskInput.addEventListener("input", () => {
    const isEmpty = addTaskSubtaskInput.value === "";
    updateDisplayElements(isEmpty);
  });

  clearButtonWrapper.addEventListener("click", clearSubtaskInputField);
}

/**
 * Clears the subtask input field and updates display elements.
 */
function clearSubtaskInputField() {
  const addTaskSubtaskInput = document.querySelector(
    ".add-task-subtasks-input"
  );
  addTaskSubtaskInput.value = "";
  updateDisplayElements(true);
}

/**
 * Handles the addition of subtasks in the "Add Task" modal.
 */
function handleAddSubtask() {
  const addTaskSubtaskInput = document.querySelector(
    ".add-task-subtasks-input"
  );
  const addSubtaskIcon = document.querySelector(".add-task-subtasks-icon-add");

  addSubtaskIcon.addEventListener("click", () => {
    if (addTaskSubtaskInput.checkValidity()) {
      const subtaskText = addTaskSubtaskInput.value;
      newSubtasks.push({ text: addTaskSubtaskInput.value, status: "todo" });
      renderSubtasksInAddTasksModal();
      addTaskSubtaskInput.value = "";
      updateDisplayElements(true);
    } else {
      console.log("Please fill in the subtask field.");
    }
  });
}

/**
 * Initializes the subtask handling in the "Add Task" modal.
 */
function initSubtaskHandling() {
  const inputDiv = document.querySelector(".add-task-subtasks-input-wrapper");
  const editSubtasksPlusIcon = document.querySelector(
    ".add-task-subtasks-plus-icon"
  );

  inputDiv.addEventListener("click", focusSubtaskInput);
  handleSubtaskInput();
  editSubtasksPlusIcon.addEventListener("click", focusSubtaskInput);
}

initSubtaskHandling();
handleAddSubtask();

function renderEditSubtaskContainer(i) {
  const subtaskContainer = document.querySelector(".add-task-task-input");
  subtaskContainer.innerHTML = /*html*/ `
        <input class="add-task-task-inputfield" type="text">
        <div class="add-task-task-input-icons-wrapper">
            <img class="add-task-task-delete-icon" id="add-task-task-delete-icon${i}" src="./assets/img/delete.svg" alt="">
            <div class="add-task-subtasks-input-icons-divider"></div>
            <img class="add-task-task-confirm-edit-icon" id="add-task-task-confirm-edit-icon${i}" src="./assets/img/Subtask's icons.svg" alt="">
        </div>
    `;
}

/**
 * Renders subtasks in the "Add Task" modal.
 */
function renderSubtasksInAddTasksModal() {
  const addedSubtasks = document.querySelector(".added-subtasks");
  addedSubtasks.innerHTML = "";
  for (let i = 0; i < newSubtasks.length; i++) {
    addedSubtasks.innerHTML += /*html*/ `
        <div id ="add-task-subtask-wrapper${i}" class="existing-subtasks-list-item">
            <li id="add-task-subtask${i}" class="subtask-list-item">${newSubtasks[i].text}</li>
            <div class="subtask-list-item-btn">
                <img id="add-task-edit-subtask-btn${i}" class="edit-subtask-btn" src="./assets/img/edit.svg" alt="" onclick="editSubtaskInAddTaskModal(${i})">
                <div class="subtask-list-item-divider"></div>
                <img class="delete-subtask-btn" src="./assets/img/delete.svg" alt="" onclick="deleteSubtaskInAddTaskModal(${i})">
            </div>
        </div>
    `;
  }
}

/**
 * Handles editing of a subtask in the "Add Task" modal.
 * @param {number} i - The index of the subtask to edit.
 */
function editSubtaskInAddTaskModal(i) {
  const listElement = document.getElementById(`add-task-subtask${i}`);
  const subtaskText = listElement.innerHTML;
  const clickedSubtask = newSubtasks.find(
    (subtask) => subtask.text === subtaskText
  );
  hideSubtaskWrapper();
  renderEditSubtaskContainer(i);
  showEditSubtaskInput(clickedSubtask);
  setupEditSubtaskConfirmButton(clickedSubtask, i);
  setupEditSubtaskDeleteButton(clickedSubtask, i);
}

/**
 * Hides the subtask wrapper in the "Add Task" modal.
 */
function hideSubtaskWrapper() {
  const subtaskWrapper = document.querySelector(".added-subtasks");
  subtaskWrapper.style.display = "none";
}

/**
 * Shows the input field for editing a subtask in the "Add Task" modal.
 * @param {object} clickedSubtask - The subtask object to edit.
 */
function showEditSubtaskInput(clickedSubtask) {
  const editSubtaskInputWrapper = document.querySelector(
    ".add-task-task-input"
  );
  editSubtaskInputWrapper.style.display = "flex";
  const editSubtaskInputfield = document.querySelector(
    ".add-task-task-inputfield"
  );
  editSubtaskInputfield.value = clickedSubtask.text;
}

/**
 * Sets up the event listener for the "Edit Task Confirm" button in the "Add Task" modal.
 * @param {object} clickedSubtask - The subtask object being edited.
 */
function setupEditSubtaskConfirmButton(clickedSubtask, i) {
  const editTaskConfirmBtn = document.getElementById(
    `add-task-task-confirm-edit-icon${i}`
  );

  // Vor dem Hinzufügen des EventListeners entfernen, falls er bereits vorhanden ist
  editTaskConfirmBtn.removeEventListener("click", onEditTaskConfirmClick);

  // EventListener hinzufügen und eine Funktion mit Zugriff auf clickedSubtask erstellen
  editTaskConfirmBtn.addEventListener("click", function () {
    onEditTaskConfirmClick(clickedSubtask);
  });
}

/**
 * Handles the action when the "Edit Task Confirm" button is clicked.
 * @param {object} clickedSubtask - The subtask object being edited.
 */
function onEditTaskConfirmClick(clickedSubtask) {
  const editSubtaskInputfield = document.querySelector(
    ".add-task-task-inputfield"
  );
  clickedSubtask.text = editSubtaskInputfield.value;
  hideEditSubtaskInput();
  showSubtaskWrapper();
  renderSubtasksInAddTasksModal();
}

/**
 * Hides the input field for editing a subtask in the "Add Task" modal.
 */
function hideEditSubtaskInput() {
  const editSubtaskInputWrapper = document.querySelector(
    ".add-task-task-input"
  );
  editSubtaskInputWrapper.style.display = "none";
}

/**
 * Shows the subtask wrapper in the "Add Task" modal.
 */
function showSubtaskWrapper() {
  const subtaskWrapper = document.querySelector(".added-subtasks");
  subtaskWrapper.style.display = "block";
}

/**
 * Sets up the event listener for the "Edit Task Delete" button in the "Add Task" modal.
 * @param {object} clickedSubtask - The subtask object being edited.
 */
function setupEditSubtaskDeleteButton(clickedSubtask, i) {
  const editTaskDeleteBtn = document.getElementById(
    `add-task-task-delete-icon${i}`
  );

  // Vor dem Hinzufügen des EventListeners entfernen, falls er bereits vorhanden ist
  editTaskDeleteBtn.removeEventListener("click", onEditTaskDeleteClick);

  // EventListener hinzufügen und eine Funktion mit Zugriff auf clickedSubtask erstellen
  editTaskDeleteBtn.addEventListener("click", function () {
    onEditTaskDeleteClick(clickedSubtask);
  });
}

/**
 * Handles the action when the "Edit Task Delete" button is clicked.
 * @param {object} clickedSubtask - The subtask object being deleted.
 */
function onEditTaskDeleteClick(clickedSubtask) {
  const editTaskDeleteBtn = document.querySelector(
    ".add-task-task-delete-icon"
  );
  const indexOfSubtask = newSubtasks.indexOf(clickedSubtask);
  newSubtasks.splice(indexOfSubtask, 1);
  hideEditSubtaskInput();
  showSubtaskWrapper();
  renderSubtasksInAddTasksModal();

  // Nach der Verwendung den EventListener entfernen, um doppelte Listener zu vermeiden
  // editTaskDeleteBtn.removeEventListener('click', onEditTaskDeleteClick);
}

/**
 * Handles the deletion of a subtask in the "Add Task" modal.
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtaskInAddTaskModal(i) {
  const listItem = document.getElementById(`add-task-subtask-wrapper${i}`);
  listItem.style.display = "none";
  const listElement = document.getElementById(`add-task-subtask${i}`);
  const subtaskText = listElement.innerHTML;
  const clickedSubtask = newSubtasks.find(
    (subtask) => subtask.text === subtaskText
  );
  const indexOfSubtask = newSubtasks.indexOf(clickedSubtask);
  newSubtasks.splice(indexOfSubtask, 1);
}

// END: Code for subtasks section in add task modal
