<template>
  <div class="toolbar">
    <div>
      <svg class="icon">
        <use xlink:href="#icon-pen"></use>
      </svg>
      <svg class="icon">
        <use xlink:href="#icon-eraser"></use>
      </svg>
    </div>

    <div>
      <svg class="icon">
        <use xlink:href="#icon-fullscreen"></use>
      </svg>
      <svg class="icon">
        <use xlink:href="#icon-preview"></use>
      </svg>
      <svg class="icon">
        <use xlink:href="#icon-download"></use>
      </svg>
    </div>
    <!--
    <div class="leftbar">
      <div class="button-group">
        <button type="button" onclick="controller.eraseMode();">
          <svg class="icon">
            <use xlink:href="#icon-eraser"></use>
          </svg>
        </button>
      </div>
      <div class="button-group">
        <input type="color" id="color-picker" class="color-picker" onchange="controller.updateCurrentColor();" onclick="controller.updateCurrentColor();"/><button type="button" onclick="controller.addColor();">+</button>
      </div>
      <div class="colorlist" id="color-list"></div>
    </div>

    <div class="rightbar">
      <div class="button-group">
        <button type="button" onclick="controller.toggleOutline();">outline</button>
      </div>
      <div class="button-group">
        <button type="button" onclick="controller.load();">load</button><button type="button" onclick="controller.save();">save</button>
      </div>
      <div class="button-group">
        <button type="button" onclick="controller.exportSVG();">export (SVG)</button>
      </div>
      <a href="https://github.com/maxwellito/triangulart">
        <svg class="icon">
          <use xlink:href="#icon-github"></use>
        </svg>
      </a>
    </div>
    -->
  </div>
</template>

<script>

export default {
  name: 'workspace',
  data () {
    return {
      foo: 'bar'
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.toolbar {
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  bottom: 0;
  width: 100%;
  padding: .5rem;
  background-color: #131016;
  color: #ccc;
  box-sizing: border-box;

  .icon {
    width: 2rem;
    height: 2rem;
  }
}

.icon + .icon {
  margin-left: .5rem;
}

</style>