document.addEventListener("DOMContentLoaded", () => {

	const socials = document.querySelector('.fixed--social__button');
	if (socials) {
		socials.addEventListener('click', (e) => {
			const open = socials.querySelector('.fixed--social__open');
			const close = socials.querySelector('.fixed--social__close');
			const wrapper = document.querySelector('.fixed--social__wrapper');
			open.classList.toggle('hidden');
			close.classList.toggle('active');
			wrapper.classList.toggle('active');
		});
	}

	const burgerMenu = document.querySelector('.burger');
	const headermenu = document.querySelector('.header--mob');
	const menu = document.querySelector('.header--mob .menu');
	const menuLink = document.querySelectorAll('.header--mob .menu li a');
	burgerMenu.addEventListener('click', () => {
		menu.classList.toggle('active');
		headermenu.classList.toggle('open')
		burgerMenu.classList.toggle('active');
		menuLink.forEach( li => {
			li.addEventListener('click', (e) => {
				burgerMenu.classList.remove('active');
				headermenu.classList.remove('open')
				menu.classList.remove('active');
				menu.style.maxHeight = null;
			});
		});
	});

	const select1 = new ItcCustomSelect('#select-1');
	const select2 = new ItcCustomSelect('#select-2');
	const select3 = new ItcCustomSelect('#select-3');
	document.querySelectorAll('.itc-select').forEach(select => {
		const button = select.querySelector('.itc-select__toggle');
		const options = select.querySelectorAll('.itc-select__option');
		const input = select.querySelector('input[type="hidden"]');
		
		options.forEach(option => {
			option.addEventListener('click', () => {
				const value = option.getAttribute('data-value');
				const text = option.textContent;

				// Записываем значение в скрытый input
				input.value = value;

				// Обновляем текст кнопки
				button.textContent = text;
			});
		});
	});

	// Получаем все элементы для модальных окон
	const modalOpenButtons = document.querySelectorAll('[data-modal-open]'); // Кнопки для открытия модалок
	const modalCloseButtons = document.querySelectorAll('.modal--close'); // Кнопки закрытия
	const modals = document.querySelectorAll('.modal, .marketPlace'); // Все модальные окна
	const header = document.querySelector('.header');
	const socialsWrapper = document.querySelector('.fixed--social');
	// Стек для хранения открытых модальных окон
	const modalStack = [];
	let currentZIndex = 100; // Начальный z-index для модалок
	// Функция для вычисления ширины скроллбара
	function getScrollbarWidth() {
		return window.innerWidth - document.documentElement.clientWidth;
	}
	// Функция для установки z-index последней открытой модалки
	function updateModalZIndex(modal) {
		currentZIndex++;
		modal.style.zIndex = currentZIndex;
	}
	// Функция для открытия модального окна
	function openModal(modal) {
		// Если модалка уже открыта, убираем её из стека
		const modalIndex = modalStack.indexOf(modal);
		if (modalIndex > -1) {
			modalStack.splice(modalIndex, 1); // Удаляем модалку из стека
		}

		// Добавляем модалку в стек и активируем
		modal.classList.add('active');
		modalStack.push(modal);

		updateModalZIndex(modal); // Обновляем z-index

		if (modalStack.length === 1) { // Устанавливаем padding-right только при открытии первой модалки
			const scrollbarWidth = getScrollbarWidth();
			document.body.style.paddingRight = `${scrollbarWidth}px`;
			header.style.paddingRight = `${scrollbarWidth}px`;
			socialsWrapper.style.marginRight = `${scrollbarWidth}px`;
			document.documentElement.classList.add('hidden');
		}
	}
	// Функция для закрытия верхнего модального окна
	function closeTopModal() {
		if (modalStack.length > 0) {
			const modal = modalStack.pop(); // Берём верхнее модальное окно из стека
			modal.classList.remove('active');
			modal.style.zIndex = ''; // Сбрасываем z-index
		}

		if (modalStack.length === 0) { // Сбрасываем padding-right только при закрытии последней модалки
			document.body.style.paddingRight = '';
			header.style.paddingRight = '';
			socialsWrapper.style.marginRight = '';
			document.documentElement.classList.remove('hidden');
			currentZIndex = 100; // Сбрасываем z-index к исходному значению
		}
	}
	// Обработчик для открытия модальных окон
	modalOpenButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			const modalSelector = button.dataset.modalOpen;
			const modal = document.querySelector(modalSelector);
			if (modal) openModal(modal);
		});
	});
	// Обработчик для закрытия по кнопкам "modal--close"
	modalCloseButtons.forEach(closeButton => {
		closeButton.addEventListener('click', (e) => {
			e.stopPropagation();
			closeTopModal(); // Закрываем только верхнее модальное окно
		});
	});
	// Обработчик для закрытия при клике вне модального окна
	document.addEventListener('click', (e) => {
		const target = e.target;
		if (!target.closest('.modal--wrapper') && !target.closest('[data-modal-open]')) {
			closeTopModal(); // Закрываем верхнюю модалку
		}
	});
	// Исключаем закрытие при клике внутри содержимого модалки
	document.querySelectorAll('.modal--wrapper').forEach(wrapper => {
		wrapper.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	});

	// Находим все кнопки внутри .main--calculate__buttons и элементы dimensions
	const buttons = document.querySelectorAll('.main--calculate__buttons .button');
	const dimensions = document.querySelectorAll('.dimensions--block');
	// Функция для удаления класса active у всех элементов
	function removeActiveClass(elements) {
		elements.forEach(element => {
			element.classList.remove('active');
		});
	}
	// Функция для сброса параметров внутри блока
	function resetBlockParams(block) {
		const inputs = block.querySelectorAll('input, textarea, select');
		inputs.forEach(input => {
			if (input.tagName === 'INPUT' && (input.type === 'checkbox' || input.type === 'radio')) {
				input.checked = false; // Сбрасываем состояние чекбоксов и радиокнопок
			} else if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
				input.value = ''; // Очищаем текстовые поля
			} else if (input.tagName === 'SELECT') {
				input.selectedIndex = 0; // Сбрасываем select на первый элемент
			}
		});

		// Сбрасываем кастомный select (если есть)
		const customSelects = block.querySelectorAll('.itc-select');
		customSelects.forEach(customSelect => {
			const button = customSelect.querySelector('.itc-select__toggle');
			const options = customSelect.querySelectorAll('.itc-select__option');
			
			// Сбрасываем выбранное значение в кнопке
			button.textContent = 'Введите вес';
			
			// Сбрасываем активный класс у всех опций
			options.forEach(option => {
					option.classList.remove('active');
			});
		});
	}
	// Добавляем обработчики событий на кнопки
	buttons.forEach((button, index) => {
		button.addEventListener('click', () => {
			// Удаляем класс active у всех кнопок и добавляем его к нажатой кнопке
			removeActiveClass(buttons);
			button.classList.add('active');

			// Обрабатываем блоки dimensions
			dimensions.forEach((dimension, i) => {
				if (i !== index) {
					resetBlockParams(dimension); // Сбрасываем параметры неактивного блока
					dimension.classList.remove('active'); // Убираем класс active с неактивного блока
				}
			});

			// Добавляем класс active к соответствующему элементу dimensions
			if (dimensions[index]) {
				dimensions[index].classList.add('active');
			}
		});
	});

	let eventCalllback = function(e) {
		let el = e.target,
			clearVal = el.dataset.phoneClear,
			pattern = el.dataset.phonePattern,
			matrix_def = "+7 (___) ___-__-__",
			matrix = pattern ? pattern : matrix_def,
			i = 0,
			def = matrix.replace(/\D/g, ""),
			val = e.target.value.replace(/\D/g, "");
		if (clearVal !== 'false' && e.type === 'blur') {
			if (val.length < matrix.match(/([\_\d])/g).length) {
				e.target.value = '';
				return;
			}
		}
		if (def.length >= val.length) val = def;
		e.target.value = matrix.replace(/./g, function(a) {
			return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
		});
	}
	let phone_inputs = document.querySelectorAll('.phone-number');
	for (let elem of phone_inputs) {
		for (let ev of ['input', 'blur', 'focus']) {
			elem.addEventListener(ev, eventCalllback);
		}
	}
	
	const calculateButton = document.getElementById("calculateButton");
	const mainRight = document.querySelector(".main--calculate__right");

	calculateButton.addEventListener("click", function () {
		mainRight.classList.add("active");
	});

	const swiper = new Swiper('.main--reviews__right', {
		loop: false,
		spaceBetween: 20,
		initialSlide: 0,
		slidesPerView: 'auto',
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		// breakpoints: {
		// 	1400: {
		// 		slidesPerView: 1, // Показать 3 слайда от 1400px и выше
		// 		slidesPerGroup: 1, // Листать по 3 слайда
		// 	},
		// 	768: {
		// 		slidesPerView: 1, // Показать 2 слайда от 768px
		// 		slidesPerGroup: 1, // Листать по 2 слайда
		// 	},
		// 	480: {
		// 		slidesPerView: 1, // Показать 1 слайд от 480px
		// 		slidesPerGroup: 1, // Листать по 1 слайду
		// 	},
		// 	0: {
		// 		slidesPerView: 1, // Показать 1 слайд от 480px
		// 		slidesPerGroup: 1, // Листать по 1 слайду
		// 	},
		// },
	});

	const smoothHeight = (itemSelector, buttonSelector, contentSelector) => {
		const items = document.querySelectorAll(itemSelector);

		if (!items.length) return;

		// Добавляем класс 'active', 'data-open="true"' и устанавливаем max-height первому элементу
		const firstItem = items[0];
		const firstButton = firstItem.querySelector(buttonSelector);
		const firstContent = firstItem.querySelector(contentSelector);
		firstItem.classList.add('active');
		firstButton.classList.add('active');
		firstItem.dataset.open = 'true';
		firstContent.style.maxHeight = `${firstContent.scrollHeight}px`;

		items.forEach(el => {
			const button = el.querySelector(buttonSelector);
			const content = el.querySelector(contentSelector);

			button.addEventListener('click', () => {
				if (el.dataset.open !== 'true') {
					// Удаляем параметры для всех элементов, кроме текущего
					items.forEach(item => {
						if (item !== el) {
							item.dataset.open = 'false';
							item.classList.remove('active');
							item.querySelector(buttonSelector).classList.remove('active');
							item.querySelector(contentSelector).style.maxHeight = '';
						}
					});
					el.dataset.open = 'true';
					button.classList.add('active');
					el.classList.add('active');
					content.style.maxHeight = `${content.scrollHeight}px`;
				} else {
					el.dataset.open = 'false';
					el.classList.remove('active');
					button.classList.remove('active');
					content.style.maxHeight = '';
				}
			})

			const onResize = () => {
				if (el.dataset.open === 'true') {
					if (parseInt(content.style.maxHeight) !== content.scrollHeight) {
						content.style.maxHeight = `${content.scrollHeight}px`;
					}
				}
			}

			window.addEventListener('resize', onResize);
		});
	}
	smoothHeight('.main--faq__item', '.main--faq__item--button', '.main--faq__item--answer');

	document.querySelectorAll('input[name^="fio"]').forEach(input => {
		input.addEventListener('input', function () {
			// Убираем любые ссылки (http, https, www, и домены)
			this.value = this.value
				.replace(/https?:\/\/[^\s]+/gi, '') // Убираем http:// и https:// ссылки
				.replace(/www\.[^\s]+/gi, '') // Убираем ссылки, начинающиеся с www.
				.replace(/[\w-]+\.[a-z]{2,}/gi, '') // Убираем доменные имена, например mail.ru, google.com и т.д.
				.replace(/[^a-zа-яё\s\-]/gi, '') // Оставляем только буквы, пробелы и дефисы
				.replace(/-{2,}/g, '-') // Убираем повторяющиеся дефисы
				.replace(/\s{2,}/g, ' '); // Заменяем несколько пробелов подряд на один

			// Ограничиваем длину ввода (например, 100 символов)
			if (this.value.length > 100) {
				this.value = this.value.substring(0, 100);
			}
		});
	});

});