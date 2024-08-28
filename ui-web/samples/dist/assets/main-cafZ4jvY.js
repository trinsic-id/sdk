import"./modulepreload-polyfill-B5Qt9EMX.js";var L=()=>{let t=navigator.userAgent,e=()=>!!t.match(/Android/i),i=()=>!!t.match(/iPhone|iPad|iPod/i),n=()=>!!t.match(/Opera Mini/i),o=()=>!!t.match(/IEMobile/i),a=()=>!!t.match(/SSR/i),r=()=>!!(e()||i()||n()||o()),l=()=>!r()&&!a();return{isMobile:r(),isDesktop:l(),isAndroid:e(),isIos:i(),isSSR:a()}};function U(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function m(t){return function(e){if(Array.isArray(e))return h(e)}(t)||function(e){if(typeof Symbol<"u"&&Symbol.iterator in Object(e))return Array.from(e)}(t)||function(e,i){if(e){if(typeof e=="string")return h(e,i);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return h(e,i)}}(t)||function(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}()}function h(t,e){(e==null||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}var M,f,c,g,C,T=(M=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'],f=function(){function t(n){var o=n.targetModal,a=n.triggers,r=a===void 0?[]:a,l=n.onShow,s=l===void 0?function(){}:l,d=n.onClose,u=d===void 0?function(){}:d,b=n.openTrigger,I=b===void 0?"data-micromodal-trigger":b,p=n.closeTrigger,j=p===void 0?"data-micromodal-close":p,y=n.openClass,O=y===void 0?"is-open":y,w=n.disableScroll,B=w!==void 0&&w,k=n.disableFocus,P=k!==void 0&&k,E=n.awaitCloseAnimation,F=E!==void 0&&E,_=n.awaitOpenAnimation,N=_!==void 0&&_,x=n.debugMode,z=x!==void 0&&x;(function(D,K){if(!(D instanceof K))throw new TypeError("Cannot call a class as a function")})(this,t),this.modal=document.getElementById(o),this.config={debugMode:z,disableScroll:B,openTrigger:I,closeTrigger:j,openClass:O,onShow:s,onClose:u,awaitCloseAnimation:F,awaitOpenAnimation:N,disableFocus:P},r.length>0&&this.registerTriggers.apply(this,m(r)),this.onClick=this.onClick.bind(this),this.onKeydown=this.onKeydown.bind(this)}var e,i;return e=t,(i=[{key:"registerTriggers",value:function(){for(var n=this,o=arguments.length,a=new Array(o),r=0;r<o;r++)a[r]=arguments[r];a.filter(Boolean).forEach(function(l){l.addEventListener("click",function(s){return n.showModal(s)})})}},{key:"showModal",value:function(){var n=this,o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:null;if(this.activeElement=document.activeElement,this.modal.setAttribute("aria-hidden","false"),this.modal.classList.add(this.config.openClass),this.scrollBehaviour("disable"),this.addEventListeners(),this.config.awaitOpenAnimation){var a=function r(){n.modal.removeEventListener("animationend",r,!1),n.setFocusToFirstNode()};this.modal.addEventListener("animationend",a,!1)}else this.setFocusToFirstNode();this.config.onShow(this.modal,this.activeElement,o)}},{key:"closeModal",value:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:null,o=this.modal;if(this.modal.setAttribute("aria-hidden","true"),this.removeEventListeners(),this.scrollBehaviour("enable"),this.activeElement&&this.activeElement.focus&&this.activeElement.focus(),this.config.onClose(this.modal,this.activeElement,n),this.config.awaitCloseAnimation){var a=this.config.openClass;this.modal.addEventListener("animationend",function r(){o.classList.remove(a),o.removeEventListener("animationend",r,!1)},!1)}else o.classList.remove(this.config.openClass)}},{key:"closeModalById",value:function(n){this.modal=document.getElementById(n),this.modal&&this.closeModal()}},{key:"scrollBehaviour",value:function(n){if(this.config.disableScroll){var o=document.querySelector("body");switch(n){case"enable":Object.assign(o.style,{overflow:""});break;case"disable":Object.assign(o.style,{overflow:"hidden"})}}}},{key:"addEventListeners",value:function(){this.modal.addEventListener("touchstart",this.onClick),this.modal.addEventListener("click",this.onClick),document.addEventListener("keydown",this.onKeydown)}},{key:"removeEventListeners",value:function(){this.modal.removeEventListener("touchstart",this.onClick),this.modal.removeEventListener("click",this.onClick),document.removeEventListener("keydown",this.onKeydown)}},{key:"onClick",value:function(n){(n.target.hasAttribute(this.config.closeTrigger)||n.target.parentNode.hasAttribute(this.config.closeTrigger))&&(n.preventDefault(),n.stopPropagation(),this.closeModal(n))}},{key:"onKeydown",value:function(n){n.keyCode===27&&this.closeModal(n),n.keyCode===9&&this.retainFocus(n)}},{key:"getFocusableNodes",value:function(){var n=this.modal.querySelectorAll(M);return Array.apply(void 0,m(n))}},{key:"setFocusToFirstNode",value:function(){var n=this;if(!this.config.disableFocus){var o=this.getFocusableNodes();if(o.length!==0){var a=o.filter(function(r){return!r.hasAttribute(n.config.closeTrigger)});a.length>0&&a[0].focus(),a.length===0&&o[0].focus()}}}},{key:"retainFocus",value:function(n){var o=this.getFocusableNodes();if(o.length!==0)if(o=o.filter(function(r){return r.offsetParent!==null}),this.modal.contains(document.activeElement)){var a=o.indexOf(document.activeElement);n.shiftKey&&a===0&&(o[o.length-1].focus(),n.preventDefault()),!n.shiftKey&&o.length>0&&a===o.length-1&&(o[0].focus(),n.preventDefault())}else o[0].focus()}}])&&U(e.prototype,i),t}(),c=null,g=function(t){if(!document.getElementById(t))return console.warn("MicroModal: ❗Seems like you have missed %c'".concat(t,"'"),"background-color: #f8f9fa;color: #50596c;font-weight: bold;","ID somewhere in your code. Refer example below to resolve it."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<div class="modal" id="'.concat(t,'"></div>')),!1},C=function(t,e){if(function(n){n.length<=0&&(console.warn("MicroModal: ❗Please specify at least one %c'micromodal-trigger'","background-color: #f8f9fa;color: #50596c;font-weight: bold;","data attribute."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<a href="#" data-micromodal-trigger="my-modal"></a>'))}(t),!e)return!0;for(var i in e)g(i);return!0},{init:function(t){var e=Object.assign({},{openTrigger:"data-micromodal-trigger"},t),i=m(document.querySelectorAll("[".concat(e.openTrigger,"]"))),n=function(r,l){var s=[];return r.forEach(function(d){var u=d.attributes[l].value;s[u]===void 0&&(s[u]=[]),s[u].push(d)}),s}(i,e.openTrigger);if(e.debugMode!==!0||C(i,n)!==!1)for(var o in n){var a=n[o];e.targetModal=o,e.triggers=m(a),c=new f(e)}},show:function(t,e){var i=e||{};i.targetModal=t,i.debugMode===!0&&g(t)===!1||(c&&c.removeEventListeners(),(c=new f(i)).showModal())},close:function(t){t?c.closeModalById(t):c.closeModal()}});typeof window<"u"&&(window.MicroModal=T);var v=T,R=`
.modal__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center
  }

  .modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center
  }

  .modal__title {
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.25;
    color: #00449e;
    box-sizing: border-box
  }

  .modal__close {
    background: transparent;
    border: 0
  }

  .modal__header .modal__close:before {
    content: "✕"
  }

  .modal__content {
    margin-top: 2rem;
    margin-bottom: 2rem;
    line-height: 1.5;
    color: #000c
  }

  .modal__btn {
    font-size: .875rem;
    padding: .5rem 1rem;
    background-color: #e6e6e6;
    color: #000c;
    border-radius: .25rem;
    border-style: none;
    border-width: 0;
    cursor: pointer;
    -webkit-appearance: button;
    text-transform: none;
    overflow: visible;
    line-height: 1.15;
    margin: 0;
    will-change: transform;
    -moz-osx-font-smoothing: grayscale;
    backface-visibility: hidden;
    transform: translateZ(0);
    transition: transform .25s ease-out
  }

  .modal__btn:focus,
  .modal__btn:hover {
    transform: scale(1.05)
  }

  .modal__btn-primary {
    background-color: #00449e;
    color: #fff
  }

  @keyframes mmfadeIn {
    0% {
      opacity: 0
    }

    to {
      opacity: 1
    }
  }

  @keyframes mmfadeOut {
    0% {
      opacity: 1
    }

    to {
      opacity: 0
    }
  }

  @keyframes mmslideIn {
    0% {
      transform: translateY(15%)
    }

    to {
      transform: translateY(0)
    }
  }

  @keyframes mmslideOut {
    0% {
      transform: translateY(0)
    }

    to {
      transform: translateY(-10%)
    }
  }

  .micromodal-slide {
    display: none
  }

  .micromodal-slide.is-open {
    display: block
  }

  .micromodal-slide[aria-hidden=false] .modal__overlay {
    animation: mmfadeIn .3s cubic-bezier(0, 0, .2, 1)
  }

  .micromodal-slide[aria-hidden=false] .modal__container {
    animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1)
  }

  .micromodal-slide[aria-hidden=true] .modal__overlay {
    animation: mmfadeOut .3s cubic-bezier(0, 0, .2, 1)
  }

  .micromodal-slide[aria-hidden=true] .modal__container {
    animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1)
  }

  .micromodal-slide .modal__container,
  .micromodal-slide .modal__overlay {
    will-change: transform
  }


  .fixed {
    position: fixed
  }

  .inset-0 {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
  }


  .flex {
    display: flex
  }


  .h-[600px] {
    height: 600px
  }

  .h-full {
    height: 100%
  }


  .min-h-[600px] {
    min-height: 600px
  }

  .place-content-center {
    place-content: center
  }

  .items-center {
    align-items: center
  }

  .justify-center {
    justify-content: center
  }

  .bg-transparent {
    background-color: transparent
  }


  .w-full {
    width: 100%
  }

  .lock-bg {
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .h-600px {
    height: 600px;
  }

  .w-400px {
    width: 400px;
  }

  #trinsic-ui iframe {
    border: 0;
  }

  `;async function H(t){t+="&embed=iframe";let e=document.createElement("style");if(e.id="trinsic-ui-style",e.textContent=R,document.head.appendChild(e),v.init(),t==null||t==="")throw new Error("Please specify a launch url by calling our API via one of our backend SDK's");q(t);var i=new Promise((n,o)=>{window.addEventListener("message",a=>{var r,l;console.debug("event data",a.data),((r=a.data)==null?void 0:r.success)===!0&&(A(),n(a.data)),((l=a.data)==null?void 0:l.success)===!1&&(A(),o(a.data))},!1)});return i}async function Y(t,e){t+="&redirectUrl="+e,window.location.href=t}async function $(t){let e=L(),i=window.open(t,"Trinsic",e.isDesktop?"width=600,height=900":"width="+window.innerWidth+",height="+window.innerHeight+",top=0,left=0");var n=new Promise((o,a)=>{window==null||window.addEventListener("message",r=>{var l,s;console.debug("event data",r.data),((l=r.data)==null?void 0:l.success)===!0&&(i==null||i.close(),o(r.data)),((s=r.data)==null?void 0:s.success)===!1&&(i==null||i.close(),a(r.data))},!1)});return n}function q(t){S();let e=L(),i=document.createElement("div");i.id="trinsic-ui",i.ariaHidden="true",i.className="micromodal-slide";let n=document.createElement("div");n.tabIndex=-1,n.className="fixed inset-0 flex items-center justify-center";let o=document.createElement("div");o.ariaModal="true",o.className=e.isDesktop?"modal__container h-600px w-400px lock-bg":"modal__container h-full min-h-600px w-full";let a=document.createElement("iframe");a.className="h-full w-full bg-transparent",a.allow="camera *; microphone *; display-capture *; publickey-credentials-get *; publickey-credentials-create *",a.src=t,o.append(a),n.append(o),i.append(n),document.body.classList.add("lock-bg"),document.body.append(i),v.show("trinsic-ui")}function A(){try{v.close("trinsic-ui")}catch{}document.body.classList.remove("lock-bg"),S()}function S(){let t=document.getElementById("trinsic-ui");t==null||t.remove()}window.launchIframe=H;window.launchRedirect=Y;window.launchPopup=$;function G(){const t=document.getElementsByClassName("launch-button");for(let e=0;e<t.length;e++)t[e].disabled=!1}function Q(){const t=document.getElementsByClassName("launch-button");for(let e=0;e<t.length;e++)t[e].disabled=!0}async function V(){Q();const t=await fetch("/create-session",{method:"POST",headers:{"Content-Type":"application/json"}}).then(e=>e.json()).then(e=>e.launchUrl);window.launchUrl=t,G()}function W(){fetch("/providers",{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>t.json()).then(t=>{for(let e=0;e<t.providers.length;e++)document.getElementById("listOptions").innerHTML+=`<li><button class="launch-button" style="padding: 10px; background-color: transparent;" onclick="launchPopupMethod('${t.providers[e].id}').then(r => exchangeResult(r))"> <img src="${t.providers[e].logoUrl}" /> <div class="launch-name"> Launch ${t.providers[e].name}</div>  <div class="chevron"></div></button></li>`})}V();W();
//# sourceMappingURL=main-cafZ4jvY.js.map
