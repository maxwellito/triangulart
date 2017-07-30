<template>
  <div class="launcher">
    <transition name="fade">
      <intro @setView="setView" @loadWorkspaceFile="loadWorkspaceFile" v-if="view === 'intro'"/>
      <new-canvas-form @newCanvas="newCanvas" @setView="setView" v-if="view === 'create'"/>
      <workspace-browser @loadWorkspaceIndex="loadWorkspaceIndex" @setView="setView" v-if="view === 'workspace'"/>
    </transition>
  </div>
</template>

<script>

import Intro from './intro/Intro.vue'
import NewCanvasForm from './newCanvasForm/NewCanvasForm.vue'
import WorkspaceBrowser from './workspaceBrowser/WorkspaceBrowser.vue'

export default {
  name: 'launcher',
  components: {
    Intro,
    NewCanvasForm,
    WorkspaceBrowser
  },
  data () {
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
  }
}
</script>

<style lang="scss">

.launcher {
  position: fixed;
  left: 0;
  right: 0;

  z-index: 10;
  padding: 2rem;
  width: 100%;
  height: 100%;
  max-width: 960px;
  margin: auto;

  box-sizing: border-box;
  background-color: #fff;
}

.launcher-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;
  height: 100%;
}

.launcher-action-box {
  width: 30%;
  text-align: center;
  cursor: pointer;
}

.launcher-action-icon {
  display: block;
  width: 72px;
  height: 72px;
  margin: 0 auto 1rem;
}

</style>