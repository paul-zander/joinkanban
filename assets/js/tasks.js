const titles = [];
const descriptions = [];
const dates = [];
const categor = ["Technical Task", "User Story"];
const dataContacts = [];
const taskes = [];
const selectedContactsArray = [];
const tasks = [];
let selectedPriorityNewTask;
let selectedContacts = [];
let contactStatus = [];
let contacts = [];

async function init() {
  await includeHTML();
  loadContacts();
  renderTask();
  renderSelectOptionsCategory();
  noLateDays();
  await setHeaderInitials();
  await setProfileBadgeEventListener();
  await setActiveNavLink();
}

/**
 * function to render HTML Header/Footer
 */
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

/**
 * async, waiting to load Users from Databank - necessary for Assigned To
 */
async function loadContacts() {
  const keyToSearch = "users";
  contacts = await getItem(keyToSearch);
  contacts = JSON.parse(contacts);
  assignedTo(contacts);
}

/**
 * disable post days usage in Date input
 */
function noLateDays() {
  const currentDate = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("choosedDate");
  dateInput.setAttribute("min", currentDate);
}

/**
 * check current choosed Btn and add an Event on
 */
function renderTask() {
  const btnUrgent = document.querySelector(".edit-urgent");
  const btnMedium = document.querySelector(".edit-medium");
  const btnLow = document.querySelector(".edit-low");
  btnUrgent.addEventListener("click", () => changeColorOfPriorityBtn("Urgent"));
  btnMedium.addEventListener("click", () => changeColorOfPriorityBtn("Medium"));
  btnLow.addEventListener("click", () => changeColorOfPriorityBtn("Low"));
  showCurrentPriority(getSelectedPriority());
}

/**
 * Renders contacts which was already loaded into an Array
 * @param {contacts} contacts  function async loadContacts
 */
function assignedTo(contacts) {
  const contactHTML = document.getElementById("contactList");
  contactStatus = new Array(contacts.length).fill(true);

  contactHTML.innerHTML = "";

  for (let i = 0; i < contacts.length; i++) {
    const nameContact = contacts[i]["name"];
    const initials = generateInitials(nameContact);
    const color = contacts[i]["color"];
    const contactContainer = document.createElement("div");
    contactContainer.classList.add("assigned-container");
    contactContainer.innerHTML += contactsRender(
      color,
      initials,
      nameContact,
      i
    );
    contactStatus.push(true);
    contactContainer
      .querySelector(".helper-for-contacts")
      .addEventListener("click", () => {
        toggleCheckbox(i, contactStatus);
      });
    contactHTML.appendChild(contactContainer);
  }
  renderContactBadges();
}

/**
 * contact badges get rendered depends on choosen color
 */
async function renderContactBadges() {
  const contactBadgesWrapper = document.querySelector(
    ".contact-badges-container-task"
  );
  contactBadgesWrapper.innerHTML = "";

  for (let i = 0; i < selectedContacts.length; i++) {
    const name = selectedContacts[i].name;
    const initials = generateInitials(name);
    const color = selectedContacts[i].color;

    contactBadgesWrapper.innerHTML += /*html*/ `
        <div class="assignee-choosed" style="background: ${color}">${initials}</div>
    `;
  }
}

/**
 * right toogle function for the choosed contact
 * @param {choosed Contact} index
 */
function toggleCheckbox(index) {
  let checkbox = document.getElementById(`check${index}`);
  let checkboxImage = document.getElementById(`checkbox-${index}`);
  let isChecked = checkbox.checked;

  if (!isChecked) {
    checkboxImage.src = "./assets/img/checkbox-checked.svg";
    checkbox.checked = true;
    selectedContacts.push(contacts[index]);
  } else if (isChecked) {
    checkbox.checked = false;
    checkboxImage.src = "./assets/img/checkbox.svg";
    let selectedIndex = selectedContacts.indexOf(contacts[index]);
    if (selectedIndex !== -1) {
      selectedContacts.splice(selectedIndex, 1);
    }
  }
}

/**
 * initials get cut and color
 */
function generateInitials(nameContact) {
  const nameParts = nameContact.split(" ");
  const initials = nameParts.map((part) => part[0]).join("");
  const initialsUppercase = initials.toUpperCase();
  return initialsUppercase;
}

