/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@trinsic/web-ui/dist/index.esm.js":
/*!********************************************************!*\
  !*** ./node_modules/@trinsic/web-ui/dist/index.esm.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   launchIframe: () => (/* binding */ Q),\n/* harmony export */   launchPopup: () => (/* binding */ X),\n/* harmony export */   launchRedirect: () => (/* binding */ V)\n/* harmony export */ });\nvar h=()=>{let t=navigator.userAgent,o=()=>!!t.match(/Android/i),i=()=>!!t.match(/iPhone|iPad|iPod/i),a=()=>!!t.match(/Opera Mini/i),e=()=>!!t.match(/IEMobile/i),n=()=>!!t.match(/SSR/i),r=()=>!!(o()||i()||a()||e()),s=()=>!r()&&!n();return{isMobile:r(),isDesktop:s(),isAndroid:o(),isIos:i(),isSSR:n()}};function S(t,o){for(var i=0;i<o.length;i++){var a=o[i];a.enumerable=a.enumerable||!1,a.configurable=!0,\"value\"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function m(t){return function(o){if(Array.isArray(o))return g(o)}(t)||function(o){if(typeof Symbol<\"u\"&&Symbol.iterator in Object(o))return Array.from(o)}(t)||function(o,i){if(o){if(typeof o==\"string\")return g(o,i);var a=Object.prototype.toString.call(o).slice(8,-1);if(a===\"Object\"&&o.constructor&&(a=o.constructor.name),a===\"Map\"||a===\"Set\")return Array.from(o);if(a===\"Arguments\"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return g(o,i)}}(t)||function(){throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\")}()}function g(t,o){(o==null||o>t.length)&&(o=t.length);for(var i=0,a=new Array(o);i<o;i++)a[i]=t[i];return a}var A,b,c,v,C,L=(A=[\"a[href]\",\"area[href]\",'input:not([disabled]):not([type=\"hidden\"]):not([aria-hidden])',\"select:not([disabled]):not([aria-hidden])\",\"textarea:not([disabled]):not([aria-hidden])\",\"button:not([disabled]):not([aria-hidden])\",\"iframe\",\"object\",\"embed\",\"[contenteditable]\",'[tabindex]:not([tabindex^=\"-\"])'],b=function(){function t(e){var n=e.targetModal,r=e.triggers,s=r===void 0?[]:r,l=e.onShow,d=l===void 0?function(){}:l,u=e.onClose,B=u===void 0?function(){}:u,p=e.openTrigger,F=p===void 0?\"data-micromodal-trigger\":p,y=e.closeTrigger,P=y===void 0?\"data-micromodal-close\":y,w=e.openClass,R=w===void 0?\"is-open\":w,k=e.disableScroll,j=k!==void 0&&k,E=e.disableFocus,D=E!==void 0&&E,x=e.awaitCloseAnimation,N=x!==void 0&&x,_=e.awaitOpenAnimation,K=_!==void 0&&_,M=e.debugMode,z=M!==void 0&&M;(function(Y,q){if(!(Y instanceof q))throw new TypeError(\"Cannot call a class as a function\")})(this,t),this.modal=document.getElementById(n),this.config={debugMode:z,disableScroll:j,openTrigger:F,closeTrigger:P,openClass:R,onShow:d,onClose:B,awaitCloseAnimation:N,awaitOpenAnimation:K,disableFocus:D},s.length>0&&this.registerTriggers.apply(this,m(s)),this.onClick=this.onClick.bind(this),this.onKeydown=this.onKeydown.bind(this)}var o,i,a;return o=t,(i=[{key:\"registerTriggers\",value:function(){for(var e=this,n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];r.filter(Boolean).forEach(function(l){l.addEventListener(\"click\",function(d){return e.showModal(d)})})}},{key:\"showModal\",value:function(){var e=this,n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:null;if(this.activeElement=document.activeElement,this.modal.setAttribute(\"aria-hidden\",\"false\"),this.modal.classList.add(this.config.openClass),this.scrollBehaviour(\"disable\"),this.addEventListeners(),this.config.awaitOpenAnimation){var r=function s(){e.modal.removeEventListener(\"animationend\",s,!1),e.setFocusToFirstNode()};this.modal.addEventListener(\"animationend\",r,!1)}else this.setFocusToFirstNode();this.config.onShow(this.modal,this.activeElement,n)}},{key:\"closeModal\",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:null,n=this.modal;if(this.modal.setAttribute(\"aria-hidden\",\"true\"),this.removeEventListeners(),this.scrollBehaviour(\"enable\"),this.activeElement&&this.activeElement.focus&&this.activeElement.focus(),this.config.onClose(this.modal,this.activeElement,e),this.config.awaitCloseAnimation){var r=this.config.openClass;this.modal.addEventListener(\"animationend\",function s(){n.classList.remove(r),n.removeEventListener(\"animationend\",s,!1)},!1)}else n.classList.remove(this.config.openClass)}},{key:\"closeModalById\",value:function(e){this.modal=document.getElementById(e),this.modal&&this.closeModal()}},{key:\"scrollBehaviour\",value:function(e){if(this.config.disableScroll){var n=document.querySelector(\"body\");switch(e){case\"enable\":Object.assign(n.style,{overflow:\"\"});break;case\"disable\":Object.assign(n.style,{overflow:\"hidden\"})}}}},{key:\"addEventListeners\",value:function(){this.modal.addEventListener(\"touchstart\",this.onClick),this.modal.addEventListener(\"click\",this.onClick),document.addEventListener(\"keydown\",this.onKeydown)}},{key:\"removeEventListeners\",value:function(){this.modal.removeEventListener(\"touchstart\",this.onClick),this.modal.removeEventListener(\"click\",this.onClick),document.removeEventListener(\"keydown\",this.onKeydown)}},{key:\"onClick\",value:function(e){(e.target.hasAttribute(this.config.closeTrigger)||e.target.parentNode.hasAttribute(this.config.closeTrigger))&&(e.preventDefault(),e.stopPropagation(),this.closeModal(e))}},{key:\"onKeydown\",value:function(e){e.keyCode===27&&this.closeModal(e),e.keyCode===9&&this.retainFocus(e)}},{key:\"getFocusableNodes\",value:function(){var e=this.modal.querySelectorAll(A);return Array.apply(void 0,m(e))}},{key:\"setFocusToFirstNode\",value:function(){var e=this;if(!this.config.disableFocus){var n=this.getFocusableNodes();if(n.length!==0){var r=n.filter(function(s){return!s.hasAttribute(e.config.closeTrigger)});r.length>0&&r[0].focus(),r.length===0&&n[0].focus()}}}},{key:\"retainFocus\",value:function(e){var n=this.getFocusableNodes();if(n.length!==0)if(n=n.filter(function(s){return s.offsetParent!==null}),this.modal.contains(document.activeElement)){var r=n.indexOf(document.activeElement);e.shiftKey&&r===0&&(n[n.length-1].focus(),e.preventDefault()),!e.shiftKey&&n.length>0&&r===n.length-1&&(n[0].focus(),e.preventDefault())}else n[0].focus()}}])&&S(o.prototype,i),a&&S(o,a),t}(),c=null,v=function(t){if(!document.getElementById(t))return console.warn(\"MicroModal: \\u2757Seems like you have missed %c'\".concat(t,\"'\"),\"background-color: #f8f9fa;color: #50596c;font-weight: bold;\",\"ID somewhere in your code. Refer example below to resolve it.\"),console.warn(\"%cExample:\",\"background-color: #f8f9fa;color: #50596c;font-weight: bold;\",'<div class=\"modal\" id=\"'.concat(t,'\"></div>')),!1},C=function(t,o){if(function(a){a.length<=0&&(console.warn(\"MicroModal: \\u2757Please specify at least one %c'micromodal-trigger'\",\"background-color: #f8f9fa;color: #50596c;font-weight: bold;\",\"data attribute.\"),console.warn(\"%cExample:\",\"background-color: #f8f9fa;color: #50596c;font-weight: bold;\",'<a href=\"#\" data-micromodal-trigger=\"my-modal\"></a>'))}(t),!o)return!0;for(var i in o)v(i);return!0},{init:function(t){var o=Object.assign({},{openTrigger:\"data-micromodal-trigger\"},t),i=m(document.querySelectorAll(\"[\".concat(o.openTrigger,\"]\"))),a=function(r,s){var l=[];return r.forEach(function(d){var u=d.attributes[s].value;l[u]===void 0&&(l[u]=[]),l[u].push(d)}),l}(i,o.openTrigger);if(o.debugMode!==!0||C(i,a)!==!1)for(var e in a){var n=a[e];o.targetModal=e,o.triggers=m(n),c=new b(o)}},show:function(t,o){var i=o||{};i.targetModal=t,i.debugMode===!0&&v(t)===!1||(c&&c.removeEventListeners(),(c=new b(i)).showModal())},close:function(t){t?c.closeModalById(t):c.closeModal()}});typeof window<\"u\"&&(window.MicroModal=L);var f=L;var T='\\n.modal__overlay {\\n    position: fixed;\\n    top: 0;\\n    left: 0;\\n    right: 0;\\n    bottom: 0;\\n    background: rgba(0, 0, 0, 0.5);\\n    display: flex;\\n    justify-content: center;\\n    align-items: center\\n  }\\n\\n  .modal__header {\\n    display: flex;\\n    justify-content: space-between;\\n    align-items: center\\n  }\\n\\n  .modal__title {\\n    margin-top: 0;\\n    margin-bottom: 0;\\n    font-weight: 600;\\n    font-size: 1.25rem;\\n    line-height: 1.25;\\n    color: #00449e;\\n    box-sizing: border-box\\n  }\\n\\n  .modal__close {\\n    background: transparent;\\n    border: 0\\n  }\\n\\n  .modal__header .modal__close:before {\\n    content: \"\\u2715\"\\n  }\\n\\n  .modal__content {\\n    margin-top: 2rem;\\n    margin-bottom: 2rem;\\n    line-height: 1.5;\\n    color: #000c\\n  }\\n\\n  .modal__btn {\\n    font-size: .875rem;\\n    padding: .5rem 1rem;\\n    background-color: #e6e6e6;\\n    color: #000c;\\n    border-radius: .25rem;\\n    border-style: none;\\n    border-width: 0;\\n    cursor: pointer;\\n    -webkit-appearance: button;\\n    text-transform: none;\\n    overflow: visible;\\n    line-height: 1.15;\\n    margin: 0;\\n    will-change: transform;\\n    -moz-osx-font-smoothing: grayscale;\\n    backface-visibility: hidden;\\n    transform: translateZ(0);\\n    transition: transform .25s ease-out\\n  }\\n\\n  .modal__btn:focus,\\n  .modal__btn:hover {\\n    transform: scale(1.05)\\n  }\\n\\n  .modal__btn-primary {\\n    background-color: #00449e;\\n    color: #fff\\n  }\\n\\n  @keyframes mmfadeIn {\\n    0% {\\n      opacity: 0\\n    }\\n\\n    to {\\n      opacity: 1\\n    }\\n  }\\n\\n  @keyframes mmfadeOut {\\n    0% {\\n      opacity: 1\\n    }\\n\\n    to {\\n      opacity: 0\\n    }\\n  }\\n\\n  @keyframes mmslideIn {\\n    0% {\\n      transform: translateY(15%)\\n    }\\n\\n    to {\\n      transform: translateY(0)\\n    }\\n  }\\n\\n  @keyframes mmslideOut {\\n    0% {\\n      transform: translateY(0)\\n    }\\n\\n    to {\\n      transform: translateY(-10%)\\n    }\\n  }\\n\\n  .micromodal-slide {\\n    display: none\\n  }\\n\\n  .micromodal-slide.is-open {\\n    display: block\\n  }\\n\\n  .micromodal-slide[aria-hidden=false] .modal__overlay {\\n    animation: mmfadeIn .3s cubic-bezier(0, 0, .2, 1)\\n  }\\n\\n  .micromodal-slide[aria-hidden=false] .modal__container {\\n    animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1)\\n  }\\n\\n  .micromodal-slide[aria-hidden=true] .modal__overlay {\\n    animation: mmfadeOut .3s cubic-bezier(0, 0, .2, 1)\\n  }\\n\\n  .micromodal-slide[aria-hidden=true] .modal__container {\\n    animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1)\\n  }\\n\\n  .micromodal-slide .modal__container,\\n  .micromodal-slide .modal__overlay {\\n    will-change: transform\\n  }\\n\\n\\n  .fixed {\\n    position: fixed\\n  }\\n\\n  .inset-0 {\\n    top: 0;\\n    right: 0;\\n    bottom: 0;\\n    left: 0\\n  }\\n\\n\\n  .flex {\\n    display: flex\\n  }\\n\\n\\n  .h-[600px] {\\n    height: 600px\\n  }\\n\\n  .h-full {\\n    height: 100%\\n  }\\n\\n\\n  .min-h-[600px] {\\n    min-height: 600px\\n  }\\n\\n  .place-content-center {\\n    place-content: center\\n  }\\n\\n  .items-center {\\n    align-items: center\\n  }\\n\\n  .justify-center {\\n    justify-content: center\\n  }\\n\\n  .bg-transparent {\\n    background-color: transparent\\n  }\\n\\n\\n  .w-full {\\n    width: 100%\\n  }\\n\\n  .lock-bg {\\n    overflow-y: hidden;\\n    overflow-x: hidden;\\n  }\\n\\n  .h-600px {\\n    height: 600px;\\n  }\\n\\n  .w-400px {\\n    width: 400px;\\n  }\\n\\n  #trinsic-ui iframe {\\n    border: 0;\\n  }\\n\\n  ';async function Q(t){t+=\"&embed=iframe\";let o=document.createElement(\"style\");if(o.id=\"trinsic-ui-style\",o.textContent=T,document.head.appendChild(o),f.init(),t==null||t===\"\")throw new Error(\"Please specify a launch url by calling our API via one of our backend SDK's\");H(t);var i=new Promise((a,e)=>{window.addEventListener(\"message\",n=>{var r,s;console.debug(\"event data\",n.data),((r=n.data)==null?void 0:r.success)===!0&&(I(),a(n.data)),((s=n.data)==null?void 0:s.success)===!1&&(I(),e(n.data))},!1)});return i}async function V(t,o){t+=\"&redirectUrl=\"+o,window.location.href=t}async function X(t){let o=h(),i=window.open(\"about:blank\",\"Trinsic\",o.isDesktop?\"width=600,height=900\":\"width=\"+window.innerWidth+\",height=\"+window.innerHeight+\",top=0,left=0\");if(!i)throw new Error(\"Failed to open popup window\");i.location.href=await t();var a=new Promise((e,n)=>{window==null||window.addEventListener(\"message\",r=>{var s,l;console.debug(\"event data\",r.data),((s=r.data)==null?void 0:s.success)===!0&&(i==null||i.close(),e(r.data)),((l=r.data)==null?void 0:l.success)===!1&&(i==null||i.close(),n(r.data))},!1)});return a}function H(t){O();let o=h(),i=document.createElement(\"div\");i.id=\"trinsic-ui\",i.ariaHidden=\"true\",i.className=\"micromodal-slide\";let a=document.createElement(\"div\");a.tabIndex=-1,a.className=\"fixed inset-0 flex items-center justify-center modal__overlay\";let e=document.createElement(\"div\");e.ariaModal=\"true\",e.className=o.isDesktop?\"modal__container h-600px w-400px lock-bg shadow-lg\":\"modal__container h-full min-h-600px w-full\";let n=document.createElement(\"iframe\");if(n.className=\"h-full w-full bg-transparent\",n.allow=\"camera *; microphone *; display-capture *; publickey-credentials-get *; publickey-credentials-create *\",n.src=t,e.append(n),a.append(e),i.append(a),document==null||document.body===null||document.body===void 0||document.body.classList===null||document.body.classList===void 0)throw new Error(\"document.body.classList is null or undefined. Make sure you run this code after your DOM has loaded. You can use the event listener 'DOMContentLoaded' to ensure this.\");document.body.classList.add(\"lock-bg\"),document.body.append(i),f.show(\"trinsic-ui\")}function I(){try{f.close(\"trinsic-ui\")}catch(t){}document.body.classList.remove(\"lock-bg\"),O()}function O(){let t=document.getElementById(\"trinsic-ui\");t==null||t.remove()}\n//# sourceMappingURL=index.esm.js.map\n\n\n//# sourceURL=webpack://@trinsic/web-ui-webpack-sample/./node_modules/@trinsic/web-ui/dist/index.esm.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _trinsic_web_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @trinsic/web-ui */ \"./node_modules/@trinsic/web-ui/dist/index.esm.js\");\n\nconsole.log(\"Hello, Webpack!\", (0,_trinsic_web_ui__WEBPACK_IMPORTED_MODULE_0__.launchPopup)());\n\n\n//# sourceURL=webpack://@trinsic/web-ui-webpack-sample/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;