<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <svg class="toolbar-item icon" @click="toggleEditing()">
        <use v-bind:href="'#icon-' + editingIcon"></use>
      </svg>
      <svg class="toolbar-item icon" @click="selectEraser()">
        <title>Eraser</title>
        <desc>Eraser tool to clean triangles</desc>
        <use xlink:href="#icon-eraser"></use>
      </svg>
      <label class="toolbar-item">
        <input type="color" class="color-picker" @change="updateCurrentColor()" v-model="selectedColor"/>
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
              :key="color"
              :style="{'background-color':color}"
              class="palette-color"
              :class="{'active': color === selectedColor}"
              @click="updateCurrentColor(color)"></span>
      </span>

      <!-- <div class="colorlist" id="color-list"></div> -->
    </div>

    <div class="toolbar-right">
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

import Toolbar from '../../../services/toolbar.js'
import fullscreenHelper from '../../../services/fullscreenHelper.js'

const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink'

export default {
  name: 'workspace',
  props: ['playground'],
  created: function () {
    this.controller = new Toolbar(this.playground);
    this.palette = this.controller.palette
  },
  data () {
    return {
      controller: null,
      selectedColor: '#11aaff',
      editingIcon: 'pen',
      palette: []
    }
  },
  methods: {
    toggleFullscreen: function () {
      fullscreenHelper.toggle()
    },
    togglePreview: function () {
      this.controller.toggleOutline()
    },
    downloadSVG: function () {
      this.controller.exportSVG()
    },
    toggleEditing: function (newState) {
      this.editingIcon = this.controller.toggleEditing() ? 'pen' : 'hand'
    },
    selectEraser: function () {
      this.controller.eraseMode()
    },
    addColor: function () {
      console.log('Color added', this.selectedColor)
      this.controller.addColor(this.selectedColor)
    },
    updateCurrentColor: function (color) {
      console.log('Update color', (color || this.selectedColor))
      this.selectedColor = color || this.selectedColor
      this.controller.updateCurrentColor(this.selectedColor)
    }
  }
}
</script>

<style lang="scss">

@mixin horizontal-toolbar {
  display: flex;
  align-items: center;
}

.toolbar {
  @include horizontal-toolbar;
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

.toolbar-left, .toolbar-right {
  @include horizontal-toolbar;
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
  @include horizontal-toolbar;
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