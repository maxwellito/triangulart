Vue.component('launcher', {
  data: function () {
    return {
      view: 'intro'
    }
  },
  methods: {
    setView: function (view) {
      this.view = view
    },
    loadWorkspaceFile: function (data) {
      this.$emit('loadWorkspaceFile', data)
    },
    loadWorkspaceIndex: function (data) {
      this.$emit('loadWorkspaceIndex', data)
    },
    newCanvas: function (data) {
      this.$emit('newCanvas', data)
    }
  },
  template: '\
    <div class="launcher">\
      <transition name="fade">\
        <intro @setView="setView" @loadWorkspaceFile="loadWorkspaceFile" v-if="view === \'intro\'"/>\
        <new-canvas-form @newCanvas="newCanvas" @setView="setView" v-if="view === \'create\'"/>\
        <workspace-browser @loadWorkspaceIndex="loadWorkspaceIndex" @setView="setView" v-if="view === \'workspace\'"/>\
      </transition>\
    </div>'
  })