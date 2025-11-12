
// Smooth scrolling (Lenis) + GSAP ScrollTrigger integration
const lenis = new Lenis()

lenis.on('scroll', (e) => {
  console.log(e)
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  // GSAP provides time in seconds; Lenis expects milliseconds
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// Ensure ScrollTrigger is available (CDN is included in HTML)
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

let animationsTriggered = false;
let floaterTween = null;
gsap.set("#work .h1-heading", { y: 50, opacity: 0 });
gsap.set(".intro-logo", { y: 20, opacity: 0, scale: 0.96 });
gsap.set(".intro-tag", { y: 30, opacity: 0 });

const lockInteraction = () => {
  if (typeof lenis !== 'undefined' && lenis && typeof lenis.stop === 'function') {
    lenis.stop();
  }
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';
};

const unlockInteraction = () => {
  if (typeof lenis !== 'undefined' && lenis && typeof lenis.start === 'function') {
    lenis.start();
  }
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
};

function animateNavbar() {
  const tl = gsap.timeline();
  tl.from(".nav", {
    y: -30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  })
    .from(
      ".nav-items a, .nav-icons a",
      {
        x: -60,
        opacity: 0,
        ease: "power1.out",
        stagger: { each: 0.08 },
      },
      "-=0.2"
    );
}

function animateNavIconsLoop() {
  gsap.to(".nav-icons img", {
    y: -4,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
    stagger: 0.12,
  });
}

function animateNavItems() {
  gsap.from(".nav-items a, .nav-icons a", {
    x: -100,
    opacity: 0,
    ease: "power1",
    stagger: {
      amount: 0.5,
      each: 0.12,
    },
  });
}

function animateFloaterLoop() {
  const el = document.getElementById('scrollUpBtn');
  if (!el) return;
  floaterTween = gsap.to(el, {
    y: -6,
    duration: 1.2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    paused: true,
  });
}

function animatePage1() {
  gsap.from(".page1 h1, .page1 h3,.page1 .ylwbtn, .page1 .ylwmbbtn", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay: 0.8,
    stagger: {
      amount: 0.5,
      each: 0.12,
    },
  });

  gsap.from(".page1 img", {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    delay: 1.2,
  });
  gsap.from("#work .h1-heading", {
    y: 50,
    duration: 0.8,
    delay: 2,
  });
  gsap.to("#work .h1-heading", {
    opacity: 1,
    y: 20,
    duration: 0.8,
    delay: 2,
  });
}

function startAnimations() {
  // Check if the animations have already been triggered
  if (!animationsTriggered) {

    const mainContent = document.querySelector(".mainwrapper");
    gsap.to(mainContent, { opacity: 1, duration: 1 });
    // Animate navbar container first, then its items
    animateNavbar();
    animateNavIconsLoop();
    animateFloaterLoop();
    animatePage1();
    initScrollTriggers();
    animationsTriggered = true; // Mark the animations as triggered
  }
}
function animateImpression() {
  const intro = document.getElementById('intro');
  if (!intro) { unlockInteraction(); startAnimations(); return; }

  lockInteraction();
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  tl.to(".intro-logo", { y: 0, opacity: 1, scale: 1, duration: 0.6 })
    .to(".intro-tag", { y: 0, opacity: 1, duration: 0.45 }, "-=0.25")
    .to("#intro", { opacity: 0, duration: 0.5, delay: 0.3 })
    .set("#intro", { display: "none", pointerEvents: "none" })
    .add(unlockInteraction)
    .add(startAnimations);
}

window.addEventListener("load", function () {
  animateImpression();
});

const dot = document.querySelector('.dot');

document.addEventListener('mousemove', (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const container = document.querySelector('.mainwrapper');
  const containerRect = container.getBoundingClientRect();

  // Calculate the relative position of the mouse inside the container
  const relativeX = mouseX - containerRect.left;
  const relativeY = mouseY - containerRect.top;

  dot.style.left = relativeX + 'px';
  dot.style.top = relativeY + 'px';

});



document.addEventListener('mouseleave', () => {
  dot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity = '1';
});

// Hide/show top navbar on scroll + apply scrolled style
let lastScrollTop = 0;
const navEl = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  navEl.classList.toggle('nav--scrolled', st > 20);
  lastScrollTop = st <= 0 ? 0 : st;
});

