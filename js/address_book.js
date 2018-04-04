// FUNCTIONS:
checkAuthorizationState = () => {
	const usr = JSON.parse(localStorage.getItem('ab-log-usr'));
	if (!isUserLoggedIn(usr)) {
		document.location.href = "login.html";
	} else {
		const getData = {
			'id': usr.id,
		}
		getCompanyData(getData);
	}
}

getCompanyData = (getData) => {
	getCompanyDataPromise(getData).then((response) => {
        const companyData = JSON.parse(response);
        allData['categories'] = companyData['categories'].split(',');
        allData['users'] = JSON.parse(JSON.stringify(companyData.company_contacts));
        allData['selected-category'] = 'Все';
        allData['indicator'] = '';
        fillCategoriesComponent(allData['categories']);
        sortUsersByCategory();
        updateDataBySelection();
    }).catch((error) => {
        alert("Ошибка! Проверте консоль для получения дополнительной информации.");
        console.log(error);
    });
}

getCompanyDataPromise = (getData) => {
    return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        const url = '/php/address_book.php?args=' + JSON.stringify(getData);
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

fillCategoriesComponent = (data) => {
	if (!data || data.length === 0) {
		return;
	}

	let list = document.getElementById("category-select");
	let firstElement = document.createElement("option");
    firstElement.text = 'Все';
    list.add(firstElement);
	for (let key in data) {
		let option = document.createElement("option");
    	option.text = data[key];
    	list.add(option);
	}
}

createTable = (data) => {
	let ctable = document.getElementById('contacts-table');
	let header = ctable.createTHead();
	if (header) {
		const header_data = ['ФИО', 'Категория', 'Номер', 'Описание'];
		let row = header.insertRow(0);

		for (let i = 0; i < header_data.length; i++) {
			let cell = row.insertCell(i);
			cell.innerHTML = '<b>' + header_data[i] + '</b>';
		}
	}

	if (!data || data.length === 0) {
		return;
	}
	
	let tbody = document.createElement('TBODY');
	ctable.append(tbody);

	for (let key in data) {
		let row = tbody.insertRow(Number(key));
		const current_values = Object.values(data[key]);

		for (let j = 0; j < current_values.length; j++) {
			let cell = row.insertCell(j);
			cell.classList.add('vertical-align');
			if (j === current_values.length - 1) {
				cell.classList.add('format-column');
			}
			let span = document.createElement('SPAN');
			const cellText = document.createTextNode(current_values[j] ? current_values[j] : '');
			span.appendChild(cellText);
			cell.append(span);
		}
	}
}

clearTable = () => {
	let table = document.getElementById('contacts-table');
	const rowCount = table.rows.length;
	for (let i = 0; i < rowCount; i++) {
	    table.deleteRow(0);
	}
}

updateDataBySelection = () => {
	let showData = [];
	allData['indicator'] = allData['indicator'].trim();
	if (allData['selected-category'] === 'Все') {
		showData = allData.users;
	} else {
		showData = allData.users.filter((el) => {
			return el.category === allData['selected-category'];
		});
	}

	if (allData['indicator'].length > 0) {
		showData = allData.users.filter((el) => {
			let pattern = new RegExp(allData['indicator'], 'i', 'g');
			return pattern.test(el.fio);
		});	
	}

	clearTable();
	createTable(showData);
}

sortUsersByCategory = () => {
	if (allData['categories'].length === 0) {
		return;
	}

	let categoriesAssociation = {};
	for (let key in allData['categories']) {
		categoriesAssociation[allData['categories'][key]] = Number(key);
	}

	allData['users'].sort((current,next) => {
		if (categoriesAssociation[current.category] > categoriesAssociation[next.category]) {
			return 1;
		} else {
			return -1;
		}
	});
}

// ON LOAD:
window.onload = checkAuthorizationState();
let allData = {};

document.getElementById('search-indicator').addEventListener('input', (ev) => {
	allData['indicator'] = ev.target.value;
	updateDataBySelection();
});

document.getElementById('category-select').addEventListener('change', (ev) => {
	allData['selected-category'] = ev.target.value;
	updateDataBySelection();
});