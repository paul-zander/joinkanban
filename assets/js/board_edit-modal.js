/**
 * Edits a task, updates the edit modal content, and sets up related functionality.
 * @param {Object} task - The task to be edited.
 */
async function editTask(task) {
  currentTaskInEditModal = task;
  const formattedDate = formatDate(task.dueDate);
  const modal = document.querySelector(".modal");
  modal.innerHTML = await generateModalHTML(task, formattedDate);

  await renderSubtasksInEditModal(task);
  renderContactsInEditModal();
  markAssignedContactsInDropdown();
  renderContactBadges();
  setupSearchBarContacts();
  setupPriorityButtons(task);
  setupSubtasksSection();
  setupAddSubtaskButton();
}

/**
 * Renders contact badges for assignees in the edit modal.
 * @description This function updates the contact badges displayed in the edit modal, representing the assignees of the current task.
 */
async function renderContactBadges() {
  const contactBadgesWrapper = document.querySelector(
    ".contact-badges-container"
  );
  contactBadgesWrapper.innerHTML = "";

  for (let i = 0; i < currentTaskInEditModal.assignees.length; i++) {
    const name = currentTaskInEditModal.assignees[i].name;
    const initials = generateInitials(name);
    const color = currentTaskInEditModal.assignees[i].color;

    contactBadgesWrapper.innerHTML += /*html*/ `
            <div class="assignee" style="background: ${color}">${initials}</div>
        `;
  }
}

/**
 * Toggles the visibility of elements in the edit modal related to contact selection.
 * @description This function toggles the visibility of several elements, such as the assigned badges, the "add contact" button, and the arrow button, in the edit modal for contact selection.
 */
function toggleContactsInEditModal() {
  const assigneesBadgesWrapper = document.querySelector(
    ".edit-assigned-to-badges"
  );
  const imgElement = document.querySelector(".show-contacts-btn");
  const addContactBtn = document.querySelector(".add-contact-btn");
  const contactBadges = document.querySelector(".contact-badges-container");

  // Toggles contacts wrapper to select from
  assigneesBadgesWrapper.classList.toggle("d-none");

  // Toggles button to add new contacts to the task
  addContactBtn.classList.toggle("d-none");

  // Toggles the arrow button
  if (assigneesBadgesWrapper.classList.contains("d-none")) {
    imgElement.src = "./assets/img/arrow_drop_down.svg";
  } else {
    imgElement.src = "./assets/img/arrow_drop_up.svg";
  }

  // Toggles profile badges under contacts wrapper to select from
  contactBadges.classList.toggle("d-none");

  renderContactBadges();
}

/**
 * Finds a selected contact by its ID.
 * @param {number} selectedContactId - The ID of the selected contact.
 * @returns {Object} - The found contact or undefined if no contact with the specified ID is found.
 */
function findSelectedContact(selectedContactId) {
  return localContacts.find((contact) => contact.id === selectedContactId);
}

/**
 * Removes a contact from the list of assignees in the current task being edited.
 * @param {Object} selectedContact - The contact to be removed.
 */
function removeContactFromAssignees(selectedContact) {
  const indexOfContact = currentTaskInEditModal.assignees.findIndex(
    (contact) => contact.id === selectedContact.id
  );
  currentTaskInEditModal.assignees.splice(indexOfContact, 1);
}

/**
 * Adds a contact to the list of assignees in the current task being edited.
 * @param {Object} selectedContact - The contact to be added.
 */
function addContactToAssignees(selectedContact) {
  currentTaskInEditModal.assignees.push(selectedContact);
}

/**
 * Checks if a contact is assigned in the assignees of the current task being edited.
 * @param {Object} selectedContact - The contact to be checked.
 * @returns {boolean} - true if the contact is assigned in the assignees, otherwise false.
 */
function isContactAssigned(selectedContact) {
  return currentTaskInEditModal.assignees.some(
    (contact) => contact.id === selectedContact.id
  );
}

