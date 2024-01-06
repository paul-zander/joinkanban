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
