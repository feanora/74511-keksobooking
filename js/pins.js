'use strict';

(function () {
  var PIN_WIDTH = 50; // из css
  var PIN_HEIGHT = 70; // из css

  var pinTemplateElement = document.querySelector('#pin__template').content.querySelector('.map__pin');
  var pinsLocationElement = document.querySelector('.map__pins');
  window.util.isPinActive = false;

  // Создание DOM-элемента метки на карте
  var initPinElement = function (pin) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinAvatarElement = pinElement.querySelector('img');
    pinElement.style.left = pin.location.x - (PIN_WIDTH / 2) + 'px';
    pinElement.style.top = pin.location.y - PIN_HEIGHT + 'px';
    pinAvatarElement.src = pin.author.avatar;
    pinAvatarElement.alt = pin.offer.title;
    pinElement.addEventListener('click', function () {
      if (window.util.isPinActive) {
        var pinAvctivElement = pinsLocationElement.querySelector('.map__pin--active');
        pinAvctivElement.classList.remove('map__pin--active');
      }
      window.popup.renderElement(pin);
      pinElement.classList.add('map__pin--active');
      window.util.isPinActive = true;
    });
    return pinElement;
  };

  // Обработчик успешной загрузки данных для отрисовки меток похожих объявлений
  var loadHandler = function (ads) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(initPinElement(ads[i]));
      pinsLocationElement.appendChild(fragment);
    }
  };

  // Обработчик ошибки
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0; text-align: center; background-color: rgba(0, 204, 255, 0.5)';
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.right = '0';
    node.style.fontZixe = '24px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    var closeErrorMessage = function () {
      document.body.removeChild(node);
    };

    setTimeout(closeErrorMessage, 7000);
  };

  // Удаление меток похожих объявлений с карты
  var removePinsElements = function () {
    var pinElement = pinsLocationElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pinElement.length; i++) {
      pinsLocationElement.removeChild(pinElement[i]);
    }
  };

  window.pins = {
    loadHandler: loadHandler,
    errorHandler: errorHandler,
    removeElements: removePinsElements
  };
})();
