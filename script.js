"use strict";
//c 45 minute!
document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("form");
	form.addEventListener("submit", formSend);

	async function formSend(event) {
		event.preventDefault();

		let error = formValidate(form);

		//Отправка формы!
		let formData = new FormData(form); //Вытягивает данные полей
		formData.append("image", formImage.files[0]); //..+инфа изображение

		//Если форма прошла валидацию, то:
		if (error === 0) {
			form.classList.add("_sending"); //Показываем юзеру, что отправка началась...

			let response = await fetch("sendmail.php", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				let result = await response.json();
				alert(result.message);
				formPreview.innerHTML = ""; //Очистка полей форм
				form.reset(); //Очистка полей форм
				form.classList.remove("_sending");
			} else {
				alert("Error response!");
				form.classList.remove("_sending");
			}
		} else {
			console.log(error);
			alert("Zapolni!");
		}
	}

	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll("._req");

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains("_email")) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else if (
				input.getAttribute("type") === "checkbox" &&
				input.checked === false
			) {
				formAddError(input);
				error++;
			} else {
				if (input.value === "") {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	}

	function formAddError(input) {
		input.parentElement.classList.add("_error");
		input.classList.add("_error");
	}

	function formRemoveError(input) {
		input.parentElement.classList.remove("_error");
		input.classList.remove("_error");
	}

	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}

	//! Вывод миниатюр
	const formImage = document.getElementById("formImage");
	const formPreview = document.getElementById("formPreview");

	formImage.addEventListener("change", () => {
		uploadFile(formImage.files[0]);
	});

	//Проверки
	function uploadFile(file) {
		if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
			alert("Images only approved!");
			formImage.value = "";
			return;
		}

		if (file.size > 2 * 1024 * 1024) {
			alert("File must be no more 2MB");
		}

		var reader = new FileReader();
		reader.onload = function (e) {
			formPreview.innerHTML = `<img src="${e.target.result}" alt="foto">`;
		};
		reader.onerror = function (e) {
			alert("Error!");
		};
		reader.readAsDataURL(file);
	}
});
