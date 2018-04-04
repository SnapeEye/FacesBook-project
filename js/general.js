// FUNCTIONS:
menuSwitcher = () => {
	let x = document.getElementById("navDemo");
	if (x.className.indexOf("w3-show") === -1) {
		x.className += " w3-show";
	} else {
		x.className = x.className.replace(" w3-show", "");
	}
}

authCheck = () => {
	const usr = JSON.parse(localStorage.getItem('ab-log-usr'));

	if (isUserLoggedIn(usr)) {
    	let big_link_auth = document.getElementById('show-auth');
    	let small_link_auth = document.getElementById('show-auth-small');
    	big_link_auth.style.display = 'none';
    	small_link_auth.style.display = 'none';

        let big_link_usr = document.getElementById('show-user');
        let small_link_usr = document.getElementById('show-user-small');
        big_link_usr.innerText = usr.fio;
        small_link_usr.innerText = usr.fio;
    } else {
    	let big_link_usr = document.getElementById('show-user');
    	let small_link_usr = document.getElementById('show-user-small');
    	big_link_usr.style.display = 'none';
    	small_link_usr.style.display = 'none';
    }
}

isUserLoggedIn = (usr) => {
    return usr ? true : false;
}

fieldIsIncorrect = (field) => {
    return (typeof(field) === 'string' && field.length > 0) ? false : true;
}

validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// ON LOAD
authCheck();