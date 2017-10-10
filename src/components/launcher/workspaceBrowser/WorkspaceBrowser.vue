<template>
  <div class="launcher-content">
    <div class="nav-actions">
      <button @click="cancel" class="button">&lt; Back</button>
    </div>
    <h3 class="row">Choose your saved workspace</h3>
    <div class="row">
      <table class="table workspace-browser-list">
        <tr v-for="index in sortedIndexes" :key="index.id">
          <td class="workspace-browser-list-label" @click="resumeWorkspace(index.id)">
            <span>{{index.name}}</span> 
            <small>updated {{index.date | timeAgo}}</small>
          </td>
          <td class="workspace-browser-list-action">
            <span @click="renameWorkspace(index)">&#182;</span>
          </td>
          <td class="workspace-browser-list-action">
            <span @click="deleteWorkspace(index)">&#215;</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

import storage from '../../../services/storage.js'

export default {
  name: 'workspace-browser',
  data () {
    return {
      indexes: storage.loadIndexes()
    }
  },
  methods: {
    cancel: function () {
      this.$emit('setView', 'intro')
    },
    resumeWorkspace: function (id) {
      console.log('Emitation', id)
      this.$emit('loadWorkspaceIndex', id)
    },
    renameWorkspace: function (item) {
      let newName = window.prompt(`Enter the new name for "${item.name}"`, item.name)
      if (newName != null) {
        storage.renameItem(item.id, newName)
      }
    },
    deleteWorkspace: function (item) {
      if (window.confirm(`Are you sure to delete "${item.name}" ?`)) {
        storage.deleteItem(item.id)
      }
    }
  },
  computed: {
    sortedIndexes: function () {
      return this.indexes.sort((a, b) => a.date < b.date)
    }
  }
}
</script>

<style lang="scss">

.workspace-browser-list {
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.workspace-browser-list-label {
  font-size: 1.25rem;
}

.workspace-browser-list-action {
  width: 2rem;
  font-size: 1.25rem;
  text-align: right;
}

.workspace-browser-list td * {
  cursor: pointer;
}

@media (max-width: 480px) {
  .workspace-browser-list-label * {
    display: block;
  }
}

</style>