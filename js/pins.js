'use strict';

(function () {
  var PinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var PIN_NUMBER = 5;
  var utilModule = window.util;

  var pinTemplateElement = document.querySelector('#pin__template').content.querySelector('.map__pin');
  var pinsLocationElement = document.querySelector('.map__pins');
  utilModule.isPinActive = false;

  // Удаление у метки класса active, если он есть
  var removeActiveClass = function () {
    if (utilModule.isPinActive) {
      var pinAvctivElement = pinsLocationElement.querySelector('.map__pin--active');
      pinAvctivElement.classList.remove('map__pin--active');
      utilModule.isPinActive = false;
    }
  };

  // Создание DOM-элемента метки на карте
  var initPinElement = function (pin) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinAvatarElement = pinElement.querySelector('img');
    pinElement.style.left = pin.location.x - (PinSize.WIDTH / 2) + 'px';
    pinElement.style.top = pin.location.y - PinSize.HEIGHT + 'px';
    pinAvatarElement.src = pin.author.avatar;
    pinAvatarElement.alt = pin.offer.title;
    pinElement.addEventListener('click', function () {
      removeActiveClass();
      window.popup.renderElement(pin);
      pinElement.classList.add('map__pin--active');
      utilModule.isPinActive = true;
    });
    return pinElement;
  };

  var renderPinsElements = function (ads) {
    var arrayLength = ads.length > PIN_NUMBER ? PIN_NUMBER : ads.length;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayLength; i++) {
      fragment.appendChild(initPinElement(ads[i]));
      pinsLocationElement.appendChild(fragment);
    }
  };

  // Удаление меток похожих объявлений с карты
  var removePinsElements = function () {
    var pinElement = pinsLocationElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pinElement.length; i++) {
      pinsLocationElement.removeChild(pinElement[i]);
    }
  };

  window.pins = {
    render: renderPinsElements,
    remove: removePinsElements,
    removeActiveClass: removeActiveClass
  };
})();
