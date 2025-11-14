
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

gsap.defaults({ overwrite: 'auto' })

// Ensure ScrollTrigger is available (CDN is included in HTML)
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof Draggable !== 'undefined' && typeof MorphSVGPlugin !== 'undefined') {
  gsap.registerPlugin(Draggable, MorphSVGPlugin);
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

function typeGreeting() {
  const h1 = document.querySelector('.page1 .blk h1');
  if (!h1) return;
  const stroke = h1.querySelector('.h1-stroke');
  const br = h1.querySelector('br');
  let textNode = null;
  let part1 = '';
  h1.childNodes.forEach(n => {
    if (n.nodeType === 3 && n.textContent.trim().length > 0) {
      textNode = textNode || n;
      part1 = n.textContent;
    }
  });
  if (!stroke) return;
  const part2 = stroke.textContent;
  if (!textNode) { textNode = document.createTextNode(''); h1.insertBefore(textNode, h1.firstChild); }
  textNode.textContent = '';
  stroke.textContent = '';
  if (br) br.style.visibility = 'hidden';
  const caret = document.createElement('span');
  caret.className = 'typing-caret';
  h1.appendChild(caret);
  let i = 0;
  const total = part1.length + part2.length;
  const speed = 60;
  const start = () => {
    const id = setInterval(() => {
      i++;
      if (i <= part1.length) {
        textNode.textContent = part1.slice(0, i);
      } else {
        if (br) br.style.visibility = '';
        const j = i - part1.length;
        stroke.textContent = part2.slice(0, j);
      }
      if (i >= total) {
        clearInterval(id);
      }
    }, speed);
  };
  setTimeout(start, 800);
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
    typeGreeting();
    initScrollTriggers();
    animationsTriggered = true; // Mark the animations as triggered
  }
}
function animateImpression() {
  const intro = document.getElementById('intro');
  if (!intro) { unlockInteraction(); startAnimations(); return; }

  lockInteraction();

  const runIntro = () => {
    stopBulbPrompt();
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(".intro-logo", { y: 0, opacity: 1, scale: 1, duration: 0.6 })
      .to(".intro-tag", { y: 0, opacity: 1, duration: 0.45 }, "-=0.25")
      .to(".bulb-prompt", { autoAlpha: 0, duration: 0.2 }, "<")
      .to("#intro", { opacity: 0, duration: 0.5, delay: 0.3 })
      .set("#intro", { display: "none", pointerEvents: "none" })
      .add(unlockInteraction)
      .add(startAnimations);
  };

  let bulbReady = false;
  if (window.setupBulbSwitch && typeof window.setupBulbSwitch === 'function') {
    const bulb = window.setupBulbSwitch();
    bulbReady = !!bulb && !!bulb.toggleTimeline;
  }

  if (bulbReady) {
    window.addEventListener('bulb-on', runIntro, { once: true });
  } else {
    runIntro();
  }
}

window.addEventListener("load", function () {
  animateImpression();
  setupBulbPrompt();
});

function setupBulbPrompt() {
  const prompt = document.querySelector('.bulb-prompt');
  if (!prompt) return;
  const text = prompt.textContent;
  prompt.setAttribute('aria-label', text);
  const parts = text.split('').map((c) => (c === ' ' ? '&nbsp;' : c));
  prompt.innerHTML = parts.map((c) => `<span class="bulb-ch" aria-hidden="true">${c}</span>`).join('');
  const spans = prompt.querySelectorAll('.bulb-ch');
  gsap.set(spans, { display: 'inline-block', opacity: 0 });
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.out' } });
  tl.to(spans, { opacity: 1, duration: 0.04, stagger: 0.08 })
    .to(spans, { opacity: 0, duration: 0.03, stagger: { each: 0.05, from: 'end' } }, '+=1.2');
  window.__bulbTypeTL = tl;
}

