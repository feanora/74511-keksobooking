'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var housingTypeMap = {
    'bungalo': {
      TYPE: 'Бунгало',
      PRICE: '0',
      PLACEHOLDER: '0'
    },
    'flat': {
      TYPE: 'Квартира',
      PRICE: '1000',
      PLACEHOLDER: '1000'
    },
    'house': {
      TYPE: 'Дом',
      PRICE: '5000',
      PLACEHOLDER: '5000'
    },
    'palace': {
      TYPE: 'Дворец',
      PRICE: '10000',
      PLACEHOLDER: '10000'
    }
  };

  var mapElement = document.querySelector('.map');
  var formElement = document.querySelector('.ad-form');
  var mainPinElement = document.querySelector('.map__pin--main');
  var isPinActive;

  var performActionIfEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  // Генерация случайного числа от min до max
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  // Перетасовка массива (алгоритм Фишера_Йетса)
  var shuffleArray = function (array) {
    var newArray = array.slice();
    for (var i = newArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = swap;
    }
    return newArray;
  };

  // Удаление потомков
  var deleteChildElement = function (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    return parent;
  };

  // Добавление/удаление у полей формы атрибута disabled
  var toggleDisabledFields = function (elements, value) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = value;
    }
  };

  window.util = {
    mapElement: mapElement,
    formElement: formElement,
    mainPinElement: mainPinElement,
    isPinActive: isPinActive,
    housingTypeMap: housingTypeMap,
    performActionIfEscEvent: performActionIfEscEvent,
    getRandomNumber: getRandomNumber,
    shuffleArray: shuffleArray,
    deleteChildElement: deleteChildElement,
    toggleDisabledFields: toggleDisabledFields
  };
})();
