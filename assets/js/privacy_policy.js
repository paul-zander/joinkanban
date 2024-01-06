async function init() {
  await includeHTML();
  await setHeaderInitials();
  await setProfileBadgeEventListener();
  await setActiveNavLink();
  hideElementsOnLogin();
}

function hideElementsOnLogin() {
  // Überprüfe, ob der Referer-Header verfügbar ist
  if (
    document.referrer.includes("login.html") ||
    document.referrer.includes("sign-up.html")
  ) {
    // const navBar = document.querySelector(".navbarLeft");
    // navBar.style.display = "none";

    const navContent = document.querySelector(".nav-Container");
    navContent.style.display = "none";
    // Benutzer kommt von der Login-Seite, also ausblenden
    const navList = document.querySelector(".nav-links");
    if (navList) {
      navList.style.display = "none";
    }

    const helpIcon = document.querySelector(".help-icon");
    if (helpIcon) {
      helpIcon.style.display = "none";
    }

    const userInitials = document.querySelector(".user-initials-wrapper");
    if (userInitials) {
      userInitials.style.display = "none";
    }
  }
}

/**The includeHTML function asynchronously loads and inserts HTML content from specified files into elements marked with "w3-include-html"
 * attributes on a webpage, handling file retrieval and error cases,
 * while the second part listens for the DOM to be ready and enables a back button to navigate to the previous page. */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("backButton");

  backButton.addEventListener("click", function () {
    window.history.back();
  });
});

/** go to legal_notice.html */
function redirectToLegalNotice() {
  window.location.href = "./legal_notice.html";
}
