'use strict';

(function () {
  var DEFAULT_VALUE = 'any';

  var PriceRange = {
    FIRST_POINT: 10000,
    SECOND_POINT: 50000
  };

  var PriceValue = {
    MIDDLE: 'middle',
    LOW: 'low',
    HIGH: 'high'
  };

  var ads = [];
  var filteredAds = [];
  var filtersFormElement = document.querySelector('.map__filters');
  var housingTypeElement = filtersFormElement.querySelector('#housing-type');
  var housingPriceElement = filtersFormElement.querySelector('#housing-price');
  var housingRoomsElement = filtersFormElement.querySelector('#housing-rooms');
  var housingGuestsElement = filtersFormElement.querySelector('#housing-guests');
  var housingFeaturesElement = filtersFormElement.querySelector('#housing-features');
  var selectFilterElements = filtersFormElement.querySelectorAll('select');
  var checkboxFilterElements = filtersFormElement.querySelectorAll('input');
  var utilModule = window.util;
  var pinsModule = window.pins;

  // Переключение фильтров в неактивное состояние
  var switchFiltersToInertMode = function () {
    utilModule.toggleDisabledFields(selectFilterElements, true);
    utilModule.toggleDisabledFields(checkboxFilterElements, true);
  };

  // Переключение фильтров в активное состояние
  var switchFiltersToDynamicMode = function () {
    utilModule.toggleDisabledFields(selectFilterElements, false);
    utilModule.toggleDisabledFields(checkboxFilterElements, false);
  };

  // Фильтрация массива объявлений по значению атрибута value у select
  var filterArrayByValue = function (selectElement, key) {
    if (selectElement.value === DEFAULT_VALUE) {
      return filteredAds;
    }
    filteredAds = filteredAds.filter(function (ad) {
      return ad.offer[key].toString() === selectElement.value;
    });
    return filteredAds;
  };

  // Подготовка к фильтрации по цене
  var preparedForFiltration = function (array) {
    return array.filter(function (ad) {
      var price = ad.offer.price;
      switch (housingPriceElement.value) {
        case PriceValue.MIDDLE:
          return price > PriceRange.FIRST_POINT && price < PriceRange.SECOND_POINT;
        case PriceValue.LOW:
          return price <= PriceRange.FIRST_POINT;
        case PriceValue.HIGH:
          return price >= PriceRange.SECOND_POINT;
        default:
          return false;
      }
    });
  };

  // Фильтрация массива объявлений по уровню цены
  var filterArrayByPrice = function () {
    if (housingPriceElement.value === DEFAULT_VALUE) {
      return filteredAds;
    }
    filteredAds = preparedForFiltration(filteredAds);
    return filteredAds;
  };

  // Фильтрация по удобствам
  var filterArrayByFeatures = function () {
    var housingFeaturesElements = housingFeaturesElement.querySelectorAll('input:checked');
    Array.from(housingFeaturesElements).forEach(function (it) {
      filteredAds = filteredAds.filter(function (ad) {
        return ad.offer.features.includes(it.value);
      });
    });
    return filteredAds;
  };

  // Фильтрация по всем параметрам
  var sortAll = function () {
    filterArrayByValue(housingTypeElement, 'type');
    filterArrayByValue(housingRoomsElement, 'rooms');
    filterArrayByValue(housingGuestsElement, 'guests');
    filterArrayByPrice();
    filterArrayByFeatures();
    return filteredAds;
  };

  // Отображение результата фильтрации
  var updateAds = function () {
    filteredAds = ads.slice();
    pinsModule.removeActiveClass();
    pinsModule.remove();
    window.popup.closeIfOpen();
    sortAll();
    pinsModule.render(filteredAds);
  };

  var filtersFormElementChangeHandler = function () {
    window.debounce(updateAds);
  };

  filtersFormElement.addEventListener('change', filtersFormElementChangeHandler);

  // Обработчик успешной загрузки данных для отрисовки меток похожих объявлений
  var successHandler = function (data) {
    ads = data;
    pinsModule.render(ads);
    switchFiltersToDynamicMode();
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

  window.loadPins = {
    successHandler: successHandler,
    errorHandler: errorHandler,
    switchFiltersToInertMode: switchFiltersToInertMode
  };
})();
