'use strict';

(function () {
  var MainPinSize = {
    WIDTH: 65,
    HEIGHT: 65,
    SHANK: 22
  };

  var MainPinStartCoord = {
    X: 570,
    Y: 337
  };

  var LimitationOnCoord = {
    X_MIN: 0,
    X_MAX: 1200,
    Y_MIN: 130,
    Y_MAX: 630
  };

  var utilModule = window.util;
  var loadPinsModule = window.loadPins;
  var formElement = utilModule.formElement;
  var mainPinElement = utilModule.mainPinElement;
  var addressFieldElement = formElement.querySelector('#address');

  // Перевод в десятичное число
  var convertToNumber = function (string) {
    return parseInt(string, 10);
  };

  // Заполнение поля адреса
  var showAddress = function () {
    var mainPinX = convertToNumber(mainPinElement.style.left) + MainPinSize.WIDTH / 2;
    var mainPinY = convertToNumber(mainPinElement.style.top) + MainPinSize.HEIGHT + MainPinSize.SHANK;
    addressFieldElement.value = mainPinX + ', ' + mainPinY;
    return addressFieldElement.value;
  };

  var minCoord = {
    x: LimitationOnCoord.X_MIN,
    y: LimitationOnCoord.Y_MIN - MainPinSize.HEIGHT - MainPinSize.SHANK
  };
  var maxCoord = {
    x: LimitationOnCoord.X_MAX - MainPinSize.WIDTH,
    y: LimitationOnCoord.Y_MAX - MainPinSize.HEIGHT - MainPinSize.SHANK
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
    window.pageModes.switchToDynamic();
    loadPinsModule.switchFiltersToInertMode();
    showAddress();
    window.backend.load(loadPinsModule.successHandler, loadPinsModule.errorHandler);
    mainPinElement.removeEventListener('mouseup', mainPinElementClickHandler);
  };

  mainPinElement.addEventListener('mousedown', mouseDownHandler);
  mainPinElement.addEventListener('mouseup', mainPinElementClickHandler);

  // Возвращение главного пина в начальное положение
  var resetPin = function () {
    mainPinElement.style.top = MainPinStartCoord.Y + 'px';
    mainPinElement.style.left = MainPinStartCoord.X + 'px';
  };

  window.mainPin = {
    showAddress: showAddress,
    elementClickHandler: mainPinElementClickHandler,
    reset: resetPin
  };
})();
