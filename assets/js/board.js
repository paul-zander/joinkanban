/**
 * Initializes the board by including HTML, setting header initials, and adding profile badge event listener.
 * @description This function initializes the board by performing tasks such as including HTML content, setting header initials, and adding an event listener to the profile badge in header.
 */
async function initBoard() {
  await includeHTML();
  await setHeaderInitials();
  await setProfileBadgeEventListener();
  await setActiveNavLink();
  localContacts = JSON.parse(await getItem("contacts"));
  renderCards();
}

let localTasks;
let currentTaskInEditModal;
let localContacts = [];

/**
 * Includes HTML content from external files to elements with the "w3-include-html" attribute.
 * @description This function loads HTML content from external files and includes it in elements with the "w3-include-html" attribute.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    const file = element.getAttribute("w3-include-html"); // "includes/header.html"
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
  toast.classList.add("open");

  setTimeout(() => {
    toast.classList.remove("open");
  }, 3000);
}

/**
 * Retrieves to-do items from the server and updates the "localTasks" array.
 * @description This function fetches to-do items from a server and updates the "localTasks" array with the retrieved data.
 */
async function getToDos() {
  let tasks = JSON.parse(await getItem("tasks"));
  localTasks = tasks;
}

/**
 * Retrieves contact data from the server and updates the "localContacts" array.
 * @description This function fetches contact data from a server and updates the "localContacts" array with the retrieved data.
 */
async function loadContacts() {
  // const keyToSearch = "contacts";
  // let contacts = await getItem(keyToSearch);
  // localContacts = JSON.parse(contacts);
  localContacts = JSON.parse(await getItem("contacts"));
}

/**
 * Renders tasks for a specific category.
 * @param {string} category - The category for which tasks should be rendered.
 */
async function renderTasksByCategory(category) {
  const boardColumn = document.querySelector(`.${category}`);
  const filteredTasks = filterTasksByCategory(category);
  renderTasks(boardColumn, filteredTasks, category);
}

/**
 * Filters tasks by category.
 * @param {string} category - The category by which tasks should be filtered.
 * @returns {Array} - An array of tasks that match the specified category.
 */
function filterTasksByCategory(category) {
  return localTasks.filter((task) => task.category === category);
}

/**
 * Renders tasks for a specific category within a given board column.
 * @param {HTMLElement} boardColumn - The HTML element representing the board column where tasks should be rendered.
 * @param {Array} tasks - An array of tasks to render.
 * @param {string} category - The category of tasks being rendered.
 */
function renderTasks(boardColumn, tasks, category) {
  boardColumn.innerHTML = "";
  boardColumn.innerHTML += createNoTasksDummyElement(category);

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const cardHtml = createTaskCardHtml(task, i, category);
    boardColumn.innerHTML += cardHtml;
    setColorOfCategory(task.label, `${category}-card-label-${i}`);
    renderAssigneesInCard(
      task.assignees,
      `${category}-assignees-${i}`,
      `additional-assignees-${task.id}`
    );
    checkSubtasks(task.subtasks.length, `${category}-progress-${i}`);
  }
}

/**
 * Checks if the array of tasks for a specific category is empty and updates the visibility of a corresponding message.
 * @param {string} category - The category for which the task array should be checked.
 */
function checkIfArrEmpty(category) {
  const tasksByCategory = localTasks.filter(
    (task) => task.category === category
  );
  const noTasksDummy = document.querySelector(`.no-tasks-${category}`);
  if (tasksByCategory.length === 0) {
    noTasksDummy.classList.remove("d-none");
  } else {
    noTasksDummy.classList.add("d-none");
  }
}

/**
 * Toggles the visibility of "no tasks" messages for different task categories.
 * @description This function toggles the visibility of "no tasks" messages for various task categories (e.g., 'to-do', 'in-progress', 'await-feedback', 'done') by calling `checkIfArrEmpty` for each category.
 */
async function toggleNoTasksCard() {
  checkIfArrEmpty("to-do");
  checkIfArrEmpty("in-progress");
  checkIfArrEmpty("await-feedback");
  checkIfArrEmpty("done");
}

