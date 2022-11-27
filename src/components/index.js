import BaseViewer from './BaseViewer.vue'
import HtmlOverlay from './HtmlOverlay.vue'
import Store from './Store.js'
import ZoomControls from './ZoomControls.vue'

export default {
  HtmlOverlay,
  Store,
  ZoomControls,
  install(app) {
    app.component('OsdHtmlOverlay', HtmlOverlay)
    app.component('OsdZoomControls', ZoomControls)
    app.component('OsdViewer', BaseViewer)
  },
}
