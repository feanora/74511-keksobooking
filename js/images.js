'use strict';

(function () {
  var formElement = window.util.formElement;
  var avatarChooserElement = formElement.querySelector('#avatar');
  var avatarPreviewElement = formElement.querySelector('.ad-form-header__avatar');

  var FILE_TYPES = [
    'gif',
    'jpg',
    'jpeg',
    'png'
  ];

  avatarChooserElement.addEventListener('change', function () {
    var avatar = avatarChooserElement.files[0];
    var avatarName = avatar.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return avatarName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreviewElement.src = reader.result;
      });

      reader.readAsDataURL(avatar);
    }
  });
})();
