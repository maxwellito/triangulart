/**
 * Fullscreen polyfills
 */

let fullscreenHelper = {

  /**
   * Checks if the browser is already in fullscreen mode
   */
  isFullscreen: function () {
    return  (document.fullScreenElement && document.fullScreenElement !== null) ||
            (document.mozFullScreen || document.webkitIsFullScreen);
  },
  
  /**
   * Enter in fullscreen mode
   */
  enterFullscreen: function () {
    var docElm = document.documentElement;
  
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    }
  },
  
  /**
   * Exit the fullscreen mode
   */
  exitFullscreen: function () {
    if (document.documentElement.exitFullscreen) {
      document.documentElement.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  },

  /**
   * Toggle the fullscreen mode
   */
  toggle: function () {
    if (!fullscreenHelper.isFullscreen()) {
      fullscreenHelper.enterFullscreen();
    }
    else {
      fullscreenHelper.exitFullscreen();
    }
  }
}

export default fullscreenHelper