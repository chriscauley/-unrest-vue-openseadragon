import i from "openseadragon";
import { openBlock as a, createElementBlock as m, resolveComponent as u, createBlock as w, withModifiers as v, renderSlot as g, reactive as f, markRaw as x, normalizeStyle as h, createVNode as b, createCommentVNode as z, createElementVNode as y } from "vue";
import Z from "@unrest/vue-mousetrap";
const d = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [n, s] of o)
    t[n] = s;
  return t;
}, $ = {
  props: {
    id: {
      type: String,
      default: "openseadragon-viewer"
    },
    options: Object,
    events: Object,
    pixelated: Boolean
  },
  emits: ["viewer-bound"],
  data() {
    return { viewer: null };
  },
  mounted() {
    const { ...e } = this.options;
    e.element = this.$el, window.viewer_jawn = this.viewer = new i(e);
    const { viewport: o } = this.viewer;
    o.centerSpringY.animationTime = 0.25, o.centerSpringX.animationTime = 0.25, o.zoomSpring.animationTime = 0.25, this.bindEvents(), this.$emit("viewer-bound", this.viewer);
    const t = () => {
      if (this.pixelated) {
        const { drawer: n, viewport: s } = this.viewer;
        n.context.imageSmoothingEnabled = s.getZoom() < 0.5;
      }
    };
    this.viewer.addHandler("zoom", t), this.viewer.addOnceHandler("tile-loaded", t);
  },
  methods: {
    bindEvents() {
      const { events: e = {}, viewer: o } = this;
      Object.entries(e).forEach(([t, n]) => o.addHandler(t, n));
    }
  }
}, O = ["id"];
function C(e, o, t, n, s, r) {
  return a(), m("div", {
    id: t.id,
    class: "osd-wrapper"
  }, null, 8, O);
}
const k = /* @__PURE__ */ d($, [["render", C]]), B = {
  components: { OpenSeadragon: k },
  props: {
    osd_store: Object,
    editor_mode: Boolean
  },
  emits: ["viewer-bound"],
  data() {
    const { editor_mode: e } = this;
    return { osd_options: {
      maxZoomPixelRatio: e ? 8 : 4,
      navigatorAutoFade: !1,
      showNavigator: !0,
      showZoomControl: !1,
      showHomeControl: !1,
      showFullPageControl: !1,
      showRotationControl: !1,
      debugmode: !1,
      clickTimeThreshold: 1e3,
      mouseNavEnabled: !e,
      gestureSettingsMouse: {
        clickToZoom: !1,
        dblClickToZoom: !1
      }
    } };
  },
  watch: {
    editor_mode() {
      const { viewer: e } = this.osd_store;
      e.setMouseNavEnabled(!this.editor_mode), e.viewport.maxZoomPixelRatio = this.editor_mode ? 8 : 4;
    }
  },
  methods: {
    osdWheel(e) {
      if (!this.editor_mode)
        return;
      const o = this.osd_store.viewer, t = o.viewport;
      if (e.ctrlKey) {
        const n = o.container.getBoundingClientRect(), s = new i.Point(e.pageX - n.left, e.pageY - n.top), r = Math.pow(o.zoomPerScroll, -e.deltaY / 20);
        t.zoomBy(r, t.pointFromPixel(s, !0));
      } else {
        const n = t.pixelFromPoint(t.getCenter(!0)), s = t.pointFromPixel(
          new i.Point(n.x + 3 * e.deltaX, n.y + 3 * e.deltaY)
        );
        t.panTo(s, !1);
      }
      t.applyConstraints();
    },
    callback(e) {
      this.osd_store.bindViewer(e), this.$emit("viewer-bound", e);
    }
  }
};
function M(e, o, t, n, s, r) {
  const l = u("open-seadragon");
  return a(), w(l, {
    onMousewheel: v(r.osdWheel, ["prevent"]),
    options: s.osd_options,
    onViewerBound: r.callback,
    pixelated: !0
  }, null, 8, ["onMousewheel", "options", "onViewerBound"]);
}
const S = /* @__PURE__ */ d(B, [["render", M]]), H = {
  props: {
    viewer: Object
  },
  mounted() {
    this.viewer.addOverlay(this.$el, new i.Rect(0, 0, 1, 1));
  }
}, P = { class: "osd-html__overlay" };
function T(e, o, t, n, s, r) {
  return a(), m("div", P, [
    g(e.$slots, "default")
  ]);
}
const p = /* @__PURE__ */ d(H, [["render", T]]), V = () => {
  const e = f({ _viewer: null });
  return {
    state: e,
    patch: (o) => Object.assign(e, o),
    get viewer() {
      return e._viewer;
    },
    set viewer(o) {
      e._viewer = o && x(o);
    },
    bindViewer(o) {
      e._viewer = o, o.addHandler("zoom", () => e.zoom = o.viewport.getZoom());
    }
  };
}, j = (e, o, t) => Math.min(t, Math.max(e, o)), c = [0, 0.5, 1, 2, 3, 4], E = {
  mixins: [Z.Mixin],
  props: {
    viewer: Object
  },
  data() {
    return { zoom: null, start_zoom: void 0, box: void 0 };
  },
  computed: {
    wrapper_style() {
      const { height: e, width: o } = this.viewer.navigator.element.getBoundingClientRect();
      return { right: `${o}px`, height: `${e}px` };
    },
    handle_style() {
      return { bottom: `${100 * (this.zoom.current - this.zoom.min) / this.zoom.range}%` };
    },
    mousetrap() {
      return {
        "+=": () => this.nextZoom(),
        "-": () => this.prevZoom()
      };
    }
  },
  mounted() {
    this.viewer.addHandler("zoom", this.setZoom), this.viewer.addOnceHandler("open", this.setZoom);
  },
  methods: {
    setZoom() {
      this.zoom = {
        current: this.viewer.viewport.getZoom(),
        min: this.viewer.viewport.getMinZoom(),
        max: this.viewer.viewport.getMaxZoom()
      }, this.zoom.range = this.zoom.max - this.zoom.min;
    },
    dragstart() {
      this.box = this.$el.getBoundingClientRect(), this.start_zoom = this.viewer.viewport.getZoom();
    },
    drag(e) {
      const { xy_start: o, xy: t } = e._drag, n = (o[1] - t[1]) / this.box.height;
      this.applyZoom(this.start_zoom + n * this.zoom.range);
    },
    applyZoom(e) {
      this.viewer.viewport.zoomTo(j(e, this.zoom.min, this.zoom.max));
    },
    nextZoom() {
      const e = c.findIndex((o) => o > this.zoom.current);
      this.applyZoom(c[e]);
    },
    prevZoom() {
      const e = c.slice().reverse(), o = e.findIndex((t) => t < this.zoom.current);
      this.applyZoom(e[o]);
    }
  }
}, R = /* @__PURE__ */ y("div", { class: "osd-zoom-controls__track" }, null, -1);
function N(e, o, t, n, s, r) {
  const l = u("unrest-draggable");
  return s.zoom ? (a(), m("div", {
    key: 0,
    class: "osd-zoom-controls",
    style: h(r.wrapper_style)
  }, [
    R,
    b(l, {
      class: "osd-zoom-controls__current",
      style: h(r.handle_style),
      onDragstart: r.dragstart,
      onDrag: r.drag
    }, null, 8, ["style", "onDragstart", "onDrag"])
  ], 4)) : z("", !0);
}
const _ = /* @__PURE__ */ d(E, [["render", N]]), X = {
  HtmlOverlay: p,
  Store: V,
  ZoomControls: _,
  install(e) {
    e.component("OsdHtmlOverlay", p), e.component("OsdZoomControls", _), e.component("OsdViewer", S);
  }
};
export {
  X as default
};
