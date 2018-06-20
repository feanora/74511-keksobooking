'use strict';

(function () {
  var mapElement = window.util.mapElement;
  var formElement = window.util.formElement;
  var fieldsetElements = formElement.querySelectorAll('fieldset');

  // Добавление/удаление у полей формы атрибута disabled
  var toggleDisabledFields = function (value) {
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = value;
    }
  };

  // Переключение в неактивный режим
  var switchToInertMode = function () {
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    toggleDisabledFields(true);
  };

  // Переключение в активный режим
  var switchToDynamicMode = function () {
    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');
    toggleDisabledFields(false);
  };

  window.pageModes = {
    switchToInertMode: switchToInertMode,
    switchToDynamicMode: switchToDynamicMode
  };
})();