function stopBulbPrompt() {
  if (window.__bulbTypeTL) {
    window.__bulbTypeTL.kill();
    window.__bulbTypeTL = null;
  }
}

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

  // Inject controls and progress bar
  const prevBtn = document.createElement('button');
  prevBtn.className = 'work-prev';
  prevBtn.setAttribute('aria-label','Previous slide');
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'work-next';
  nextBtn.setAttribute('aria-label','Next slide');
  nextBtn.innerHTML = '&#10095;';

  const progress = document.createElement('div');
  progress.className = 'work-progress';
  const progressFill = document.createElement('div');
  progressFill.className = 'work-progress-fill';
  progress.appendChild(progressFill);

  slider.appendChild(prevBtn);
  slider.appendChild(nextBtn);
  slider.appendChild(progress);

  function updateSlides(newIndex) {
    const prevIndex = index;
    const prevSlide = slides[prevIndex];
    const nextSlide = slides[newIndex];

    slides.forEach((s)=>{
      s.classList.remove('active','prev');
      s.style.left = '0%';
    });

    if (prevSlide) {
      prevSlide.classList.add('prev');
      gsap.set(prevSlide, { xPercent: 0, opacity: 1, scale: 1, rotate: 0 });
      gsap.to(prevSlide, { xPercent: -30, opacity: 0, scale: 0.98, duration: 0.6, ease: 'power2.out' });
    }

    nextSlide.classList.add('active');
    gsap.set(nextSlide, { xPercent: 100, opacity: 0, scale: 0.98, rotate: -1 });
    gsap.to(nextSlide, { xPercent: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: 'power3.out' });

    const pct = ((newIndex + 1) / slides.length) * 100;
    progressFill.style.width = pct + '%';

    index = newIndex;
  }

  function next() { updateSlides((index + 1) % slides.length); }
  function prev() { updateSlides((index - 1 + slides.length) % slides.length); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  // progress bar is not clickable; navigation via arrows/swipe/keys

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

// Bulb switch setup (CodePen integration)
window.setupBulbSwitch = function setupBulbSwitch() {
  const cords = document.querySelectorAll('.toggle-scene__cord');
  const hit = document.querySelector('.toggle-scene__hit-spot');
  const dummy = document.querySelector('.toggle-scene__dummy-cord');
  const dummyLine = document.querySelector('.toggle-scene__dummy-cord line');
  if (!cords.length || !hit || !dummy || !dummyLine) {
    return { toggleTimeline: gsap.timeline({ paused: true }) };
  }
  const proxy = document.createElement('div');
  const endX = dummyLine.getAttribute('x2');
  const endY = dummyLine.getAttribute('y2');
  const reset = () => gsap.set(proxy, { x: endX, y: endY });
  reset();

  const toggleTL = gsap.timeline({
    paused: true,
    onStart: () => {
      const root = document.documentElement;
      const current = getComputedStyle(root).getPropertyValue('--on').trim();
      const next = current === '1' ? 0 : 1;
      toggleTL._turnOn = next === 1;
      gsap.set(root, { '--on': next });
      gsap.set([dummy, hit], { display: 'none' });
      gsap.set(cords[0], { display: 'block' });
      window.dispatchEvent(new CustomEvent('bulb-toggle', { detail: { on: next === 1 } }));
    },
    onComplete: () => {
      gsap.set([dummy, hit], { display: 'block' });
      gsap.set(cords[0], { display: 'none' });
      reset();
      if (toggleTL._turnOn) {
        window.dispatchEvent(new Event('bulb-on'));
      } else {
        window.dispatchEvent(new Event('bulb-off'));
      }
    }
  });

  for (let i = 1; i < cords.length; i++) {
    toggleTL.add(
      gsap.to(cords[0], {
        morphSVG: cords[i],
        duration: 0.1,
        repeat: 1,
        yoyo: true
      })
    );
  }

  let startX = 0, startY = 0;
  const makeDrag = (triggerEl) => Draggable.create(proxy, {
    trigger: triggerEl,
    type: 'x,y',
    onPress: function() { startX = this.x; startY = this.y; },
    onDrag: function() {
      gsap.set(dummyLine, { attr: { x2: this.x, y2: this.y } });
    },
    onRelease: function() {
      const distX = Math.abs(this.x - startX);
      const distY = Math.abs(this.y - startY);
      const travelled = Math.sqrt(distX * distX + distY * distY);
      gsap.to(dummyLine, {
        attr: { x2: endX, y2: endY },
        duration: 0.1,
        onComplete: () => {
          if (travelled > 30) {
            toggleTL.restart();
          } else {
            reset();
          }
        }
      });
    }
  });
  makeDrag(hit);
  makeDrag(dummyLine);
  const cordsGroup = document.querySelector('.toggle-scene__cords');
  if (cordsGroup) makeDrag(cordsGroup);

  // Mobile/touch fallback: allow simple tap to toggle
  const tapToggle = () => toggleTL.restart();
  hit.addEventListener('click', tapToggle, { passive: true });
  hit.addEventListener('touchend', tapToggle, { passive: true });
  hit.addEventListener('pointerup', tapToggle, { passive: true });

  // Improve touch usability: enlarge hit-spot on coarse pointers
  try {
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (coarse) {
      const r = parseFloat(hit.getAttribute('r')) || 60;
      hit.setAttribute('r', String(Math.max(r, 110)));
    }
  } catch (_) {}

  const svgRoot = document.querySelector('.toggle-scene');
  if (svgRoot) {
    svgRoot.addEventListener('click', tapToggle, { passive: true });
    svgRoot.addEventListener('touchend', tapToggle, { passive: true });
    svgRoot.addEventListener('pointerup', tapToggle, { passive: true });
  }

  return { toggleTimeline: toggleTL };
};

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

const iconCarrier_development = document.getElementById('icon-carrier-development');
const bgCircle_1 = document.getElementById('bg-circle-1');
const firstscreen_grp = document.getElementById('1st-screen');
const secondscreen_grp = document.getElementById('2nd-screen');
const thirdscreen_grp = document.getElementById('3rd-screen');

gsap.set([firstscreen_grp], { xPercent: 20, yPercent: 20, autoAlpha: 0, scale: 0.8 });
gsap.set([secondscreen_grp], { xPercent: 20, yPercent: 20, autoAlpha: 0, scale: 0.8 });
gsap.set([thirdscreen_grp], { xPercent: 20, yPercent: 20, autoAlpha: 0, scale: 0.8 });

function myOverFunction() {
  gsap.to([firstscreen_grp], { duration: 0.45, xPercent: -60, yPercent: 0, autoAlpha: 0.5, scale: 1 });
  gsap.to([secondscreen_grp], { duration: 0.75, xPercent: -40, yPercent: 0, autoAlpha: 0.5, scale: 1 });
  gsap.to([thirdscreen_grp], { duration: 0.95, xPercent: -20, yPercent: 0, autoAlpha: 0.5, scale: 1 });
  gsap.to(bgCircle_1, { duration: 0.75, yPercent: 10, xPercent: 35, scale: 0.85, fill: '#dedede', stroke: '#dedede', ease: 'expo.out' });
  gsap.to('path#mainscreen-display-first', { duration: 1, attr: { d: 'M346,65.6l-139.3,57.7c-1.2,0.5-2,1.6-2.2,2.8l-16.3,108.3l138.8-9.7l24-155.1C351.5,66.7,348.6,64.5,346,65.6z' }, ease: 'expo.out' });
  gsap.to('path#mainscreen-hw-upper-first', { duration: 1, attr: { d: 'M352.3,58.6l-150.9,62.5c-1.3,0.5-2.2,1.7-2.4,3.1l-17.6,117.2l150.3-10.5l26-168C358.2,59.8,355.2,57.4,352.3,58.6z' }, fill: '#ff8800', ease: 'expo.out' });
  gsap.to('path#onoff-btn-first', { duration: 1, attr: { d: 'M251.3,253.5c-1.1,3.6-3.9,5-6.3,3c-2.4-2-3.4-6.6-2.3-10.3c1.1-3.7,4-5,6.3-3C251.4,245.2,252.4,249.8,251.3,253.5z' }, ease: 'expo.out' });
  gsap.to('path#mainscreen-hw-lower-first', { duration: 1, attr: { d: 'M352.4,59.2l-150.1,61.1c-1.9,0.8-3.1,2.6-3.5,4.6l-20.4,134c-0.4,2.4,1.5,4.6,4,4.6l136.7-0.6c4.9,0,9-3.6,9.8-8.4l29.1-191C358.2,60.5,355.2,58.1,352.4,59.2z' }, ease: 'expo.out' });
  gsap.to('path#mainscreen-depth-first', { duration: 1, attr: { d: 'M355.3,58.6l-148.6,64.6c-1.3,0.5-2.2,1.7-2.4,3.1l-24.6,134.4c0,1.1,2.4,4.1,4.8,4.1l139.2,0.4c4.6-0.1,9-4.7,9.7-8.4l29.7-190.4c0.2-0.9,0-1.5-0.4-2C360.9,61.3,356.9,59.3,355.3,58.6z' }, ease: 'expo.out' });
  gsap.to('path#box-top', { duration: 1, attr: { d: 'M208.6,126.3l132.8-53.7l-3.8,21.8l-131.1,47L208.6,126.3z' }, ease: 'expo.out' });
  gsap.to('path#box-right-bottom', { duration: 1, attr: { d: 'M322.5,192l-4,25.7l-126.1,11.5l2.4-15.6L322.5,192z' }, ease: 'expo.out' });
  gsap.to('path#box-left-middle', { duration: 1, attr: { d: 'M195.6,209.2l10.1-63.2l39.1-13.3l-11,70L195.6,209.2z' }, ease: 'expo.out' });
  gsap.to('path#box-right-middle', { duration: 1, attr: { d: 'M335.6,101l-13.1,85.8l-86,15l11-69.5L335.6,101z' }, ease: 'expo.out' });
  gsap.to('path#blue-symbol-topleft', { duration: 1, attr: { d: 'M212.9,129.7c0.1-0.8-0.8-1.1-1.4-0.9c-0.5,0.2-1.5,1.2-1.6,2c-0.1,0.8,0.8,1.1,1.3,0.9C211.8,131.5,211.8,130.5,211.9,129.7z' }, ease: 'expo.out' });
  gsap.to('path#coding-lines-big', { duration: 1, attr: { d: 'M272,130.8l-22.2,6.9 M249.2,143.5l28-8.3 M257.2,147l28.9-8.2 M295.4,142.4l-29.8,8.2 M284.7,151.1l-28.8,7.7 M273.4,159.7l-27.9,7.1 M265.6,167.5l-21.1,4.7 M271.9,171.9l-28.5,6.5 M278.7,176.7l-28.3,5.8 M258.6,186.8l29.2-5.9 M269.1,190.7l-11.1,2' }, ease: 'expo.out' });
  gsap.to('path#coding-lines-min', { duration: 1, attr: { d: 'M327.6,105.8l-6.4,2.1 M321.1,109.3l8-2.5 M323.5,110.1l8.1-2.5 M334.1,108.3l-8.2,2.5 M331.3,110.6l-8.1,2.5 M328.2,112.9l-8,2.4 M326,115l-6.1,1.7 M327.9,116l-8.2,2.4 M329.7,117l-8,2.2 M324.2,120l8.1-2.3 M327.2,120.6l-3.1,0.9' }, ease: 'expo.out' });
  gsap.to('path#mainscreen-leg-shadow-first', { duration: 1, attr: { d: 'M273.1,264.7c1,3.5,1.9,6.8,2.7,9.7c10.3,0.2,24.3,2.2,35.2,7.8c-3.8-11.4-5.8-19.1-5.8-19.1L273.1,264.7z' }, ease: 'expo.out' });
  gsap.to('path#mainscreen-leg-first', { duration: 1, attr: { d: 'M305.1,263.1c0,0,3.4,12.7,9.4,29.7c1.6,4.6,1.4,8.2-2.6,8.9c-4,0.7-22.4,2.3-28,2.7c-7.5,0.5-8.8,0.4-17.1-0.3c-15.8-1.3-50.5-3.1-50.5-3.1s39-1,49-1.8c10-0.8,12.4-4.2,13.4-7.7c1-3.4-1.9-13.3-5.6-26.8L305.1,263.1z' }, ease: 'expo.out' });
  gsap.to('path#shadow-under-first', { duration: 1, attr: { d: 'M372.3,304.7c0,3.3-45.1,4.8-97.3,5.3c-31.5,0.3-92.2-3.2-91.7-5.3c1.2-5.1,60.4-3,89.8-3.7C328.8,299.8,372.3,302.6,372.3,304.7z' }, ease: 'expo.out' });
}

function myOutFunction() {
  gsap.to([firstscreen_grp], { duration: 0.45, xPercent: 20, yPercent: 20, autoAlpha: 0, scale: 0.8 });
  gsap.to([secondscreen_grp], { duration: 0.35, xPercent: 20, yPercent: 20, autoAlpha: 0, scale: 0.8 });
  gsap.to([thirdscreen_grp], { duration: 0.25, xPercent: 20, yPercent: 20, autoAlpha: 0, scale: 0.8 });
  gsap.to(bgCircle_1, { duration: 1.25, yPercent: 0, xPercent: 0, scale: 1, fill: '#e6e6e6', stroke: '#e6e6e6', ease: 'elastic.out' });
  gsap.to('path#mainscreen-display-first', { duration: 0.75, attr: { d: 'M361.1,101.8l-198.9,10.6c-2.5,0.2-3.9,1.5-3.9,3.3l-5.3,118.8l206.8,6.8l7.9-134.2C367.8,104.6,364.1,101.6,361.1,101.8z' }, ease: 'elastic.out' });
  gsap.to('path#mainscreen-hw-upper-first', { duration: 0.75, attr: { d: 'M368.7,95.2l-211.1,12.7c-2.7,0.2-4.5,1.9-4.7,3.9l-5.8,128.5l220,8.7l8.6-148C375.9,98.2,371.9,95,368.7,95.2z' }, fill: '#695f5e', ease: 'elastic.out' });
  gsap.to('path#onoff-btn-first', { duration: 0.75, attr: { d: 'M263.8,261.5c-1.5,3.8-5.5,5.3-8.8,3.2c-3.4-2.1-4.8-7-3.3-10.9c1.6-3.9,5.6-5.3,8.9-3.1C264,252.8,265.4,257.7,263.8,261.5z' }, ease: 'elastic.out' });
  gsap.to('path#mainscreen-hw-lower-first', { duration: 0.75, attr: { d: 'M368.7,95.2l-210.6,12.6c-3.3,0.2-5.1,1.9-5.3,4l-6.6,147.2c-0.1,2.6,3.8,5.3,8.3,5.5l200.9,12c5.8,0.3,10.3-2.5,10.5-6.7l9.8-168.9C375.9,98.2,371.9,95,368.7,95.2z' }, ease: 'elastic.out' });
  gsap.to('path#mainscreen-depth-first', { duration: 0.75, attr: { d: 'M372.1,96.1l-205.3,16.2c-2.2,0.1-3.6,1.2-3.6,2.7l-15.5,146.3c0.2,1.2,5.3,4.8,9.7,5.1l201,11.4c5.5,0.3,10.1-3.6,10.4-6.8l9.8-167.1c0.1-0.8-0.2-1.4-0.7-2C375.4,98.5,374.2,97.3,372.1,96.1z' }, ease: 'elastic.out' });
  gsap.to('path#box-top', { duration: 0.75, attr: { d: 'M166.4,118l190-9.5l-1.1,17.2l-189.7,7.9L166.4,118z' }, ease: 'elastic.out' });
  gsap.to('path#box-right-bottom', { duration: 0.75, attr: { d: 'M349.9,211.9l-1.4,22.6l-189-5.2l0.8-17L349.9,211.9z' }, ease: 'elastic.out' });
  gsap.to('path#box-left-middle', { duration: 0.75, attr: { d: 'M161,207.5l4.1-69l65.5-2.3l-4.2,71.3L161,207.5z' }, ease: 'elastic.out' });
  gsap.to('path#box-right-middle', { duration: 0.75, attr: { d: 'M354.5,131.2l-4.3,75.8l-119.2,0.6l4-71.5L354.5,131.2z' }, ease: 'elastic.out' });
  gsap.to('path#blue-symbol-topleft', { duration: 0.75, attr: { d: 'M176.4,124.2c-0.1-0.9-1.8-1.6-2.8-1.6c-0.9,0.1-2.6,0.8-2.6,1.8c0.1,0.9,1.8,1.6,2.8,1.6C174.7,125.9,176.4,125.1,176.4,124.2z' }, ease: 'elastic.out' });
  gsap.to('path#coding-lines-big', { duration: 0.75, attr: { d: 'M273,141.6l-34,0.7 M239,148.3l42.5-0.7 M252.8,154.3l42.5-0.7 M309.2,159.6l-42.5,0.7 M295.3,165.6l-42.5,0.7 M280.1,171.6l-42.5,0.7 M269.8,177.8l-32.7,0 M280.1,183.7l-43.6,0.5 M291,189.9l-42.3,0.1M262.5,196.1l42.3-0.3 M279.2,202l-16.5,0' }, ease: 'elastic.out' });
  gsap.to('path#coding-lines-min', { duration: 0.75, attr: { d: 'M344.3,133.4l-7.8,0.2 M336.6,135l9.7-0.2 M339.7,136.3l9.7-0.2 M352.6,137.6l-9.7,0.2 M349.4,138.9l-9.7,0.2 M346,140.3l-9.7,0.2 M343.6,141.7l-7.5,0 M346,143.1l-10,0.1 M348.4,144.5l-9.7,0M341.9,145.9l9.7-0.1 M345.7,147.3l-3.8,0' }, ease: 'elastic.out' });
  gsap.to('path#mainscreen-leg-shadow-first', { duration: 0.75, attr: { d: 'M254.1,261.6c0.4,4,2,9.1,3.2,12c7.8-0.5,33.6,0.8,45.9,5.4c-0.8-12.6-6.6-20.8-6.6-20.8L254.1,261.6z' }, ease: 'elastic.out' });
  gsap.to('path#mainscreen-leg-first', { duration: 0.75, attr: { d: 'M292.2,257.6c0,0,9.6,2.1,11.3,23.6c0.5,7.1,1.2,11.3-1.2,13.4c-2.4,2.2-13.3,6.3-20.3,9.4c-3.8,1.7-5.8,2.1-15,1.3c-13.4-1.2-52-5.5-52-5.5s26.8-6.1,34.8-10.2c7.5-3.7,8.1-6.3,8.1-12c0-4.6-3.4-8.6-3.7-16L292.2,257.6z' }, ease: 'elastic.out' });
  gsap.to('path#shadow-under-first', { duration: 0.75, attr: { d: 'M373.2,302.8c1,5-46.2,6.8-98.4,8.3c-55.5,1.5-129-9.1-127.7-13c3-9,103-16.6,149.7-15.3C352.5,284.3,371.5,294.5,373.2,302.8z' }, ease: 'elastic.out' });
}

if (iconCarrier_development) {
  const devSvg = iconCarrier_development.querySelector('svg');
  try {
    const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) {
      const target = devSvg || iconCarrier_development;
      const over = () => myOverFunction();
      const out = () => myOutFunction();
      target.addEventListener('touchstart', over, { passive: true });
      target.addEventListener('touchend', out, { passive: true });
      target.addEventListener('pointerdown', over, { passive: true });
      target.addEventListener('pointerup', out, { passive: true });
    }
  } catch (_) {}
  (devSvg || iconCarrier_development).addEventListener('click', function() {
    if (iconCarrier_development.classList.contains('open')) {
      iconCarrier_development.classList.remove('open');
      gsap.to('path#mainscreen-display-first', { duration: 1, attr: { d: 'M346,65.6l-139.3,57.7c-1.2,0.5-2,1.6-2.2,2.8l-16.3,108.3l138.8-9.7l24-155.1C351.5,66.7,348.6,64.5,346,65.6z' }, ease: 'expo.out' });
      gsap.to('path#mainscreen-hw-upper-first', { duration: 1, attr: { d: 'M352.3,58.6l-150.9,62.5c-1.3,0.5-2.2,1.7-2.4,3.1l-17.6,117.2l150.3-10.5l26-168C358.2,59.8,355.2,57.4,352.3,58.6z' }, ease: 'expo.out' });
      gsap.to('path#onoff-btn-first', { duration: 1, attr: { d: 'M251.3,253.5c-1.1,3.6-3.9,5-6.3,3c-2.4-2-3.4-6.6-2.3-10.3c1.1-3.7,4-5,6.3-3C251.4,245.2,252.4,249.8,251.3,253.5z' }, ease: 'expo.out' });
      gsap.to('path#mainscreen-hw-lower-first', { duration: 1, attr: { d: 'M352.4,59.2l-150.1,61.1c-1.9,0.8-3.1,2.6-3.5,4.6l-20.4,134c-0.4,2.4,1.5,4.6,4,4.6l136.7-0.6c4.9,0,9-3.6,9.8-8.4l29.1-191C358.2,60.5,355.2,58.1,352.4,59.2z' }, ease: 'expo.out' });
      gsap.to('path#mainscreen-depth-first', { duration: 1, attr: { d: 'M355.3,58.6l-148.6,64.6c-1.3,0.5-2.2,1.7-2.4,3.1l-24.6,134.4c0,1.1,2.4,4.1,4.8,4.1l139.2,0.4c4.6-0.1,9-4.7,9.7-8.4l29.7-190.4c0.2-0.9,0-1.5-0.4-2C360.9,61.3,356.9,59.3,355.3,58.6z' }, ease: 'expo.out' });
      gsap.to('path#box-top', { duration: 1, attr: { d: 'M208.6,126.3l132.8-53.7l-3.8,21.8l-131.1,47L208.6,126.3z' }, ease: 'expo.out' });
      gsap.to('path#box-right-bottom', { duration: 1, attr: { d: 'M322.5,192l-4,25.7l-126.1,11.5l2.4-15.6L322.5,192z' }, ease: 'expo.out' });
      gsap.to('path#box-left-middle', { duration: 1, attr: { d: 'M195.6,209.2l10.1-63.2l39.1-13.3l-11,70L195.6,209.2z' }, ease: 'expo.out' });
      gsap.to('path#box-right-middle', { duration: 1, attr: { d: 'M335.6,101l-13.1,85.8l-86,15l11-69.5L335.6,101z' }, ease: 'expo.out' });
      gsap.to('path#blue-symbol-topleft', { duration: 1, attr: { d: 'M212.9,129.7c0.1-0.8-0.8-1.1-1.4-0.9c-0.5,0.2-1.5,1.2-1.6,2c-0.1,0.8,0.8,1.1,1.3,0.9C211.8,131.5,211.8,130.5,211.9,129.7z' }, ease: 'expo.out' });
      gsap.to('path#coding-lines-big', { duration: 1, attr: { d: 'M272,130.8l-22.2,6.9 M249.2,143.5l28-8.3 M257.2,147l28.9-8.2 M295.4,142.4l-29.8,8.2 M284.7,151.1l-28.8,7.7 M273.4,159.7l-27.9,7.1 M265.6,167.5l-21.1,4.7 M271.9,171.9l-28.5,6.5 M278.7,176.7l-28.3,5.8 M258.6,186.8l29.2-5.9 M269.1,190.7l-11.1,2' }, ease: 'expo.out' });
      gsap.to('path#coding-lines-min', { duration: 1, attr: { d: 'M327.6,105.8l-6.4,2.1 M321.1,109.3l8-2.5 M323.5,110.1l8.1-2.5 M334.1,108.3l-8.2,2.5 M331.3,110.6l-8.1,2.5 M328.2,112.9l-8,2.4 M326,115l-6.1,1.7 M327.9,116l-8.2,2.4 M329.7,117l-8,2.2 M324.2,120l8.1-2.3 M327.2,120.6l-3.1,0.9' }, ease: 'expo.out' });
      gsap.to('path#mainscreen-leg-shadow-first', { duration: 1, attr: { d: 'M273.1,264.7c1,3.5,1.9,6.8,2.7,9.7c10.3,0.2,24.3,2.2,35.2,7.8c-3.8-11.4-5.8-19.1-5.8-19.1L273.1,264.7z' }, ease: 'expo.out' });
      gsap.to('path#mainscreen-leg-first', { duration: 1, attr: { d: 'M305.1,263.1c0,0,3.4,12.7,9.4,29.7c1.6,4.6,1.4,8.2-2.6,8.9c-4,0.7-22.4,2.3-28,2.7c-7.5,0.5-8.8,0.4-17.1-0.3c-15.8-1.3-50.5-3.1-50.5-3.1s39-1,49-1.8c10-0.8,12.4-4.2,13.4-7.7c1-3.4-1.9-13.3-5.6-26.8L305.1,263.1z' }, ease: 'expo.out' });
      gsap.to('path#shadow-under-first', { duration: 1, attr: { d: 'M372.3,304.7c0,3.3-45.1,4.8-97.3,5.3c-31.5,0.3-92.2-3.2-91.7-5.3c1.2-5.1,60.4-3,89.8-3.7C328.8,299.8,372.3,302.6,372.3,304.7z' }, ease: 'expo.out' });
    } else {
      iconCarrier_development.classList.add('open');
      gsap.to('path#mainscreen-display-first', { duration: 0.75, attr: { d: 'M361.1,101.8l-198.9,10.6c-2.5,0.2-3.9,1.5-3.9,3.3l-5.3,118.8l206.8,6.8l7.9-134.2C367.8,104.6,364.1,101.6,361.1,101.8z' }, ease: 'elastic.out' });
      gsap.to('path#mainscreen-hw-upper-first', { duration: 0.75, attr: { d: 'M368.7,95.2l-211.1,12.7c-2.7,0.2-4.5,1.9-4.7,3.9l-5.8,128.5l220,8.7l8.6-148C375.9,98.2,371.9,95,368.7,95.2z' }, ease: 'elastic.out' });
      gsap.to('path#onoff-btn-first', { duration: 0.75, attr: { d: 'M263.8,261.5c-1.5,3.8-5.5,5.3-8.8,3.2c-3.4-2.1-4.8-7-3.3-10.9c1.6-3.9,5.6-5.3,8.9-3.1C264,252.8,265.4,257.7,263.8,261.5z' }, ease: 'elastic.out' });
      gsap.to('path#mainscreen-hw-lower-first', { duration: 0.75, attr: { d: 'M368.7,95.2l-210.6,12.6c-3.3,0.2-5.1,1.9-5.3,4l-6.6,147.2c-0.1,2.6,3.8,5.3,8.3,5.5l200.9,12c5.8,0.3,10.3-2.5,10.5-6.7l9.8-168.9C375.9,98.2,371.9,95,368.7,95.2z' }, ease: 'elastic.out' });
      gsap.to('path#mainscreen-depth-first', { duration: 0.75, attr: { d: 'M372.1,96.1l-205.3,16.2c-2.2,0.1-3.6,1.2-3.6,2.7l-15.5,146.3c0.2,1.2,5.3,4.8,9.7,5.1l201,11.4c5.5,0.3,10.1-3.6,10.4-6.8l9.8-167.1c0.1-0.8-0.2-1.4-0.7-2C375.4,98.5,374.2,97.3,372.1,96.1z' }, ease: 'elastic.out' });
      gsap.to('path#box-top', { duration: 0.75, attr: { d: 'M166.4,118l190-9.5l-1.1,17.2l-189.7,7.9L166.4,118z' }, ease: 'elastic.out' });
      gsap.to('path#box-right-bottom', { duration: 0.75, attr: { d: 'M349.9,211.9l-1.4,22.6l-189-5.2l0.8-17L349.9,211.9z' }, ease: 'elastic.out' });
      gsap.to('path#box-left-middle', { duration: 0.75, attr: { d: 'M161,207.5l4.1-69l65.5-2.3l-4.2,71.3L161,207.5z' }, ease: 'elastic.out' });
      gsap.to('path#box-right-middle', { duration: 0.75, attr: { d: 'M354.5,131.2l-4.3,75.8l-119.2,0.6l4-71.5L354.5,131.2z' }, ease: 'elastic.out' });
      gsap.to('path#blue-symbol-topleft', { duration: 0.75, attr: { d: 'M176.4,124.2c-0.1-0.9-1.8-1.6-2.8-1.6c-0.9,0.1-2.6,0.8-2.6,1.8c0.1,0.9,1.8,1.6,2.8,1.6C174.7,125.9,176.4,125.1,176.4,124.2z' }, ease: 'elastic.out' });
      gsap.to('path#coding-lines-big', { duration: 0.75, attr: { d: 'M273,141.6l-34,0.7 M239,148.3l42.5-0.7 M252.8,154.3l42.5-0.7 M309.2,159.6l-42.5,0.7 M295.3,165.6l-42.5,0.7 M280.1,171.6l-42.5,0.7 M269.8,177.8l-32.7,0 M280.1,183.7l-43.6,0.5 M291,189.9l-42.3,0.1M262.5,196.1l42.3-0.3 M279.2,202l-16.5,0' }, ease: 'elastic.out' });
      gsap.to('path#coding-lines-min', { duration: 0.75, attr: { d: 'M344.3,133.4l-7.8,0.2 M336.6,135l9.7-0.2 M339.7,136.3l9.7-0.2 M352.6,137.6l-9.7,0.2 M349.4,138.9l-9.7,0.2 M346,140.3l-9.7,0.2 M343.6,141.7l-7.5,0 M346,143.1l-10,0.1 M348.4,144.5l-9.7,0M341.9,145.9l9.7-0.1 M345.7,147.3l-3.8,0' }, ease: 'elastic.out' });
      gsap.to('path#mainscreen-leg-shadow-first', { duration: 0.75, attr: { d: 'M254.1,261.6c0.4,4,2,9.1,3.2,12c7.8-0.5,33.6,0.8,45.9,5.4c-0.8-12.6-6.6-20.8-6.6-20.8L254.1,261.6z' }, ease: 'elastic.out' });
      gsap.to('path#mainscreen-leg-first', { duration: 0.75, attr: { d: 'M292.2,257.6c0,0,9.6,2.1,11.3,23.6c0.5,7.1,1.2,11.3-1.2,13.4c-2.4,2.2-13.3,6.3-20.3,9.4c-3.8,1.7-5.8,2.1-15,1.3c-13.4-1.2-52-5.5-52-5.5s26.8-6.1,34.8-10.2c7.5-3.7,8.1-6.3,8.1-12c0-4.6-3.4-8.6-3.7-16L292.2,257.6z' }, ease: 'elastic.out' });
      gsap.to('path#shadow-under-first', { duration: 0.75, attr: { d: 'M373.2,302.8c1,5-46.2,6.8-98.4,8.3c-55.5,1.5-129-9.1-127.7-13c3-9,103-16.6,149.7-15.3C352.5,284.3,371.5,294.5,373.2,302.8z' }, ease: 'elastic.out' });
    }
  }, false);
}
