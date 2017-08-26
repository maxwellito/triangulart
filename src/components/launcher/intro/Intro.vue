<template>
  <div class="launcher-content">
    <div class="row row-inline">
      <object data="assets/triangulart_logo.svg" type="image/svg+xml" class="intro-logo"></object>
      <div>
        <h1>triangulart</h1>
        <p>This is a silly graphic editor build in JavaScript to create isometric illustrations.<br>
           Triangulart is like pixel art but for triangles.<br><br>
           Please choose one of the following action</p>
      </div>
    </div>
    <div class="row row-balanced">
      <div class="launcher-action-box">
        <file-load @jsonLoaded="configLoaded">
          <svg class="launcher-action-icon"><use xlink:href="#action-import"></use></svg>
          <span>Upload project</span>
        </file-load>
      </div>
      <div class="launcher-action-box">
        <svg @click="startNew" class="launcher-action-icon"><use xlink:href="#action-add"></use></svg>
        <span @click="startNew">Start a new canvas</span>
      </div>
      <div class="launcher-action-box">
        <svg @click="loadPrevious" class="launcher-action-icon"><use xlink:href="#action-floppydisk"></use></svg>
        <span @click="loadPrevious">Load previous project</span> 
        <span v-if="projectsAvalable" :text-content.prop="projectsAvalable" class="notif"></span>
      </div>
    </div>
  </div>
</template>

<script>

import storage from '../../../services/storage.js'
import FileLoad from './fileLoad/FileLoad.vue'

export default {
  name: 'intro',
  components: {
    FileLoad
  },
  data () {
    return {
      indexes: storage.loadIndexes()
    }
  },
  methods: {
    configLoaded: function (data) {
      console.log('loadWorkspaceConfig', data.substr(0,40))
      this.$emit('loadWorkspaceConfig', data)
    },
    startNew: function () {
      console.log('setView', 'create')
      this.$emit('setView', 'create')
    },
    loadPrevious: function () {
      console.log('setView', 'workspace')
      this.$emit('setView', 'workspace')
    }
  },
  computed: {
    projectsAvalable: function () {
      return this.indexes.length
    }
  }
}
</script>

<style>

.intro-logo {
  padding-right: 2rem;
  border-right: 1px solid currentColor;
  margin-right: 2rem;
  width: 20%;
}
</style>