// ON LOAD:
window.onload = checkAuthorizationState();

var canEdit = 0;
var optionButtons = {
	generateEditBtn: function() {
		var btn_edit = document.createElement("BUTTON");
		btn_edit.classList.add('w3-btn', 'btn-styles');
		btn_edit.setAttribute("id", "btn-edit");
		btn_edit.setAttribute("title", "Редактировать контакт");
		btn_edit.innerText = 'Редактировать';
		btn_edit.addEventListener('click', function() {
			if (canEdit == 0) {
				var cells = this.parentElement.parentElement.children;

				for (var i = 0; i < cells.length - 1; i++) {
					var input = cells[i].firstElementChild;
					input.readOnly = false;
					input.classList.add('edit-bg-color');
				}

				canEdit = parseInt(this.parentElement.parentElement.getAttribute('id'));
			} else {
				alert('Можно редактировать одновременно только 1 контакт.');
			}
		});
		return btn_edit;
	},

	generateSaveChangesBtn: function() {
		var btn_save_changes = document.createElement("BUTTON");
		btn_save_changes.classList.add('w3-btn', 'btn-styles');
		btn_save_changes.setAttribute("id", "btn-save-changes");
		btn_save_changes.setAttribute("title", "Сохранить контакт");
		btn_save_changes.innerText = 'Сохранить';
		btn_save_changes.addEventListener('click', function() {
			if (canEdit != 0 && parseInt(this.parentElement.parentElement.getAttribute('id')) == canEdit) {
				var cells = document.getElementById(canEdit).children;

				for (var i = 0; i < cells.length - 1; i++) {
					var input = cells[i].firstElementChild;
					input.readOnly = true;
					input.classList.remove('edit-bg-color');
				}

				var usr = JSON.parse(localStorage.getItem('ab-log-usr'));
				if (usr.contacts.length == 0) {
					var newContact = {
						id: canEdit,
						name: cells[0].firstElementChild.value,
						number: cells[1].firstElementChild.value,
						address: cells[2].firstElementChild.value
					}
					usr.contacts.push(newContact);
				} else {
					for (var i = 0; i < usr.contacts.length; i++) {
						if (usr.contacts[i].id == canEdit) {
							usr.contacts[i].name = cells[0].firstElementChild.value;
							usr.contacts[i].number = cells[1].firstElementChild.value;
							usr.contacts[i].address = cells[2].firstElementChild.value;

							break;
						} else if (i == usr.contacts.length - 1) {
							var newContact = {
								id: canEdit,
								name: cells[0].firstElementChild.value,
								number: cells[1].firstElementChild.value,
								address: cells[2].firstElementChild.value
							}
							usr.contacts.push(newContact);
						}
					}
				}

				localStorage.setItem('ab-log-usr', JSON.stringify(usr));
				canEdit = 0;
			} else {
				alert('Нет данных для сохранения.');
			}
		});
		return btn_save_changes;
	},

	generateDeleteBtn: function() {
		var btn_delete = document.createElement("BUTTON");
		btn_delete.classList.add('w3-btn', 'btn-styles');
		btn_delete.setAttribute("id", "btn-delete");
		btn_delete.setAttribute("title", "Удалить контакт");
		btn_delete.innerText = 'x';
		btn_delete.addEventListener('click', function() {
			if (!confirm('Действительно желаете удалить этот контакт?')) {
				return;
			}

			var delRow = this.parentElement.parentElement;
			var delRowID = parseInt(delRow.getAttribute('id'));
			delRow.style.display = 'none';

			var usr = JSON.parse(localStorage.getItem('ab-log-usr'));
			if (validateUser(usr)) {
				for (var i = 0; i < usr.contacts.length; i++) {
					if (usr.contacts[i].id == delRowID) {
						usr.contacts.splice(i, 1);
						localStorage.setItem('ab-log-usr', JSON.stringify(usr));
						break;
					}
				}
			} else {
				alert('Данные пользователя повреждены! Перезайдите или свяжитесь с администратором.');
			}

			if (delRowID == canEdit) {
				canEdit = 0;
			}
		});
		return btn_delete;
	}
}

createTable();

window.onbeforeunload = function (event) {
	return 'Не сохраненные данные будут утеряны! Покинуть страницу?';
}

