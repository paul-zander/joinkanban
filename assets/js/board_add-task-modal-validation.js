/**
 * Validates the input form.
 */
function validateForm() {
  let title = document.querySelector(".add-task-modal-headline");
  let description = document.querySelector(".add-task-description-textarea");
  let dueDate = document.querySelector(".add-task-date-input");

  checkValidation(title, description, dueDate);
}

/**
 * Checks the validation of individual fields and displays error messages if necessary.
 * @param {HTMLInputElement} title - The title input field.
 * @param {HTMLTextAreaElement} description - The description text field.
 * @param {HTMLInputElement} dueDate - The due date input field.
 * @returns {boolean} - Returns true if validation is successful, otherwise false.
 */
function checkValidation(title, description, dueDate) {
  if (
    validateTitle(title) &&
    validateDescription(description) &&
    validateDueDate(dueDate) &&
    validatePriority() &&
    validateAssignees() &&
    validateCategory()
  ) {
    createNewTask();
    return true;
  }

  return false;
}

/**
 * Validates the title field.
 * @param {HTMLInputElement} title - The title input field.
 * @returns {boolean} - Returns true if validation is successful, otherwise false.
 */
function validateTitle(title) {
  if (title.value.trim() === "") {
    showRequiredMessageTitle();
    return false;
  }
  return true;
}

/**
 * Validates the description field.
 * @param {HTMLTextAreaElement} description - The description text field.
 * @returns {boolean} - Returns true if validation is successful, otherwise false.
 */
function validateDescription(description) {
  if (description.value.trim() === "") {
    showRequiredMessageDescription();
    return false;
  }
  return true;
}

/**
 * Validates the due date field.
 * @param {HTMLInputElement} dueDate - The due date input field.
 * @returns {boolean} - Returns true if validation is successful, otherwise false.
 */
function validateDueDate(dueDate) {
  if (dueDate.value.trim() === "") {
    showRequiredMessageDueDate();
    return false;
  }
  return true;
}

/**
 * Validates the priority selection.
 * @returns {boolean} - Returns true if validation is successful, otherwise false.
 */
function validatePriority() {
  const priorityButtons = document.querySelectorAll(".add-task-priority-btn");
  let priorityBtnSelected = false;

  priorityButtons.forEach((btn) => {
    if (
      btn.classList.contains("urgently-selected") ||
      btn.classList.contains("medium-selected") ||
      btn.classList.contains("low-selected")
    ) {
      priorityBtnSelected = true;
    }
  });

  if (!priorityBtnSelected) {
    showRequiredMessagePriority();
    return false;
  }

  return true;
}

/**
 * Validates the assignment selection.
 * @returns {boolean} - Returns true if validation is successful, otherwise false.
 */
function validateAssignees() {
  if (contacts.length === 0) {
    showRequiredMessageAssignees();
    return false;
  }
  return true;
}

/**
 * Validates the category selection.
 * @returns {boolean} - Returns true if validation is successful, otherwise false.
 */
// function validateCategory() {
//   if (category !== ("User Story" || "Technical Task")) {
//     showRequiredMessageCategory();
//     return false;
//   }
//   return true;
// }

function validateCategory() {
  if (category !== "User Story" && category !== "Technical Task") {
    showRequiredMessageCategory();
    return false;
  }
  return true;
}

/**
 * Displays a required message for the title field.
 */
function showRequiredMessageTitle() {
  const titleWrapper = document.querySelector(
    ".add-task-modal-headline-wrapper"
  );
  const titleRequiredMessage = document.querySelector(".title-message");
  titleWrapper.classList.add("required-border-bottom-color");
  titleRequiredMessage.classList.remove("d-none");
}

/**
 * Displays a required message for the description field.
 */
function showRequiredMessageDescription() {
  const descriptionWrapper = document.querySelector(
    ".add-task-description-textarea"
  );
  const descriptionRequiredMessage = document.querySelector(
    ".description-message"
  );
  descriptionWrapper.classList.add("required-border-description");
  descriptionRequiredMessage.classList.remove("d-none");
}

/**
 * Displays a required message for the due date field.
 */
function showRequiredMessageDueDate() {
  const dueDateWrapper = document.querySelector(".add-task-date-input");
  const dateRequiredMessage = document.querySelector(".date-message");
  dueDateWrapper.classList.add("required-border-bottom-color");
  dateRequiredMessage.classList.remove("d-none");
}

/**
 * Displays a required message for the priority selection.
 */
function showRequiredMessagePriority() {
  const priorityMessage = document.querySelector(".priority-message");
  priorityMessage.classList.remove("d-none");
}

/**
 * Displays a required message for the assignees selection.
 */
function showRequiredMessageAssignees() {
  const assigneeWrapper = document.querySelector(
    ".add-task-assigned-to-input-wrapper"
  );
  const assigneeRequiredMessage = document.querySelector(".assignee-message");
  assigneeWrapper.classList.add("required-border-bottom-color");
  assigneeRequiredMessage.classList.remove("d-none");
}

/**
 * Displays a required message for the category selection.
 */
function showRequiredMessageCategory() {
  const categoryWrapper = document.querySelector(".add-task-category-wrapper");
  const categoryRequiredMessage = document.querySelector(".category-message");
  categoryWrapper.classList.add("required-border-bottom-color");
  categoryRequiredMessage.classList.remove("d-none");
}

/**
 * Resets the visual markers for required fields in the form.
 */
function resetRequiredWrapper() {
  const titleWrapper = document.querySelector(
    ".add-task-modal-headline-wrapper"
  );
  const descriptionWrapper = document.querySelector(
    ".add-task-description-textarea"
  );
  const dueDateWrapper = document.querySelector(".add-task-date-input");
  const assigneeWrapper = document.querySelector(
    ".add-task-assigned-to-input-wrapper"
  );
  const categoryWrapper = document.querySelector(".add-task-category-wrapper");

  titleWrapper.classList.remove("required-border-bottom-color");
  descriptionWrapper.classList.remove("required-border-description");
  dueDateWrapper.classList.remove("required-border-bottom-color");
  assigneeWrapper.classList.remove("required-border-bottom-color");
  categoryWrapper.classList.remove("required-border-bottom-color");
}

/**
 * Resets the visible error messages in the form.
 */
function resetRequiredMessages() {
  const titleRequiredMessage = document.querySelector(".title-message");
  const descriptionRequiredMessage = document.querySelector(
    ".description-message"
  );
  const dateRequiredMessage = document.querySelector(".date-message");
  const priorityMessage = document.querySelector(".priority-message");
  const assigneeRequiredMessage = document.querySelector(".assignee-message");
  const categoryRequiredMessage = document.querySelector(".category-message");
  titleRequiredMessage.classList.add("d-none");
  descriptionRequiredMessage.classList.add("d-none");
  dateRequiredMessage.classList.add("d-none");
  priorityMessage.classList.add("d-none");
  assigneeRequiredMessage.classList.add("d-none");
  categoryRequiredMessage.classList.add("d-none");
}
