<template>
  <div class="toolbar">
    <div>
      <svg class="icon" @click="toggleEditing()">
        <use xlink:href="#icon-pen"></use>
      </svg>
      <svg class="icon">
        <title>Eraser</title>
        <desc>Eraser tool to clean triangles</desc>
        <use xlink:href="#icon-eraser"></use>
      </svg>
    </div>

    <div>
      <svg class="icon" @click="toggleFullscreen()">
        <title>Fullscreen</title>
        <desc>Toggle the fullscreen mode</desc>
        <use xlink:href="#icon-fullscreen"></use>
      </svg>
      <svg class="icon" @click="togglePreview()">
        <title>Preview</title>
        <desc>Show/hide the triangle grid border</desc>
        <use xlink:href="#icon-preview"></use>
      </svg>
      <svg class="icon" @click="downloadSVG()">
        <title>Download SVG</title>
        <desc>Downoad the SVG file of your creation</desc>
        <use xlink:href="#icon-download"></use>
      </svg>
    </div>
    <!--
    <div class="leftbar">
      <div class="button-group">
        <button type="button" onclick="controller.eraseMode();">
          <svg class="icon">
            <use xlink:href="#icon-eraser"></use>
          </svg>
        </button>
      </div>
      <div class="button-group">
        <input type="color" id="color-picker" class="color-picker" onchange="controller.updateCurrentColor();" onclick="controller.updateCurrentColor();"/><button type="button" onclick="controller.addColor();">+</button>
      </div>
      <div class="colorlist" id="color-list"></div>
    </div>

    <div class="rightbar">
      <div class="button-group">
        <button type="button" onclick="controller.toggleOutline();">outline</button>
      </div>
      <div class="button-group">
        <button type="button" onclick="controller.load();">load</button><button type="button" onclick="controller.save();">save</button>
      </div>
      <div class="button-group">
        <button type="button" onclick="controller.exportSVG();">export (SVG)</button>
      </div>
      <a href="https://github.com/maxwellito/triangulart">
        <svg class="icon">
          <use xlink:href="#icon-github"></use>
        </svg>
      </a>
    </div>
    -->
  </div>
</template>

<script>


/**
 * Fullscreen polyfills
 */
function isFullscreen () {
  return  (document.fullScreenElement && document.fullScreenElement !== null) ||
          (document.mozFullScreen || document.webkitIsFullScreen);
}

function enterFullscreen () {
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
}

function exitFullscreen () {
  if (document.documentElement.exitFullscreen) {
    document.documentElement.exitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

import Toolbar from '../../../services/toolbar.js'




export default {
  name: 'workspace',
  props: ['playground'],
  created: function () {
    this.controller = new Toolbar(this.playground);
  },
  data () {
    return {
      controller: null
    }
  },
  methods: {
    toggleFullscreen: function () {
      if (!isFullscreen()) {
        enterFullscreen();
      }
      else {
        exitFullscreen();
      }
    },
    togglePreview: function () {
      this.controller.toggleOutline()
    },
    downloadSVG: function () {
      this.controller.exportSVG()
    },
    toggleEditing: function () {
      this.controller.toggleEditing()
    }
  }
}
</script>

<style lang="scss">
.toolbar {
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  bottom: 0;
  width: 100%;
  padding: .5rem;
  background-color: #131016;
  color: #ccc;
  box-sizing: border-box;

  .icon {
    width: 2rem;
    height: 2rem;
  }
}

.icon + .icon {
  margin-left: .5rem;
}

</style>