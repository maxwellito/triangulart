<template>
  <div class="launcher-content">
    <div class="nav-actions">
      <button class="button" @click="cancel">&lt; Back</button>
    </div>
    <div class="row">
      <label class="new-canvas-field">
        <div class="field">
          <input class="field-input" type="number" v-model="width" min="1"/>
          <span class="field-icon">↔</span>
        </div>
        <span>Map width</span>
      </label>
      <label class="new-canvas-field">
        <div class="field">
          <input class="field-input" type="number" v-model="height" min="1"/>
          <span class="field-icon">↕</span>
        </div>
        <span>Map height</span>
      </label>
      <grid-orientation-picker @update:isLandscape="switchOrientation" class="new-canvas-field"></grid-orientation-picker>
    </div>
    <div class="center">
      <div class="button-group">
        <input type="text" v-model="name">
        <button class="button" @click="create">GO!</button>
      </div>
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
      isLandscape: true,
      name: 'untitled-project'
    }
  },
  methods: {
    create: function () {
      console.log(42)
      this.$emit('newCanvas', {
        width: this.width,
        height: this.height,
        isLandscape: this.isLandscape,
        name: this.name
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
  font-size: 2rem;
  border: none;
}

.field-input:active, .field-input:focus{
  outline: none;
}

@media (max-width: 480px) {
  .new-canvas-field {
    display: block;
    text-align: center;
    margin-bottom: 2rem;
  }
}

</style>