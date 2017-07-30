var playground, controller;

Vue.component('app', {
  data: function () {
    return {
      onPlay: false,
      workspace: null
    }
  },
  created: function () {
    playground = new Triangulr('playground');
    controller = new Toolbar(playground);
  },
  methods: {
    setView: function (view) {
      this.view = view
    },
    loadWorkspaceFromFile: function (data) {
      console.log('loadWorkspaceFromFile', data)
      playground.import(data)
      this.workspace = storage.createItem('imported file')
      storage.updateItem(this.workspace.id, JSON.stringify(playground.export()))
    },
    loadWorkspaceFromStorage: function (id) {
      console.log('loadWorkspaceFromStorage', id)
      this.workspace = {id}
      playground.import(JSON.parse(storage.getItem(id)))
    },
    newWorkspace: function (data) {
      console.log('newWorkspace', data)
      playground.setCanvas(data.width, data.height, 30, data.isLandscape);
      this.workspace = storage.createItem(data.name || 'untitled')
      storage.updateItem(this.workspace.id, JSON.stringify(playground.export()))
    }
  },
  template: '\
    <div>\
      <transition name="fade">\
        <launcher v-if="!workspace" \
          @loadWorkspaceFile="loadWorkspaceFromFile" \
          @newCanvas="newWorkspace" \
          @loadWorkspaceIndex="loadWorkspaceFromStorage"/>\
        <workspace v-if="workspace" />\
      </transition>\
    </div>'
  })