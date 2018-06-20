'use strict';

(function () {
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

  // Добавление рамки невалидным полям
  var fieldInvalidHandler = function (evt) {
    var target = evt.target;
    target.classList.add('invalid');
    checkValidity();
  };

  // Проверка, валидно ли поле. Если да, то убирает рамку
  var checkValidity = function () {
    var checkedField = formElement.querySelector('.invalid');
    if (checkedField.validity.valid) {
      checkedField.classList.remove('invalid');
    }
  };

  // Изменение значения минимальной цены и плейсхолдера в зависимости от типа жилья
  var changePriceValue = function () {
    if (selectTypeElement.value === 'bungalo') {
      priceElement.min = '0';
      priceElement.placeholder = '0';
    } else if (selectTypeElement.value === 'flat') {
      priceElement.min = '1000';
      priceElement.placeholder = '1000';
    } else if (selectTypeElement.value === 'house') {
      priceElement.min = '5000';
      priceElement.placeholder = '5000';
    } else {
      priceElement.min = '10000';
      priceElement.placeholder = '10000';
    }
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
    checkValidity();
  });

  roomNumberElement.addEventListener('change', function () {
    synchronizeRoomsAndGuests();
    checkValidity();
  });

  // Синхронизация времени заезда и выезда
  var synchronizeTimeIn = function () {
    timeOutElement.value = timeInElement.value;
  };

  var synchronizeTimeOut = function () {
    timeInElement.value = timeOutElement.value;
  };

  titleElement.addEventListener('change', function () {
    checkValidity();
  });

  selectTypeElement.addEventListener('change', function () {
    changePriceValue();
    checkValidity();
  });

  priceElement.addEventListener('change', function () {
    checkValidity();
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
    window.pageModes.switchToInertMode();
    window.pins.removePinsElements();
    var popupElement = mapElement.querySelector('.map__card');
    if (popupElement) {
      window.popup.closePopup();
    }
    formElement.reset();
    window.mainPin.resetPin();
    window.mainPin.showAddress();
  };

  resetElement.addEventListener('click', function () {
    pageReset();
    mainPinElement.addEventListener('mouseup', window.mainPin.mainPinElementClickHandler);
  });
})();
