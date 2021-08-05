"use strict";

document.addEventListener('DOMContentLoaded', function () {

    // Modal

    const popupLinks = document.querySelectorAll('.popup-link');
    const body = document.querySelector('body');
    const lockPadding = document.querySelectorAll(".lock-padding");
    const curentPopup = document.querySelector('.popup');

    let unlock = true;

    const timeout = 800;

    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function (e) {
                popupOpen(curentPopup);
                e.preventDefault();
            });
        }
    }

    const popupCloseIcon = document.querySelectorAll('.popup__close');
    if (popupCloseIcon.length > 0) {
        for (let index = 0; index < popupCloseIcon.length; index++) {
            const el = popupCloseIcon[index];
            el.addEventListener('click', function (e) {
                popupClose(el.closest('.popup'));
                e.preventDefault();
            });
        }
    }

    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
            const popupActive = document.querySelector('.popup.open');
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                bodyLock();
            }
            curentPopup.classList.add('open');
            curentPopup.addEventListener("click", function (e) {
                if (!e.target.closest('.popup__content')) {
                    popupClose(e.target.closest('.popup'));
                }
            });
        }
    }

    function popupClose(popupActive) {
        if (unlock) {
            popupActive.classList.remove('open');
        }
    }

    function bodyLock() {
        const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = lockPaddingValue;
            }
        }
        body.style.paddingRight = lockPaddingValue;
        body.classList.add('lock');

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    function bodyUnLock() {
        setTimeout(function () {
            if (lockPadding.length > 0) {
                for (let index = 0; index < lockPadding.length; index++) {
                    const el = lockPadding[index];
                    el.style.paddingRight = '0px';
                }
            }
            body.style.paddingRight = '0px';
            body.classList.remove('lock');
        }, timeout);

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    document.addEventListener('keydown', function (e) {
        if (e.code === "Escape") {
            const popupActive = document.querySelector('.popup.open');
            popupClose(popupActive);
        }
    });

    (function () {
        // проверяем поддержку
        if (!Element.prototype.closest) {
            // реализуем
            Element.prototype.closest = function (css) {
                var node = this;
                while (node) {
                    if (node.matches(css)) return node;
                    else node = node.parentElement;
                }
                return null;
            };
        }
    })();

    (function () {
        // проверяем поддержку
        if (!Element.prototype.matches) {
            // определяем свойство
            Element.prototype.matches = Element.prototype.matchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector;
        }
    })();

    // Validation Form

	const form = document.getElementById('form');
    const popupMini = document.querySelector('.popup__mini');
    const popupAnswer = document.querySelector('.popup__answer');
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		let formData = new FormData(form);
		// formData.append('image', formImage.files[0]);

		if (error === 0) {
			form.classList.add('sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				// alert(result.message);
                popupAnswer.innerHTML = result;
                popupMini.classList.add('open');
				// formPreview.innerHTML = '';
				form.reset();
				form.classList.remove('sending');
			} else {
				alert("Ошибка");
				form.classList.remove('sending');
			}
		} else {
			alert('Заполните обязательные поля');
		}

	}

	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('.req');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains('email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	}

	function formAddError(input) {
		input.parentElement.classList.add('error');
		input.classList.add('error');
	}

	function formRemoveError(input) {
		input.parentElement.classList.remove('error');
		input.classList.remove('error');
	}

	//Функция теста email
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}

	// //Получаем инпут file в переменную
	// const formImage = document.getElementById('formImage');
	// //Получаем див для превью в переменную
	// const formPreview = document.getElementById('formPreview');

	// //Слушаем изменения в инпуте file
	// formImage.addEventListener('change', () => {
	// 	uploadFile(formImage.files[0]);
	// });

	// function uploadFile(file) {
	// 	// провераяем тип файла
	// 	if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
	// 		alert('Разрешены только изображения.');
	// 		formImage.value = '';
	// 		return;
	// 	}
	// 	// проверим размер файла (<2 Мб)
	// 	if (file.size > 2 * 1024 * 1024) {
	// 		alert('Файл должен быть менее 2 МБ.');
	// 		return;
	// 	}

	// 	var reader = new FileReader();
	// 	reader.onload = function (e) {
	// 		formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
	// 	};
	// 	reader.onerror = function (e) {
	// 		alert('Ошибка');
	// 	};
	// 	reader.readAsDataURL(file);
	// }
});
