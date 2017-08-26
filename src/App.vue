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