'use strict';

var ALL_AD_TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var ALL_TYPE_HOUSING = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var ALL_CHEKIN_TIME = [
  '12:00',
  '13:00',
  '14:00'
];
var ALL_CHEKOUT_TIME = [
  '12:00',
  '13:00',
  '14:00'
];
var ALL_FEATURES_HOUSING = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var ALL_PHOTOS_HOUSING = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var NUMBER_OF_AVATAR_MIN = 1;
var NUMBER_OF_AVATAR_MAX = 8;
var NUMBER_OF_AD = 8;
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

var map = document.querySelector('.map');
var mapWithPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin__template').content.querySelector('.map__pin');
var cadrTemplate = document.querySelector('#pin__template').content.querySelector('.map__card');
var ads = [];

// Имитация активного режима
var simulateDynamicMode = function () {
  map.classList.remove('map--faded');
};

// Генерация случайного числа от min до max
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

// Перетасовка массива (алгоритм Фишера_Йетса)
var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
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
var getArrayOfRandomIndex = function (array) {
  var arrayOfIndex = getArray(0, array.length - 1);
  return shuffleArray(arrayOfIndex);
};

// Массив со случайными индексами массива заголовков предолжения
var allTitleNumbersIndex = getArrayOfRandomIndex(ALL_AD_TITLE);
// Массив с номерами аватаров
var allAvatarNumbers = getArray(NUMBER_OF_AVATAR_MIN, NUMBER_OF_AVATAR_MAX);
// Массив со случайными индексами массива аватаров
var allAvatarNumbersIndex = getArrayOfRandomIndex(allAvatarNumbers);

// Генерация адреса аватара
var createAvatarAddress = function (i) {
  var avatarPath = 'img/avatars/user';
  var avatarFormat = '.png';
  var avatarNumber = allAvatarNumbers[allAvatarNumbersIndex[i]];
  // Если изображений станет больше 9, то 0 не нужен
  if (avatarNumber < 10) {
    avatarNumber = '0' + avatarNumber;
  }
  return avatarPath + avatarNumber + avatarFormat;
};

// Генерация массива с объявлениями
var initAds = function () {
  var newAds = [];
  for (var i = 0; i < NUMBER_OF_AD; i++) {
    var locationX = getRandomNumber(COODRINATE_X_MIN, COODRINATE_X_MAX);
    var locationY = getRandomNumber(COODRINATE_Y_MIN, COODRINATE_Y_MAX);
    var randomAd = {
      author: {
        avatar: createAvatarAddress(i)
      },
      offer: {
        title: ALL_AD_TITLE[allTitleNumbersIndex[i]],
        address: locationX + ', ' + locationY,
        price: getRandomNumber(PRICE_MIN, PRICE_MAX),
        type: ALL_TYPE_HOUSING[getRandomNumber(0, ALL_TYPE_HOUSING.length - 1)],
        rooms: getRandomNumber(ROOM_MIN, ROOM_MAX),
        guests: getRandomNumber(GUESTS_MIN, GUESTS_MAX),
        checkin: ALL_CHEKIN_TIME[getRandomNumber(0, ALL_CHEKIN_TIME.length - 1)],
        checkout: ALL_CHEKOUT_TIME[getRandomNumber(0, ALL_CHEKOUT_TIME.length - 1)],
        features: getRandomLengthArray(ALL_FEATURES_HOUSING),
        description: '',
        photos: shuffleArray(ALL_PHOTOS_HOUSING)
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
var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinAvatar = pinTemplate.querySelector('img');
  pinElement.style.left = pin.location.x - (PIN_WIDTH / 2) + 'px';
  pinElement.style.top = pin.location.y - PIN_HEIGHT + 'px';
  pinAvatar.src = pin.author.avatar;
  pinAvatar.alt = pin.offer.title;
  return pinElement;
};

// Заполнение карты DOM-элементами на основе массива с объектами
var fillMap = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderPin(ads[i]));
    mapWithPins.appendChild(fragment);
  }
};

var init = function () {
  simulateDynamicMode();
  ads = initAds();
  fillMap();
};

init();

// Заполнение списка преимуществ DOM-элементами
var renderFeaturesBlock = function (features) {
  var featuresList = cadrTemplate.querySelector('.popup__features');
  // Удаление потомков
  while (featuresList.firstChild) {
    featuresList.removeChild(featuresList.firstChild);
  }
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    var featuresItem = document.createElement('li');
    var newFeaturesClass = 'popup__feature--' + features[i];
    featuresItem.classList.add('popup__feature', newFeaturesClass);
    fragment.appendChild(featuresItem);
  }
  return featuresList.appendChild(fragment);
};

var renderAdPopup = function (ad) {
  var adPopup = cadrTemplate.cloneNode(true);
  adPopup.querySelector('.popup__title').textContent = ad.offer.title;
  adPopup.querySelector('.popup__text--address').textContent = ad.offer.address;
  adPopup.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  adPopup.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ads[1].offer.guests + ' гостей';
  adPopup.querySelector('.popup__text--time').textContent = 'Заезд после' + ad.offer.checkin + ', выезд до' + ad.offer.checkout;
  adPopup.querySelector('.popup__description').textContent = ad.offer.description;
  adPopup.querySelector('.popup__avatar').src = ad.author.avatar;
  return adPopup;
};

renderFeaturesBlock(ads[1].offer.features);

map.querySelector('.map__filters-container');
var renderAd = function () {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderAdPopup(ads[1]));
  map.insertBefore(fragment, map.querySelector('.map__filters-container'));
};

renderAd();
