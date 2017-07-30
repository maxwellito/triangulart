
Vue.component('workspace-browser', {
  data: function () {
    return {
      indexes: storage.loadIndexes()
    }
  },
  methods: {
    cancel: function () {
      this.$emit('setView', 'intro')
    },
    resumeWorkspace: function (item) {
      this.$emit('load-workspace', item.id)
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
  },
  template: '\
    <div class="launcher-content">\
      <h3 class="row">Choose your saved workspace</h3>\
      <div class="row">\
        <table class="table workspace-browser-list">\
          <tr v-for="index in sortedIndexes" :key="index.id">\
            <td class="workspace-browser-list-label" @click="resumeWorkspace(index)">\
              <span>{{index.name}}</span> \
              <small>updated {{index.date | timeAgo}}</small>\
            </td>\
            <td class="workspace-browser-list-action">\
              <span @click="renameWorkspace(index)">&#182;</span>\
            </td>\
            <td class="workspace-browser-list-action">\
              <span @click="deleteWorkspace(index)">&#215;</span>\
            </td>\
          </tr>\
        </table>\
      </div>\
      <div>\
        <button @click="cancel" class="button">Back</button>\
      </div>\
    </div>'
})

Vue.filter('timeAgo', function (value) {
  let gap = (+(new Date()) - value) / 1000
  if (gap < 2) {
    return 'just now'
  }
  else if (gap < 60) {
    return Math.floor(gap) + 's ago'
  }
  else if (gap < 3600) {
    return Math.floor(gap/60) + 'min ago'
  }
  else if (gap < (3600 * 24)) {
    return Math.floor(gap/3600) + 'h ago'
  }
  else if (gap < (3600 * 24 * 30)) {
    return Math.floor(gap/(3600*24)) + ' day(s) ago'
  }
  else if (gap < (3600 * 24 * 365)) {
    return Math.floor(gap/(3600*24*30)) + ' month(s) ago'
  }
  else {
    return Math.floor(gap/(3600*24*365)) + ' year(s) ago'
  }
})