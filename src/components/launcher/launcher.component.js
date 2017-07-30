Vue.component('launcher', {
  data: function () {
    return {
      view: 'intro'
    }
  },
  methods: {
    setView: function (view) {
      console.log('::', view)
      this.view = view
    },
    loadWorkspaceFromFile: function (data) {
      alert('Load workspace')
    },
    loadWorkspaceFromStorage: function (data) {
      alert('Load workspace')
    },
    newWorkspace: function (data) {
      alert('New workspace')
    }
  },
  template: '\
    <div class="launcher">\
      <intro @setView="setView" @loadWorkspace="loadWorkspaceFromFile" v-if="view === \'intro\'"/>\
      <new-canvas-form @setView="setView" @newCanvas="newWorkspace" v-if="view === \'create\'"/>\
      <workspace-browser @setView="setView" @loadWorkspace="loadWorkspaceFromStorage" v-if="view === \'workspace\'"/>\
    </div>'
  })