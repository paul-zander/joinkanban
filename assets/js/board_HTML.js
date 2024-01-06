/**
 * Creates an element for a category with no tasks.
 * @param {string} category - The category for which the dummy element is created.
 * @returns {string} - The HTML for the element.
 */
function createNoTasksDummyElement(category) {
  return /*html*/ `<div class="no-tasks-dummy no-tasks-${category} d-none">No tasks ${category}</div>`;
}

/**
 * Creates the HTML for a task card.
 * @param {Object} task - The task data.
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @returns {string} - The HTML for the task card.
 */
function createTaskCardHtml(task, index, category) {
  const priorityImg = getPriorityImg(task.priority);
  const subTasksTotal = task.subtasks.length;
  const subtasksDone = task.subtasks.filter(
    (subtask) => subtask.status === "done"
  ).length;
  const doneToTotalRatio = (subtasksDone / subTasksTotal) * 100;

  return /*html*/ `
        <div class="card-dummy" id="${task.id}" draggable="true" onclick="openModal(${task.id})">
            <div class="card-content">
                <div class="card-label" id="${category}-card-label-${index}">${task.label}</div>
                <div class="card-title">${task.title}</div>
                <div class="card-description">${task.description}</div>
                <div class="progress" id="${category}-progress-${index}">
                    <div class="progress-bar">
                        <div class="progress-bar-line" style="width: ${doneToTotalRatio}%"></div>
                    </div>
                    <div class="progress-text">${subtasksDone}/${subTasksTotal} Subtasks</div>
                </div>
                <div class="card-bottom">
                    <div class="assignees-container">
                        <div class="assignees" id="${category}-assignees-${index}">
                            <!-- Add assignees here -->
                        </div>
                        <div class="additional-assignees" id="additional-assignees-${task.id}"></div>
                    </div>
                    <div class="priority-symbol">
                        <img src="./assets/img/${priorityImg}.svg" draggable="false" alt="">
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renders assignees in a card.
 * @param {Array} assignees - An array of assignees for the task.
 * @param {string} assigneesDivId - The ID of the assignees container.
 */
function renderAssigneesInCard(
  assignees,
  assigneesDivId,
  additionalAssingeesDivId
) {
  const assigneesContainer = document.getElementById(`${assigneesDivId}`);
  const assigneesArray = assignees;
  const addtionalAssigneesContainer = document.getElementById(
    `${additionalAssingeesDivId}`
  );

  let zIndex = 0;
  let profilBadgePosition = 0;
  const numAdditonalAssignees = assigneesArray.length - 5;

  if (assigneesArray.length > 5) {
    addtionalAssigneesContainer.innerHTML = `+${numAdditonalAssignees}`;
    for (let i = 0; i < 4; i++) {
      const name = assigneesArray[i].name;
      const initials = generateInitials(name);
      const color = assigneesArray[i].color;

      assigneesContainer.innerHTML += /*html*/ `
                    <div class="assignee" style="background: ${color}; z-index: ${
        zIndex + 1
      }; transform: translate(${profilBadgePosition}%) " >${initials}</div>
                `;
      zIndex++;
      profilBadgePosition = profilBadgePosition - 20;
    }
  } else {
    for (let i = 0; i < assigneesArray.length; i++) {
      const name = assigneesArray[i].name;
      const initials = generateInitials(name);
      const color = assigneesArray[i].color;

      assigneesContainer.innerHTML += /*html*/ `
                      <div class="assignee" style="background: ${color}; z-index: ${
        zIndex + 1
      }; transform: translate(${profilBadgePosition}%) " >${initials}</div>
                  `;
      zIndex++;
      profilBadgePosition = profilBadgePosition - 20;
    }
  }
}

/**
 * Renders the task details in the modal.
 * @param {number} taskId - The ID of the task to be displayed in the modal.
 */
function renderModal(taskId) {
  const task = localTasks.find((task) => +task.id === +taskId);
  const priorityImg = getPriorityImg(task.priority);
  let modal = document.querySelector(".modal");
  modal.innerHTML = "";
  modal.innerHTML += /*html*/ `
        <div class="modal-header">
            <div class="modal-label">${task.label}</div>
            <div class="close-modal-wrapper" onclick="closeModal()">
                <img class="close-modal" src="./assets/img/close.svg" alt="">
            </div>
        </div>
        <textarea readonly class="modal-headline">${task.title}</textarea>
        <textarea readonly class="modal-description">${
          task.description
        }</textarea>
        <div class="modal-date"><span class="modal-span">Due date: </span>${formatDate(
          task.dueDate
        )}</div>
        <div class="modal-priority"><span class="modal-span">Priority: </span>${
          task.priority
        } <img class="modal-priority-sign" src="./assets/img/${priorityImg}.svg"></div>
        <div class="assignee-container">
        <span class="modal-span span-assignees">Assigned To: </span>
        </div>
        <div class="modal-subtasks">
        <span class="modal-span span-subtasks">Subtasks </span>
            <div class="insert-modal-subtasks">
            
            </div>
        </div>
        <div class="delete-and-edit-wrapper">
            <div class="delete-and-edit">
                <div class="delete" onclick="deleteTask(${task.id})">
                    <img src="./assets/img/delete.svg" alt=""><span>Delete</span>
                </div>
                <div class="small-divider"></div>
                <div class="edit" id="editTask">
                    <img src="./assets/img/edit.svg" alt=""><span>Edit</span>
                </div>
            </div>
        </div>
    `;
  setColorOfCategoryInModal(task.label);
  renderAssignees(task.assignees);
  renderSubtasks(task.subtasks);
  // checkSubtasksInModal();
  document
    .getElementById("editTask")
    .addEventListener("click", () => editTask(task));
}

/**
 * Renders contacts in the edit modal.
 */
async function renderContactsInEditModal() {
  const assigneesBadgesWrapper = document.querySelector(
    ".edit-assigned-to-badges"
  );

  assigneesBadgesWrapper.innerHTML = "";
  for (let i = 0; i < localContacts.length; i++) {
    const name = localContacts[i].name;
    const initials = generateInitials(name);
    const color = localContacts[i].color;
    assigneesBadgesWrapper.innerHTML += /*html*/ `
        <div class="contacts-wrapper" id="${localContacts[i].id}" onclick="markContactsInDropdown(${localContacts[i].id})">
            <div class="contacts-row">
                <div class="assignee" style="background: ${color}">
                    <div class="assignee-initals">${initials}</div>
                </div>
                <div class="assignee-name">${name}</div>
            </div>
            <img id="contacts-row-checkbox${localContacts[i].id}" class="contacts-row-checkbox" src="./assets/img/checkbox.svg" alt="">
        </div>
    `;
  }
}

/**
 * Generates the HTML for the edit modal.
 * @param {Object} task - The task being edited.
 * @param {string} formattedDate - The formatted due date.
 * @returns {string} - The HTML for the edit modal.
 */
async function generateModalHTML(task, formattedDate) {
  const modalHTML = /*html*/ `
    <div class="edit-close-modal-wrapper">
        <div class="close-modal-btn-wrapper" onclick="closeModal()">
            <img class="close-modal" src="./assets/img/close.svg" alt="">
        </div>
    </div>
    <div class="edit-modal-wrapper">
        <div class="edit-modal-headline-wrapper">
            <textarea class="edit-modal-headline" placeholder="Enter a title">${
              task.title
            }</textarea>
        </div>
        <div class="edit-description">
            <span class="edit-span">Description</span>
            <div class="edit-textarea-wrapper">
                <img class="resize-handler" src="./assets/img/resize-handler.svg" alt="">
                <textarea class="edit-description-textarea" type="text" placeholder="Enter a description">${
                  task.description
                }</textarea>
            </div>
        </div>
        <div class="edit-date">
            <span class="edit-span">Due date</span>
            <input class="edit-due-date" type="date" placeholder="${task.dueDate
              .split("/")
              .reverse()
              .join("-")}" value="${task.dueDate
    .split("/")
    .reverse()
    .join("-")}">
        </div>
        <div class="edit-priority">
            <span class="edit-span">Priority</span>
            <div class="edit-priority-btn-wrapper">
                <div class="priority-btn edit-urgent">
                    <span>Urgent</span>
                    <img src="./assets/img/highprio.svg" alt="">
                </div>
                <div class="priority-btn edit-medium">
                    <span>Medium</span>
                    <img src="./assets/img/mediumprio.svg" alt="">
                </div>
                <div class="priority-btn edit-low">
                    <span>Low</span>
                    <img src="./assets/img/lowprio.svg" alt="">
                </div>
            </div>
        </div>
        <div class="edit-assigned-to">
            <span class="edit-span">Assigned to</span>
            <div class="edit-assigned-to-input-wrapper">
                <input class="edit-assigned-to-input" type="text" placeholder="Select contacts to assign">
                <img class="show-contacts-btn"class="" src="./assets/img/arrow_drop_down.svg" alt="" onclick="toggleContactsInEditModal()">
            </div>
            <div class="edit-assigned-to-badges d-none"></div>
            <button class="add-contact-btn d-none">Add new contact <img src="./assets/img/person_add.svg" alt=""></button>
        </div>
        <div class="contact-badges-container"></div>
        <div class="edit-subtasks">
            <span class="edit-span">Subtasks</span>
            <div class="edit-subtasks-input-wrapper">
                <input class="edit-subtasks-input" type="text" placeholder="Add new subtask" required>
                <div class="edit-subtasks-icons-wrapper">
                    <div class="edit-clear-wrapper">
                        <img src="./assets/img/clear-lightblue.svg" alt="">
                    </div>
                    <div class="edit-subtasks-icons-divider"></div>
                    <div class="edit-plus-wrapper">
                        <img class="edit-subtasks-icon-add" src="./assets/img/Subtask's icons.svg" alt="">
                        <img class="edit-subtasks-plus-icon" src="./assets/img/plusiconsubtask.svg" alt="">
                    </div>
                </div>
            </div>
            <div class="existing-subtasks"></div>
            <div class="edit-task-input">
                <input class="edit-task-inputfield" type="text">
                <div class="edit-task-input-icons-wrapper">
                    <img class="edit-task-delete-icon" src="./assets/img/delete.svg" alt="">
                    <div class="edit-subtasks-input-icons-divider"></div>
                    <img class="edit-task-confirm-edit-icon" src="./assets/img/Subtask's icons.svg" alt="">
                </div>
            </div>
        </div>
        <div class="change-work-stage">
            <span class="add-task-span">Work Stage</span>
            <div class="change-work-stage-wrapper" onclick="toggleWorkStages()">
                <div class="select-category" type="text" placeholder="Change work stage">Change work stage</div>
                <img class="change-work-stage-btn" src="./assets/img/arrow_drop_down.svg" alt="">
            </div>
            <div class="change-work-stage-options">
                <div class="change-work-stage-to-do" onclick="setWorkStage('to-do')">To do</div>
                <div class="change-work-stage-in-progress" onclick="setWorkStage('in-progress')">In Progress</div>
                <div class="change-work-stage-await-feedback" onclick="setWorkStage('await-feedback')">Await feedback</div>
                <div class="change-work-stage-done" onclick="setWorkStage('done')">Done</div>
            </div>
        </div>
    </div>
    <div class="confirm-section">
            <button onclick="saveEditedTask()">Ok <img src="./assets/img/check.svg" alt=""></button>
        </div>
    `;

  return modalHTML;
}

/**
 * Renders subtasks in the edit modal.
 * @param {Object} task - The task containing subtasks to render.
 */
async function renderSubtasksInEditModal(task) {
  const existingSubtasks = document.querySelector(".existing-subtasks");
  existingSubtasks.innerHTML = "";

  for (let i = 0; i < task.subtasks.length; i++) {
    existingSubtasks.innerHTML += /*html*/ `
        <div id ="subtask-wrapper${i}" class="existing-subtasks-list-item">
            <li id="subtask${i}" class="subtask-list-item">${task.subtasks[i].text}</li>
            <div class="subtask-list-item-btn">
                <img id="edit-subtask-btn${i}" class="edit-subtask-btn" src="./assets/img/edit.svg" alt="" onclick="editSubtask(${i})">
                <div class="subtask-list-item-divider"></div>
                <img class="delete-subtask-btn" src="./assets/img/delete.svg" alt="" onclick="deleteSubtask(${i})">
            </div>
        </div>
    `;
  }
}
