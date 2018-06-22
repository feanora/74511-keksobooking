'use strict';

(function () {
  var init = function () {
    window.pageModes.switchToInert();
    window.mainPin.showAddress();
    window.util.ads = window.initAds();
  };
  init();
})();
