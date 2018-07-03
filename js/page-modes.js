'use strict';

(function () {
  var utilModule = window.util;
  var mapElement = utilModule.mapElement;
  var formElement = utilModule.formElement;
  var fieldsetElements = formElement.querySelectorAll('fieldset');

  // Переключение в неактивный режим
  var switchToInertMode = function () {
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    utilModule.toggleDisabledFields(fieldsetElements, true);
  };

  // Переключение в активный режим
  var switchToDynamicMode = function () {
    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');
    utilModule.toggleDisabledFields(fieldsetElements, false);
  };

  window.pageModes = {
    switchToInert: switchToInertMode,
    switchToDynamic: switchToDynamicMode
  };
})();
