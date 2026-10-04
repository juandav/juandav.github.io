(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVG = 'http://www.w3.org/2000/svg';

  /* ---------- Real constellations ----------
     Star coordinates are approximate, normalized to a 0..100 box.
     Each star: [x, y, magnitude 1..3 (1 = brightest)]. */
  const CONSTELLATIONS = {
    orion: {
      name: 'Orion',
      stars: [[22, 12, 1], [72, 16, 2], [46, 0, 3], [38, 52, 2], [48, 49, 2], [58, 46, 2], [30, 92, 2], [80, 86, 1]],
      links: [[0, 2], [2, 1], [0, 1], [0, 3], [1, 5], [3, 4], [4, 5], [3, 6], [5, 7]]
    },
    ursaMajor: {
      name: 'Ursa Major',
      stars: [[92, 30, 1], [90, 62, 2], [66, 70, 2], [64, 40, 3], [46, 34, 1], [28, 30, 2], [6, 44, 1]],
      links: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]]
    },
    cassiopeia: {
      name: 'Cassiopeia',
      stars: [[0, 30, 2], [24, 72, 1], [48, 42, 1], [72, 82, 2], [98, 24, 2]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    cygnus: {
      name: 'Cygnus',
      stars: [[50, 0, 1], [50, 40, 2], [50, 100, 2], [8, 30, 2], [92, 24, 3], [50, 68, 3]],
      links: [[0, 1], [1, 5], [5, 2], [3, 1], [1, 4]]
    },
    lyra: {
      name: 'Lyra',
      stars: [[32, 0, 1], [12, 12, 3], [48, 34, 3], [74, 40, 3], [64, 92, 2], [36, 86, 2]],
      links: [[0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [5, 2]]
    },
    scorpius: {
      name: 'Scorpius',
      stars: [[2, 12, 2], [10, 0, 2], [16, 20, 2], [30, 32, 1], [40, 42, 3], [48, 56, 2], [52, 72, 3], [50, 88, 2], [60, 98, 2], [76, 96, 2], [88, 86, 1], [84, 74, 2]],
      links: [[1, 0], [0, 2], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]]
    },
    crux: {
      name: 'Crux',
      stars: [[50, 0, 2], [46, 100, 1], [8, 46, 1], [88, 54, 2], [68, 72, 3]],
      links: [[0, 1], [2, 3]]
    }
  };

  /* ---------- Placement ----------
     anchor: section the item is attached to; y: fraction of that section's height;
     x: % of viewport width; size in px; depth: parallax strength; mobile: show on phones. */
  const ITEMS = [
    { type: 'constellation', id: 'cassiopeia', anchor: '.hero', y: 0.12, x: 47, size: 160, depth: 0.08, mobile: false },
    { type: 'constellation', id: 'ursaMajor', anchor: '.hero', y: 0.80, x: 38, size: 230, depth: 0.12, mobile: true },
    { type: 'planet', kind: 'giant', anchor: '.hero', y: 0.86, x: -9, size: 300, depth: 0.25, mobile: true },

    { type: 'planet', kind: 'ringed', anchor: '#mission', y: -0.02, x: 82, size: 130, depth: 0.15, mobile: true },
    { type: 'constellation', id: 'orion', anchor: '#briefing', y: 0.0, x: 68, size: 200, depth: 0.1, mobile: true },
    { type: 'planet', kind: 'mars', anchor: '#briefing', y: 0.55, x: 1, size: 56, depth: 0.35, mobile: false },

    { type: 'constellation', id: 'cygnus', anchor: '#capabilities', y: 0.0, x: 72, size: 180, depth: 0.1, mobile: true },
    { type: 'planet', kind: 'moon', anchor: '#capabilities', y: 0.62, x: 93, size: 90, depth: 0.3, mobile: false },

    { type: 'constellation', id: 'lyra', anchor: '#constellation', y: 0.02, x: 80, size: 120, depth: 0.1, mobile: false },

    { type: 'constellation', id: 'scorpius', anchor: '#missions', y: 0.0, x: 68, size: 230, depth: 0.1, mobile: true },
    { type: 'planet', kind: 'ice', anchor: '#missions', y: 0.5, x: -5, size: 150, depth: 0.25, mobile: false },

    { type: 'constellation', id: 'crux', anchor: '#comms', y: 0.08, x: 8, size: 120, depth: 0.1, mobile: true, note: 'seen from home' },
    { type: 'planet', kind: 'earth', anchor: '#comms', y: 0.18, x: 80, size: 120, depth: 0.2, mobile: true, label: 'Home base · Colombia' }
  ];

  const el = (tag, attrs = {}, ns) => {
    const node = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };

  function buildConstellation ({ id, note }) {
    const c = CONSTELLATIONS[id];
    const svg = el('svg', { viewBox: '-8 -8 116 130', class: 'const' }, SVG);

    c.links.forEach(([a, b]) => {
      const [x1, y1] = c.stars[a];
      const [x2, y2] = c.stars[b];
      svg.append(el('line', { x1, y1, x2, y2, pathLength: 1, class: 'const__line' }, SVG));
    });

    c.stars.forEach(([cx, cy, mag], i) => {
      const r = [0, 2.4, 1.7, 1.2][mag];
      const star = el('circle', { cx, cy, r, class: 'const__star' }, SVG);
      star.style.animationDelay = `${(i * 0.7) % 4}s`;
      svg.append(el('circle', { cx, cy, r: r * 3.2, class: 'const__halo' }, SVG), star);
    });

    const label = el('text', { x: 50, y: 118, 'text-anchor': 'middle', class: 'const__name' }, SVG);
    label.textContent = note ? `${c.name} · ${note}` : c.name;
    svg.append(label);
    return svg;
  }

  function buildPlanet ({ kind, label }) {
    const planet = el('div', { class: `planet planet--${kind}` });
    const surface = el('div', { class: 'planet__surface' });

    if (kind === 'giant') surface.append(el('span', { class: 'planet__storm' }));
    if (kind === 'earth') surface.append(el('span', { class: 'planet__land' }));
    if (kind === 'ringed') planet.append(el('span', { class: 'planet__ring planet__ring--back' }));
    planet.append(surface);
    if (kind === 'ringed') planet.append(el('span', { class: 'planet__ring planet__ring--front' }));
    if (kind === 'earth') planet.append(el('span', { class: 'planet__orbit' }, null));
    if (kind === 'earth') planet.lastChild.append(el('span', { class: 'planet__moon' }));

    if (label) {
      const tag = el('span', { class: 'planet__label' });
      tag.textContent = label;
      planet.append(tag);
    }
    return planet;
  }

  /* ---------- Layer ---------- */
  const layer = el('div', { class: 'cosmos', 'aria-hidden': 'true' });
  document.body.prepend(layer);

  const nodes = ITEMS.map(item => {
    const wrap = el('div', { class: `cosmos__item cosmos__item--${item.type}` });
    if (!item.mobile) wrap.classList.add('cosmos__item--desktop');
    wrap.append(item.type === 'planet' ? buildPlanet(item) : buildConstellation(item));
    layer.append(wrap);
    return { item, wrap, top: 0 };
  });

  function layout () {
    const compact = window.innerWidth < 720;
    const scale = compact ? 0.6 : window.innerWidth < 1100 ? 0.8 : 1;
    for (const n of nodes) {
      const anchor = document.querySelector(n.item.anchor);
      if (!anchor) continue;
      const rect = anchor.getBoundingClientRect();
      const size = n.item.size * scale;
      n.top = rect.top + window.scrollY + rect.height * n.item.y;
      n.wrap.style.top = `${n.top}px`;
      n.wrap.style.left = `${n.item.x}%`;
      n.wrap.style.setProperty('--size', `${size}px`);
    }
    parallax();
  }

  function parallax () {
    if (reducedMotion) return;
    const center = window.scrollY + window.innerHeight / 2;
    for (const n of nodes) {
      const offset = (center - n.top) * n.item.depth;
      n.wrap.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      parallax();
      ticking = false;
    });
  }, { passive: true });

  // Section heights change as fonts load and on resize; keep anchors in sync.
  new ResizeObserver(layout).observe(document.querySelector('main'));
  window.addEventListener('resize', layout);
  layout();

  /* ---------- Draw constellations when they come into view ---------- */
  const drawables = layer.querySelectorAll('.cosmos__item--constellation');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-drawn');
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    drawables.forEach(d => io.observe(d));
  } else {
    drawables.forEach(d => d.classList.add('is-drawn'));
  }
})();
