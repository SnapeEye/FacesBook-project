// NOTES:
// POST: http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

// ON LOAD:
if (!checkLoggedUser())
    document.location.href = 'user_page.html';

document.getElementById('btn-login').addEventListener('click', function() {
    var email = document.getElementById('data-email').value;
    var password = document.getElementById('data-password').value;

    if (validateEmail(email)) {
        login(email, password);
    } else {
        alert('Введенный адрес почты не корректен! Пожалуйста, проверте веденые данные.');
        return;
    }
});

// FUNCTIONS:
function login(email, pass) {
	getLoginPromise(email, pass).then((response) => {
        var usr = JSON.parse(response);
        usr.contacts = JSON.parse(usr.contacts);
        if (validateUser(usr)) {
            localStorage.setItem('ab-log-usr', JSON.stringify(usr));
            document.location.href = 'user_page.html';
        }
        else
            alert('Данные пользователя повреждены! Перезайдите или свяжитесь с администратором.')
    }).catch((error) => {
        alert("Ошибка! Проверте консоль для получения дополнительной информации.");
        console.log(error);
    });
}

function getLoginPromise(email, pass) {
    return new Promise(function(resolve, reject) {
        var http = new XMLHttpRequest();
        var url = '/php/login.php?email=' + email + '&password=' + pass;
        http.open("GET", url, true);
        http.onreadystatechange = function() {
            if (http.readyState == 4)
            {
                if (http.status == 200)
                    resolve(http.responseText);
                else
            	    reject(http.responseText);
            }
        }
        http.onerror = function() {
            reject(http.responseText);
        }
        http.send(null);
    });
}

function checkLoggedUser() {
    var usr = JSON.parse(localStorage.getItem('ab-log-usr'));
    if (usr === null)
        return true;
    return false;
}