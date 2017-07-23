Vue.component('grid-orientation-picker', {
  data: function () {
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
  },
  template: '\
    <div class="grid-orientation-picker">\
      <svg class="grid-orientation-picker-svg" viewBox="0 0 62 62" @click="toggle" >\
        <g class="grid-orientation-picker-pattern" :class="orientation">\
          <path d="M16 5 L1 31 L31 31 Z"></path>\
          <path d="M16 5 L31 31 L46 5 Z"></path>\
          <path d="M46 5 L31 31 L61 31 Z"></path>\
          <path d="M0 31 L16 57 L31 31 Z"></path>\
          <path d="M31 31 L16 57 L46 57 Z"></path>\
          <path d="M31 31 L46 57 L61 31 Z"></path>\
        </g>\
      </svg>\
      <p class="grid-orientation-picker-label">\
        <span>{{this.orientation}}</span></br>\
        <span>Orientation</span>\
        <span @click="toggle">&#8635;</span>\
      </p>\
    </div>'
})