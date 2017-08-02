<template>
  <toolbar/>
</template>

<script>

import Toolbar from './toolbar/Toolbar.vue'

export default {
  name: 'workspace',
  components: {
    Toolbar
  },
  data () {
    return {
      foo: 'bar'
    }
  },
  methods: {}
}
</script>

<style>
.playground svg {
  cursor: crosshair;
  margin: 1rem 1rem 80px;
}

.playground path, .grid path {
  stroke: currentColor;
  stroke-width: 0.25;
}

.color-picker {
  height: 1.5rem;
  padding: 0 0 0 2px;
  border: none;
  background: none;
  border-radius: 2px;
}


</style>