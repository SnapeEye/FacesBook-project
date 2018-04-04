// ON LOAD:
document.getElementById('btn-start-work').addEventListener('click', function() {
    const usr = JSON.parse(localStorage.getItem('ab-log-usr'));
    if (isUserLoggedIn(usr)) {
        document.location.href = "user_page.html"
    } else {
        document.location.href = "registration.html";
    }
});