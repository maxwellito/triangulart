<template>
  <div class="launcher-content">
    <div class="row row-inline">
      <object data="assets/vectors/triangulart_logo.svg" type="image/svg+xml" class="intro-logo"></object>
      <div>
        <h1>triangulart <small>[v2 beta]</small></h1>
        <p>Graphic editor to create isometric illustrations, it's like pixel art but with triangles.<br>
           Don't forget to share your creation with <a href="https://twitter.com/search?q=%23triangulart">#triangulart</a></p>
        <p class="credits">
          by <a href="https://twitter.com/mxwllt"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-maxwellito"></use></svg></a> / on <a href="https://github.com/maxwellito/triangulart"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-github"></use></svg></a>
        </p>
      </div>
    </div>
    <div class="row row-balanced">
      <file-load @jsonLoaded="configLoaded" class="launcher-action-box">
        <svg class="launcher-action-icon"><use xlink:href="#action-import"></use></svg>
        <span>Upload project</span>
      </file-load>
      <div class="launcher-action-box">
        <svg @click="startNew" class="launcher-action-icon"><use xlink:href="#action-add"></use></svg>
        <span @click="startNew">Start a new canvas</span>
      </div>
      <div class="launcher-action-box">
        <svg @click="loadPrevious" class="launcher-action-icon"><use xlink:href="#action-floppydisk"></use></svg>
        <span @click="loadPrevious">Load previous project 
          <span v-if="projectsAvalable" :text-content.prop="projectsAvalable" class="notif"></span>
        </span>
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
      this.$emit('loadWorkspaceConfig', data)
    },
    startNew: function () {
      this.$emit('setView', 'create')
    },
    loadPrevious: function () {
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

.credits svg {
  vertical-align: sub;
}

@media (max-width: 480px) {
  .intro-logo {
    padding-right: 0;
    border-right: none;
    margin-right: 0;
    width: 200px;
    max-width: 50%;
  }
}
</style>