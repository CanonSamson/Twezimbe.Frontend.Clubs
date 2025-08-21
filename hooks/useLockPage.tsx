// import { disablePageScroll, enablePageScroll } from '@fluejs/noscroll'


interface ScrollLockActions {
  lock: () => void;
  unlock: () => void;
  toggle: () => void;
}

export const useLockPage = (): ScrollLockActions=> {
  const lock = () => {
    // // disable page scroll
    // disablePageScroll()
  }

  const unlock = (): void => {
    // // enable page scroll
    // enablePageScroll()
  }

  const toggle = (): void => {
    // if (document.body.classList.contains('noscroll')) {
    //   unlock()
    // } else {
    //   lock()
    // }
  }
  return {
    lock,
    unlock,
    toggle
  }
}