/**
 * Marks a contact in a dropdown, updates the checkbox, and the assignees.
 * @param {number} i - The index number of the selected contact.
 */
function markContactsInDropdown(i) {
  const contactWrapper = document.getElementById(`${i}`);
  toggleContactSelection(contactWrapper);

  const checkboxOfContact = document.getElementById(
    `contacts-row-checkbox${i}`
  );
  const isSelected = contactWrapper.classList.contains(
    "contacts-wrapper-selected"
  );
  updateContactCheckbox(checkboxOfContact, isSelected);

  const selectedContact = findSelectedContact(i);

  if (isSelected) {
    // If the contact is already in the assignees, don't add it again
    if (!isContactAssigned(selectedContact)) {
      addContactToAssignees(selectedContact);
    }
  } else {
    removeContactFromAssignees(selectedContact);
  }

  renderContactBadges();
}

/**
 * Marks assigned contacts in the dropdown and updates associated checkboxes.
 * @description This function highlights and updates checkboxes for assigned contacts in the dropdown based on the current task's assignees.
 */
async function markAssignedContactsInDropdown() {
  for (let i = 0; i < currentTaskInEditModal.assignees.length; i++) {
    const assigneeId = currentTaskInEditModal.assignees[i].id;
    const contactWrapper = document.getElementById(`${assigneeId}`);
    const checkboxOfContact = document.getElementById(
      `contacts-row-checkbox${assigneeId}`
    );
    contactWrapper.classList.add("contacts-wrapper-selected");
    if (contactWrapper.classList.contains("contacts-wrapper-selected")) {
      checkboxOfContact.src = "./assets/img/checkbox-checked-white.svg";
    } else {
      checkboxOfContact.src = "./assets/img/checkbox.svg";
    }
  }
}

/**
 * Toggles the visibility of the contact wrapper and updates the arrow button image.
 * @param {HTMLElement} contactWrapper - The contact wrapper element to be toggled.
 * @param {HTMLImageElement} imgElement - The arrow button image element.
 */
function toggleContactWrapperVisibility(contactWrapper, imgElement) {
  contactWrapper.classList.toggle("d-none");
  if (contactWrapper.classList.contains("d-none")) {
    imgElement.src = "./assets/img/arrow_drop_down.svg";
  } else {
    imgElement.src = "./assets/img/arrow_drop_up.svg";
  }
}

/**
 * Filters contact rows based on a search term.
 * @param {NodeListOf<HTMLElement>} contactRows - List of contact row elements.
 * @param {string} term - The search term to filter contacts.
 */
function filterContactRows(contactRows, term) {
  contactRows.forEach((contactRow) => {
    const contactName = contactRow
      .querySelector(".assignee-name")
      .textContent.toLowerCase();

    if (contactName.indexOf(term) !== -1) {
      contactRow.closest(".contacts-wrapper").style.display = "flex";
    } else {
      contactRow.closest(".contacts-wrapper").style.display = "none";
    }
  });
}

/**
 * Sets up the search bar for contacts in the edit modal.
 */
function setupSearchBarContacts() {
  const searchBarContacts = document.querySelector(".edit-assigned-to-input");
  const contactRows = document.querySelectorAll(".contacts-row");
  const contactWrapper = document.querySelector(".edit-assigned-to-badges");
  const imgElement = document.querySelector(".show-contacts-btn");

  searchBarContacts.addEventListener("click", () => {
    toggleContactWrapperVisibility(contactWrapper, imgElement);
  });

  searchBarContacts.addEventListener("keyup", (e) => {
    const term = e.target.value.toLowerCase();
    if (contactWrapper.classList.contains("d-none")) {
      contactWrapper.classList.remove("d-none");
    }

    filterContactRows(contactRows, term);
  });
}

// START: Code for subtasks in edit modal

/**
 * Edits a subtask, displaying an edit interface for the clicked subtask and setting up confirm and delete buttons.
 * @param {number} i - The index of the subtask to edit.
 */
