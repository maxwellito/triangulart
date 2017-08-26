<template>
  <label>
    <slot></slot>
    <input type="file" @change="load($event)" accept=".json, .svg" class="hidden"/>
  </label>
</template>

<script>

export default {
  name: 'file-load',
  methods: {
    load: function (event) {
      var files = event.currentTarget.files
      var file = files[0]
      var confReader = new FileReader()

      confReader.addEventListener('load', event => {
        if (!event.target || !event.target.result) {
          this.$emit('error', e)
          return
        }
        this.$emit('jsonLoaded', event.target.result)
      })

      // Read the text file
      confReader.readAsText(file)
    }
  }
}
</script>