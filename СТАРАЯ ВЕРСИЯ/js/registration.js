// NOTES:
// POST: http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

// ON LOAD:
document.getElementById('btn-reg').addEventListener('click', function() {
    var nickname = document.getElementById('data-nickname').value;
    var email = document.getElementById('data-email').value;
    var password = document.getElementById('data-password').value;
    var password_check = document.getElementById('data-password-check').value;

    if (validateEmail(email)) {
        if (validatePasswords(password, password_check))
            registration(nickname, email, password);
        else
            alert('Введенные пароли не совпадают! Пожалуйста, проверте введеные данные.');
    } else
        alert('Введенный адрес почты не корректен! Пожалуйста, проверте введеные данные.');
});

// FUNCTIONS:
function registration(nickname, email, pass) {
    if (fieldIsIncorrect(nickname) || fieldIsIncorrect(email) || fieldIsIncorrect(pass)) {
        alert('Некоторые данные не валидны! Повторите ввод снова.');
        return;
    }
	getRegPromise(nickname, email, pass).then((response) => {
        if (response === 'success')
            document.location.href = 'login.html';
        else
            alert('Ошибка регистрации! Попробуйте снова или свяжитесь с администратором.')
    }).catch((error) => {
        alert('Ошибка! Проверте консоль для получения дополнительной информации.');
        console.log(error);
    });
}

function getRegPromise(nickname, email, pass) {
    return new Promise(function(resolve, reject) {
        var http = new XMLHttpRequest();
        var url = '/php/registration.php?';
        var args = 'nickname=' + nickname + '&email=' + email + '&password=' + pass;
        http.open('POST', url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
        http.send(args);
    });
}

function validatePasswords(password, password_check) {
    if (password === password_check)
        return true;

    return false;
}