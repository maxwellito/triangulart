<template>
  <div>
    <transition-group name="fade">
      <launcher key="launcher" v-show="!workspace"
        @loadWorkspaceConfig="loadWorkspaceConfig"
        @newCanvas="newWorkspace"
        @loadWorkspaceIndex="loadWorkspaceFromStorage"/>
      <workspace key="workspace" v-show="workspace" :playground="playground" :workspace="workspace"/>
    </transition-group>
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
      workspace: null,
      playground: new Triangulr('playground')
    }
  },
  created: function () {
    window.addEventListener('hashchange', () => {
      this.locationCheck()
    })
  },
  mounted: function () {
    this.locationCheck()
  },
  methods: {
    loadWorkspaceConfig: function (data) {
      this.workspace = this.playground.loadWorkspaceFromFile(data)
      this.setLocation()
    },
    loadWorkspaceFromStorage: function (id) {
      this.workspace = this.playground.loadWorkspaceFromStorage(id)
      this.setLocation()
    },
    newWorkspace: function (data) {
      this.workspace = this.playground.newWorkspace(data)
      this.setLocation()
    },
    setLocation: function () {
      if (this.workspace && this.workspace.id) {
        window.location.hash = this.workspace.id
      }
    },
    locationCheck: function () {
      let hash = window.location.hash
      if (hash && hash !== '#') {
        // Go to the page
        hash = parseInt(hash.substr(1))
        if (hash && (!this.workspace || this.workspace.id !== hash)) {
          this.loadWorkspaceFromStorage(hash)
        }
      }
      else {
        // Go to the home
        this.workspace = null
      }
    }
  }
}
</script>

<style lang="scss">

$selector-stroke-dark: #666;
$selector-stroke-bright: #999;

.movable {
  cursor: move;
}

.selector-rect {
  fill: #fff;
  fill-opacity: 0.01;
  stroke: $selector-stroke-dark;
  stroke-dasharray: 4px;
  animation: 1s selector-stroke linear infinite;
}

@keyframes selector-stroke {
  0%    {stroke: $selector-stroke-dark; stroke-dashoffset: 0;}
  49.9% {stroke: $selector-stroke-dark;}
  50%   {stroke: $selector-stroke-bright;}
  99.9% {stroke: $selector-stroke-bright;}
  100%  {stroke: $selector-stroke-dark; stroke-dashoffset: 8px;}
}
</style>
