Vue.component('launcher', {
  props: ['foo'],
  data: function () {
    return {
      projectsAvalable: 2
    }
  },
  methods: {
    configLoaded: function (data) {
      alert(data)
    },
    startNew: function () {

    },
    loadPrevious: function () {

    }
  },
  template: '\
    <div class="launcher grid">\
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
          <file-load @load="configLoaded">\
            <svg class="launcher-action-icon"><use xlink:href="#action-import"></use></svg>\
            <span>Upload project</span>\
          </file-load>\
        </div>\
        <div class="launcher-action-box">\
          <svg @load="startNew" class="launcher-action-icon"><use xlink:href="#action-add"></use></svg>\
          <span @load="startNew">Start a new canvas</span>\
        </div>\
        <div class="launcher-action-box">\
          <svg @load="loadPrevious" class="launcher-action-icon"><use xlink:href="#action-floppydisk"></use></svg>\
          <span @load="loadPrevious">Load previous project</span> <span v-if="projectsAvalable" :text-content.prop="projectsAvalable" class="notif">2</span>\
        </div>\
      </div>\
    </div>'
  })