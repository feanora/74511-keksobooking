'use strict';

(function () {
  var PHOTO_WIDTH = 45; // из css
  var PHOTO_HEIGHT = 40; // из css
  var cadrTemplateElement = document.querySelector('#pin__template').content.querySelector('.map__card');
  var mapElement = window.util.mapElement;
  var mapFiltersContainerElement = mapElement.querySelector('.map__filters-container');
  var featuresListElement = cadrTemplateElement.querySelector('.popup__features');
  var photosListElement = cadrTemplateElement.querySelector('.popup__photos');
  var typeElement = cadrTemplateElement.querySelector('.popup__type');

  // Удаление потомков
  var deleteChildElement = function (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    return parent;
  };

  // Вывод типа жилья
  var identifyHousingType = function (ad) {
    if (ad.offer.type === 'flat') {
      typeElement.textContent = 'Квартира';
    } else if (ad.offer.type === 'bungalo') {
      typeElement.textContent = 'Бунгало';
    } else if (ad.offer.type === 'house') {
      typeElement.textContent = 'Дом';
    } else {
      typeElement.textContent = 'Дворец';
    }
  };

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
    deleteChildElement(featuresListElement);
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
    deleteChildElement(photosListElement);
    var photosFragment = preparedFragment(photos, 'img', 'popup__photo');
    var photoItems = photosFragment.querySelectorAll('.popup__photo');
    for (var i = 0; i < photos.length; i++) {
      photoItems[i].src = photos[i];
      photoItems[i].width = PHOTO_WIDTH;
      photoItems[i].height = PHOTO_HEIGHT;
    }
    photosListElement.appendChild(photosFragment);
  };

  // Создание DOM-элемента попапа объявления
  var initAdPopupElement = function (ad) {
    identifyHousingType(ad);
    fillFeaturesListElement(ad, ad.offer.features);
    fillPhotosListElement(ad, ad.offer.photos);
    var adPopupElement = cadrTemplateElement.cloneNode(true);
    adPopupElement.querySelector('.popup__title').textContent = ad.offer.title;
    adPopupElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    adPopupElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
    adPopupElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    adPopupElement.querySelector('.popup__text--time').textContent = 'Заезд после' + ad.offer.checkin + ', выезд до' + ad.offer.checkout;
    adPopupElement.querySelector('.popup__description').textContent = ad.offer.description;
    adPopupElement.querySelector('.popup__avatar').src = ad.author.avatar;
    var popupCloseElement = adPopupElement.querySelector('.popup__close');
    popupCloseElement.addEventListener('click', function () {
      window.popup.close();
    });
    document.addEventListener('keydown', popupEscPressHandler);
    return adPopupElement;
  };

  // Отрисовка попапа
  var renderAdPopapElement = function (ad) {
    var popupElement = mapElement.querySelector('.map__card');
    if (popupElement) {
      window.popup.close();
    }
    mapElement.insertBefore(initAdPopupElement(ad), mapFiltersContainerElement);
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
  };

  window.popup = {
    close: closePopup,
    renderElement: renderAdPopapElement
  };
})();
