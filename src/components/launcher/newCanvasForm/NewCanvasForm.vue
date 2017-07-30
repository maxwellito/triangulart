<template>
  <div class="launcher-content">
    <div class="row">
      <label>
        <div class="field">
          <input class="field-input" type="number" v-model="width" min="1"/>
          <span class="field-icon">↔</span>
        </div>
        <span>Map width</span>
      </label>
      <label>
        <div class="field">
          <input class="field-input" type="number" v-model="height" min="1"/>
          <span class="field-icon">↕</span>
        </div>
        <span>Map height</span>
      </label>
      <grid-orientation-picker @update:isLandscape="switchOrientation"></grid-orientation-picker>
    </div>
    <div>
      <button class="button" @click="cancel">Back</button>
      <button class="button">GO!</button>
    </div>
  </div>
</template>

<script>

import GridOrientationPicker from './gridOrientationPicker/GridOrientationPicker.vue'

export default {
  name: 'new-canvas-form',
  components: {
    GridOrientationPicker
  },
  data () {
    return {
      width: 30,
      height: 20,
      isLandscape: true
    }
  },
  methods: {
    create: function () {
      this.$emit('newCanvas', {
        width: this.width,
        height: this.height,
        isLandscape: this.isLandscape
      })
    },
    cancel: function () {
      this.$emit('setView', 'intro')
    },
    switchOrientation: function (isLandscape) {
      this.isLandscape = isLandscape
    }
  }
}
</script>

<style lang="scss">

.field-icon {
    font-size: 2rem;
}

.field-input {
  max-width: 3em;
}

.field-input:active, .field-input:focus{
  outline: none;
}

</style>