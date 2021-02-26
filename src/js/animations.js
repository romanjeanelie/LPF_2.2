import { LogLuvEncoding } from "three";

import SplitText from "./libs/SplitText.min.js";
import { gsap } from "gsap";

export default class Animations {
  constructor(options) {
    this.titleEl = options.titleEl;
    this.dateEl = options.dateEl;
    this.timeEls = options.timeEls;
    this.descEl = options.descEl;

    this.animate();
    this.isLoaded = false;
  }

  animate() {
    // this.tl1 = gsap.timeline();
    // this.tl2 = gsap.timeline();
    // this.mySplitText = new SplitText("#desc", { type: "words,chars" });
    // this.chars = this.mySplitText.chars; //an array of all the divs that wrap each character

    // this.tl1.from(
    //   this.chars,
    //   {
    //     duration: 12,
    //     opacity: 0,
    //     y: 1,
    //     ease: "back",
    //     stagger: 0.02,
    //   },
    //   "+=0"
    // );

    window.addEventListener("load", () => {
      setTimeout(() => {
        document.body.classList.remove("loading");
        this.isLoaded = true;
        this.descEl.style.opacity = 0;
      }, 10000);
      //   this.tl2.to(".date", { duration: 3, opacity: 1 }, "+=0.5");
      //   this.tl2.to(".time__wrapper", { duration: 10, opacity: 0.2, stagger: 0.2 }, "-=3");
      //   this.tl2.to(".webgl", { duration: 4, opacity: 1 }, "-=11");
      //   this.tl2.to(".title", { duration: 3, opacity: 0.6 }, "-=9");
      //   this.tl2.to(".desc", { duration: 4, opacity: 0.7 }, "-=7");
    });
  }
}