function editSubtask(i) {
  const listElement = document.getElementById(`subtask${i}`);
  const subtaskText = listElement.innerHTML;
  const clickedSubtask = currentTaskInEditModal.subtasks.find(
    (subtask) => subtask.text === subtaskText
  );
  const subtaskWrapper = document.querySelector(".existing-subtasks");
  const editSubtaskInputWrapper = document.querySelector(".edit-task-input");
  const editSubtaskInputfield = document.querySelector(".edit-task-inputfield");
  const editTaskConfirmBtn = document.querySelector(
    ".edit-task-confirm-edit-icon"
  );
  const editTaskDeleteBtn = document.querySelector(".edit-task-delete-icon");

  displayEditSubtaskInterface(
    clickedSubtask,
    subtaskWrapper,
    editSubtaskInputWrapper,
    editSubtaskInputfield
  );

  setupEditTaskConfirmButton(
    editTaskConfirmBtn,
    clickedSubtask,
    editSubtaskInputfield,
    subtaskWrapper,
    editSubtaskInputWrapper
  );

  setupEditTaskDeleteButton(
    editTaskDeleteBtn,
    clickedSubtask,
    editSubtaskInputWrapper,
    subtaskWrapper
  );
}

/**
 * Displays the edit subtask interface by hiding the subtask display and showing the input field with the subtask text.
 * @param {Object} clickedSubtask - The clicked subtask to edit.
 * @param {HTMLElement} subtaskWrapper - The subtask display wrapper.
 * @param {HTMLElement} editSubtaskInputWrapper - The input field wrapper.
 * @param {HTMLInputElement} editSubtaskInputfield - The input field for editing the subtask text.
 */
function displayEditSubtaskInterface(
  clickedSubtask,
  subtaskWrapper,
  editSubtaskInputWrapper,
  editSubtaskInputfield
) {
  subtaskWrapper.style.display = "none";
  editSubtaskInputWrapper.style.display = "flex";
  editSubtaskInputfield.value = clickedSubtask.text;
}

/**
 * Sets up the confirmation button for editing a subtask.
 * @param {HTMLElement} editTaskConfirmBtn - The confirmation button for editing the subtask.
 * @param {Object} clickedSubtask - The clicked subtask to edit.
 * @param {HTMLInputElement} editSubtaskInputfield - The input field for editing the subtask text.
 * @param {HTMLElement} subtaskWrapper - The subtask display wrapper.
 * @param {HTMLElement} editSubtaskInputWrapper - The input field wrapper.
 */
function setupEditTaskConfirmButton(
  editTaskConfirmBtn,
  clickedSubtask,
  editSubtaskInputfield,
  subtaskWrapper,
  editSubtaskInputWrapper
) {
  function onEditTaskConfirmClick() {
    clickedSubtask.text = editSubtaskInputfield.value;
    editSubtaskInputWrapper.style.display = "none";
    subtaskWrapper.style.display = "block";
    renderSubtasksInEditModal(currentTaskInEditModal);
    editTaskConfirmBtn.removeEventListener("click", onEditTaskConfirmClick);
  }
  editTaskConfirmBtn.addEventListener("click", onEditTaskConfirmClick);
}

/**
 * Sets up the delete button for editing a subtask.
 * @param {HTMLElement} editTaskDeleteBtn - The delete button for editing the subtask.
 * @param {Object} clickedSubtask - The clicked subtask to edit.
 * @param {HTMLElement} editSubtaskInputWrapper - The input field wrapper.
 * @param {HTMLElement} subtaskWrapper - The subtask display wrapper.
 */
