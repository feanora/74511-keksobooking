'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65; // из css
  var MAIN_PIN_HEIGHT = 65; // из css
  var MAIN_PIN_SHANK = 22; // из css
  var MAIN_PIN_X_START = 570; // из разметки
  var MAIN_PIN_Y_START = 375; // из разметки
  var X_MIN = 0;
  var X_MAX = 1200;
  var Y_MIN = 130;
  var Y_MAX = 630;

  var formElement = window.util.formElement;
  var mainPinElement = window.util.mainPinElement;
  var addressFieldElement = formElement.querySelector('#address');

  // Перевод в десятичное число
  var convertToNumber = function (string) {
    return parseInt(string, 10);
  };

  // Заполнение поля адреса
  var showAddress = function () {
    var mainPinX = convertToNumber(mainPinElement.style.left) + MAIN_PIN_WIDTH / 2;
    var mainPinY = convertToNumber(mainPinElement.style.top) + MAIN_PIN_HEIGHT + MAIN_PIN_SHANK;
    addressFieldElement.value = mainPinX + ', ' + mainPinY;
    return addressFieldElement.value;
  };

  var minCoord = {
    x: X_MIN,
    y: Y_MIN - MAIN_PIN_HEIGHT - MAIN_PIN_SHANK
  };
  var maxCoord = {
    x: X_MAX - MAIN_PIN_WIDTH,
    y: Y_MAX - MAIN_PIN_HEIGHT - MAIN_PIN_SHANK
  };

  // Расчет положения метки
  var calculatePinPosition = function (offset, shift, min, max) {
    var pinPosition = offset - shift;
    if (pinPosition <= min) {
      pinPosition = min;
    } else if (pinPosition >= max) {
      pinPosition = max;
    } else {
      pinPosition = pinPosition;
    }
    return pinPosition;
  };

  // Обработчик нажатия на метку с перетаскиванием
  var mouseDownHandler = function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      mainPinElement.style.top = calculatePinPosition(mainPinElement.offsetTop, shift.y, minCoord.y, maxCoord.y) + 'px';
      mainPinElement.style.left = calculatePinPosition(mainPinElement.offsetLeft, shift.x, minCoord.x, maxCoord.x) + 'px';
      showAddress();
    };
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  // Обработчик клика на метку (без перемещения)
  var mainPinElementClickHandler = function () {
    window.pageModes.switchToDynamicMode();
    showAddress();
    window.pins.renderPinsElements();
    mainPinElement.removeEventListener('mouseup', mainPinElementClickHandler);
  };

  mainPinElement.addEventListener('mousedown', mouseDownHandler);
  mainPinElement.addEventListener('mouseup', mainPinElementClickHandler);

  // Возвращение главного пина в начальное положение
  var resetPin = function () {
    mainPinElement.style.top = MAIN_PIN_Y_START + 'px';
    mainPinElement.style.left = MAIN_PIN_X_START + 'px';
  };

  window.mainPin = {
    showAddress: showAddress,
    mainPinElementClickHandler: mainPinElementClickHandler,
    resetPin: resetPin
  };
})();
