// ON LOAD:
document.getElementById('btn-reg').addEventListener('click', () => {
    const fio = document.getElementById('data-fio').value;
    const email = document.getElementById('data-email').value;
    const password = document.getElementById('data-password').value;
    const password_check = document.getElementById('data-password-check').value;
    const key = document.getElementById('data-reg-key').value;


    if (validateEmail(email)) {
        if (validatePasswords(password, password_check)) {
            if (validateRegKey(key)) {
                const regData = {
                    'fio': fio,
                    'email': email,
                    'password': password,
                    'key': key,
                };
                registration(regData);    
            } else {
                alert('Введенный ключ не валиден! Пожалуйста, проверте введеные данные.');
            }
        } else {
            alert('Введенные пароли не совпадают! Пожалуйста, проверте введеные данные.');
        }
    } else {
        alert('Введенный адрес почты не корректен! Пожалуйста, проверте введеные данные.');
    }
});

// FUNCTIONS:
registration = (regData) => {
    if (fieldIsIncorrect(regData.fio) || fieldIsIncorrect(regData.email) || fieldIsIncorrect(regData.password) || fieldIsIncorrect(regData.key)) {
        alert('Некоторые данные не валидны! Повторите ввод снова.');
        return;
    }
	getRegPromise(regData).then((response) => {
        if (response === 'success') {
            document.location.href = 'login.html';
        } else {
            alert('Ошибка регистрации! Попробуйте снова или свяжитесь с администратором.')
        }
    }).catch((error) => {
        alert(error);
    });
}

getRegPromise = (regData) => {
    return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        const url = '/php/registration.php?';
        const args = 'args=' + JSON.stringify(regData);
        http.open('POST', url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    resolve(http.responseText);
                } else {
            	    reject(http.responseText);
                }
            }
        }
        http.onerror = () => {
            reject(http.responseText);
        }
        http.send(args);
    });
}

validatePasswords = (password, password_check) => {
    return password === password_check ? true : false;
}

validateRegKey = (key) => {
    return key.length === 32 ? true : false;
}