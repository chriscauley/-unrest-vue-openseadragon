import l from "openseadragon";
import { resolveComponent as u, openBlock as c, createBlock as g, withModifiers as w, createElementBlock as _, renderSlot as v, reactive as x, markRaw as f, normalizeStyle as d, createVNode as z, createCommentVNode as y, createElementVNode as b } from "vue";
import Z from "@unrest/vue-mousetrap";
const m = (o, e) => {
  const t = o.__vccOpts || o;
  for (const [s, r] of e)
    t[s] = r;
  return t;
}, $ = {
  props: {
    osd_store: Object
  },
  emits: ["viewer-bound"],
  data() {
    var t;
    const o = !!((t = this.$auth.user) != null && t.is_superuser);
    return { osd_options: {
      maxZoomPixelRatio: o ? 8 : 4,
      navigatorAutoFade: !1,
      showNavigator: !0,
      showZoomControl: !1,
      showHomeControl: !1,
      showFullPageControl: !1,
      showRotationControl: !1,
      debugmode: !1,
      clickTimeThreshold: 1e3,
      mouseNavEnabled: !o,
      gestureSettingsMouse: {
        clickToZoom: !1,
        dblClickToZoom: !1
      }
    } };
  },
  computed: {
    is_editor() {
      var o;
      return !!((o = this.$auth.user) != null && o.is_superuser);
    }
  },
  watch: {
    is_editor() {
      const { viewer: o } = this.osd_store;
      o.setMouseNavEnabled(!this.is_editor), o.viewport.maxZoomPixelRatio = this.is_editor ? 8 : 4;
    }
  },
  methods: {
    osdWheel(o) {
      if (!this.is_editor)
        return;
      const e = this.osd_store.viewer, t = e.viewport;
      if (o.ctrlKey) {
        const s = e.container.getBoundingClientRect(), r = new l.Point(o.pageX - s.left, o.pageY - s.top), n = Math.pow(e.zoomPerScroll, -o.deltaY / 20);
        t.zoomBy(n, t.pointFromPixel(r, !0));
      } else {
        const s = t.pixelFromPoint(t.getCenter(!0)), r = t.pointFromPixel(
          new l.Point(s.x + 3 * o.deltaX, s.y + 3 * o.deltaY)
        );
        t.panTo(r, !1);
      }
      t.applyConstraints();
    },
    callback(o) {
      this.osd_store.bindViewer(o), this.$emit("viewer-bound", o);
    }
  }
};
function k(o, e, t, s, r, n) {
  const i = u("open-seadragon");
  return c(), g(i, {
    onMousewheel: w(n.osdWheel, ["prevent"]),
    options: r.osd_options,
    callback: n.callback,
    pixelated: !0
  }, null, 8, ["onMousewheel", "options", "callback"]);
}
const C = /* @__PURE__ */ m($, [["render", k]]), O = {
  props: {
    viewer: Object
  },
  mounted() {
    this.viewer.addOverlay(this.$el, new l.Rect(0, 0, 1, 1));
  }
}, M = { class: "osd-html__overlay" };
function P(o, e, t, s, r, n) {
  return c(), _("div", M, [
    v(o.$slots, "default")
  ]);
}
const h = /* @__PURE__ */ m(O, [["render", P]]), B = () => {
  const o = x({ _viewer: null });
  return {
    state: o,
    patch: (e) => Object.assign(o, e),
    get viewer() {
      return o._viewer;
    },
    set viewer(e) {
      o._viewer = e && f(e);
    },
    bindViewer(e) {
      o._viewer = e, e.addHandler("zoom", () => o.zoom = e.viewport.getZoom());
    }
  };
}, R = (o, e, t) => Math.min(t, Math.max(o, e)), a = [0, 0.5, 1, 2, 3, 4], V = {
  mixins: [Z.Mixin],
  props: {
    viewer: Object
  },
  data() {
    return { zoom: null, start_zoom: void 0, box: void 0 };
  },
  computed: {
    wrapper_style() {
      const { height: o, width: e } = this.viewer.navigator.element.getBoundingClientRect();
      return { right: `${e}px`, height: `${o}px` };
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
    drag(o) {
      const { xy_start: e, xy: t } = o._drag, s = (e[1] - t[1]) / this.box.height;
      this.applyZoom(this.start_zoom + s * this.zoom.range);
    },
    applyZoom(o) {
      this.viewer.viewport.zoomTo(R(o, this.zoom.min, this.zoom.max));
    },
    nextZoom() {
      const o = a.findIndex((e) => e > this.zoom.current);
      this.applyZoom(a[o]);
    },
    prevZoom() {
      const o = a.slice().reverse(), e = o.findIndex((t) => t < this.zoom.current);
      this.applyZoom(o[e]);
    }
  }
}, H = /* @__PURE__ */ b("div", { class: "osd-zoom-controls__track" }, null, -1);
function N(o, e, t, s, r, n) {
  const i = u("unrest-draggable");
  return r.zoom ? (c(), _("div", {
    key: 0,
    class: "osd-zoom-controls",
    style: d(n.wrapper_style)
  }, [
    H,
    z(i, {
      class: "osd-zoom-controls__current",
      style: d(n.handle_style),
      onDragstart: n.dragstart,
      onDrag: n.drag
    }, null, 8, ["style", "onDragstart", "onDrag"])
  ], 4)) : y("", !0);
}
const p = /* @__PURE__ */ m(V, [["render", N]]), F = {
  HtmlOverlay: h,
  Store: B,
  ZoomControls: p,
  install(o) {
    o.component("OsdHtmlOverlay", h), o.component("OsdZoomControls", p), o.component("OsdViewer", C);
  }
};
export {
  F as default
};
