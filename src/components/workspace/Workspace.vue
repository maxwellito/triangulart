<template>
  <div>
    <div ref="playground" class="playground"></div>
    <toolbar :playground="playground" :workspace="workspace"/>
  </div>
</template>

<script>

import Toolbar from './toolbar/Toolbar.vue'

export default {
  name: 'workspace',
  props: ['playground', 'workspace'],
  components: {
    Toolbar
  },
  data () {
    return {
      foo: 'bar'
    }
  },
  mounted: function () {
    this.playground.setContainer(this.$refs.playground)
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
</style>