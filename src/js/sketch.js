import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Light from "./light";
import Triangle from "./triangle";

import { TweenMax as TM, Power3 } from "gsap/all";

export default class Sketch {
  constructor(options) {
    this.container = options.dom;

    // this.listColors = options.listColors;
    // this.listDateColors = options.listDateColors;

    this.titleEl = options.titleEl;
    this.dateEl = options.dateEl;
    this.timeEls = options.timeEls;

    // Utils
    this.hoverEased = { value: 0.1 };

    this.options = options;

    this.init();
  }

  init() {
    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10);
    this.camera.position.z = 1;
    this.camera.position.x = 0;
    this.camera.position.y = -0.5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor("#030303");
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Lights
    this.light = new Light(this.scene);

    // Objects
    this.triangle = new Triangle(this.options, this.scene);

    this.resize();
    this.setupResize();
    this.computeHoverEased();
    this.checkScrollOnMobile();
    this.checkClickOnMobile();
    this.render();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  computeHoverEased() {
    this.timeEls.forEach((timeEl) => {
      timeEl.addEventListener("mouseenter", () => {
        this.indexOpacity = ([...this.timeEls].indexOf(timeEl) + 1) / this.timeEls.length;

        TM.to(this.hoverEased, 0.7, {
          value: this.indexOpacity,
          ease: Power3,
        });
      });
    });
  }

  checkScrollOnMobile() {
    const intersection = 300;

    // At first
    setTimeout(() => this.timeEls[1].classList.add("active"), 500);

    window.addEventListener("scroll", () => {
      this.timeEls.forEach((timeEl) => {
        const position = timeEl.getBoundingClientRect().y;
        if (position < intersection && position > 100) {
          timeEl.classList.add("active");
        } else {
          timeEl.classList.remove("active");
        }
      });
      console.log(window.scrollY);
      if (window.scrollY > 100) {
        document.body.classList.add("scrolled");
      }
    });
  }

  checkClickOnMobile() {
    this.timeEls.forEach((timeEl) => {
      timeEl.addEventListener("click", () => {
        this.timeEls.forEach((el) => {
          el.classList.remove("active");
          console.log(el);
        });
        timeEl.classList.add("active");
      });
    });
  }

  render() {
    this.elapsedTime = this.clock.getElapsedTime();

    // Invert color title + date
    this.dateEl.style.filter = `invert(${this.hoverEased.value - 0.4})`;
    this.titleEl.style.filter = `invert(${this.hoverEased.value - 0.4})`;

    // Animate light
    this.light.animate(this.elapsedTime);

    // Animate triangle
    this.triangle.animate(this.elapsedTime, this.hoverEased.value);

    // Animate camera
    this.camera.position.z = this.hoverEased.value * 2;
    this.camera.position.x = this.hoverEased.value / 2;

    // Update controls
    this.controls.update();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call render on each frame
    window.requestAnimationFrame(this.render.bind(this));
  }
}
