//creates an animation at a specific place on the page
function startAnimation() {
    const mainImage = document.getElementById("mainImage");
    setTimeout(() => {
        mainImage.style.transform = "translate(-901%, -345%) scale(1)";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1300);
    }, 0);
}
document.addEventListener("DOMContentLoaded", startAnimation);


