import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Animations from "./animations";

import Light from "./light";
import Triangle from "./triangle";

import SetDate from "./setDate";
import Mobiles from "./mobiles.js";

import { gsap } from "gsap";
import { TweenMax as TM, Power3 } from "gsap/all";

export default class Sketch {
  constructor(options) {
    this.container = options.dom;

    this.titleEl = options.titleEl;
    this.dateEl = options.dateEl;
    this.timeEls = options.timeEls;
    this.descEl = options.descEl;

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
    this.renderer.domElement.classList.add("webgl");

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Lights
    this.light = new Light(this.scene);

    // Objects
    this.triangle = new Triangle(this.options, this.scene);

    // Animation
    // this.animations = new Animations(this.options);

    this.loadedEased = { value: 0 };
    this.indexLoaded = 0;

    // Utils
    this.setDate = new SetDate(this.options);
    this.mobiles = new Mobiles(this.options);

    this.eventListener();
    this.resize();
    this.setupResize();
    this.computeHoverEased();
    this.mobiles.checkIsMobile();
    this.mobiles.checkScrollOnMobile();
    this.mobiles.checkClickOnMobile();
    this.render();
  }

  eventListener() {
    // Animate when assets are loaded
    this.computeLoadingEased();

    gsap.from(".desc", { duration: 1, opacity: 0 });

    window.addEventListener("load", () => {
      setTimeout(() => {
        // document.body.classList.remove("loading");
        this.indexLoaded = 2;
        this.computeLoadingEased();
        this.tl = gsap.timeline();
        this.tl.to(".time__wrapper", { duration: 4, opacity: 0.25 });
        this.tl.to(".date", { duration: 3, opacity: 1 }, "-=3");
        this.tl.to(".join", { duration: 1, opacity: 1 }, "-=2");
        this.tl.to(".title", { duration: 1, opacity: 0.6 }, "-=2");
      }, 100);
    });
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

  computeLoadingEased() {
    TM.to(this.loadedEased, 4.7, {
      value: this.indexLoaded,
      ease: Power3,
    });
  }

  render() {
    this.elapsedTime = this.clock.getElapsedTime();

    // Check if page is loaded

    // this.camera.position.z = this.hoverEased.value * this.loadedEased.value * 2;
    this.camera.position.z = this.hoverEased.value * 2;
    this.camera.position.x = this.hoverEased.value / 2;

    // console.log(this.loadedEased.value);

    // Invert color title + date
    this.dateEl.style.filter = `invert(${this.hoverEased.value - 0.4})`;
    this.titleEl.style.filter = `invert(${this.hoverEased.value - 0.4})`;

    // Animate light
    this.light.animate(this.elapsedTime);

    // Animate triangle
    this.triangle.animate(this.elapsedTime, this.hoverEased.value, this.loadedEased.value);

    // Animate camera

    // Update controls
    this.controls.update();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call render on each frame
    window.requestAnimationFrame(this.render.bind(this));
  }
}
