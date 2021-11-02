"use strict";

document.addEventListener('DOMContentLoaded', function () {

    // Modal

    const popupLinks = document.querySelectorAll('.popup-link');
    const body = document.querySelector('body');
    const lockPadding = document.querySelectorAll(".lock-padding");
    const curentPopup = document.querySelector('.popup');
    const popupActive = document.querySelector('.popup.open');

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

    function popupCloseIcon() {
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
    }

    popupCloseIcon();

    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
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

    function popupClose(popupActive, doUnlock = true) {
        if (unlock) {
            popupActive.classList.remove('open');
            if (doUnlock) {
                bodyUnLock();
            }
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

    // Send & Validation Form

	const form = document.getElementById('form');
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		let formData = new FormData(form);

		if (error === 0) {
            document.querySelector('.error_message').remove();
			form.classList.add('sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				form.reset();
				form.classList.remove('sending');
                showResponseModal(result.message);
			} else {
                form.classList.remove('sending');
                showResponseModal('Упс, что-то пошло не так на сервере!');
			}
		} else {
            requiredFields('Заполните обязательные поля');
		}

	}

    function requiredFields(message) {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error_message');
        errorMessage.innerHTML = message;
        document.querySelector('.popup__body').append(errorMessage);
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

    function showResponseModal(message) {
        const prevModalDialog = document.querySelector('.popup__body');

        prevModalDialog.style.display = 'none';
        popupOpen(curentPopup);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('popup__body');
        thanksModal.innerHTML = `
            <div class="modal__title">${message}</div>
        `;
        document.querySelector('.popup__content').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.style.display = '';
        }, 4000);
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
});