const CardInProgress = document.querySelector(".in-progress");
const btnCloseModal = document.querySelector(".close-modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const cardDummy = document.querySelector(".card-dummy");

/**
 * Renders to-do cards and associated data, such as contacts and task categories.
 * @description This function is responsible for rendering to-do cards along with their associated data, such as contacts and task categories. It also adds event listeners for drag-and-drop functionality.
 */
async function renderCards() {
  await getToDos();
  await renderTasksByCategory("to-do");
  await renderTasksByCategory("in-progress");
  await renderTasksByCategory("await-feedback");
  await renderTasksByCategory("done");
  await toggleNoTasksCard();
  addEventListenersDragStart();
  // await loadContacts();
}

/**
 * Saves edits made to the to-do items and triggers a card rendering update.
 * @description This function saves edits made to the to-do items by updating the local storage data. It then triggers the rendering of the updated cards.
 */
async function saveEdits() {
  await setItem("tasks", JSON.stringify(localTasks));
  renderCards();
}

/**
 * Assigns new IDs to tasks within the given array based on their positions.
 * @param {Object[]} taskArr - An array of task objects.
 * @returns {Promise<void>} A Promise that resolves when the task IDs have been updated.
 */
async function setNewIdsForTasks(taskArr) {
  taskArr.forEach((task, index) => {
    task.id = index + 1;
  });
}

/**
 * Sets the color of a category label for a to-do card.
 * @param {string} category - The category of the to-do item.
 * @param {string} toDoLabel - The ID of the label element to be colored.
 */
function setColorOfCategory(category, toDoLabel) {
  cardLabel = document.getElementById(toDoLabel);
  cardLabel.classList.remove("user-story", "technical-task");
  if (category === "User Story") {
    cardLabel.classList.add("user-story");
  } else if (category === "Technical Task") {
    cardLabel.classList.add("technical-task");
  }
}

/**
 * Checks the number of subtasks and hides the associated element if there are none.
 * @param {number} subTasksTotal - The total number of subtasks.
 * @param {string} id - The ID of the element to be checked for hiding.
 */
function checkSubtasks(subTasksTotal, id) {
  subTasksTotal === 0 && document.getElementById(id).classList.add("d-none");
}

/**
 * Gets the image representing the priority of a to-do item.
 * @param {string} priority - The priority level of the to-do item.
 * @returns {string} - The image identifier representing the priority.
 */
function getPriorityImg(priority) {
  if (priority === "Urgent") {
    return "highprio";
  } else if (priority === "Medium") {
    return "mediumprio";
  } else if (priority === "Low") {
    return "lowprio";
  }
}

/**
 * Sets the color of a category label in a modal for a to-do item.
 * @param {string} category - The category of the to-do item.
 */
function setColorOfCategoryInModal(category) {
  modalLabel = document.querySelector(".modal-label");
  modalLabel.classList.remove("user-story", "technical-task");
  if (category === "User Story") {
    modalLabel.classList.add("user-story");
  } else if (category === "Technical Task") {
    modalLabel.classList.add("technical-task");
  }
}

/**
 * Adds an event listener to filter and display task cards based on a search query.
 * @description This event listener is triggered when the DOM content is loaded. It allows users to filter and display task cards based on a search query entered in a search bar.
 */
document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("search-query");
  const taskCards = document.getElementsByClassName("card-dummy");
  if (searchBar) {
    searchBar.addEventListener("keyup", (e) => {
      const term = e.target.value.toLowerCase();

      Array.from(taskCards).forEach((card) => {
        const title = card
          .querySelector(".card-title")
          .textContent.toLowerCase();
        const description = card
          .querySelector(".card-description")
          .textContent.toLowerCase();

        if (title.indexOf(term) !== -1 || description.indexOf(term) !== -1) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
});

/**
 * Toggles the selection of a contact wrapper and updates the associated checkbox image.
 * @param {HTMLElement} contactWrapper - The element to be selected or deselected.
 */
function toggleContactSelection(contactWrapper) {
  contactWrapper.classList.toggle("contacts-wrapper-selected");
}

/**
 * Updates the image of the contact checkbox based on the selected state.
 * @param {HTMLElement} checkboxOfContact - The checkbox element whose image should be updated.
 * @param {boolean} isSelected - Indicates whether the contact is selected (true) or not (false).
 */
function updateContactCheckbox(checkboxOfContact, isSelected) {
  if (isSelected) {
    checkboxOfContact.src = "./assets/img/checkbox-checked-white.svg";
  } else {
    checkboxOfContact.src = "./assets/img/checkbox.svg";
  }
}

/**
 * Formats a date string to 'dd/mm/yyyy' format.
 * @param {string} dateString - The date string to be formatted (in the 'yyyy-mm-dd' format).
 * @returns {string} - The formatted date in 'dd/mm/yyyy' format.
 */
function formatDate(dateString) {
  const parts = dateString.split("-"); // Teilen Sie das Datum in Teile auf
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}/${month}/${year}`;
}

/**
 * Sets up the priority buttons, handles click events, and displays the current priority.
 * @param {Object} task - The task for which priority buttons are being set up.
 */
function setupPriorityButtons(task) {
  const btnUrgent = document.querySelector(".edit-urgent");
  const btnMedium = document.querySelector(".edit-medium");
  const btnLow = document.querySelector(".edit-low");
  const urgentImg = document.querySelector(".edit-urgent img");
  const mediumImg = document.querySelector(".edit-medium img");
  const lowImg = document.querySelector(".edit-low img");

  btnUrgent.addEventListener("click", () =>
    changeColorOfPriorityBtn("urgent", task)
  );
  btnMedium.addEventListener("click", () =>
    changeColorOfPriorityBtn("medium", task)
  );
  btnLow.addEventListener("click", () => changeColorOfPriorityBtn("low", task));

  showCurrentPriority(
    task.priority,
    btnUrgent,
    btnMedium,
    btnLow,
    urgentImg,
    mediumImg,
    lowImg
  );
}

/**
 * Creates an edited task object with the provided values and copies other properties from the current task in edit modal.
 * @param {HTMLInputElement} editedTitle - The input element for the edited task title.
 * @param {HTMLInputElement} editedDescription - The input element for the edited task description.
 * @param {HTMLInputElement} editedDueDate - The input element for the edited task due date.
 * @returns {Object} - The edited task object with updated values.
 */
function createEditedTask(editedTitle, editedDescription, editedDueDate) {
  return {
    title: editedTitle.value,
    description: editedDescription.value,
    dueDate: editedDueDate.value,
    label: currentTaskInEditModal.label,
    priority: currentTaskInEditModal.priority,
    subtasks: currentTaskInEditModal.subtasks,
    assignees: currentTaskInEditModal.assignees,
    id: currentTaskInEditModal.id,
    category: currentTaskInEditModal.category,
  };
}

/**
 * Displays the current priority of a task by adding a 'selected' class and updating the priority icon.
 * @param {string} currentPriority - The current priority level of the task ('urgent', 'medium', or 'low').
 */

function showCurrentPriority(
  currentPriority,
  btnUrgent,
  btnMedium,
  btnLow,
  urgentImg,
  mediumImg,
  lowImg
) {
  if (currentPriority === "Urgent") {
    btnUrgent.classList.add("urgently-selected");
    urgentImg.src = "./assets/img/urgent-white.svg";
  } else if (currentPriority === "Medium") {
    btnMedium.classList.add("medium-selected");
    mediumImg.src = "./assets/img/medium-white.svg";
  } else if (currentPriority === "Low") {
    btnLow.classList.add("low-selected");
    lowImg.src = "./assets/img/low-white.svg";
  }
}

/**
 * This function changes the priority of the task we are currently editing
 *
 * @param {string} priority of the current task we are looking at edit modal
 * @param {*} task of the current task we are looking at edit modal
 */
function changeColorOfPriorityBtn(priority, task) {
  const btnUrgent = document.querySelector(".edit-urgent");
  const btnMedium = document.querySelector(".edit-medium");
  const btnLow = document.querySelector(".edit-low");
  const urgentImg = document.querySelector(".edit-urgent img");
  const mediumImg = document.querySelector(".edit-medium img");
  const lowImg = document.querySelector(".edit-low img");
  resetBackgroundColor(btnUrgent, btnMedium, btnLow);
  resetButtons(urgentImg, mediumImg, lowImg);
  setPriority(
    priority,
    task,
    btnUrgent,
    btnMedium,
    btnLow,
    urgentImg,
    mediumImg,
    lowImg
  );
}

/**
 * Add the appropriate class depending on the priority
 *
 * @param {String} priority
 * @param {JSON} task
 * @param {HTML Element} btnUrgent
 * @param {HTML Element} btnMedium
 * @param {HTML Element} btnLow
 * @param {HTML Element} urgentImg
 * @param {HTML Element} mediumImg
 * @param {HTML Element} lowImg
 */
function setPriority(
  priority,
  task,
  btnUrgent,
  btnMedium,
  btnLow,
  urgentImg,
  mediumImg,
  lowImg
) {
  if (priority === "urgent") {
    btnUrgent.classList.add("urgently-selected");
    urgentImg.src = "./assets/img/urgent-white.svg";
    task.priority = "Urgent";
  } else if (priority === "medium") {
    btnMedium.classList.add("medium-selected");
    mediumImg.src = "./assets/img/medium-white.svg";
    task.priority = "Medium";
  } else if (priority === "low") {
    btnLow.classList.add("low-selected");
    lowImg.src = "./assets/img/low-white.svg";
    task.priority = "Low";
  }
}

/**
 * Reset background colors and text colors for all buttons
 *
 * @param {HTML Element} btnUrgent
 * @param {HTML Element} btnMedium
 * @param {HTML Element} btnLow
 */
function resetBackgroundColor(btnUrgent, btnMedium, btnLow) {
  btnUrgent.classList.remove("urgently-selected");
  btnMedium.classList.remove("medium-selected");
  btnLow.classList.remove("low-selected");
}

/**
 * Resets the priority buttons to their default images.
 * @param {HTMLElement} urgentImg - The image element for the 'Urgent' priority button.
 * @param {HTMLElement} mediumImg - The image element for the 'Medium' priority button.
 * @param {HTMLElement} lowImg - The image element for the 'Low' priority button.
 */
function resetButtons(urgentImg, mediumImg, lowImg) {
  urgentImg.src = "./assets/img/highprio.svg";
  mediumImg.src = "./assets/img/mediumprio.svg";
  lowImg.src = "./assets/img/lowprio.svg";
}

/**
 * Renders the list of assignees in the assignee container.
 * @param {Array} assignees - An array of assignees to be rendered.
 */
function renderAssignees(assignees) {
  const assigneeContainer = document.querySelector(".assignee-container");
  const assigneesArray = assignees;
  for (let i = 0; i < assigneesArray.length; i++) {
    const name = assigneesArray[i].name;
    const initials = generateInitials(name);
    const color = assigneesArray[i].color;
    assigneeContainer.innerHTML += /*html*/ `
        <div class="assignee-row">
            <div class="assignee" style="background: ${color}">
                <div class="assignee-initals">${initials}</div>
            </div>
            <div class="assignee-name">${name}</div>
        </div>
    `;
  }
}

/**
 * Function to create initials of assignees
 */
function generateInitials(name) {
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part[0]).join("");
  initialsUppercase = initials.toUpperCase();
  return initialsUppercase;
}

/**
 * Clears the content of the subtasks container.
 * @param {HTMLElement} subtasksContainer - The container where subtasks are displayed.
 */
function clearSubtasksContainer(subtasksContainer) {
  subtasksContainer.innerHTML = "";
}

/**
 * Displays a message indicating that no subtasks are added in the subtasks container.
 * @param {HTMLElement} subtasksContainer - The container where subtasks are displayed.
 */
function displayNoSubtasksMessage(subtasksContainer) {
  subtasksContainer.innerHTML = "No subtasks added.";
}

/**
 * Renders a subtask in the subtasks container.
 * @param {HTMLElement} subtasksContainer - The container where subtasks are displayed.
 * @param {string} status - The status of the subtask.
 * @param {string} taskText - The text of the subtask.
 * @param {number} i - The index of the subtask.
 */
function renderSubtask(subtasksContainer, status, taskText, i) {
  subtasksContainer.innerHTML += /*html*/ `
        <div class="sub-task-row" id="subtask-${i}">
            <input type="checkbox" checked="checked" id="check${i}">
            <img class="checkbox" id="checkbox-${i}" src="./assets/img/${status}.svg">
            <label for="check${i}">${taskText}</label>
        </div>
    `;
}

/**
 * Sets up click listeners for subtask checkboxes to handle subtask completion.
 * @param {Array} subtasks - An array of subtasks to set up click listeners for.
 * @param {HTMLElement} subtasksContainer - The container where subtasks are displayed.
 */
function setupSubtaskClickListeners(subtasks, subtasksContainer) {
  for (let i = 0; i < subtasks.length; i++) {
    document
      .getElementById(`checkbox-${i}`)
      .addEventListener("click", () => checkmarkSubtask(i, subtasks[i]));
    // document.getElementById(`subtask-${i}`).addEventListener('click', () => checkmarkSubtask(i, subtasks[i]));
  }
}

/**
 * Renders the list of subtasks in the subtasks container.
 * @param {Array} subtasks - An array of subtasks to be rendered.
 */
function renderSubtasks(subtasks) {
  const subtasksContainer = document.querySelector(".insert-modal-subtasks");
  clearSubtasksContainer(subtasksContainer);

  if (subtasks.length === 0) {
    displayNoSubtasksMessage(subtasksContainer);
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      const status = checkStatusOfSubtasks(subtasks[i].status);
      const taskText = subtasks[i].text;
      renderSubtask(subtasksContainer, status, taskText, i);
    }
    setupSubtaskClickListeners(subtasks, subtasksContainer);
  }
}

/**
 * Toggles the completion status of a subtask and updates its status.
 * @param {number} i - The index of the subtask to be checked or unchecked.
 * @param {Object} subtask - The subtask object to be updated.
 */
function checkmarkSubtask(i, subtask) {
  const checkbox = document.getElementById(`checkbox-${i}`);
  if (checkbox.src.endsWith("checkbox.svg")) {
    checkbox.src = "./assets/img/checkbox-checked.svg";
    subtask.status = "done";
  } else {
    checkbox.src = "./assets/img/checkbox.svg";
    subtask.status = "todo";
  }
}

/**
 * This function checks the status (todo/done) of every subtask
 *
 * @param {string} status - This is the status of the subtask that can be either "todo" or "done"
 * @returns - Function returns the status (todo/done) of the subtask as string
 */
function checkStatusOfSubtasks(status) {
  if (status === "todo") {
    return "checkbox";
  } else if (status === "done") {
    return "checkbox-checked";
  }
}

/**
 * Opens the task editing modal with the provided task.
 * @param {Object} task - The task to be edited in the modal.
 */
function openModal(task) {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  renderModal(task);
}

/**
 * Closes the task editing modal and saves the edits before closing.
 */
async function closeModal() {
  deleteModal.classList.add("d-none");
  removeClickListener(deleteTaskBtn, "click", deleteTaskFunction);
  removeClickListener(cancelDeleteBtn, "click", cancelDeleteFunction);
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  resetRequiredWrapper();
  resetRequiredMessages();
  addTaskModal.classList.remove("is-active");
  await saveEdits();
  renderCards();
}

/**
 * Adds a click event listener to the overlay, which closes the modal when clicked.
 */
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }
});

/**
 * Adds a keydown event listener to the document, which closes the modal when the 'Escape' key is pressed.
 * The modal is closed only if it is currently open.
 * Note: The event listener checks for both modal and addTaskModal to determine if the modal is open.
 */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (
      !modal.classList.contains("hidden") ||
      addTaskModal.classList.contains("is-active")
    ) {
      closeModal();
    }
  }
});

/**
 * These functions are used to enable drag an drop of the tasks to different columns in board
 */

let selected;

const boardColumns = document.querySelectorAll(".board-column");
const cards = document.querySelectorAll(".card-dummy");

/**
 * Handles the dragstart event when a card is dragged. It sets the selected card and adds a CSS class.
 * @param {Event} e - The dragstart event.
 */
function handleDragStart(e) {
  selected = e.target;
  selected.classList.add("rotated");
}

/**
 * Handles the dragover event for a board column, allowing it to accept the dragged card.
 * @param {Event} e - The dragover event.
 */
function handleDragOver(e) {
  e.preventDefault();
  this.classList.add("board-column-dragover");
}

/**
 * Handles the dragleave event for a board column, removing the dragover visual indicator.
 */
function handleDragLeave() {
  this.classList.remove("board-column-dragover");
}

/**
 * Handles the drop event when a card is dropped into a board column. It updates the card's category, visual elements, and saves the changes.
 */
function handleDrop() {
  selected.classList.remove("rotated");
  this.classList.remove("board-column-dragover");
  this.appendChild(selected);
  const selectedTask = localTasks.find((task) => +task.id === +selected.id);
  selectedTask.category = this.id;
  selected = null;
  toggleNoTasksCard();
  saveEdits();
}

/**
 * Adds the dragstart event listener to all cards with the 'card-dummy' class.
 */
function addEventListenersDragStart() {
  const cards = document.querySelectorAll(".card-dummy");
  cards.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
  });
}

addEventListenersDragStart();

/**
 * Attaches event listeners for the drag-and-drop functionality to each board column.
 */
boardColumns.forEach((boardColumn) => {
  boardColumn.addEventListener("dragover", handleDragOver);
  boardColumn.addEventListener("dragleave", handleDragLeave);
  boardColumn.addEventListener("drop", handleDrop);
});

// Code for Add Task Modal
const addTaskBtn = document.querySelector(".search-add-task");
const addTaskModal = document.querySelector(".add-task-modal");
const closeAddTaskBtn = document.querySelector(".add-task-close-modal-wrapper");

/**
 * Toggles the visibility of the "Add Task" modal when the add task button is clicked.
 * @param {Event} e - The click event.
 */
addTaskBtn.addEventListener("click", () => {
  addTaskModal.classList.toggle("is-active");
  overlay.classList.toggle("hidden");
  columnCategory = "to-do";
});

/**
 * Closes the "Add Task" modal when the close button is clicked.
 * @param {Event} e - The click event.
 */
closeAddTaskBtn.addEventListener("click", () => {
  addTaskModal.classList.remove("is-active");
  overlay.classList.toggle("hidden");
});

/**
 * Toggles the body's overflow style property based on the visibility of the "Add Task" modal.
 */
if (addTaskModal.classList.contains("is-active")) {
  document.body.style.overflow = "hidden";
} else if (!addTaskModal.classList.contains("is-active")) {
  document.body.style.overflow = "auto";
}

const boardColumnAddTaskBtnTodo = document.querySelector(
  "#plus-btn-container-todo"
);
boardColumnAddTaskBtnTodo.addEventListener("click", () => {
  const selectedColumn = "to-do";
  if (window.innerWidth <= 1080) {
    // Auf der aktuellen Seite, füge selectedColumn als Parameter zur URL hinzu
    window.location.href = "add-task.html?column=" + selectedColumn;
  } else {
    // Auf der aktuellen Seite, zeige das Overlay und das Modal an
    columnCategory = "to-do";
    overlay.classList.toggle("hidden");
    addTaskModal.classList.toggle("is-active");
  }
});

const boardColumnAddTaskBtnInProgress = document.querySelector(
  "#plus-btn-container-in-progress"
);

boardColumnAddTaskBtnInProgress.addEventListener("click", () => {
  const selectedColumn = "in-progress"; // Setze die ausgewählte Spalte

  if (window.innerWidth <= 1080) {
    // Auf der aktuellen Seite, füge selectedColumn als Parameter zur URL hinzu
    window.location.href = "add-task.html?column=" + selectedColumn;
  } else {
    // Auf der aktuellen Seite, zeige das Overlay und das Modal an
    columnCategory = "in-progress";
    overlay.classList.toggle("hidden");
    addTaskModal.classList.toggle("is-active");
  }
});

const boardColumnAddTaskBtnAwaitFeedback = document.querySelector(
  "#plus-btn-container-await-feedback"
);
boardColumnAddTaskBtnAwaitFeedback.addEventListener("click", () => {
  const selectedColumn = "await-feedback";
  if (window.innerWidth <= 1080) {
    // Auf der aktuellen Seite, füge selectedColumn als Parameter zur URL hinzu
    window.location.href = "add-task.html?column=" + selectedColumn;
  } else {
    // Auf der aktuellen Seite, zeige das Overlay und das Modal an
    columnCategory = "await-feedback";
    overlay.classList.toggle("hidden");
    addTaskModal.classList.toggle("is-active");
  }
});

/**back to login.html */
function goBackToLogin() {
  window.location.href = "login.html";
}

/**go to privacy_policy.html */
function redirectToPrivacyPolicy(userIsLoggedIn) {
  const navLinks = document.querySelector(".nav-Container");

  userIsLoggedIn === false && navLinks.classList.add("d-none");

  window.location.href = "privacy_policy.html";
}

/* go to legal_notice.html */
function redirectToLegalNotice() {
  window.location.href = "legal_notice.html";
}
