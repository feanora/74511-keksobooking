'use strict';

(function () {
  var PhotoSize = {
    WIDTH: 45,
    HEIGHT: 40
  };

  var cadrTemplateElement = document.querySelector('#pin__template').content.querySelector('.map__card');
  var mapElement = window.util.mapElement;
  var featuresListElement = cadrTemplateElement.querySelector('.popup__features');
  var photosListElement = cadrTemplateElement.querySelector('.popup__photos');
  var filtersContainerElement = mapElement.querySelector('.map__filters-container');

  // Создание фрагмента для последующего заполнения родительского элемента
  var preparedFragment = function (items, tag, classname) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < items.length; i++) {
      var item = document.createElement(tag);
      item.className = classname;
      fragment.appendChild(item);
    }
    return fragment;
  };

  // Заполнение списка преимуществ
  var fillFeaturesListElement = function (ad, features) {
    window.util.deleteChildElement(featuresListElement);
    var featuresFragment = preparedFragment(features, 'li', 'popup__feature');
    var featureItems = featuresFragment.querySelectorAll('.popup__feature');
    for (var i = 0; i < featureItems.length; i++) {
      var newFeaturesClass = 'popup__feature--' + features[i];
      featureItems[i].classList.add(newFeaturesClass);
    }
    featuresListElement.appendChild(featuresFragment);
  };

  // Заполнение списка фотографий
  var fillPhotosListElement = function (ad, photos) {
    window.util.deleteChildElement(photosListElement);
    var photosFragment = preparedFragment(photos, 'img', 'popup__photo');
    var photoItems = photosFragment.querySelectorAll('.popup__photo');
    for (var i = 0; i < photos.length; i++) {
      photoItems[i].src = photos[i];
      photoItems[i].width = PhotoSize.WIDTH;
      photoItems[i].height = PhotoSize.HEIGHT;
    }
    photosListElement.appendChild(photosFragment);
  };

  // Склонение слова "комната"
  var declensionRoom = function (number) {
    var word;
    if (number % 10 === 1) {
      word = 'комната';
    } else if ((number % 10 > 1) && (number % 10 < 5)) {
      word = 'комнаты';
    } else {
      word = 'комнат';
    }
    return word;
  };

  // Склонение слова "гость"
  var declensionGuest = function (number) {
    return (number % 10 === 1 && number !== 11) ? 'гостя' : 'гостей';
  };

  // Создание DOM-элемента попапа объявления
  var initAdPopupElement = function (ad) {
    fillFeaturesListElement(ad, ad.offer.features);
    fillPhotosListElement(ad, ad.offer.photos);
    var adPopupElement = cadrTemplateElement.cloneNode(true);
    adPopupElement.querySelector('.popup__title').textContent = ad.offer.title;
    adPopupElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    adPopupElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
    adPopupElement.querySelector('.popup__type').textContent = window.util.housingTypeMap[ad.offer.type].TYPE;
    adPopupElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' ' + declensionRoom(ad.offer.rooms) + ' для ' + ad.offer.guests + ' ' + declensionGuest(ad.offer.guests);
    adPopupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    adPopupElement.querySelector('.popup__description').textContent = ad.offer.description;
    adPopupElement.querySelector('.popup__avatar').src = ad.author.avatar;
    var popupCloseElement = adPopupElement.querySelector('.popup__close');
    popupCloseElement.addEventListener('click', function () {
      window.popup.close();
    });
    document.addEventListener('keydown', popupEscPressHandler);
    return adPopupElement;
  };

  // Закрытие попапа, если он открыт
  var closeIfOpen = function () {
    var popupElement = mapElement.querySelector('.map__card');
    if (popupElement) {
      window.popup.close();
    }
  };

  // Отрисовка попапа
  var renderAdPopapElement = function (ad) {
    closeIfOpen();
    mapElement.insertBefore(initAdPopupElement(ad), filtersContainerElement);
  };

  // Закрытие попапа по нажатию на esc
  var popupEscPressHandler = function (evt) {
    window.util.performActionIfEscEvent(evt, window.popup.close);
  };

  // Закрытие попапа с объявлением
  var closePopup = function () {
    var popupElement = mapElement.querySelector('.map__card');
    mapElement.removeChild(popupElement);
    document.removeEventListener('keydown', popupEscPressHandler);
    window.pins.removeActiveClass();
  };

  window.popup = {
    close: closePopup,
    closeIfOpen: closeIfOpen,
    renderElement: renderAdPopapElement
  };
})();
