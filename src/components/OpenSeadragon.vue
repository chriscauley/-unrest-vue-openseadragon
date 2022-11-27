<template>
  <div :id="id" class="osd-wrapper" />
</template>

<script>
import OSD from 'openseadragon'

export default {
  props: {
    id: {
      type: String,
      default: 'openseadragon-viewer',
    },
    options: Object,
    events: Object,
    pixelated: Boolean,
  },
  emits: ['viewer-bound'],

  data() {
    return { viewer: null }
  },

  mounted() {
    const { ...options } = this.options
    options.element = this.$el
    window.viewer_jawn = this.viewer = new OSD(options)

    const { viewport } = this.viewer
    viewport.centerSpringY.animationTime = 0.25
    viewport.centerSpringX.animationTime = 0.25
    viewport.zoomSpring.animationTime = 0.25
    this.bindEvents()
    this.$emit('viewer-bound', this.viewer)
    // pixelation looks weird at higer zoom levels
    const onZoom = () => {
      if (this.pixelated) {
        const { drawer, viewport } = this.viewer
        drawer.context.imageSmoothingEnabled = viewport.getZoom() < 0.5
      }
    }
    this.viewer.addHandler('zoom', onZoom)
    this.viewer.addOnceHandler('tile-loaded', onZoom)
  },

  methods: {
    bindEvents() {
      const { events = {}, viewer } = this
      Object.entries(events).forEach(([key, handler]) => viewer.addHandler(key, handler))
    },
  },
}
</script>
