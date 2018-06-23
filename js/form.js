'use strict';

(function () {
  var PRICE_DEPENDENCIES = {
    'bungalo': {
      price: '0',
      placeholder: '0'
    },
    'flat': {
      price: '1000',
      placeholder: '1000'
    },
    'house': {
      price: '5000',
      placeholder: '5000'
    },
    'palace': {
      price: '10000',
      placeholder: '10000'
    }
  };

  var mapElement = window.util.mapElement;
  var formElement = window.util.formElement;
  var mainPinElement = window.util.mainPinElement;
  var titleElement = formElement.querySelector('#title');
  var selectTypeElement = formElement.querySelector('#type');
  var priceElement = formElement.querySelector('#price');
  var timeInElement = formElement.querySelector('#timein');
  var timeOutElement = formElement.querySelector('#timeout');
  var roomNumberElement = formElement.querySelector('#room_number');
  var guestNumberElement = formElement.querySelector('#capacity');
  var resetElement = formElement.querySelector('.ad-form__reset');
  var successMessageElement = document.querySelector('.success');
  var errorMessageElement = document.querySelector('.error');
  var errorMessageInsideElement = document.querySelector('.error__message');
  var closeErrorMessageElement = errorMessageElement.querySelector('.popup__close');

  // Добавление рамки невалидным полям
  var fieldInvalidHandler = function (evt) {
    var target = evt.target;
    target.classList.add('invalid');
    checkValidity(target);
  };

  // Проверка, валидно ли поле. Если да, то убирает рамку
  var checkValidity = function (checkedField) {
    if (checkedField.validity.valid) {
      checkedField.classList.remove('invalid');
    }
  };

  // Изменение значения минимальной цены и плейсхолдера в зависимости от типа жилья
  var changePriceValue = function () {
    priceElement.min = PRICE_DEPENDENCIES[selectTypeElement.value].price;
    priceElement.placeholder = PRICE_DEPENDENCIES[selectTypeElement.value].placeholder;
  };

  // Синхронизация количества комнат и количества гостей
  var synchronizeRoomsAndGuests = function () {
    if ((roomNumberElement.value === '1') && (guestNumberElement.value !== '1')) {
      guestNumberElement.setCustomValidity('Одна комната только для одного гостя');
    } else if ((roomNumberElement.value === '2') && (guestNumberElement.value !== '1') && (guestNumberElement.value !== '2')) {
      guestNumberElement.setCustomValidity('Две комнаты только для одного или двоих гостей');
    } else if ((roomNumberElement.value === '3') && (guestNumberElement.value === '0')) {
      guestNumberElement.setCustomValidity('Только для гостей');
    } else if ((roomNumberElement.value === '100') && (guestNumberElement.value !== '0')) {
      guestNumberElement.setCustomValidity('Сто комнат не для гостей');
    } else {
      guestNumberElement.setCustomValidity('');
    }
  };

  guestNumberElement.addEventListener('change', function () {
    synchronizeRoomsAndGuests();
    checkValidity(guestNumberElement);
  });

  roomNumberElement.addEventListener('change', function () {
    synchronizeRoomsAndGuests();
    checkValidity(roomNumberElement);
  });

  // Синхронизация времени заезда и выезда
  var synchronizeTimeIn = function () {
    timeOutElement.value = timeInElement.value;
  };

  var synchronizeTimeOut = function () {
    timeInElement.value = timeOutElement.value;
  };

  titleElement.addEventListener('change', function () {
    checkValidity(titleElement);
  });

  selectTypeElement.addEventListener('change', function () {
    changePriceValue();
    checkValidity(selectTypeElement);
  });

  priceElement.addEventListener('change', function () {
    checkValidity(priceElement);
  });

  timeInElement.addEventListener('change', function () {
    synchronizeTimeIn();
  });

  timeOutElement.addEventListener('change', function () {
    synchronizeTimeOut();
  });

  formElement.addEventListener('invalid', fieldInvalidHandler, true);

  // Сброс страницы в начальное состояние
  var pageReset = function () {
    window.pageModes.switchToInert();
    window.pins.removeElements();
    var popupElement = mapElement.querySelector('.map__card');
    if (popupElement) {
      window.popup.close();
    }
    formElement.reset();
    window.mainPin.reset();
    window.mainPin.showAddress();
  };

  resetElement.addEventListener('click', function () {
    pageReset();
    mainPinElement.addEventListener('mouseup', window.mainPin.elementClickHandler);
  });

  // Закрытие сообщения об успешной отправке формы
  var closeSuccessMessage = function () {
    successMessageElement.classList.add('hidden');
    document.removeEventListener(successMessageEscPressHandler);
    document.removeEventListener('click', successMessageClickHandler);
  };

  var successMessageEscPressHandler = function (evt) {
    window.util.performActionIfEscEvent(evt, closeSuccessMessage);
  };

  var successMessageClickHandler = function () {
    closeSuccessMessage();
  };

  // Закрытие сообщения об ошибке
  var closeErrorMessage = function () {
    errorMessageElement.classList.add('hidden');
    closeErrorMessageElement.removeEventListener('click', closeErrorMessageClickHandler);
    document.removeEventListener('keydown', closeErrorMessageEscPressHandler);
  };

  var closeErrorMessageClickHandler = function () {
    closeErrorMessage();
  };

  var closeErrorMessageEscPressHandler = function (evt) {
    window.util.performActionIfEscEvent(evt, closeErrorMessage);
  };

  // Обработчик успешной отправки формы
  var loadHandler = function () {
    pageReset();
    mainPinElement.addEventListener('mouseup', window.mainPin.elementClickHandler);
    successMessageElement.classList.remove('hidden');
    document.addEventListener('click', successMessageClickHandler);
    document.addEventListener('keydown', successMessageEscPressHandler);
  };

  // Обработчик ошибки
  var errorHandler = function (errorMessage) {
    errorMessageElement.classList.remove('hidden');
    errorMessageInsideElement.textContent = errorMessage + ' Пожалуйста, попробуйте повторить позже';
    closeErrorMessageElement.addEventListener('click', closeErrorMessageClickHandler);
    document.addEventListener('keydown', closeErrorMessageEscPressHandler);
  };

  // Обработчик отправки формы
  var formElementSubmitHandler = function (evt) {
    window.backend.save(new FormData(formElement), loadHandler, errorHandler);
    evt.preventDefault();
  };

  formElement.addEventListener('submit', formElementSubmitHandler);
})();
