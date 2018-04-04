// NOTES:
// POST: http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

// ON LOAD:
window.onload = checkAuthorizationState();

initData();

///////////////////////////////////////////////////////////////////////////////////////////
// Get the modal
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
    modal.style.display = "none";
}
///////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS:
function checkAuthorizationState() {
  var usr = JSON.parse(localStorage.getItem('ab-log-usr'));
  if (!validateUser(usr)) {
    document.location.href = "login.html";
  }
}

function initData() {
	var usr = JSON.parse(localStorage.getItem('ab-log-usr'));
	if (validateUser(usr)) {
    usr.avatar = rebuildBase64Avatar(usr.avatar);
    document.getElementById('user-nickname').innerText = usr.nickname;
		document.getElementById('user-number').innerText = usr.contacts.length;
		if (usr.avatar != '')
			document.getElementById('myImg').src = usr.avatar;
		else
			document.getElementById('myImg').src = 'src/no-avatar.png';
	}

	document.getElementById('btn-logout').addEventListener('click', function() {
    //uploadUserData();
		localStorage.removeItem('ab-log-usr');
		document.location.href="index.html";
	});

  var uploader = document.getElementById('uploader-avatar');
  uploader.addEventListener('change', function(e) {
      var files = uploader.files;
      var name = files[0].name;
      var ext = files[0]['name'].substring(files[0]['name'].lastIndexOf('.') + 1).toLowerCase();
       
      if (files && files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
      	var img = window.URL.createObjectURL(files[0]);
        document.getElementById('myImg').src = img;
        if (validateUser(usr)) {
        	saveBase64Image(files[0], usr);
        } else {
          alert('uploader: Ошибка записи данных или данные повреждены! Перезайдите в аккаунт и повторите попытку.')
        }
      } else {
          alert('uploader: Некорректный формат - ' + ext + ' - или ошибка загрузки данных! Повторите загрузку снова.')
      }
  });
}

function saveBase64Image(file, usr) {
   	var reader = new FileReader();
   	reader.readAsDataURL(file);
   	reader.onload = function () {
   		// TODO: AJAX on save
   		console.log(reader.result);
   		usr.avatar = reader.result;
      localStorage.setItem('ab-log-usr', JSON.stringify(usr));
      uploadUserData();
   	};
   	reader.onerror = function (error) {
   		console.log('Error: ', error);
   	};
}