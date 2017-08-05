<template>
  <div>
    <transition name="fade">
      <launcher v-if="!workspace" 
        @loadWorkspaceFile="loadWorkspaceFromFile" 
        @newCanvas="newWorkspace" 
        @loadWorkspaceIndex="loadWorkspaceFromStorage"/>
      <workspace v-if="workspace" :playground="playground"/>
    </transition>
  </div>
</template>

<script>

import storage from './services/storage.js'
import Triangulr from './services/triangulr.js'

import Launcher from './components/launcher/Launcher.vue'
import Workspace from './components/workspace/Workspace.vue'

export default {
  name: 'app',
  components: {
    Launcher,
    Workspace
  },
  data () {
    return {
      onPlay: false,
      workspace: null,
      playground: new Triangulr('playground')
    }
  },
  methods: {
    setView: function (view) {
      this.view = view
    },
    loadWorkspaceFromFile: function (data) {
      console.log('loadWorkspaceFromFile', data)
      this.playground.import(data)
      this.workspace = storage.createItem('imported file')
      storage.updateItem(this.workspace.id, this.playground.export())
    },
    loadWorkspaceFromStorage: function (id) {
      console.log('loadWorkspaceFromStorage', id)
      this.workspace = {id}
      this.playground.import(storage.getItem(id))
    },
    newWorkspace: function (data) {
      console.log('newWorkspace', data)
      this.playground.setCanvas(data.width, data.height, 30, data.isLandscape);
      this.workspace = storage.createItem(data.name || 'untitled')
      storage.updateItem(this.workspace.id, this.playground.export())
    }
  }
}
</script>

<style>
</style>