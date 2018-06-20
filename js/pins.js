'use strict';

(function () {
  var PIN_WIDTH = 50; // из css
  var PIN_HEIGHT = 70; // из css

  var pinTemplateElement = document.querySelector('#pin__template').content.querySelector('.map__pin');
  var pinsLocationElement = document.querySelector('.map__pins');

  // Создание DOM-элемента метки на карте
  var initPinElement = function (pin) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinAvatarElement = pinElement.querySelector('img');
    pinElement.style.left = pin.location.x - (PIN_WIDTH / 2) + 'px';
    pinElement.style.top = pin.location.y - PIN_HEIGHT + 'px';
    pinAvatarElement.src = pin.author.avatar;
    pinAvatarElement.alt = pin.offer.title;
    pinElement.addEventListener('click', function () {
      window.popup.renderAdPopapElement(pin);
    });
    return pinElement;
  };

  // Заполнение карты DOM-элементами на основе массива с объектами
  var renderPinsElements = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.util.ads.length; i++) {
      fragment.appendChild(initPinElement(window.util.ads[i]));
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
    initPinElement: initPinElement,
    renderPinsElements: renderPinsElements,
    removePinsElements: removePinsElements
  };
})();
