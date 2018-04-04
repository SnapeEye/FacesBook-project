// ON LOAD:
document.getElementById('btn-start-work').addEventListener('click', function() {
    var usr = JSON.parse(localStorage.getItem('ab-log-usr'));
    if (validateUser(usr)) {
        document.location.href = "user_page.html"
    } else {
        document.location.href = "registration.html";
    }
});

// FUNCTIONS:
