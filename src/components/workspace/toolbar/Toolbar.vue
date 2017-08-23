<template>
  <div class="toolbar">
    <div class="horizontal-toolbar">
      <svg class="toolbar-item icon" @click="setMode('MOVE')" :class="{active: currentMode == 'MOVE'}">
        <title>Move</title>
        <desc>Scroll on the map without editing</desc>
        <use href="#icon-hand"></use>
      </svg>
      <svg class="toolbar-item icon" @click="setMode('SELECT')" :class="{active: currentMode == 'SELECT'}">
        <title>Select</title>
        <desc>Select an area of triangles to edit them</desc>
        <use href="#icon-selection"></use>
      </svg>
      <svg class="toolbar-item icon" @click="setMode('FILL')" :class="{active: currentMode == 'FILL'}">
        <title>Pen</title>
        <desc>Fill triangles</desc>
        <use href="#icon-pen"></use>
      </svg>
      <svg class="toolbar-item icon" @click="setMode('ERASE')" :class="{active: currentMode == 'ERASE'}">
        <title>Eraser</title>
        <desc>Eraser tool to clean triangles</desc>
        <use xlink:href="#icon-eraser"></use>
      </svg>
    </div>

    <div class="horizontal-toolbar">
      <label class="toolbar-item">
        <input type="color" class="color-picker" @change="setFillColor()" v-model="selectedColor"/>
        <svg class="icon">
          <title>Color picker</title>
          <desc>Pick a new color to use to draw</desc>
          <use xlink:href="#icon-picker"></use>
        </svg>
        <span :style="{background: selectedColor}" class="color-value"></span>
      </label>
      <span class="toolbar-item palette">
        <span @click="addColor()" class="palette-color">+</span>
        <span v-for="color in palette"
              class="palette-color"
              :key="color"
              :style="{'background-color':color}"
              :class="{'active': color === selectedColor}"
              @click="setFillColor(color)"></span>
      </span>

      <!-- <div class="colorlist" id="color-list"></div> -->
    </div>

    <div class="horizontal-toolbar">
      <svg class="toolbar-item icon" @click="undo()">
        <title>Undo</title>
        <desc>Undo the last action done on the workspace</desc>
        <use xlink:href="#icon-undo"></use>
      </svg>
      <svg class="toolbar-item icon" @click="toggleFullscreen()">
        <title>Fullscreen</title>
        <desc>Toggle the fullscreen mode</desc>
        <use xlink:href="#icon-fullscreen"></use>
      </svg>
        <svg class="toolbar-item icon" @click="togglePreview()">
        <title>Preview</title>
        <desc>Show/hide the triangle grid border</desc>
        <use xlink:href="#icon-preview"></use>
      </svg>
      <svg class="toolbar-item icon" @click="downloadSVG()">
        <title>Download SVG</title>
        <desc>Downoad the SVG file of your creation</desc>
        <use xlink:href="#icon-download"></use>
      </svg>
      <!--
      <a class="toolbar-item" href="https://github.com/maxwellito/triangulart">
        <svg class="icon">
          <use xlink:href="#icon-github"></use>
        </svg>
      </a>
      -->
    </div>
  </div>
</template>

<script>

import downloader from '../../../services/downloader.js'
import fullscreenHelper from '../../../services/fullscreenHelper.js'
import Keybinding from '../../../services/keybinding.js'

export default {
  name: 'toolbar',
  props: ['playground'],
  created: function () {
    this.keybinding = new Keybinding()
    this.palette = this.playground.palette
    this.setFillColor()
    this.setMode('FILL')

    this.keybinding.on('undo', () => {
      console.log('Hi there, you cheeky listener')
      this.undo()
    })
    this.keybinding.on('copy', () => {
      console.log('Not implemented yet')
    })
  },
  destroyed: function () {
    this.keybinding.destroy()
  },
  data () {
    return {
      selectedColor: '#11aaff',
      currentMode: 'FILL',
      palette: []
    }
  },
  methods: {
    // Actions
    setMode: function (action) {
      this.playground.setMode(this.playground['ACTION_' + action])
      this.currentMode = action
    },
    isOnMode: function (action) {
      return this.playground.isOnMode(this.playground['ACTION_' + action])
    },

    addColor: function () {
      this.playground.addColor(this.selectedColor)
    },
    setFillColor: function (color) {
      this.selectedColor = color || this.selectedColor
      this.playground.setColor(this.selectedColor)
    },

    // 
    undo: function () {
      console.log('UNDOOO')
      this.playground.undo()
    },
    togglePreview: function () {
      this.playground.togglePreview()
    },
    toggleFullscreen: function () {
      fullscreenHelper.toggle()
    },
    downloadSVG: function () {
      downloader(this.playground.exportSVG(), 'artwork.svg');
    }
  }
}
</script>

<style lang="scss">

.horizontal-toolbar {
  display: flex;
  align-items: center;
}

.toolbar {
  @extend .horizontal-toolbar;
  position: fixed;
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

.toolbar-item {
  height: 2rem;
  & + & {
    margin-left: .5rem;
  }
}

.active {
  color: #1af;
}

.color-picker {
  position: relative;
  opacity: 0;
  width: 0;
  height: 0;
}

.color-value {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: super;
  border-radius: 50%;
}

.palette {
  @extend .horizontal-toolbar;
  padding: .25rem;
  border: 1px solid #fff;
  border-radius: 1rem;
  box-sizing: border-box;
}

.palette-color {
  display: inline-block;
  width: 1.375em;
  height: 1.375em;
  border-radius: 50%;
  box-sizing: border-box;
  text-align: center;
  line-height: 1.3;
  cursor: pointer;

  &.active {
    border: .2em double #fff; 
  }

  & + &  {
    margin-left: .25rem;
  }
}

</style>