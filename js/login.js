document.getElementById('btn-login').addEventListener('click', () => {
    const email = document.getElementById('data-email').value;
    const password = document.getElementById('data-password').value;

    if (validateEmail(email)) {
        const logData = {
            'email': email,
            'password': password,
        };
        login(logData);
    } else {
        alert('Введенный адрес почты не корректен! Пожалуйста, проверте введеные данные.');
        return;
    }
});

// FUNCTIONS:
login = (logData) => {
	getLoginPromise(logData).then((response) => {
        const usr = JSON.parse(response);
        if (isUserLoggedIn(usr)) {
            localStorage.setItem('ab-log-usr', JSON.stringify(usr));
            document.location.href = 'user_page.html';
        } else {
            alert('Данные пользователя повреждены! Перезайдите или свяжитесь с администратором.')
        }
    }).catch((error) => {
        alert("Ошибка! Проверте консоль для получения дополнительной информации.");
        console.log(error);
    });
}

getLoginPromise = (logData) => {
    return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        const url = '/php/login.php?args=' + JSON.stringify(logData);
        http.open("GET", url, true);
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
        http.send(null);
    });
}

checkLoggedUser = () => {
    const usr = JSON.parse(localStorage.getItem('ab-log-usr'));
    return isUserLoggedIn(usr);
}

// ON LOAD:
if (checkLoggedUser()) {
    document.location.href = 'user_page.html';
}