/**
 * subTask get controlled disabled
 */
function subtasksFormValidation() {
  const old = document.getElementById("default-input");
  old.classList.add("d-none");
  const addInput = document.getElementById("add-input");
  addInput.classList.remove("d-none");
}

/**
 * help function to reset the input from Subtask and Icons
 */
function resetInputSubtask() {
  const normal = document.getElementById("default-input");
  normal.classList.remove("d-none");
  const addInput = document.getElementById("add-input");
  addInput.classList.add("d-none");
  const inputField = document.getElementById("selectedSubtask");
  inputField.value = "";
}

/**
 * subtask get pushed into local array, to make it able to edit and push towards an databank
 */
function addSubtaskToList() {
  const input = document.getElementById("selectedSubtask").value;
  taskes.push({ text: `${input}`, status: "todo" });
  resetInputSubtask();
  renderTaskList();
}

/**
 * show all tasks from an array taskes
 */
function renderTaskList() {
  const list = document.getElementById("showTask");
  list.innerHTML = generateTaskListHTML(taskes);
}

/**
 * open possibility to add an Task
 */
function editTask(i) {
  const listElement = document.getElementById(`listElement${i}`);
  const taskText = listElement.querySelector(
    ".subtask-list-element"
  ).textContent;

  listElement.innerHTML = generateEditTaskHTML(i, taskText);

  const edit = document.getElementById("editInput");
  edit.style.display = "flex";
}

/**
 * save the Task you choose and save it also in the array on correct spot (i)
 */
function saveEditedTask(i) {
  const editTaskInput = document.getElementById(`editTaskInput${i}`);
  const updatedTaskText = editTaskInput.value;
  taskes[i].text = updatedTaskText;
  renderTaskList();
}

/**
 * delete the i Task you choosed
 */
function deleteCurrentTask(i) {
  let removen = document.getElementById(`listElement${i}`);
  removen.remove();
  taskes.splice(i, 1);
  renderTaskList();
}

/**
 * link to privacy_policy
 */
function redirectToPrivacyPolicy() {
  window.location.href = "./privacy_policy.html";
}

/**
 * link to legal__notice
 */
function redirectToLegalNotice() {
  window.location.href = "./legal_notice.html";
}

/**
 * selected Person get rendered in assignedTo aswell as Badges for them get created and rendered
 */
function renderSelectOptionsPersons() {
  let contactList = document.getElementById("contactList");
  let addContactButton = document.getElementById("addNewContact");
  let imgElement = document.querySelector(".add-task-show-contacts-btn");

  contactList.style.display =
    contactList.style.display === "block" &&
    addContactButton.style.display === "flex"
      ? "none"
      : "block";
  addContactButton.style.display =
    contactList.style.display === "block" ? "flex" : "none";
  imgElement.src = `./assets/img/arrow_drop_${
    contactList.classList.contains("d-none") ? "down" : "up"
  }.svg`;
  renderContactBadges();
}

/**
 * dropdown for category
 */
function renderSelectOptionsCategory() {
  let categorySelect = document.querySelector(".category");
  for (const category of categor) {
    categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
  }
}

/**
 * All Fields get controlled and they get pushed to an array, after push to Databank, into link to board.html
 */
async function createTask() {
  let titleInput = document.getElementById("titleInput");
  let descriptionInput = document.getElementById("descriptionInput");
  let dateInput = document.getElementById("choosedDate");
  let categorySelect = document.getElementById("selectedCategory");
  let hasError = errorValidation();
  hasError = hasError || subtaskErrorValidation();
  hasError = hasError || assigneesErrorValidation();

  if (hasError) {
    return;
  }
  let existingTasks = await getItem("tasks");
  existingTasks = JSON.parse(existingTasks) || [];
  let newTask = {
    title: titleInput.value,
    description: descriptionInput.value,
    dueDate: dateInput.value,
    label: categorySelect.value,
    priority: selectedPriorityNewTask,
    subtasks: taskes,
    assignees: selectedContacts,
    id: (existingTasks.length + 1).toString(),
    category: "to-do",
  };
  existingTasks.push(newTask);
  await setItem("tasks", JSON.stringify(existingTasks));
  clearTask();
  moveToBoard();
}

