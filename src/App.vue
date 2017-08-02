<template>
  <div>
    <transition name="fade">
      <launcher v-if="!workspace" 
        @loadWorkspaceFile="loadWorkspaceFromFile" 
        @newCanvas="newWorkspace" 
        @loadWorkspaceIndex="loadWorkspaceFromStorage"/>
      <workspace v-if="workspace" />
    </transition>
  </div>
</template>

<script>

import storage from './services/storage.js'
import Toolbar from './services/toolbar.js'
import Triangulr from './services/triangulr.js'

import Launcher from './components/launcher/Launcher.vue'
import Workspace from './components/workspace/Workspace.vue'

var playground, controller;

export default {
  name: 'app',
  components: {
    Launcher,
    Workspace
  },
  data () {
    return {
      onPlay: false,
      workspace: null
    }
  },
  created () {
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
      storage.updateItem(this.workspace.id, playground.export())
    },
    loadWorkspaceFromStorage: function (id) {
      console.log('loadWorkspaceFromStorage', id)
      this.workspace = {id}
      playground.import(storage.getItem(id))
    },
    newWorkspace: function (data) {
      console.log('newWorkspace', data)
      playground.setCanvas(data.width, data.height, 30, data.isLandscape);
      this.workspace = storage.createItem(data.name || 'untitled')
      storage.updateItem(this.workspace.id, playground.export())
    }
  }
}
</script>

<style>
</style>