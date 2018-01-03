<template>
  <div class="launcher">
    <transition name="fade">
      <intro @setView="setView" @loadWorkspaceConfig="loadWorkspaceConfig" v-if="view === 'intro'"/>
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
    loadWorkspaceConfig: function (data) {
      this.$emit('loadWorkspaceConfig', data)
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

.nav-actions {
  &:after {
    content: '';
    display: block;
    clear: both;
  }
}

@media (max-width: 480px) {
  .launcher {
    padding: 1.5rem;
  }

  .launcher-action-box {
    display: flex;
    align-items: center;

    & + & {
      margin-top: .5rem;
    }
  }

  .launcher-action-icon {
    width: 48px;
    min-width: 48px;
    height: 48px;
    margin-right: .5rem;
  }

  .grid-orientation-picker {
    max-width: 200px;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: 481px) {
  .launcher {
    position: fixed;
    left: 0;
    right: 0;

    z-index: 10;
    width: 100%;
    height: 100%;
    max-width: 960px;
    margin: auto;
    padding: 2rem;

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
}

</style>