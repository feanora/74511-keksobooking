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

var map = document.querySelector('.map');

// Имитация активного режима
var simulateDynamicMode = function () {
  map.classList.remove('map--faded');
};

simulateDynamicMode();

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

// Массив с номерами аватаров
var AllAvatarNumbers = getArray(NUMBER_OF_AVATAR_MIN, NUMBER_OF_AVATAR_MAX);
// Массив со случайными индексами массива аватаров
var AllAvatarNumbersIndex = getArrayOfRandomIndex(AllAvatarNumbers);
// Массив со случайными индексами массива заголовков предолжения
var AllTitleNumbersIndex = getArrayOfRandomIndex(ALL_AD_TITLE);

// Генерация массива с объявлениями
var initAds = function () {
  var newAds = [];
  for (var i = 0; i < NUMBER_OF_AD; i++) {
    var locationX = getRandomNumber(COODRINATE_X_MIN, COODRINATE_X_MAX);
    var locationY = getRandomNumber(COODRINATE_Y_MIN, COODRINATE_Y_MAX);
    var randomAd = {
      author: {
        avatar: 'img/avatars/user0' + AllAvatarNumbersIndex[i] + '.png'
      },
      offer: {
        title: ALL_AD_TITLE[AllTitleNumbersIndex[i]],
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

initAds();