function setupEditTaskDeleteButton(
  editTaskDeleteBtn,
  clickedSubtask,
  editSubtaskInputWrapper,
  subtaskWrapper
) {
  function onEditTaskDeleteClick() {
    editSubtaskInputWrapper.style.display = "none";
    subtaskWrapper.style.display = "block";
    const indexOfSubtask =
      currentTaskInEditModal.subtasks.indexOf(clickedSubtask);
    currentTaskInEditModal.subtasks.splice(indexOfSubtask, 1);
    renderSubtasksInEditModal(currentTaskInEditModal);
    editTaskDeleteBtn.removeEventListener("click", onEditTaskDeleteClick);
  }
  editTaskDeleteBtn.addEventListener("click", onEditTaskDeleteClick);
}

/**
 * Deletes a subtask and hides it from display in the edit modal.
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
  const listItem = document.getElementById(`subtask-wrapper${i}`);
  listItem.style.display = "none";
  const listElement = document.getElementById(`subtask${i}`);
  const subtaskText = listElement.innerHTML;
  const clickedSubtask = currentTaskInEditModal.subtasks.find(
    (subtask) => subtask.text === subtaskText
  );
  const indexOfSubtask =
    currentTaskInEditModal.subtasks.indexOf(clickedSubtask);
  currentTaskInEditModal.subtasks.splice(indexOfSubtask, 1);
}

/**
 * Handles changes in the input value and adjusts the display of related elements.
 * @param {HTMLInputElement} editSubtaskInput - The input element to monitor for changes.
 * @param {HTMLElement} clearButtonWrapper - The wrapper for the clear button.
 * @param {HTMLElement} divider - The divider element.
 * @param {HTMLElement} addSubtaskIcon - The icon for adding subtasks.
 * @param {HTMLElement} startInputIcon - The icon indicating the start of input.
 */
function handleInputValueChange(
  editSubtaskInput,
  clearButtonWrapper,
  divider,
  addSubtaskIcon,
  startInputIcon
) {
  editSubtaskInput.addEventListener("input", () => {
    if (editSubtaskInput.value === "") {
      clearButtonWrapper.style.display = "none";
      divider.style.display = "none";
      addSubtaskIcon.style.display = "none";
      startInputIcon.style.display = "flex";
    } else {
      clearButtonWrapper.style.display = "flex";
      divider.style.display = "flex";
      addSubtaskIcon.style.display = "flex";
      startInputIcon.style.display = "none";
    }
  });
}

/**
 * Sets up the plus icon for subtasks and focuses on the input when clicked.
 * @param {HTMLInputElement} editSubtaskInput - The input element to focus on when the plus icon is clicked.
 */
function setupSubtasksPlusIcon(editSubtaskInput) {
  const editSubtasksPlusIcon = document.querySelector(
    ".edit-subtasks-plus-icon"
  );
  editSubtasksPlusIcon.addEventListener("click", () => {
    editSubtaskInput.focus();
  });
}

/**
 * Sets up the clear button to reset the input value.
 * @param {HTMLElement} clearButtonWrapper - The wrapper for the clear button.
 * @param {HTMLInputElement} editSubtaskInput - The input element to clear.
 * @param {HTMLElement} divider - The divider element.
 */
function setupClearButton(clearButtonWrapper, editSubtaskInput, divider) {
  clearButtonWrapper.addEventListener("click", () => {
    editSubtaskInput.value = "";
    clearButtonWrapper.style.display = "none";
    divider.style.display = "none";
  });
}

/**
 * Sets up the subtasks section for editing, including input, clear button, and plus icon.
 */
function setupSubtasksSection() {
  const subtasksWrapper = document.querySelector(".edit-subtasks");
  const inputDiv = document.querySelector(".edit-subtasks-input-wrapper");
  const editSubtaskInput = document.querySelector(".edit-subtasks-input");
  const clearButtonWrapper = document.querySelector(".edit-clear-wrapper");
  const divider = document.querySelector(".edit-subtasks-icons-divider");
  const addSubtaskIcon = document.querySelector(".edit-subtasks-icon-add");
  const startInputIcon = document.querySelector(".edit-subtasks-plus-icon");

  inputDiv.addEventListener("click", () => editSubtaskInput.focus());

  handleInputValueChange(
    editSubtaskInput,
    clearButtonWrapper,
    divider,
    addSubtaskIcon,
    startInputIcon
  );
  setupClearButton(clearButtonWrapper, editSubtaskInput, divider);
  setupSubtasksPlusIcon(
    editSubtaskInput,
    clearButtonWrapper,
    editSubtaskInput,
    divider
  );
}

