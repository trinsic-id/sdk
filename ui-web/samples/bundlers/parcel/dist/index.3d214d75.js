// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"km5uZ":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "0a8ecb283d214d75";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    if (HMR_USE_SSE) ws = new EventSource("/__parcel_hmr");
    else try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"bB7Pu":[function(require,module,exports) {
var _webUi = require("@trinsic/web-ui");
console.log((0, _webUi.launchPopup)(()=>Promise.resolve("https://google.com")));

},{"@trinsic/web-ui":"hHRiy"}],"hHRiy":[function(require,module,exports) {
var TrinsicUI = (()=>{
    var h = Object.defineProperty;
    var W = Object.getOwnPropertyDescriptor;
    var U = Object.getOwnPropertyNames;
    var Z = Object.prototype.hasOwnProperty;
    var $ = (t, o)=>{
        for(var n in o)h(t, n, {
            get: o[n],
            enumerable: !0
        });
    }, G = (t, o, n, a)=>{
        if (o && typeof o == "object" || typeof o == "function") for (let e of U(o))!Z.call(t, e) && e !== n && h(t, e, {
            get: ()=>o[e],
            enumerable: !(a = W(o, e)) || a.enumerable
        });
        return t;
    };
    var J = (t)=>G(h({}, "__esModule", {
            value: !0
        }), t);
    var oe = {};
    $(oe, {
        launchIframe: ()=>Q,
        launchPopup: ()=>X,
        launchRedirect: ()=>V
    });
    var g = ()=>{
        let t = navigator.userAgent, o = ()=>!!t.match(/Android/i), n = ()=>!!t.match(/iPhone|iPad|iPod/i), a = ()=>!!t.match(/Opera Mini/i), e = ()=>!!t.match(/IEMobile/i), i = ()=>!!t.match(/SSR/i), r = ()=>!!(o() || n() || a() || e()), s = ()=>!r() && !i();
        return {
            isMobile: r(),
            isDesktop: s(),
            isAndroid: o(),
            isIos: n(),
            isSSR: i()
        };
    };
    function A(t, o) {
        for(var n = 0; n < o.length; n++){
            var a = o[n];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(t, a.key, a);
        }
    }
    function m(t) {
        return function(o) {
            if (Array.isArray(o)) return b(o);
        }(t) || function(o) {
            if (typeof Symbol < "u" && Symbol.iterator in Object(o)) return Array.from(o);
        }(t) || function(o, n) {
            if (o) {
                if (typeof o == "string") return b(o, n);
                var a = Object.prototype.toString.call(o).slice(8, -1);
                if (a === "Object" && o.constructor && (a = o.constructor.name), a === "Map" || a === "Set") return Array.from(o);
                if (a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)) return b(o, n);
            }
        }(t) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
    }
    function b(t, o) {
        (o == null || o > t.length) && (o = t.length);
        for(var n = 0, a = new Array(o); n < o; n++)a[n] = t[n];
        return a;
    }
    var C, v, c, p, L, T = (C = [
        "a[href]",
        "area[href]",
        'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
        "select:not([disabled]):not([aria-hidden])",
        "textarea:not([disabled]):not([aria-hidden])",
        "button:not([disabled]):not([aria-hidden])",
        "iframe",
        "object",
        "embed",
        "[contenteditable]",
        '[tabindex]:not([tabindex^="-"])'
    ], v = function() {
        function t(e) {
            var i = e.targetModal, r = e.triggers, s = r === void 0 ? [] : r, l = e.onShow, d = l === void 0 ? function() {} : l, u = e.onClose, F = u === void 0 ? function() {} : u, y = e.openTrigger, P = y === void 0 ? "data-micromodal-trigger" : y, w = e.closeTrigger, R = w === void 0 ? "data-micromodal-close" : w, k = e.openClass, j = k === void 0 ? "is-open" : k, E = e.disableScroll, D = E !== void 0 && E, x = e.disableFocus, N = x !== void 0 && x, _ = e.awaitCloseAnimation, K = _ !== void 0 && _, M = e.awaitOpenAnimation, z = M !== void 0 && M, S = e.debugMode, Y = S !== void 0 && S;
            (function(q, H) {
                if (!(q instanceof H)) throw new TypeError("Cannot call a class as a function");
            })(this, t), this.modal = document.getElementById(i), this.config = {
                debugMode: Y,
                disableScroll: D,
                openTrigger: P,
                closeTrigger: R,
                openClass: j,
                onShow: d,
                onClose: F,
                awaitCloseAnimation: K,
                awaitOpenAnimation: z,
                disableFocus: N
            }, s.length > 0 && this.registerTriggers.apply(this, m(s)), this.onClick = this.onClick.bind(this), this.onKeydown = this.onKeydown.bind(this);
        }
        var o, n, a;
        return o = t, n = [
            {
                key: "registerTriggers",
                value: function() {
                    for(var e = this, i = arguments.length, r = new Array(i), s = 0; s < i; s++)r[s] = arguments[s];
                    r.filter(Boolean).forEach(function(l) {
                        l.addEventListener("click", function(d) {
                            return e.showModal(d);
                        });
                    });
                }
            },
            {
                key: "showModal",
                value: function() {
                    var e = this, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
                    if (this.activeElement = document.activeElement, this.modal.setAttribute("aria-hidden", "false"), this.modal.classList.add(this.config.openClass), this.scrollBehaviour("disable"), this.addEventListeners(), this.config.awaitOpenAnimation) {
                        var r = function s() {
                            e.modal.removeEventListener("animationend", s, !1), e.setFocusToFirstNode();
                        };
                        this.modal.addEventListener("animationend", r, !1);
                    } else this.setFocusToFirstNode();
                    this.config.onShow(this.modal, this.activeElement, i);
                }
            },
            {
                key: "closeModal",
                value: function() {
                    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, i = this.modal;
                    if (this.modal.setAttribute("aria-hidden", "true"), this.removeEventListeners(), this.scrollBehaviour("enable"), this.activeElement && this.activeElement.focus && this.activeElement.focus(), this.config.onClose(this.modal, this.activeElement, e), this.config.awaitCloseAnimation) {
                        var r = this.config.openClass;
                        this.modal.addEventListener("animationend", function s() {
                            i.classList.remove(r), i.removeEventListener("animationend", s, !1);
                        }, !1);
                    } else i.classList.remove(this.config.openClass);
                }
            },
            {
                key: "closeModalById",
                value: function(e) {
                    this.modal = document.getElementById(e), this.modal && this.closeModal();
                }
            },
            {
                key: "scrollBehaviour",
                value: function(e) {
                    if (this.config.disableScroll) {
                        var i = document.querySelector("body");
                        switch(e){
                            case "enable":
                                Object.assign(i.style, {
                                    overflow: ""
                                });
                                break;
                            case "disable":
                                Object.assign(i.style, {
                                    overflow: "hidden"
                                });
                        }
                    }
                }
            },
            {
                key: "addEventListeners",
                value: function() {
                    this.modal.addEventListener("touchstart", this.onClick), this.modal.addEventListener("click", this.onClick), document.addEventListener("keydown", this.onKeydown);
                }
            },
            {
                key: "removeEventListeners",
                value: function() {
                    this.modal.removeEventListener("touchstart", this.onClick), this.modal.removeEventListener("click", this.onClick), document.removeEventListener("keydown", this.onKeydown);
                }
            },
            {
                key: "onClick",
                value: function(e) {
                    (e.target.hasAttribute(this.config.closeTrigger) || e.target.parentNode.hasAttribute(this.config.closeTrigger)) && (e.preventDefault(), e.stopPropagation(), this.closeModal(e));
                }
            },
            {
                key: "onKeydown",
                value: function(e) {
                    e.keyCode === 27 && this.closeModal(e), e.keyCode === 9 && this.retainFocus(e);
                }
            },
            {
                key: "getFocusableNodes",
                value: function() {
                    var e = this.modal.querySelectorAll(C);
                    return Array.apply(void 0, m(e));
                }
            },
            {
                key: "setFocusToFirstNode",
                value: function() {
                    var e = this;
                    if (!this.config.disableFocus) {
                        var i = this.getFocusableNodes();
                        if (i.length !== 0) {
                            var r = i.filter(function(s) {
                                return !s.hasAttribute(e.config.closeTrigger);
                            });
                            r.length > 0 && r[0].focus(), r.length === 0 && i[0].focus();
                        }
                    }
                }
            },
            {
                key: "retainFocus",
                value: function(e) {
                    var i = this.getFocusableNodes();
                    if (i.length !== 0) {
                        if (i = i.filter(function(s) {
                            return s.offsetParent !== null;
                        }), this.modal.contains(document.activeElement)) {
                            var r = i.indexOf(document.activeElement);
                            e.shiftKey && r === 0 && (i[i.length - 1].focus(), e.preventDefault()), !e.shiftKey && i.length > 0 && r === i.length - 1 && (i[0].focus(), e.preventDefault());
                        } else i[0].focus();
                    }
                }
            }
        ], A(o.prototype, n), a && A(o, a), t;
    }(), c = null, p = function(t) {
        if (!document.getElementById(t)) return console.warn("MicroModal: \u2757Seems like you have missed %c'".concat(t, "'"), "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "ID somewhere in your code. Refer example below to resolve it."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<div class="modal" id="'.concat(t, '"></div>')), !1;
    }, L = function(t, o) {
        if (function(a) {
            a.length <= 0 && (console.warn("MicroModal: \u2757Please specify at least one %c'micromodal-trigger'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "data attribute."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<a href="#" data-micromodal-trigger="my-modal"></a>'));
        }(t), !o) return !0;
        for(var n in o)p(n);
        return !0;
    }, {
        init: function(t) {
            var o = Object.assign({}, {
                openTrigger: "data-micromodal-trigger"
            }, t), n = m(document.querySelectorAll("[".concat(o.openTrigger, "]"))), a = function(r, s) {
                var l = [];
                return r.forEach(function(d) {
                    var u = d.attributes[s].value;
                    l[u] === void 0 && (l[u] = []), l[u].push(d);
                }), l;
            }(n, o.openTrigger);
            if (o.debugMode !== !0 || L(n, a) !== !1) for(var e in a){
                var i = a[e];
                o.targetModal = e, o.triggers = m(i), c = new v(o);
            }
        },
        show: function(t, o) {
            var n = o || {};
            n.targetModal = t, n.debugMode === !0 && p(t) === !1 || (c && c.removeEventListeners(), (c = new v(n)).showModal());
        },
        close: function(t) {
            t ? c.closeModalById(t) : c.closeModal();
        }
    });
    typeof window < "u" && (window.MicroModal = T);
    var f = T;
    var I = '\n.modal__overlay {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background: rgba(0, 0, 0, 0.5);\n    display: flex;\n    justify-content: center;\n    align-items: center\n  }\n\n  .modal__header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center\n  }\n\n  .modal__title {\n    margin-top: 0;\n    margin-bottom: 0;\n    font-weight: 600;\n    font-size: 1.25rem;\n    line-height: 1.25;\n    color: #00449e;\n    box-sizing: border-box\n  }\n\n  .modal__close {\n    background: transparent;\n    border: 0\n  }\n\n  .modal__header .modal__close:before {\n    content: "\u2715"\n  }\n\n  .modal__content {\n    margin-top: 2rem;\n    margin-bottom: 2rem;\n    line-height: 1.5;\n    color: #000c\n  }\n\n  .modal__btn {\n    font-size: .875rem;\n    padding: .5rem 1rem;\n    background-color: #e6e6e6;\n    color: #000c;\n    border-radius: .25rem;\n    border-style: none;\n    border-width: 0;\n    cursor: pointer;\n    -webkit-appearance: button;\n    text-transform: none;\n    overflow: visible;\n    line-height: 1.15;\n    margin: 0;\n    will-change: transform;\n    -moz-osx-font-smoothing: grayscale;\n    backface-visibility: hidden;\n    transform: translateZ(0);\n    transition: transform .25s ease-out\n  }\n\n  .modal__btn:focus,\n  .modal__btn:hover {\n    transform: scale(1.05)\n  }\n\n  .modal__btn-primary {\n    background-color: #00449e;\n    color: #fff\n  }\n\n  @keyframes mmfadeIn {\n    0% {\n      opacity: 0\n    }\n\n    to {\n      opacity: 1\n    }\n  }\n\n  @keyframes mmfadeOut {\n    0% {\n      opacity: 1\n    }\n\n    to {\n      opacity: 0\n    }\n  }\n\n  @keyframes mmslideIn {\n    0% {\n      transform: translateY(15%)\n    }\n\n    to {\n      transform: translateY(0)\n    }\n  }\n\n  @keyframes mmslideOut {\n    0% {\n      transform: translateY(0)\n    }\n\n    to {\n      transform: translateY(-10%)\n    }\n  }\n\n  .micromodal-slide {\n    display: none\n  }\n\n  .micromodal-slide.is-open {\n    display: block\n  }\n\n  .micromodal-slide[aria-hidden=false] .modal__overlay {\n    animation: mmfadeIn .3s cubic-bezier(0, 0, .2, 1)\n  }\n\n  .micromodal-slide[aria-hidden=false] .modal__container {\n    animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1)\n  }\n\n  .micromodal-slide[aria-hidden=true] .modal__overlay {\n    animation: mmfadeOut .3s cubic-bezier(0, 0, .2, 1)\n  }\n\n  .micromodal-slide[aria-hidden=true] .modal__container {\n    animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1)\n  }\n\n  .micromodal-slide .modal__container,\n  .micromodal-slide .modal__overlay {\n    will-change: transform\n  }\n\n\n  .fixed {\n    position: fixed\n  }\n\n  .inset-0 {\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0\n  }\n\n\n  .flex {\n    display: flex\n  }\n\n\n  .h-[600px] {\n    height: 600px\n  }\n\n  .h-full {\n    height: 100%\n  }\n\n\n  .min-h-[600px] {\n    min-height: 600px\n  }\n\n  .place-content-center {\n    place-content: center\n  }\n\n  .items-center {\n    align-items: center\n  }\n\n  .justify-center {\n    justify-content: center\n  }\n\n  .bg-transparent {\n    background-color: transparent\n  }\n\n\n  .w-full {\n    width: 100%\n  }\n\n  .lock-bg {\n    overflow-y: hidden;\n    overflow-x: hidden;\n  }\n\n  .h-600px {\n    height: 600px;\n  }\n\n  .w-400px {\n    width: 400px;\n  }\n\n  #trinsic-ui iframe {\n    border: 0;\n  }\n\n  ';
    async function Q(t) {
        t += "&embed=iframe";
        let o = document.createElement("style");
        if (o.id = "trinsic-ui-style", o.textContent = I, document.head.appendChild(o), f.init(), t == null || t === "") throw new Error("Please specify a launch url by calling our API via one of our backend SDK's");
        ee(t);
        var n = new Promise((a, e)=>{
            window.addEventListener("message", (i)=>{
                var r, s;
                console.debug("event data", i.data), ((r = i.data) == null ? void 0 : r.success) === !0 && (O(), a(i.data)), ((s = i.data) == null ? void 0 : s.success) === !1 && (O(), e(i.data));
            }, !1);
        });
        return n;
    }
    async function V(t, o) {
        t += "&redirectUrl=" + o, window.location.href = t;
    }
    async function X(t) {
        let o = g(), n = window.open("about:blank", "Trinsic", o.isDesktop ? "width=600,height=900" : "width=" + window.innerWidth + ",height=" + window.innerHeight + ",top=0,left=0");
        if (!n) throw new Error("Failed to open popup window");
        n.location.href = await t();
        var a = new Promise((e, i)=>{
            window == null || window.addEventListener("message", (r)=>{
                var s, l;
                console.debug("event data", r.data), ((s = r.data) == null ? void 0 : s.success) === !0 && (n == null || n.close(), e(r.data)), ((l = r.data) == null ? void 0 : l.success) === !1 && (n == null || n.close(), i(r.data));
            }, !1);
        });
        return a;
    }
    function ee(t) {
        B();
        let o = g(), n = document.createElement("div");
        n.id = "trinsic-ui", n.ariaHidden = "true", n.className = "micromodal-slide";
        let a = document.createElement("div");
        a.tabIndex = -1, a.className = "fixed inset-0 flex items-center justify-center modal__overlay";
        let e = document.createElement("div");
        e.ariaModal = "true", e.className = o.isDesktop ? "modal__container h-600px w-400px lock-bg shadow-lg" : "modal__container h-full min-h-600px w-full";
        let i = document.createElement("iframe");
        if (i.className = "h-full w-full bg-transparent", i.allow = "camera *; microphone *; display-capture *; publickey-credentials-get *; publickey-credentials-create *", i.src = t, e.append(i), a.append(e), n.append(a), document == null || document.body === null || document.body === void 0 || document.body.classList === null || document.body.classList === void 0) throw new Error("document.body.classList is null or undefined. Make sure you run this code after your DOM has loaded. You can use the event listener 'DOMContentLoaded' to ensure this.");
        document.body.classList.add("lock-bg"), document.body.append(n), f.show("trinsic-ui");
    }
    function O() {
        try {
            f.close("trinsic-ui");
        } catch (t) {}
        document.body.classList.remove("lock-bg"), B();
    }
    function B() {
        let t = document.getElementById("trinsic-ui");
        t == null || t.remove();
    }
    return J(oe);
})();

},{}]},["km5uZ","bB7Pu"], "bB7Pu", "parcelRequire9f69")

//# sourceMappingURL=index.3d214d75.js.map
