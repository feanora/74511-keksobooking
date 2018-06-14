'use strict';

var AD_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var HOUSING_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var CHEKIN_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];
var CHEKOUT_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];
var HOUSING_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var HOUSING_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var AVATAR_NUMBER_MIN = 1;
var AVATAR_NUMBER__MAX = 8;
var AD_NUMBER = 8;
var COODRINATE_X_MIN = 300;
var COODRINATE_X_MAX = 900;
var COODRINATE_Y_MIN = 130;
var COODRINATE_Y_MAX = 630;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOM_MIN = 1;
var ROOM_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 20;
var PIN_WIDTH = 50; // из css
var PIN_HEIGHT = 70; // из css
var PHOTO_WIDTH = 45; // из css
var PHOTO_HEIGHT = 40; // из css

var mapElement = document.querySelector('.map');
var adTitlesRandomIndexes = [];
var avatarsIndexes = [];
var avatarsRandomIndexes = [];
var pinsLocationElement = document.querySelector('.map__pins');
var pinTemplateElement = document.querySelector('#pin__template').content.querySelector('.map__pin');
var cadrTemplateElement = document.querySelector('#pin__template').content.querySelector('.map__card');
var mapFiltersContainerElement = mapElement.querySelector('.map__filters-container');
var featuresListElement = cadrTemplateElement.querySelector('.popup__features');
var photosListElement = cadrTemplateElement.querySelector('.popup__photos');
var typeElement = cadrTemplateElement.querySelector('.popup__type');
var ads = [];

// Имитация активного режима
var simulateDynamicMode = function () {
  mapElement.classList.remove('map--faded');
};

// Генерация случайного числа от min до max
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

// Перетасовка массива (алгоритм Фишера_Йетса)
var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = array[i];
    array[i] = array[j];
    array[j] = swap;
  }
  return array;
};

// Генерация числового массива от min до max
var getArray = function (min, max) {
  var array = [];
  for (var i = min; i <= max; i++) {
    array.push(i);
  }
  return array;
};

// Генерация массива произвольной длины из исходного массива
var getRandomLengthArray = function (array) {
  var newArray = [];
  var newArrayLength = getRandomNumber(1, array.length);
  for (var i = 0; i < newArrayLength; i++) {
    newArray[i] = array[i];
  }
  return newArray;
};

// Создание массива индексов, перетасованных в случайном порядке
var getRandomIndexArray = function (array) {
  var randomIndexArray = getArray(0, array.length - 1);
  return shuffleArray(randomIndexArray);
};

// Создание массива со случайными индексами массива заголовков предолжения
var getAdTitlesRandomIndexes = function (array) {
  return getRandomIndexArray(array);
};

// Создание массива с номерами аватаров
var getAvatarsIndexes = function (avatarNumberMin, avatarNumberMax) {
  return getArray(avatarNumberMin, avatarNumberMax);
};

// Создание массива со случайными индексами массива аватаров
var getAvatarsRandomIndexes = function () {
  return getRandomIndexArray(avatarsIndexes);
};

// Генерация адреса аватара
var createAvatarAddress = function (i) {
  var avatarPath = 'img/avatars/user';
  var avatarFormat = '.png';
  var avatarNumber = avatarsIndexes[avatarsRandomIndexes[i]];
  // Если изображений станет больше 9, то 0 не нужен
  if (avatarNumber < 10) {
    avatarNumber = '0' + avatarNumber;
  }
  return avatarPath + avatarNumber + avatarFormat;
};

