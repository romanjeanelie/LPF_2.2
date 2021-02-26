export default class Mobiles {
  constructor(options) {
    this.titleEl - options.titleEl;
    this.timeEls = options.timeEls;
  }

  init() {
    this.checkIsMobile();
    this.checkScrollOnMobile();
    this.checkClickOnMobile();
  }

  checkIsMobile() {
    const isMobile = () => {
      return (
        ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
          navigator.platform
        ) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes("Mac") && "ontouchend" in document) ||
        window.innerWidth < 900
      );
    };
    if (isMobile()) {
      document.body.classList.add("isMobile");
    }
  }

  checkScrollOnMobile() {
    const intersection = 400;

    // At first
    setTimeout(() => this.timeEls[0].classList.add("active"), 500);
    setTimeout(() => this.timeEls[1].classList.add("active"), 600);

    window.addEventListener("scroll", () => {
      this.timeEls.forEach((timeEl) => {
        const position = timeEl.getBoundingClientRect().y;

        if (position < intersection) {
          timeEl.classList.add("active");
        } else {
          timeEl.classList.remove("active");
        }
      });

      // To change opacity when down
      if (window.scrollY > 20) {
        document.body.classList.add("scrolled");
      } else {
        document.body.classList.remove("scrolled");
      }
    });
  }

  checkClickOnMobile() {
    this.timeEls.forEach((timeEl) => {
      timeEl.addEventListener("click", () => {
        this.timeEls.forEach((el) => {
          el.classList.remove("clicked");
        });
        timeEl.classList.add("clicked");
      });
    });
  }
}
