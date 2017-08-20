<template>
  <div>
    <transition name="fade">
      <launcher v-if="!onPlay" 
        @loadWorkspaceFile="loadWorkspaceFromFile" 
        @newCanvas="newWorkspace" 
        @loadWorkspaceIndex="loadWorkspaceFromStorage"/>
      <workspace v-if="onPlay" :playground="playground"/>
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
    loadWorkspaceFromFile: function (data) {
      this.onPlay = this.playground.loadWorkspaceFromFile(data)
    },
    loadWorkspaceFromStorage: function (id) {
      this.onPlay = this.playground.loadWorkspaceFromStorage(id)
    },
    newWorkspace: function (data) {
      this.onPlay = this.playground.newWorkspace(data)
    }
  }
}
</script>

<style>
</style>