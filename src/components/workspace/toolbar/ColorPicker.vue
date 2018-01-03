<template>
  <div class="component-container" @click="clickCapture">
    <svg class="icon" @click="toggleColorPicker()">
      <title>Color picker</title>
      <desc>Pick a new color to use to draw</desc>
      <use xlink:href="#icon-picker"></use>
    </svg>
    <span :style="{background: selectedColor.hex}" class="color-value"></span>
    <chrome-picker v-model="selectedColor" class="color-picker" v-show="isPickerOn"/>
  </div>
</template>

<script>

import {Chrome} from 'vue-color'

export default {
  name: 'color-picker',
  props: ['color'],
  components: {
    'chrome-picker': Chrome
  },
  created: function () {
    this.windowClickListener = () => this.toggleColorPicker(false)
    window.addEventListener('click', this.windowClickListener)
  },
  destroyed: function () {
    window.removeEventListener('click', this.windowClickListener)
  },
  data () {
    return {
      isPickerOn: false,
      selectedColor: {
        hex: '#11aaff'
      }
    }
  },
  methods: {
    // Actions
    toggleColorPicker: function (newStatus) {
      newStatus = newStatus === undefined ? !this.isPickerOn : newStatus
      if (this.isPickerOn === newStatus) {
        return
      }
      this.isPickerOn = newStatus
      if (!this.isPickerOn) {
        this.$emit('newColor', this.selectedColor.hex)
      }
    },
    clickCapture: function (event) {
      event.stopPropagation()
    },
  },
  watch: {
    color: function (color) {
      this.selectedColor = {hex: color}
    }
  }
}
</script>

<style lang="scss">

.component-container {
  position: relative;
}

// 225x240
.color-picker {
  position: absolute;
  top: -250px;
  left: -120px;
  height: 240px;
}

.color-value {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: super;
  border-radius: 50%;
}

</style>