// Mobile hamburger toggle
const hamburger = document.getElementById('hamburger');
if (hamburger && navEl) {
  navEl.classList.remove('nav--hidden');
  hamburger.addEventListener('click', () => {
    const open = navEl.classList.toggle('nav--open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.nav-items a').forEach((link) => {
    link.addEventListener('click', () => {
      navEl.classList.remove('nav--open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

const scrollUpBtn = document.getElementById('scrollUpBtn');
if (scrollUpBtn) {
  scrollUpBtn.addEventListener('click', () => {
    if (typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { duration: 1 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    scrollUpBtn.classList.toggle('scroll-up--visible', st > 300);
    if (floaterTween) {
      if (st > 300) floaterTween.play(); else floaterTween.pause();
    }
  });
}

// scrollUpBtn already declared above; skip re-declaration
if (scrollUpBtn) {
  scrollUpBtn.addEventListener('click', () => {
    if (typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { duration: 1 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    scrollUpBtn.classList.toggle('scroll-up--visible', st > 300);
  });
}

const headings = document.querySelectorAll('.h1-heading, #work img, .pageaboutdesc');

headings.forEach((heading, index) => {
  // Check if the current heading is the first child of .h1-heading
  const isFirstChildOfH1 = heading.classList.contains('h1-heading') && index === 0;

  // Apply GSAP animation only if it's not the first child of .h1-heading
  if (!isFirstChildOfH1) {
    gsap.from(heading, {
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: heading,
        scroller: "body",
        scrub: 2,
        start: "top 90%",
        end: "bottom 50%",
      }
    });
  }
});

const sections = document.querySelectorAll('.verticle1-page2,.verticle2-page2');

sections.forEach((section) => {
  gsap.from(section, {
    y: 100,
    duration: 0.5,

    scrollTrigger: {
      trigger: section,
      scroller: "body",
      scrub: 2,
      start: "top 90%",
      end: "top 60%",
    }
  });
});

const lines = document.querySelectorAll('.line');

lines.forEach(line => {
  gsap.to(line, {
    height: '40vh',
    scrollTrigger: {
      trigger: line,
      start: 'top 80%', 
      end: 'bottom 50%', 
      scrub: true, 
    }
  });
});
gsap.from(".aboutdescbox .aboutleft", {
  opacity: 0.5,
  duration: 0.5,
  scale: 0.5,
  scrollTrigger: {
    trigger: ".aboutdescbox .aboutleft",
    scroller: "body",
    scrub: 2,
    start: "top 90%",
    end: "top 60%",
  }
});
gsap.from(".aboutdescbox .aboutright", {
  y: 50,
  opacity: 0.5,
  duration: 0.3,

  scrollTrigger: {
    trigger: ".aboutdescbox .aboutright",
    scroller: "body",
    scrub: 1,

    start: "top 90%",
    end: "top 60%",
  }
});

let aboutScaleTween;
let aboutBorderTween;
let aboutFloatTween;
if (typeof ScrollTrigger !== 'undefined') {
  ScrollTrigger.create({
    trigger: '.aboutdesc',
    start: 'top 85%',
    onEnter: () => {
      aboutScaleTween = gsap.to('.aboutdesc', {
        scale: 1.01,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
      aboutBorderTween = gsap.to('.aboutdesc', {
        borderColor: '#FFD369',
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
      aboutFloatTween = gsap.to('.aboutdesc', {
        y: -8,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    },
    onLeave: () => {
      if (aboutScaleTween) aboutScaleTween.pause();
      if (aboutBorderTween) aboutBorderTween.pause();
      if (aboutFloatTween) aboutFloatTween.pause();
    },
    onEnterBack: () => {
      if (aboutScaleTween) aboutScaleTween.play();
      if (aboutBorderTween) aboutBorderTween.play();
      if (aboutFloatTween) aboutFloatTween.play();
    },
    onLeaveBack: () => {
      if (aboutScaleTween) aboutScaleTween.pause();
      if (aboutBorderTween) aboutBorderTween.pause();
      if (aboutFloatTween) aboutFloatTween.pause();
    }
  });
}

const expert = document.querySelectorAll('.my-expertise .blk .expertise');
expert.forEach((experts) => {

  gsap.from(experts, {
    x: -100,
    opacity: 0,
    duration: 0.1,
    stagger: 0.05,
    scrollTrigger: {
      trigger: experts,
      scroller: "body",
      scrub: 1,
      start: "top 90%",
      end: "top 50%",
    }
  });
});
const expertylw = document.querySelectorAll('.my-expertise .ylw .expertise');
expertylw.forEach((expertsylw) => {

  gsap.from(expertsylw, {
    x: 100,
    opacity: 0,
    duration: 0.1,
    stagger: 0.05,
    scrollTrigger: {
      trigger: expertsylw,
      scroller: "body",
      scrub: 1,
      start: "top 90%",
      end: "top 50%",
    }
  });
});

gsap.to(".contact-form h1",{
    scale:1.1,
    delay:5,
    duration:0.5,
    repeatdelay:3,
    yoyo:true,
    repeat:-1,
})

// ---------- Scroll-triggered reveals & parallax ----------
function initScrollTriggers() {
  // Data-attribute driven reveals: [data-reveal="left|right|up|fade"]
  setupDataReveal();

  // Roles and action buttons in project sections
  document.querySelectorAll('.page2 .roles').forEach((el) => {
    gsap.from(el, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  document.querySelectorAll('.page2 .page2-buttons').forEach((el) => {
    gsap.from(el, {
      y: 20,
      opacity: 0,
      scale: 0.96,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Subtle scale-in for each work slider container
  document.querySelectorAll('.work-slider').forEach((slider) => {
    gsap.from(slider, {
      opacity: 0,
      scale: 0.98,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: slider,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Lightweight parallax for images inside sliders
    slider.querySelectorAll('.work-slide img').forEach((img) => {
      gsap.to(img, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: slider,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  });

  // Contact section soft reveal
  const contact = document.querySelector('.contact-form');
  if (contact) {
    gsap.from(contact, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: contact,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }


  // Refresh once after setup (important when using Lenis)
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// Drive ScrollTrigger animations via data attributes
function setupDataReveal() {
  const elems = document.querySelectorAll('[data-reveal]');
  elems.forEach((el) => {
    const type = (el.getAttribute('data-reveal') || 'fade').toLowerCase();
    const offset = parseInt(el.getAttribute('data-reveal-offset') || '50', 10);
    const duration = parseFloat(el.getAttribute('data-reveal-duration') || '0.6');
    const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0');
    const ease = el.getAttribute('data-reveal-ease') || 'power2.out';
    const start = el.getAttribute('data-reveal-start') || 'top 85%';
    const toggle = el.getAttribute('data-reveal-toggle') || 'play none none reverse';
    const once = (el.getAttribute('data-reveal-once') || 'false') === 'true';

    const fromVars = { autoAlpha: 0 };
    const toVars = { autoAlpha: 1, duration, delay, ease };

    switch (type) {
      case 'left':
        fromVars.x = -offset;
        toVars.x = 0;
        break;
      case 'right':
        fromVars.x = offset;
        toVars.x = 0;
        break;
      case 'up':
        fromVars.y = -offset;
        toVars.y = 0;
        break;
      case 'fade':
      default:
        break;
    }

    gsap.fromTo(el, fromVars, {
      ...toVars,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: toggle,
        once,
      },
    });
  });
}

// ---------- Work slider implementation ----------
function setupWorkSlider(slider) {
  const slides = Array.from(slider.querySelectorAll('.work-slide'));
  if (!slides.length) return;

  let index = 0;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 4000;

  // Inject controls and dots
  const prevBtn = document.createElement('button');
  prevBtn.className = 'work-prev';
  prevBtn.setAttribute('aria-label','Previous slide');
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'work-next';
  nextBtn.setAttribute('aria-label','Next slide');
  nextBtn.innerHTML = '&#10095;';

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'work-dots';
  const dots = slides.map((_, i) => {
    const d = document.createElement('div');
    d.className = 'work-dot';
    d.setAttribute('role','button');
    d.setAttribute('aria-label', `Go to slide ${i+1}`);
    dotsWrap.appendChild(d);
    return d;
  });

  slider.appendChild(prevBtn);
  slider.appendChild(nextBtn);
  slider.appendChild(dotsWrap);

  function updateSlides(newIndex) {
    slides.forEach((s, i) => {
      s.classList.remove('active','prev');
      s.style.left = '100%';
      s.style.opacity = '0';
    });
    const prevIndex = (newIndex - 1 + slides.length) % slides.length;
    slides[prevIndex].classList.add('prev');
    slides[prevIndex].style.left = '-100%';
    slides[newIndex].classList.add('active');
    slides[newIndex].style.left = '0';
    slides[newIndex].style.opacity = '1';
    dots.forEach((d,i)=>d.classList.toggle('active', i === newIndex));
    index = newIndex;
  }

  function next() { updateSlides((index + 1) % slides.length); }
  function prev() { updateSlides((index - 1 + slides.length) % slides.length); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  dots.forEach((d,i)=>d.addEventListener('click', ()=>updateSlides(i)));

  // Autoplay
  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay(){
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Pause when out of view
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if (entry.isIntersecting) startAutoplay(); else stopAutoplay();
    });
  },{ threshold: 0.3 });
  io.observe(slider);

  // Touch swipe
  let touchStartX = null;
  slider.addEventListener('touchstart', (e)=>{ touchStartX = e.changedTouches[0].clientX; }, {passive:true});
  slider.addEventListener('touchend', (e)=>{
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    touchStartX = null;
  }, {passive:true});

  // Keyboard
  slider.setAttribute('tabindex','0');
  slider.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Initialize
  updateSlides(0);
  startAutoplay();
}

// Initialize all sliders on the page
document.querySelectorAll('.work-slider').forEach(setupWorkSlider);

function setupDragDirection() {
  const dragImage = document.querySelector(".page1 .ylw img[src*='tp3']");
  if (!dragImage) return;
  dragImage.setAttribute('draggable', 'false');
  let active = false;
  const setRotate = gsap.quickSetter(dragImage, 'rotate', 'deg');
  const onMove = (e) => {
    if (!active) return;
    const rect = dragImage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    setRotate(angle);
  };
  dragImage.addEventListener('pointerdown', (e) => {
    active = true;
    dragImage.classList.add('dragging');
    dragImage.setPointerCapture(e.pointerId);
    onMove(e);
  });
  const end = () => {
    active = false;
    dragImage.classList.remove('dragging');
    setRotate(0);
  };
  dragImage.addEventListener('pointermove', onMove);
  dragImage.addEventListener('pointerup', end);
  dragImage.addEventListener('pointercancel', end);
}

setupDragDirection();

function animateTP3() {
  const tp3Desktop = document.querySelector(".page1 .ylw img[src*='tp3']");
  const tp3Mobile = document.querySelector("img.page1mbimg[src*='tp3']") || document.querySelector(".page1mbimg");
  [tp3Desktop, tp3Mobile].forEach((el) => {
    if (!el) return;
    gsap.to(el, {
      y: -50,
      rotation: 2,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to(el, {
        yPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  });
}

animateTP3();
