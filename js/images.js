'use strict';

(function () {
  var formElement = window.util.formElement;
  var avatarChooserElement = formElement.querySelector('#avatar');
  var avatarPreviewElement = formElement.querySelector('.ad-form-header__avatar');
  var photoTemplateElement = document.querySelector('#photo__template').content.querySelector('.ad-form__photo');
  var photoChooserElement = formElement.querySelector('#images');
  var photoContainerElement = formElement.querySelector('.ad-form__photo-container');

  var FILE_TYPES = [
    'gif',
    'jpg',
    'jpeg',
    'png'
  ];

  // Проверка расширения файла
  var checkIfFileTypeIsCorrect = function (file) {
    var fileName = file.name.toLowerCase();

    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  // Загрузка и отображение файла
  var renderPreview = function (image, file) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      image.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  // Отображение аватара
  var renderAvatar = function () {
    var avatar = avatarChooserElement.files[0];
    var matches = checkIfFileTypeIsCorrect(avatar);
    if (matches) {
      renderPreview(avatarPreviewElement, avatar);
    }
  };

  // Подготовка фрагмента для отображения фотографий жилья
  var preparedHousingPhotos = function (element) {
    var fragment = document.createDocumentFragment();

    Array.from(element.files).forEach(function (file) {
      var matches = checkIfFileTypeIsCorrect(file);
      if (matches) {
        var photoElement = photoTemplateElement.cloneNode(true);
        var photoPreviewElement = photoElement.querySelector('.ad-form__housing-photo');
        renderPreview(photoPreviewElement, file);
        fragment.appendChild(photoElement);
      }
    });
    return fragment;
  };

  // Отображение фотографий жилья
  var renderHousingPhotos = function () {
    photoContainerElement.appendChild(preparedHousingPhotos(photoChooserElement));
  };

  // Сброс аватара
  var avatarReset = function () {
    avatarPreviewElement.src = 'img/muffin-grey.svg';
  };

  // Сброс фотографий жилья
  var resetHousingPhoto = function () {
    var photosElement = formElement.querySelectorAll('.ad-form__photo');
    Array.from(photosElement).forEach(function (element) {
      photoContainerElement.removeChild(element);
    });
  };

  avatarChooserElement.addEventListener('change', function () {
    renderAvatar();
  });

  photoChooserElement.addEventListener('change', function () {
    renderHousingPhotos();
  });

  window.images = {
    avatarReset: avatarReset,
    resetHousingPhoto: resetHousingPhoto
  };
})();
