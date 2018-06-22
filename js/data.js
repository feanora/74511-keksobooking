'use strict';

(function () {
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

  var avatarsIndexes = [];
  var avatarsRandomIndexes = [];

  // Создание массива с номерами аватаров
  var getAvatarsIndexes = function (avatarNumberMin, avatarNumberMax) {
    return window.util.getArray(avatarNumberMin, avatarNumberMax);
  };

  // Генерация адреса аватара
  var createAvatarAddress = function (i) {
    var avatarPath = 'img/avatars/user';
    var avatarFormat = '.png';
    var avatarNumber = avatarsRandomIndexes[i];
    // Если изображений станет больше 9, то 0 не нужен
    if (avatarNumber < 10) {
      avatarNumber = '0' + avatarNumber;
    }
    return avatarPath + avatarNumber + avatarFormat;
  };

  // Генерация массива с объявлениями
  window.initAds = function () {
    avatarsIndexes = getAvatarsIndexes(AVATAR_NUMBER_MIN, AVATAR_NUMBER__MAX);
    avatarsRandomIndexes = window.util.shuffleArray(avatarsIndexes);
    var titles = window.util.shuffleArray(AD_TITLES);
    var newAds = [];
    for (var i = 0; i < AD_NUMBER; i++) {
      var locationX = window.util.getRandomNumber(COODRINATE_X_MIN, COODRINATE_X_MAX);
      var locationY = window.util.getRandomNumber(COODRINATE_Y_MIN, COODRINATE_Y_MAX);
      var randomAd = {
        author: {
          avatar: createAvatarAddress(i)
        },
        offer: {
          title: titles[i],
          address: locationX + ', ' + locationY,
          price: window.util.getRandomNumber(PRICE_MIN, PRICE_MAX),
          type: HOUSING_TYPES[window.util.getRandomNumber(0, HOUSING_TYPES.length - 1)],
          rooms: window.util.getRandomNumber(ROOM_MIN, ROOM_MAX),
          guests: window.util.getRandomNumber(GUESTS_MIN, GUESTS_MAX),
          checkin: CHEKIN_TIMES[window.util.getRandomNumber(0, CHEKIN_TIMES.length - 1)],
          checkout: CHEKOUT_TIMES[window.util.getRandomNumber(0, CHEKOUT_TIMES.length - 1)],
          features: window.util.getRandomLengthArray(HOUSING_FEATURES),
          description: '',
          photos: window.util.shuffleArray(HOUSING_PHOTOS)
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
})();
