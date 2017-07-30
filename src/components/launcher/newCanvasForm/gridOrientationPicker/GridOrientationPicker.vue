<template>
  <div class="grid-orientation-picker">
    <svg class="grid-orientation-picker-svg" viewBox="0 0 62 62" @click="toggle" >
      <g class="grid-orientation-picker-pattern" :class="orientation">
        <path d="M16 5 L1 31 L31 31 Z"></path>
        <path d="M16 5 L31 31 L46 5 Z"></path>
        <path d="M46 5 L31 31 L61 31 Z"></path>
        <path d="M0 31 L16 57 L31 31 Z"></path>
        <path d="M31 31 L16 57 L46 57 Z"></path>
        <path d="M31 31 L46 57 L61 31 Z"></path>
      </g>
    </svg>
    <p class="grid-orientation-picker-label">
      <span>{{this.orientation}}</span></br>
      <span>Orientation</span>
      <span @click="toggle">&#8635;</span>
    </p>
  </div>
</template>

<script>

export default {
  name: 'grid-orientation-picker',
  data () {
    return {
      isLandscape: true,
      orientation: 'Landscape',
      styles: {}
    }
  },
  methods: {
    toggle: function () {
      this.isLandscape = !this.isLandscape;
      this.orientation = this.isLandscape ? 'Landscape' : 'Portrait'
      this.styles = {
        transform: this.isLandscape ? '' : 'rotate(90deg)'
      }
      this.$emit('update:isLandscape', this.isLandscape)
    }
  }
}
</script>

<style lang="scss">

.grid-orientation-picker-label {
  margin: 0;
}

.grid-orientation-picker-svg {
  float: left;
  width: 4rem;
  height: 4rem;
  margin-right: 1rem;
}

.grid-orientation-picker-pattern {
  transition: all .5s;
  transform-origin: 50% 50%;
}

.grid-orientation-picker-pattern.Portrait {
  transform: rotate(90deg);
}

.grid-orientation-picker-svg path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2px;
  stroke-linejoin:round;
  stroke-miterlimit:10;
}

</style>