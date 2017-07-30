import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
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

//# TEMP: enable the unload warning
// Prevent quit
// window.onbeforeunload = function() {
//   return "All current work will be destroyed and lost. Be sure you have saved or exported your work.";
// }