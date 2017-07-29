
Vue.component('new-canvas-form', {
  data: function () {
    return {
      width: 30,
      height: 20,
      isLandscape: true
    }
  },
  methods: {
    create: function () {
      this.$emit('new-canvas', {
        width: this.width,
        height: this.height,
        isLandscape: this.isLandscape
      })
    },
    cancel: function () {
      this.$emit('back')
    }
  },
  template: '\
    <div>\
      <div class="row">\
        <label>\
          <div class="field">\
            <input class="field-input" type="number" v-model="width" min="1"/>\
            <span class="field-icon">↔</span>\
          </div>\
          <span>Map width</span>\
        </label>\
        <label>\
          <div class="field">\
            <input class="field-input" type="number" v-model="height" min="1"/>\
            <span class="field-icon">↕</span>\
          </div>\
          <span>Map height</span>\
        </label>\
        <grid-orientation-picker @update:isLandscape="val => isLandscape = val"></grid-orientation-picker>\
      </div>\
      <div>\
        <button class="button">Back</button>\
        <button class="button">GO!</button>\
      </div>\
    </div>'
})