// Генерация массива с объявлениями
var initAds = function () {
  var newAds = [];
  for (var i = 0; i < AD_NUMBER; i++) {
    var locationX = getRandomNumber(COODRINATE_X_MIN, COODRINATE_X_MAX);
    var locationY = getRandomNumber(COODRINATE_Y_MIN, COODRINATE_Y_MAX);
    var randomAd = {
      author: {
        avatar: createAvatarAddress(i)
      },
      offer: {
        title: AD_TITLES[adTitlesRandomIndexes[i]],
        address: locationX + ', ' + locationY,
        price: getRandomNumber(PRICE_MIN, PRICE_MAX),
        type: HOUSING_TYPES[getRandomNumber(0, HOUSING_TYPES.length - 1)],
        rooms: getRandomNumber(ROOM_MIN, ROOM_MAX),
        guests: getRandomNumber(GUESTS_MIN, GUESTS_MAX),
        checkin: CHEKIN_TIMES[getRandomNumber(0, CHEKIN_TIMES.length - 1)],
        checkout: CHEKOUT_TIMES[getRandomNumber(0, CHEKOUT_TIMES.length - 1)],
        features: getRandomLengthArray(HOUSING_FEATURES),
        description: '',
        photos: shuffleArray(HOUSING_PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    newAds[i] = randomAd;
  }
  return newAds;
};

// Создание DOM-элемента метки на карте
var initPinElement = function (pin) {
  var pinElement = pinTemplateElement.cloneNode(true);
  var pinAvatarElement = pinElement.querySelector('img');
  pinElement.style.left = pin.location.x - (PIN_WIDTH / 2) + 'px';
  pinElement.style.top = pin.location.y - PIN_HEIGHT + 'px';
  pinAvatarElement.src = pin.author.avatar;
  pinAvatarElement.alt = pin.offer.title;
  return pinElement;
};

// Заполнение карты DOM-элементами на основе массива с объектами
var fillMap = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(initPinElement(ads[i]));
    pinsLocationElement.appendChild(fragment);
  }
};

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

// Заполнение родительского элемента дочерними
var fillParentElement = function (items, tag, Classname, parentElement) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < items.length; i++) {
    var item = document.createElement(tag);
    item.className = Classname;
    fragment.appendChild(item);
  }
  parentElement.appendChild(fragment);
};

// Заполнение списка преимуществ
var fillFeaturesListElement = function (ad, features) {
  deleteChildElement(featuresListElement);
  fillParentElement(features, 'li', 'popup__feature', featuresListElement);
  for (var i = 0; i < features.length; i++) {
    var newFeaturesClass = 'popup__feature--' + features[i];
    featuresListElement.children[i].classList.add(newFeaturesClass);
  }
};
// Заполнение списка фотографий
var fillPhotosListElement = function (ad, photos) {
  deleteChildElement(photosListElement);
  fillParentElement(photos, 'img', 'popup__photo', photosListElement);
  for (var i = 0; i < photos.length; i++) {
    photosListElement.children[i].src = photos[i];
    photosListElement.children[i].width = PHOTO_WIDTH;
    photosListElement.children[i].height = PHOTO_HEIGHT;
  }
};

// Создание DOM-элемента попапа объявления
var initAdPopupElement = function (ad) {
  var adPopupElement = cadrTemplateElement.cloneNode(true);
  adPopupElement.querySelector('.popup__title').textContent = ad.offer.title;
  adPopupElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adPopupElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  adPopupElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ads[1].offer.guests + ' гостей';
  adPopupElement.querySelector('.popup__text--time').textContent = 'Заезд после' + ad.offer.checkin + ', выезд до' + ad.offer.checkout;
  adPopupElement.querySelector('.popup__description').textContent = ad.offer.description;
  adPopupElement.querySelector('.popup__avatar').src = ad.author.avatar;
  return adPopupElement;
};

var renderAdPopapElement = function (ad) {
  identifyHousingType(ad);
  fillFeaturesListElement(ad, ad.offer.features);
  fillPhotosListElement(ad, ad.offer.photos);
  mapElement.insertBefore(initAdPopupElement(ad), mapFiltersContainerElement);
};

// Точка входа в программу
/* var init = function () {
  simulateDynamicMode();
  avatarsIndexes = getAvatarsIndexes(AVATAR_NUMBER_MIN, AVATAR_NUMBER__MAX);
  avatarsRandomIndexes = getAvatarsRandomIndexes();
  adTitlesRandomIndexes = getAdTitlesRandomIndexes(AD_TITLES);
  ads = initAds();
  fillMap();
  renderAdPopapElement(ads[1]);
};

init(); */

var formElement = document.querySelector('.ad-form');
var fieldsetElements = formElement.querySelectorAll('fieldset');
var mainPinElement = document.querySelector('.map__pin--main');

// Добавление/удаление у полей формы атрибута disabled
var deactivateField = function (value) {
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = value;
  }
};

// Переключение в неактивный режим
var switchToInertMode = function () {
  mapElement.classList.add('map--faded');
  formElement.classList.add('ad-form--disabled');
  deactivateField(true);
};

switchToInertMode();

// Переключение в активный режим
var switchToDynamicMode = function () {
  mapElement.classList.remove('map--faded');
  formElement.classList.remove('ad-form--disabled');
  deactivateField(false);
};

// Эмуляция перемещения метки
mainPinElement.addEventListener('mouseup', function () {
  switchToDynamicMode();
});
