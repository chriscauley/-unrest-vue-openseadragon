import r from "openseadragon";
import { openBlock as a, createElementBlock as m, resolveComponent as _, createBlock as w, withModifiers as v, renderSlot as g, reactive as f, markRaw as x, normalizeStyle as p, createVNode as b, createCommentVNode as z, createElementVNode as y } from "vue";
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
    e.element = this.$el, window.viewer_jawn = this.viewer = new r(e);
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
function C(e, o, t, n, s, i) {
  return a(), m("div", {
    id: t.id,
    class: "osd-wrapper"
  }, null, 8, O);
}
const E = /* @__PURE__ */ d($, [["render", C]]), M = {
  components: { OpenSeadragon: E },
  props: {
    osd_store: Object,
    editor_mode: Boolean,
    osd_options: Object
  },
  emits: ["viewer-bound"],
  data() {
    const { editor_mode: e } = this, o = {
      maxZoomPixelRatio: e ? 8 : 4,
      navigatorAutoFade: !1,
      showNavigator: !0,
      showZoomControl: !1,
      showHomeControl: !1,
      showFullPageControl: !1,
      showRotationControl: !1,
      debugmode: !1,
      clickTimeThreshold: 1e3,
      gestureSettingsMouse: {
        clickToZoom: !1,
        dblClickToZoom: !1
      },
      ...this.osd_options
    };
    return o.mouseNavEnabled === void 0 && (o.mouseNavEnabled = !e), { prepped_osd_options: o, viewer: null };
  },
  watch: {
    osd_options: {
      deep: !0,
      handler() {
        this.viewer.setMouseNavEnabled(!!this.osd_options.mouseNavEnabled);
      }
    },
    editor_mode() {
      var t, n;
      const { viewer: e } = this, o = (n = (t = this.osd_options) == null ? void 0 : t.mouseNavEnabled) != null ? n : !0;
      e.setMouseNavEnabled(!this.editor_mode && o), e.viewport.maxZoomPixelRatio = this.editor_mode ? 8 : 4;
    }
  },
  methods: {
    osdWheel(e) {
      if (!this.editor_mode || !this.osd_options.mouseNavEnabled)
        return;
      const { viewer: o } = this, t = o.viewport;
      if (e.ctrlKey) {
        const n = o.container.getBoundingClientRect(), s = new r.Point(e.pageX - n.left, e.pageY - n.top), i = Math.pow(o.zoomPerScroll, -e.deltaY / 20);
        t.zoomBy(i, t.pointFromPixel(s, !0));
      } else {
        const n = t.pixelFromPoint(t.getCenter(!0)), s = t.pointFromPixel(
          new r.Point(n.x + 3 * e.deltaX, n.y + 3 * e.deltaY)
        );
        t.panTo(s, !1);
      }
      t.applyConstraints();
    },
    callback(e) {
      var o;
      this.viewer = e, (o = this.osd_store) == null || o.bindViewer(e), this.$emit("viewer-bound", e);
    }
  }
};
function k(e, o, t, n, s, i) {
  const l = _("open-seadragon");
  return a(), w(l, {
    onMousewheel: v(i.osdWheel, ["prevent"]),
    options: s.prepped_osd_options,
    onViewerBound: i.callback,
    pixelated: !0
  }, null, 8, ["onMousewheel", "options", "onViewerBound"]);
}
const B = /* @__PURE__ */ d(M, [["render", k]]), S = {
  props: {
    viewer: Object
  },
  mounted() {
    this.viewer.addOverlay(this.$el, new r.Rect(0, 0, 1, 1));
  }
}, N = { class: "osd-html__overlay" };
function j(e, o, t, n, s, i) {
  return a(), m("div", N, [
    g(e.$slots, "default")
  ]);
}
const h = /* @__PURE__ */ d(S, [["render", j]]), H = () => {
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
}, P = (e, o, t) => Math.min(t, Math.max(e, o)), c = [0, 0.5, 1, 2, 3, 4], T = {
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
      this.viewer.viewport.zoomTo(P(e, this.zoom.min, this.zoom.max));
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
}, V = /* @__PURE__ */ y("div", { class: "osd-zoom-controls__track" }, null, -1);
function R(e, o, t, n, s, i) {
  const l = _("unrest-draggable");
  return s.zoom ? (a(), m("div", {
    key: 0,
    class: "osd-zoom-controls",
    style: p(i.wrapper_style)
  }, [
    V,
    b(l, {
      class: "osd-zoom-controls__current",
      style: p(i.handle_style),
      onDragstart: i.dragstart,
      onDrag: i.drag
    }, null, 8, ["style", "onDragstart", "onDrag"])
  ], 4)) : z("", !0);
}
const u = /* @__PURE__ */ d(T, [["render", R]]), X = {
  HtmlOverlay: h,
  Store: H,
  ZoomControls: u,
  install(e) {
    e.component("OsdHtmlOverlay", h), e.component("OsdZoomControls", u), e.component("OsdViewer", B);
  }
};
export {
  X as default
};
