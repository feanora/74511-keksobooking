'use strict';

(function () {
  var Code = {
    OK: 200,
    BAD_REQUES: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
  };

  var preparedXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case Code.OK:
          onLoad(xhr.response);
          break;
        case Code.BAD_REQUES:
          onError('Неверный запрос');
          break;
        case Code.UNAUTHORIZED:
          onError('Пользователь не авторизован');
          break;
        case Code.NOT_FOUND:
          onError('Ничего не найдено');
          break;

        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за: ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  var load = function (onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var xhr = preparedXhr(onLoad, onError);

    xhr.open('GET', URL);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking';
    var xhr = preparedXhr(onLoad, onError);

    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
