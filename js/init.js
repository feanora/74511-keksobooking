'use strict';

(function () {
  var init = function () {
    window.pageModes.switchToInertMode();
    window.mainPin.showAddress();
    window.util.ads = window.initAds();
  };
  init();
})();
