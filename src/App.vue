<template>
  <osd-viewer :osd_store="osd_store" @viewer-bound="addImages" :width="1000" />
</template>

<script>
import osd from '@unrest/vue-openseadragon'
import openseadragon from 'openseadragon'
import corner from '@/assets/corner_64.png'

const images = [
  ['https://via.placeholder.com/100x100', 9, 9],
  ['https://via.placeholder.com/140x100', 0, 0],
  ['https://via.placeholder.com/200x200', 1, 1],
]

const { Rect } = openseadragon
const x_max = 10
const y_max = 10

export default {
  data() {
    return { osd_store: osd.Store() }
  },
  methods: {
    addCorners() {
      const url = corner
      const corners = [
        [0, 0, 0],
        [0, y_max-1, 270],
        [x_max-1, y_max-1, 180],
        [x_max-1, 0, 90],
      ]
      corners.forEach(([x, y, degrees]) => {
        this.osd_store.viewer.addSimpleImage({ url, x, y, width: 1, opacity: 1, degrees })
      })
    },
    addImages() {
      this.osd_store.viewer.addOnceHandler('tile-loaded', this.syncImages)
      this.addCorners()
    },
    syncImages() {
      images.forEach(([url, x, y]) => {
        const [width, height] = url.split('/').pop().split('x').map(Number)
        const { _contentSize } = this.osd_store.viewer.world
        this.osd_store.viewer.addSimpleImage({
          url,
          x: x,
          y: y,
          width: width / 100,
        })
      })
      this.osd_store.viewer.viewport.fitBounds(new Rect(0, 0, x_max, y_max), true)
    }
  }
}
</script>
