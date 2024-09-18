export const CSSString = `
.modal__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
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


  .h-\[600px\] {
    height: 600px
  }

  .h-full {
    height: 100%
  }


  .min-h-\[600px\] {
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

  `;
