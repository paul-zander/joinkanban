currentUser = localStorage.getItem("currentUser");

function generateInitials(name) {
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part[0]).join("");
  initialsUppercase = initials.toUpperCase();
  return initialsUppercase;
}

const setHeaderInitials = async function () {
  const userProfilBadge = document.getElementById("user-initials-header");
  const initials = generateInitials(currentUser);
  userProfilBadge.innerHTML = /*html*/ `${initials}`;
};

async function setProfileBadgeEventListener() {
  const profilBadge = document.querySelector(".user-initials-wrapper");
  profilBadge.addEventListener("click", openOptions);
}

function openOptions(event) {
  const optionsModal = document.querySelector(".options-modal");
  optionsModal.classList.toggle("d-none");
  event.stopPropagation();
}

function closeOptions() {
  const optionsModal = document.querySelector(".options-modal");
  if (!optionsModal.classList.contains("d-none")) {
    optionsModal.classList.add("d-none");
  }
}

document.body.addEventListener("click", closeOptions);

// Code for nav links
let currentPage = window.location.pathname;

async function setActiveNavLink() {
  const navLinkSummary = document.querySelector(".summary-nav");
  const navLinkAddTask = document.querySelector(".add-task-nav");
  const navLinkBoard = document.querySelector(".board-nav");
  const navLinkContacts = document.querySelector(".contacts-nav");

  if (currentPage === "/summary.html") {
    navLinkSummary.classList.toggle("single-nav-link-active");
  } else if (currentPage === "/add-task.html") {
    navLinkAddTask.classList.toggle("single-nav-link-active");
  } else if (currentPage === "/board.html") {
    navLinkBoard.classList.toggle("single-nav-link-active");
  } else if (currentPage === "/contacts.html") {
    navLinkContacts.classList.toggle("single-nav-link-active");
  }
}

/**go to privacy_policy.html */
function redirectToPrivacyPolicy() {
  window.location.href = "privacy_policy.html";
}

/**go to legal_notice.html */
function redirectToLegalNotice() {
  window.location.href = "legal_notice.html";
}