/**
 * Validation that Errors apply when not fullfilled
 */
function errorValidation() {
  let fields = [
    { input: "titleInput", error: "titleError" },
    { input: "descriptionInput", error: "descriptionError" },
    { input: "choosedDate", error: "dateError" },
    { input: "selectedCategory", error: "categoryError" },
  ];
  let hasError = false;
  fields.forEach((field) => {
    let inputElement = document.getElementById(field.input);
    let errorElement = document.getElementById(field.error);
    if (!inputElement.value) {
      hasError = true;
      errorElement.style.display = "block";
    } else {
      errorElement.style.display = "none";
    }
  });
  let selectedPriority = getSelectedPriority();
  if (!selectedPriority) {
    hasError = true;
    document.getElementById("priorityError").style.display = "block";
  } else {
    document.getElementById("priorityError").style.display = "none";
  }
  if (hasError) {
    return;
  }
}

/**
 * validation if taskes > 0 then no error
 * @returns false or true if filled or not
 */
function subtaskErrorValidation() {
  let subtaskErrorElement = document.getElementById("subtaskError");
  if (taskes.length === 0) {
    subtaskErrorElement.style.display = "block";
    return true; // Fehler vorhanden
  } else {
    subtaskErrorElement.style.display = "none";
    return false; // Kein Fehler
  }
}

/**
 *  validation if contacts > 0 then no
 * @returns true or false if filled or not
 */
function assigneesErrorValidation() {
  let assigneesErrorElement = document.getElementById("assigneesError");
  if (selectedContacts.length === 0) {
    assigneesErrorElement.style.display = "block";
    return true; // Fehler vorhanden
  } else {
    assigneesErrorElement.style.display = "none";
    return false; // Kein Fehler
  }
}

/**
 * after board = succeed link to Board
 */
function moveToBoard() {
  window.location.href = "./board.html";
}

/**
 * clear for all Tasks elements
 */
function clearTask() {
  let contactList = document.getElementById("contactList");
  contactList.style.display = "none";
  document.getElementById("titleInput").value = "";
  document.getElementById("descriptionInput").value = "";
  document.getElementById("choosedDate").value = "";
  document.getElementById("selectedCategory").value = "";
  document.getElementById("selectedSubtask").value = "";
  document.getElementById("showTask").innerHTML = "";
  selectedContacts = [];
  resetInputSubtask();
}

/**
 * contact get Open
 */
function openContactHTML() {
  let contactFormular = document.getElementById("contactForumlar");
  if (
    contactFormular.style.display === "none" ||
    contactFormular.style.display === ""
  ) {
    contactFormular.style.display = "flex";
    contactFormular.innerHTML = contactTemplate();
  }
}

/**
 * close new Window for create Contact
 */
function closeWindow() {
  let contactFormular = document.getElementById("contactForumlar");
  contactFormular.style.display = "none";
}

/**
 * create a contact in addTask
 */
function createContact() {
  let addname = document.getElementById("name").value;
  let addemail = document.getElementById("email").value;
  let addphone = document.getElementById("phone").value;
  let addcolor = document.getElementById("color").value;
  let contact = {
    name: addname,
    email: addemail,
    phone: addphone,
    color: addcolor,
  };

  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.push(contact);
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

/**
 * priority img get changed
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
 * changed Priority get show
 */
function showCurrentPriority(currentPriority) {
  let btnUrgent = document.querySelector(".edit-urgent");
  let btnMedium = document.querySelector(".edit-medium");
  let btnLow = document.querySelector(".edit-low");
  let urgentImg = document.querySelector(".edit-urgent img");
  let mediumImg = document.querySelector(".edit-medium img");
  let lowImg = document.querySelector(".edit-low img");

  resetBackgroundColor(btnUrgent, btnMedium, btnLow);
  resetButtons(urgentImg, mediumImg, lowImg);
  selectedPriority(
    currentPriority,
    btnUrgent,
    btnMedium,
    btnLow,
    urgentImg,
    mediumImg,
    lowImg
  );
}

/**
 * Add event so on input subtaskformValidation is used
 */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("selectedSubtask").oninput = function () {
    subtasksFormValidation(this.value);
  };
});

