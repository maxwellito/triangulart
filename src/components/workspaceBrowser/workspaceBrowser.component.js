
Vue.component('workspace-browser', {
  data: function () {
    return {
      indexes: storage.loadIndexes()
    }
  },
  methods: {
    resumeWorkspace: function (id) {
      this.$emit('load-workspace', id)
    },
    deleteWorkspace: function (id) {
      storage.deleteItem(id)
    }
  },
  computed: {
    sortedIndexes: function () {
      return this.indexes.sort((a, b) => a.date < b.date)
    }
  },
  template: '\
    <table>\
      <tr v-for="index in sortedIndexes" :key="index.id">\
        <td @click="resumeWorkspace(index.id)">{{index.name}} <small>updated on {{index.date | timeAgo}}</small></td>\
        <td @click="deleteWorkspace(index.id)">Delete</td>\
      </tr>\
    </table>'
})

Vue.filter('timeAgo', function (value) {
  let gap = (+(new Date()) - value) / 1000
  if (gap < 60) {
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