document.getElementById('create-contact').addEventListener('click', function() {
	if (canEdit == 0) {
		var tbody = document.getElementById('contacts-table').getElementsByTagName('tbody')[0];
		var row = tbody.insertRow(tbody.rows.length);
		var idRow = -1;
		if (tbody.rows.length == 1) {
			idRow = 1;
		} else {
			idRow = parseInt(tbody.rows[tbody.rows.length - 2].getAttribute('id')) + 1;
		}
		row.setAttribute('id', idRow);
		canEdit = idRow;

		var data = ['~Имя~', '~Номер~', '~Адрес~'];
		for (var j = 0; j < 4; j++) {
			var cell = row.insertCell(j);
			cell.className = "vertical-align";

			if (j < 3) {
				var input = document.createElement("INPUT");
				input.readOnly = false;
				input.classList.add('edit-bg-color');
				input.setAttribute('value', data[j]);
				cell.append(input);
			} else {
				/*cell.append(optionBtns.btn_edit.cloneNode(true));
				cell.append(optionBtns.btn_save_changes.cloneNode(true));
				cell.append(optionBtns.btn_delete.cloneNode(true));*/
				cell.append(optionButtons.generateEditBtn());
				cell.append(optionButtons.generateSaveChangesBtn());
				cell.append(optionButtons.generateDeleteBtn());
			}
		}
	} else {
		alert('Нельзя создавать новые контакты, не закончив редактирование.');
	}
});

document.getElementById('save-all').addEventListener('click', function() {
	if (canEdit == 0) {
		uploadUserData();
	} else {
		alert('Завершите редактирование перед сохранением.');
	}
});

document.getElementById('delete-all').addEventListener('click', function() {
	if (!confirm('ВНИМАНИЕ! Вы действительно хотите удалить ВСЕ контакты?')) {
		return;
	}

	var usr = JSON.parse(localStorage.getItem('ab-log-usr'));
	if (validateUser(usr)) {
		usr.contacts = [];
		localStorage.setItem('ab-log-usr', JSON.stringify(usr));

		var tbody = document.getElementById('contacts-table').getElementsByTagName('tbody')[0];
		tbody.innerHTML = '';
	} else {
		alert('Данные пользователя повреждены! Перезайдите или свяжитесь с администратором.')
	}

	canEdit = 0;
});

// FUNCTIONS:
function checkAuthorizationState() {
	var usr = JSON.parse(localStorage.getItem('ab-log-usr'));
	if (!validateUser(usr)) {
		document.location.href = "login.html";
	}
}

function createTable() {
	// Creation of OPTIONS btns
	//optionBtns = getOptionButtons();

	// Table dedication
	var ctable = document.getElementById('contacts-table');
	var header = ctable.createTHead();
	if (header) {
		var header_data = ['Имя', 'Номер', 'Адрес', 'Опции'];
		var row = header.insertRow(0);

		for (var i = 0; i < header_data.length; i++) {
			var cell = row.insertCell(i);
			cell.innerHTML = '<b>' + header_data[i] + '</b>';
		}
	}

	var usr = JSON.parse(localStorage.getItem('ab-log-usr'));
	if (validateUser(usr)) {
		var contacts_data = usr.contacts;
		var tbody = document.createElement('TBODY');
		ctable.append(tbody);

		for (var i = 0; i < contacts_data.length; i++) {
			var current = contacts_data[i]; // current USER
			var row = tbody.insertRow(i); // create new ROW
			row.setAttribute('id', current.id); // set ROW ID

			var current_values = Object.values(current);
			for (var j = 0; j < current_values.length; j++) {
				var cell = row.insertCell(j);
				cell.className = "vertical-align";

				if (j < current_values.length - 1) {
					var input = document.createElement("INPUT");
					input.setAttribute('readonly', 'true');
					input.setAttribute('value', current_values[j+1]);
					cell.append(input);
				} else {
					/*cell.append(optionBtns.btn_edit.cloneNode(true));
					cell.append(optionBtns.btn_save_changes.cloneNode(true));
					cell.append(optionBtns.btn_delete.cloneNode(true));*/
					cell.append(optionButtons.generateEditBtn());
					cell.append(optionButtons.generateSaveChangesBtn());
					cell.append(optionButtons.generateDeleteBtn());
				}
			}
		}
	} else {
		console.error('createTable: Logging error! Relogin, please.');
	}
}