Vue.component('file-load', {
  methods: {
    load: function (event) {
      var files = event.currentTarget.files
      var file = files[0]
      var confReader = new FileReader()

      confReader.addEventListener('load', event => {
        try {
          var textFile = event.target
          var config = JSON.parse(textFile.result)
        }
        catch (e) {
          this.$emit('error', e)
          return
        }
        this.$emit('load', config)
      })

      // Read the text file
      confReader.readAsText(file)
    }
  },
  template: '\
    <label>\
      <span class="button">Upload</span>\
      <input type="file" @change="load($event)" class="hidden"/>\
    </label>'
})