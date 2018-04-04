// ON LOAD
authCheck();

// FUNCTIONS:
// Used to toggle the menu on small screens when clicking on the menu button
function menuSwitcher() {
	var x = document.getElementById("navDemo");
	if (x.className.indexOf("w3-show") == -1) {
		x.className += " w3-show";
	} else {
		x.className = x.className.replace(" w3-show", "");
	}
}

function authCheck() {
	var usr = JSON.parse(localStorage.getItem('ab-log-usr'));

	if (validateUser(usr)) {
    	var big_link_auth = document.getElementById('show-auth');
    	var small_link_auth = document.getElementById('show-auth-small');
    	big_link_auth.style.display = 'none';
    	small_link_auth.style.display = 'none';

        var big_link_usr = document.getElementById('show-user');
        var small_link_usr = document.getElementById('show-user-small');
        big_link_usr.innerText = usr.nickname;
        small_link_usr.innerText = usr.nickname;
    } else {
    	var big_link_usr = document.getElementById('show-user');
    	var small_link_usr = document.getElementById('show-user-small');
    	big_link_usr.style.display = 'none';
    	small_link_usr.style.display = 'none';
    }
}

function validateUser(usr) {
    if (!usr)
        return false;
    
    try {
        var checkNickname = typeof (usr.nickname) === 'string' && usr.nickname.length < 15 ? true : false;
        var checkAvatar = typeof (usr.nickname) === 'string' ? true : false; // TODO
        var checkContacts = Array.isArray(usr.contacts) ? true : false;

        if (checkNickname && checkAvatar && checkContacts)
            return true;

        return false;
    } catch (err) {
        console.log(err);
        return false;
    }

}

function fieldIsIncorrect(field) {
    if (typeof(field) === 'string' && field.length > 0 && field.length <= 25)
        return false;
    return true;
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function uploadUserData() {
    var usr = JSON.parse(localStorage.getItem('ab-log-usr'));

    if (validateUser(usr)) {
        getUpdatePromise(usr.id, usr.contacts, usr.avatar).then((response) => {
            console.log(response);
            alert(response);
        }).catch((error) => {
            alert('Upload promise rejected!');
            console.log('Error: ' + error);
            alert("uploadUserData: Ошибка! Проверте консоль для получения дополнительной информации.");
        });
    } else {
        console.log(JSON.stringify(usr));
        alert('uploadUserData: Данные пользователя повреждены! Перезайдите или свяжитесь с администратором.');
    }
}

function getUpdatePromise(id, contacts, avatar) {
    return new Promise(function(resolve, reject) {
        var http = new XMLHttpRequest();
        var url = '/php/update.php?';
        var args = 'id=' + id + '&contacts=' + JSON.stringify(contacts) + '&avatar=' + encodeURI(avatar);
        http.open("POST", url, true);
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

function rebuildBase64Avatar(arg) {
    var strings = arg.split(' ');
    var ret = '';
    for (i=0; i<strings.length; i++) {
        ret += strings[i];

        if (i < strings.length - 1)
            ret += '+';
    }
    return ret;
}