/**
 * Sets up the "Add Subtask" button in the subtasks section.
 */
function setupAddSubtaskButton() {
  const editSubtaskInput = document.querySelector(".edit-subtasks-input");
  const addSubtaskIcon = document.querySelector(".edit-subtasks-icon-add");
  const divider = document.querySelector(".edit-subtasks-icons-divider");
  const startInputIcon = document.querySelector(".edit-subtasks-plus-icon");
  const clearButtonWrapper = document.querySelector(".edit-clear-wrapper");
  addSubtaskIcon.addEventListener("click", () => {
    if (editSubtaskInput.checkValidity()) {
      currentTaskInEditModal.subtasks.push({
        text: editSubtaskInput.value,
        status: "todo",
      });
      renderSubtasksInEditModal(currentTaskInEditModal);
      changeInputWrapperButtons(
        editSubtaskInput,
        addSubtaskIcon,
        divider,
        startInputIcon,
        clearButtonWrapper
      );
    } else {
      console.log("Please fill in the subtask field.");
    }
  });
}

function changeInputWrapperButtons(
  editSubtaskInput,
  addSubtaskIcon,
  divider,
  startInputIcon,
  clearButtonWrapper
) {
  editSubtaskInput.value = "";
  clearButtonWrapper.style.display = "none";
  divider.style.display = "none";
  addSubtaskIcon.style.display = "none";
  startInputIcon.style.display = "flex";
}

// END: Code for subtasks in edit modal

/**
 * Finds and updates the edited task in the local tasks array.
 * @param {Object} editedTask - The edited task object to update in the local tasks array.
 */
function findAndUpdateEditedTask(editedTask) {
  const currentTask = localTasks.find(
    (task) => task.id === currentTaskInEditModal.id
  );
  const index = localTasks.indexOf(currentTask);
  localTasks.splice(index, 1, editedTask);
}

/**
 * Saves the edited task by creating and updating it in the local tasks array and then closes the modal.
 */
function saveEditedTask() {
  const editedTitle = document.querySelector(".edit-modal-headline");
  const editedDescription = document.querySelector(
    ".edit-description-textarea"
  );
  const editedDueDate = document.querySelector(".edit-due-date");
  const editedTask = createEditedTask(
    editedTitle,
    editedDescription,
    editedDueDate
  );
  findAndUpdateEditedTask(editedTask);
  showToast("✅ Task updated");
  closeModal();
}

/**
 * Toggles the visibility of work stage options in the "Edit Task" modal.
 */
function toggleWorkStages() {
  const workStageOptions = document.querySelector(".change-work-stage-options");
  workStageOptions.classList.toggle("d-block");
  const categoryArrow = document.querySelector(".change-work-stage-btn");
  if (workStageOptions.classList.contains("d-block")) {
    categoryArrow.src = "./assets/img/arrow_drop_up.svg";
  } else {
    categoryArrow.src = "./assets/img/arrow_drop_down.svg";
  }
}

/**
 * Sets the work stage (category) of the current task being edited in the "Edit Task" modal.
 * @param {string} choosenStage - The selected work stage (category) to set for the task.
 */
function setWorkStage(choosenStage) {
  const selectedStage = document.querySelector(".select-category");
  selectedStage.innerHTML = `${convertToTitleCase(choosenStage)}`;
  currentTaskInEditModal.category = choosenStage;
  toggleWorkStages();
}

function convertToTitleCase(choosenStage) {
  let words = choosenStage.split("-");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  let result = words.join(" ");

  return result;
}
