'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var mapElement = document.querySelector('.map');
  var formElement = document.querySelector('.ad-form');
  var mainPinElement = document.querySelector('.map__pin--main');

  window.util = {
    mapElement: mapElement,
    formElement: formElement,
    mainPinElement: mainPinElement,

    performActionIfEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

    // Генерация случайного числа от min до max
    getRandomNumber: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },

    // Перетасовка массива (алгоритм Фишера_Йетса)
    shuffleArray: function (array) {
      var newArray = array.slice();
      for (var i = newArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var swap = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = swap;
      }
      return newArray;
    },

    // Генерация числового массива от min до max
    getArray: function (min, max) {
      var array = [];
      for (var i = min; i <= max; i++) {
        array.push(i);
      }
      return array;
    },

    // Генерация массива произвольной длины из исходного массива
    getRandomLengthArray: function (array) {
      var newArray = [];
      var newArrayLength = window.util.getRandomNumber(1, array.length);
      for (var i = 0; i < newArrayLength; i++) {
        newArray[i] = array[i];
      }
      return newArray;
    }
  };
})();
