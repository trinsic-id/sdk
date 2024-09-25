(() => {
  // node_modules/@trinsic/web-ui/dist/index.esm.js
  var h = () => {
    let t = navigator.userAgent, o = () => !!t.match(/Android/i), i = () => !!t.match(/iPhone|iPad|iPod/i), a = () => !!t.match(/Opera Mini/i), e = () => !!t.match(/IEMobile/i), n = () => !!t.match(/SSR/i), r = () => !!(o() || i() || a() || e()), s = () => !r() && !n();
    return { isMobile: r(), isDesktop: s(), isAndroid: o(), isIos: i(), isSSR: n() };
  };
  function S(t, o) {
    for (var i = 0; i < o.length; i++) {
      var a = o[i];
      a.enumerable = a.enumerable || false, a.configurable = true, "value" in a && (a.writable = true), Object.defineProperty(t, a.key, a);
    }
  }
  function m(t) {
    return function(o) {
      if (Array.isArray(o)) return g(o);
    }(t) || function(o) {
      if (typeof Symbol < "u" && Symbol.iterator in Object(o)) return Array.from(o);
    }(t) || function(o, i) {
      if (o) {
        if (typeof o == "string") return g(o, i);
        var a = Object.prototype.toString.call(o).slice(8, -1);
        if (a === "Object" && o.constructor && (a = o.constructor.name), a === "Map" || a === "Set") return Array.from(o);
        if (a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)) return g(o, i);
      }
    }(t) || function() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function g(t, o) {
    (o == null || o > t.length) && (o = t.length);
    for (var i = 0, a = new Array(o); i < o; i++) a[i] = t[i];
    return a;
  }
  var A;
  var b;
  var c;
  var v;
  var C;
  var L = (A = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'], b = function() {
    function t(e) {
      var n = e.targetModal, r = e.triggers, s = r === void 0 ? [] : r, l = e.onShow, d = l === void 0 ? function() {
      } : l, u = e.onClose, B = u === void 0 ? function() {
      } : u, p = e.openTrigger, F = p === void 0 ? "data-micromodal-trigger" : p, y = e.closeTrigger, P = y === void 0 ? "data-micromodal-close" : y, w = e.openClass, R = w === void 0 ? "is-open" : w, k = e.disableScroll, j = k !== void 0 && k, E = e.disableFocus, D = E !== void 0 && E, x = e.awaitCloseAnimation, N = x !== void 0 && x, _ = e.awaitOpenAnimation, K = _ !== void 0 && _, M = e.debugMode, z = M !== void 0 && M;
      (function(Y, q) {
        if (!(Y instanceof q)) throw new TypeError("Cannot call a class as a function");
      })(this, t), this.modal = document.getElementById(n), this.config = { debugMode: z, disableScroll: j, openTrigger: F, closeTrigger: P, openClass: R, onShow: d, onClose: B, awaitCloseAnimation: N, awaitOpenAnimation: K, disableFocus: D }, s.length > 0 && this.registerTriggers.apply(this, m(s)), this.onClick = this.onClick.bind(this), this.onKeydown = this.onKeydown.bind(this);
    }
    var o, i, a;
    return o = t, (i = [{ key: "registerTriggers", value: function() {
      for (var e = this, n = arguments.length, r = new Array(n), s = 0; s < n; s++) r[s] = arguments[s];
      r.filter(Boolean).forEach(function(l) {
        l.addEventListener("click", function(d) {
          return e.showModal(d);
        });
      });
    } }, { key: "showModal", value: function() {
      var e = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      if (this.activeElement = document.activeElement, this.modal.setAttribute("aria-hidden", "false"), this.modal.classList.add(this.config.openClass), this.scrollBehaviour("disable"), this.addEventListeners(), this.config.awaitOpenAnimation) {
        var r = function s() {
          e.modal.removeEventListener("animationend", s, false), e.setFocusToFirstNode();
        };
        this.modal.addEventListener("animationend", r, false);
      } else this.setFocusToFirstNode();
      this.config.onShow(this.modal, this.activeElement, n);
    } }, { key: "closeModal", value: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, n = this.modal;
      if (this.modal.setAttribute("aria-hidden", "true"), this.removeEventListeners(), this.scrollBehaviour("enable"), this.activeElement && this.activeElement.focus && this.activeElement.focus(), this.config.onClose(this.modal, this.activeElement, e), this.config.awaitCloseAnimation) {
        var r = this.config.openClass;
        this.modal.addEventListener("animationend", function s() {
          n.classList.remove(r), n.removeEventListener("animationend", s, false);
        }, false);
      } else n.classList.remove(this.config.openClass);
    } }, { key: "closeModalById", value: function(e) {
      this.modal = document.getElementById(e), this.modal && this.closeModal();
    } }, { key: "scrollBehaviour", value: function(e) {
      if (this.config.disableScroll) {
        var n = document.querySelector("body");
        switch (e) {
          case "enable":
            Object.assign(n.style, { overflow: "" });
            break;
          case "disable":
            Object.assign(n.style, { overflow: "hidden" });
        }
      }
    } }, { key: "addEventListeners", value: function() {
      this.modal.addEventListener("touchstart", this.onClick), this.modal.addEventListener("click", this.onClick), document.addEventListener("keydown", this.onKeydown);
    } }, { key: "removeEventListeners", value: function() {
      this.modal.removeEventListener("touchstart", this.onClick), this.modal.removeEventListener("click", this.onClick), document.removeEventListener("keydown", this.onKeydown);
    } }, { key: "onClick", value: function(e) {
      (e.target.hasAttribute(this.config.closeTrigger) || e.target.parentNode.hasAttribute(this.config.closeTrigger)) && (e.preventDefault(), e.stopPropagation(), this.closeModal(e));
    } }, { key: "onKeydown", value: function(e) {
      e.keyCode === 27 && this.closeModal(e), e.keyCode === 9 && this.retainFocus(e);
    } }, { key: "getFocusableNodes", value: function() {
      var e = this.modal.querySelectorAll(A);
      return Array.apply(void 0, m(e));
    } }, { key: "setFocusToFirstNode", value: function() {
      var e = this;
      if (!this.config.disableFocus) {
        var n = this.getFocusableNodes();
        if (n.length !== 0) {
          var r = n.filter(function(s) {
            return !s.hasAttribute(e.config.closeTrigger);
          });
          r.length > 0 && r[0].focus(), r.length === 0 && n[0].focus();
        }
      }
    } }, { key: "retainFocus", value: function(e) {
      var n = this.getFocusableNodes();
      if (n.length !== 0) if (n = n.filter(function(s) {
        return s.offsetParent !== null;
      }), this.modal.contains(document.activeElement)) {
        var r = n.indexOf(document.activeElement);
        e.shiftKey && r === 0 && (n[n.length - 1].focus(), e.preventDefault()), !e.shiftKey && n.length > 0 && r === n.length - 1 && (n[0].focus(), e.preventDefault());
      } else n[0].focus();
    } }]) && S(o.prototype, i), a && S(o, a), t;
  }(), c = null, v = function(t) {
    if (!document.getElementById(t)) return console.warn("MicroModal: \u2757Seems like you have missed %c'".concat(t, "'"), "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "ID somewhere in your code. Refer example below to resolve it."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<div class="modal" id="'.concat(t, '"></div>')), false;
  }, C = function(t, o) {
    if (function(a) {
      a.length <= 0 && (console.warn("MicroModal: \u2757Please specify at least one %c'micromodal-trigger'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "data attribute."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<a href="#" data-micromodal-trigger="my-modal"></a>'));
    }(t), !o) return true;
    for (var i in o) v(i);
    return true;
  }, { init: function(t) {
    var o = Object.assign({}, { openTrigger: "data-micromodal-trigger" }, t), i = m(document.querySelectorAll("[".concat(o.openTrigger, "]"))), a = function(r, s) {
      var l = [];
      return r.forEach(function(d) {
        var u = d.attributes[s].value;
        l[u] === void 0 && (l[u] = []), l[u].push(d);
      }), l;
    }(i, o.openTrigger);
    if (o.debugMode !== true || C(i, a) !== false) for (var e in a) {
      var n = a[e];
      o.targetModal = e, o.triggers = m(n), c = new b(o);
    }
  }, show: function(t, o) {
    var i = o || {};
    i.targetModal = t, i.debugMode === true && v(t) === false || (c && c.removeEventListeners(), (c = new b(i)).showModal());
  }, close: function(t) {
    t ? c.closeModalById(t) : c.closeModal();
  } });
  typeof window < "u" && (window.MicroModal = L);
  async function X(t) {
    let o = h(), i = window.open("about:blank", "Trinsic", o.isDesktop ? "width=600,height=900" : "width=" + window.innerWidth + ",height=" + window.innerHeight + ",top=0,left=0");
    if (!i) throw new Error("Failed to open popup window");
    i.location.href = await t();
    var a = new Promise((e, n) => {
      window == null || window.addEventListener("message", (r) => {
        var s, l;
        console.debug("event data", r.data), ((s = r.data) == null ? void 0 : s.success) === true && (i == null || i.close(), e(r.data)), ((l = r.data) == null ? void 0 : l.success) === false && (i == null || i.close(), n(r.data));
      }, false);
    });
    return a;
  }

  // index.js
  X("https://google.com");
})();
