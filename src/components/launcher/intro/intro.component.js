Vue.component('intro', {
  data: function () {
    return {
      indexes: storage.loadIndexes()
    }
  },
  methods: {
    configLoaded: function (data) {
      this.$emit('loadWorkspace', data)
    },
    startNew: function () {
      this.$emit('setView', 'create')
    },
    loadPrevious: function () {
      this.$emit('setView', 'workspace')
    }
  },
  computed: {
    projectsAvalable: function () {
      return this.indexes.length
    }
  },
  template: '\
    <div>\
      <div class="row row-inline">\
        <object data="assets/triangulart_logo.svg" type="image/svg+xml" class="intro-logo"></object>\
        <div>\
          <h1>triangulart</h1>\
          <p>This is a silly graphic editor build in JavaScript to create isometric illustrations.<br>\
             Triangulart is like pixel art but for triangles.<br><br>\
             Please choose one of the following action</p>\
        </div>\
      </div>\
      <div class="row row-balanced">\
        <div class="launcher-action-box">\
          <file-load @jsonLoaded="configLoaded">\
            <svg class="launcher-action-icon"><use xlink:href="#action-import"></use></svg>\
            <span>Upload project</span>\
          </file-load>\
        </div>\
        <div class="launcher-action-box">\
          <svg @click="startNew" class="launcher-action-icon"><use xlink:href="#action-add"></use></svg>\
          <span @click="startNew">Start a new canvas</span>\
        </div>\
        <div class="launcher-action-box">\
          <svg @click="loadPrevious" class="launcher-action-icon"><use xlink:href="#action-floppydisk"></use></svg>\
          <span @click="loadPrevious">Load previous project</span> \
          <span v-if="projectsAvalable" :text-content.prop="projectsAvalable" class="notif"></span>\
        </div>\
      </div>\
    </div>'
  })