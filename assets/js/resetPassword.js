/**The createPopup function creates a pop-up message on a web page. It takes a message as input, creates a new HTML div element with the "popup" CSS class, 
 * sets the message text in the element, appends it to the document's body, and schedules its removal after 1.5 seconds (1500 milliseconds). */
function createPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 1500); 
}

/**     Retrieving the entered email and new password.
        Storing this data in the browser's localStorage as a JSON string.
        Displaying a success message in a popup.
        Redirecting to 'login.html' after a 1-second delay. */
function changePassword() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let userData = {
        email: email,
        password: password
    };
    localStorage.setItem("resetpassword", JSON.stringify(userData));
    createPopup("Ihr Passwort wurde erfolgreich zurückgesetzt");
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}
/* onclick to Back to Login site*/ 
function goBackToLogin() {
    createPopup("Zurück zur Anmeldeseite");
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000); 
}

