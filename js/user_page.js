// FUNCTIONS:
checkAuthorizationState = () => {
  const usr = JSON.parse(localStorage.getItem('ab-log-usr'));
  if (!isUserLoggedIn(usr)) {
    document.location.href = "login.html";
  } else {
    getUserInfo(usr);
  }
}

initComponentsEvents = () => {
  let inputs = document.getElementsByTagName('INPUT');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', () => {
      isChanged = true;
    });
  }

  let ta = document.getElementById('user-description');
  ta.addEventListener('change', () => {
      isChanged = true;
    });

  document.getElementById('btn-update').addEventListener('click', () => {
    const usr = JSON.parse(localStorage.getItem('ab-log-usr'));
    if (!isUserLoggedIn(usr)) {
      alert('Отсутствуют данные профиля! Перезайдите и повторите попытку.');
      return;
    }

    const fio = document.getElementById('user-fio').value;
    const number = document.getElementById('user-number').value;
    const description = document.getElementById('user-description').value;

    if (fio.length === 0 || number.length < 6 || description.length === 0) {
      alert('Все поля должны быть заполнены!');
      return;
    }

    const contactData = {
      'number': number,
      'description': description,
    }
    const updateObj = {
      'id': usr.id,
      'fio': fio,
      'contactData': JSON.stringify(contactData),
    };
    updateUserInfo(updateObj);
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('ab-log-usr');
    document.location.href="index.html";
  });
}

getUserInfo = (userData) => {
  getUserInfoPromise(userData).then((response) => {
        const usrInfo = JSON.parse(response);
        document.getElementById('user-fio').value = usrInfo.fio;
        document.getElementById('user-category').value = usrInfo.category;
        document.getElementById('user-number').value = usrInfo.number;
        document.getElementById('user-description').value = usrInfo.description;
    }).catch((error) => {
        alert("Ошибка! Проверте консоль для получения дополнительной информации.");
        console.log(error);
    });
}

getUserInfoPromise = (userData) => {
    return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        const url = '/php/user_page.php?args=' + JSON.stringify(userData);
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

updateUserInfo = (updateObj) => {
    let usr = JSON.parse(localStorage.getItem('ab-log-usr'));

    if (isUserLoggedIn(usr)) {
        updateUserInfoPromise(updateObj).then((response) => {
            alert(response);
            isChanged = false;
            usr.fio = updateObj.fio;
            localStorage.setItem('ab-log-usr', JSON.stringify(usr));
            authCheck();
        }).catch((error) => {
            alert(error);
        });
    } else {
        alert('Ошибка хранения данных! Перезайдите и попробуйте снова.');
    }
}

updateUserInfoPromise = (updateObj) => {
    return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        const url = '/php/update.php?';
        const args = 'args=' + JSON.stringify(updateObj);
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = () => {
            if (http.readyState == 4) {
                if (http.status == 200) {
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

// ON LOAD:
window.onload = checkAuthorizationState();
window.onbeforeunload = () => {
  if (isChanged) {
    return 'Не сохраненные данные будут утеряны! Покинуть страницу?';
  }
}
let isChanged = false;
initComponentsEvents();