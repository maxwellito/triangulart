Vue.component('grid-orientation-picker', {
  data: function () {
    return {
      orientation: 'landscape',
      isLandscape: true,
      styles: {}
    }
  },
  methods: {
    toggle: function () {
      this.isLandscape = !this.isLandscape;
      this.orientation = this.isLandscape ? 'landscape' : 'portrait'
      this.styles = {
        transform: this.isLandscape ? '' : 'rotate(90deg)'
      } 
    }
  },
  template: '\
    <div>\
      <svg class="grid-orientation-picker-svg" viewBox="0 0 62 54" style="transition: all .5s;" @click="toggle" v-bind:style="styles">\
        <path d="M16 1 L1 27 L31 27 Z"></path>\
        <path d="M16 1 L31 27 L46 1 Z"></path>\
        <path d="M46 1 L31 27 L61 27 Z"></path>\
        <path d="M0 27 L16 53 L31 27 Z"></path>\
        <path d="M31 27 L16 53 L46 53 Z"></path>\
        <path d="M31 27 L46 53 L61 27 Z"></path>\
      </svg>\
      <p>{{this.orientation}}</p>\
      <p><button @click="toggle">rotate &#8635;</button></p>\
    </div>'
})