/**
 * color of Priority get changed
 */
function changeColorOfPriorityBtn(priority) {
  let btnUrgent = document.querySelector(".edit-urgent");
  let btnMedium = document.querySelector(".edit-medium");
  let btnLow = document.querySelector(".edit-low");
  let urgentImg = document.querySelector(".edit-urgent img");
  let mediumImg = document.querySelector(".edit-medium img");
  let lowImg = document.querySelector(".edit-low img");
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

/**
 * choosed priority background will change
 */
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
    tasks.priority = "Urgent";
    selectedPriorityNewTask = "Urgent";
  } else if (priority === "Medium") {
    btnMedium.classList.add("medium-selected");
    mediumImg.src = "./assets/img/medium-white.svg";
    tasks.priority = "Medium";
    selectedPriorityNewTask = "Medium";
  } else if (priority === "Low") {
    btnLow.classList.add("low-selected");
    lowImg.src = "./assets/img/low-white.svg";
    tasks.priority = "Low";
    selectedPriorityNewTask = "Low";
  }
}

/**
 * Buttons Changed after reset
 */
function resetButtons(urgentImg, mediumImg, lowImg) {
  urgentImg.src = "./assets/img/highprio.svg";
  mediumImg.src = "./assets/img/mediumprio.svg";
  lowImg.src = "./assets/img/lowprio.svg";
}

/**
 * Buttons Changed after reset
 */
function resetBackgroundColor(btnUrgent, btnMedium, btnLow) {
  btnUrgent.classList.remove("urgently-selected");
  btnMedium.classList.remove("medium-selected");
  btnLow.classList.remove("low-selected");
}

/**
 * help function to get selected Priority to work with
 */
function getSelectedPriority() {
  const btnUrgent = document.querySelector(".edit-urgent");
  const btnMedium = document.querySelector(".edit-medium");
  const btnLow = document.querySelector(".edit-low");

  if (btnUrgent.classList.contains("urgently-selected")) {
    return "Urgent";
  } else if (btnMedium.classList.contains("medium-selected")) {
    return "Medium";
  } else if (btnLow.classList.contains("low-selected")) {
    return "Low";
  } else {
    return null;
  }
}

// Code from add task modal
// const searchBarContacts = document.querySelector(".add-task-assigned-to-input");
// const addTaskContactRows = document.querySelectorAll(".add-task-contacts-row");
// const contactWrapper = document.querySelector(".add-task-assigned-to-badges");
// const addContacktBtn = document.querySelector(".add-task-add-contact-btn");
// const imgElement = document.querySelector(".add-task-show-contacts-btn");

// searchBarContacts.addEventListener("click", () => {
//   contactWrapper.classList.toggle("d-none");
//   // addContactBtn.classList.toggle("d-none");
//   if (contactWrapper.classList.contains("d-none")) {
//     imgElement.src = "./assets/img/arrow_drop_down.svg";
//   } else {
//     imgElement.src = "./assets/img/arrow_drop_up.svg";
//   }
// });

// searchBarContacts.addEventListener("keyup", (e) => {
//   const term = e.target.value.toLowerCase();
//   document.querySelectorAll(".add-task-contacts-row").forEach((contactRow) => {
//     const contactName = contactRow
//       .querySelector(".assignee-name")
//       .textContent.toLowerCase();

//     if (contactName.indexOf(term) !== -1) {
//       contactRow.closest(".add-task-contacts-wrapper").style.display = "flex";
//     } else {
//       contactRow.closest(".add-task-contacts-wrapper").style.display = "none";
//     }
//   });
// });

// // const categoryDiv = document.querySelector('.add-task-category-wrapper');

// /**
//  * Toggles the visibility of categories in the "Add Task" modal.
//  */
// function toggleCategoriesInAddTaskModal() {
//   const categoryOptions = document.querySelector(".category-options");
//   categoryOptions.classList.toggle("d-block");
//   const categoryArrow = document.querySelector(".add-task-show-categories-btn");
//   if (categoryOptions.classList.contains("d-block")) {
//     categoryArrow.src = "./assets/img/arrow_drop_up.svg";
//   } else {
//     categoryArrow.src = "./assets/img/arrow_drop_down.svg";
//   }
// }
