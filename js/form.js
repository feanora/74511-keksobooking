'use strict';

(function () {
  var utilModule = window.util;
  var mainPinModule = window.mainPin;
  var imagesModule = window.images;
  var formElement = utilModule.formElement;
  var mainPinElement = utilModule.mainPinElement;
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
    priceElement.min = utilModule.housingTypeMap[selectTypeElement.value].PRICE;
    priceElement.placeholder = utilModule.housingTypeMap[selectTypeElement.value].PLACEHOLDER;
  };

  // Синхронизация количества комнат и количества гостей
  var synchronizeRoomsAndGuests = function () {
    var rooms = roomNumberElement.value;
    var guests = guestNumberElement.value;
    var message;
    if ((rooms === '1') && (guests !== '1')) {
      message = 'Одна комната только для одного гостя';
    } else if ((rooms === '2') && (guests !== '1') && (guests !== '2')) {
      message = 'Две комнаты только для одного или двоих гостей';
    } else if ((rooms === '3') && (guests === '0')) {
      message = 'Только для гостей';
    } else if ((rooms === '100') && (guests !== '0')) {
      message = 'Сто комнат не для гостей';
    } else {
      message = '';
    }
    guestNumberElement.setCustomValidity(message);
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
    window.pins.remove();
    utilModule.isPinActive = false;
    window.popup.closeIfOpen();
    formElement.reset();
    mainPinModule.reset();
    imagesModule.avatarReset();
    imagesModule.resetHousingPhoto();
    mainPinModule.showAddress();
  };

  resetElement.addEventListener('click', function () {
    pageReset();
    mainPinElement.addEventListener('mouseup', mainPinModule.elementClickHandler);
  });

  // Закрытие сообщения об успешной отправке формы
  var closeSuccessMessage = function () {
    successMessageElement.classList.add('hidden');
    document.removeEventListener('keydown', successMessageEscPressHandler);
    document.removeEventListener('click', successMessageClickHandler);
  };

  var successMessageEscPressHandler = function (evt) {
    utilModule.performActionIfEscEvent(evt, closeSuccessMessage);
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
    utilModule.performActionIfEscEvent(evt, closeErrorMessage);
  };

  // Обработчик успешной отправки формы
  var loadHandler = function () {
    pageReset();
    mainPinElement.addEventListener('mouseup', mainPinModule.elementClickHandler);
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
