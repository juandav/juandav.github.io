(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Starfield ---------- */
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  const STAR_COLORS = ['#ffffff', '#c4b5fd', '#f0abfc', '#a5f3fc'];
  let stars = [];
  let meteors = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let scrollY = window.scrollY;

  function resize () {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round((width * height) / 3800);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.2,
      depth: Math.random() * 0.6 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
      color: STAR_COLORS[Math.random() < 0.8 ? 0 : 1 + Math.floor(Math.random() * 3)]
    }));
    if (reducedMotion) draw(0);
  }

  function spawnMeteor () {
    meteors.push({
      x: Math.random() * width * 0.8 + width * 0.2,
      y: Math.random() * height * 0.4,
      vx: -(Math.random() * 6 + 6),
      vy: Math.random() * 3 + 2,
      life: 1
    });
  }

  function draw (t) {
    ctx.clearRect(0, 0, width, height);

    for (const s of stars) {
      // Parallax: deeper stars drift slower with scroll.
      const y = ((s.y - scrollY * s.depth * 0.3) % height + height) % height;
      const twinkle = reducedMotion ? 0.8 : 0.55 + Math.sin(t * s.speed * 0.06 + s.phase) * 0.45;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    meteors = meteors.filter(m => m.life > 0);
    for (const m of meteors) {
      const tail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
      tail.addColorStop(0, `rgba(240, 171, 252, ${m.life})`);
      tail.addColorStop(1, 'rgba(240, 171, 252, 0)');
      ctx.strokeStyle = tail;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
      ctx.stroke();
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.012;
    }
  }

  function loop (t) {
    if (!document.hidden) {
      if (Math.random() < 0.004) spawnMeteor();
      draw(t);
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (reducedMotion) draw(0);
  }, { passive: true });
  resize();
  if (!reducedMotion) requestAnimationFrame(loop);

  /* ---------- Typed role ---------- */
  const ROLES = [
    'AI Engineer · LLM Systems & Agents',
    'AWS Certified Developer',
    'Studying for AWS AI certification',
    'Event-Driven & Streaming Architectures',
    'Problem solver first, coder second',
    'Handcrafted code + AI-guided engineering'
  ];
  const typed = document.getElementById('typed');

  if (!reducedMotion) {
    let role = 0;
    let chars = ROLES[0].length;
    let deleting = true;

    const tick = () => {
      const text = ROLES[role];
      chars += deleting ? -1 : 1;
      typed.textContent = text.slice(0, chars);

      let delay = deleting ? 28 : 55;
      if (!deleting && chars === text.length) {
        deleting = true;
        delay = 2200;
      } else if (deleting && chars === 0) {
        deleting = false;
        role = (role + 1) % ROLES.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- Mission clock & year ---------- */
  const clock = document.getElementById('clock');
  const pad = n => String(n).padStart(2, '0');
  const updateClock = () => {
    const d = new Date();
    clock.textContent = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
  };
  updateClock();
  setInterval(updateClock, 1000);
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Tech constellation ---------- */
  // Star offsets are relative to the cluster center, in viewBox units.
  const CLUSTERS = [
    {
      name: 'AI · ML',
      wide: [300, 230], tall: [170, 170],
      stars: [['Claude', 0, 0, 3.2], ['OpenAI', -110, 60, 2.4], ['LangChain', 90, 80, 2.4], ['Hugging Face', -60, -95, 2], ['PyTorch', 130, -50, 2.2], ['Jupyter', -10, 140, 1.8]],
      links: [[0, 1], [0, 2], [0, 3], [0, 4], [2, 5], [1, 5]]
    },
    {
      name: 'AWS',
      wide: [800, 220], tall: [430, 330],
      stars: [['Lambda', 0, 0, 3.2], ['EventBridge', -120, 50, 2.4], ['Bedrock', 110, -70, 2.8], ['SQS / SNS', -40, 120, 2.2], ['Step Functions', 120, 70, 2], ['DynamoDB', -150, -60, 2], ['Kinesis', 40, -120, 1.8], ['ECS / Fargate', 200, 0, 1.8]],
      links: [[0, 1], [0, 2], [1, 3], [0, 4], [1, 5], [2, 6], [4, 7], [2, 7]]
    },
    {
      name: 'LANGUAGES',
      wide: [1300, 250], tall: [170, 500],
      stars: [['TypeScript', 0, 0, 3], ['Python', -120, -70, 3], ['Node.js', 60, 100, 2.6], ['Go', 130, -40, 2], ['C / C++', -40, -150, 1.8], ['Java', 160, 70, 1.6], ['C#', -140, 70, 1.6], ['React', -40, 160, 2], ['NestJS', 150, 160, 2]],
      links: [[0, 1], [0, 2], [0, 3], [1, 4], [3, 5], [1, 6], [2, 7], [2, 8]]
    },
    {
      name: 'DATA · DEVOPS',
      wide: [500, 600], tall: [430, 640],
      stars: [['Kafka', 0, 0, 3], ['PostgreSQL', -130, -40, 2.4], ['Redis', 110, -60, 2.2], ['MongoDB', -90, 90, 2], ['RabbitMQ', 120, 70, 1.8], ['Docker', 230, 10, 2.6], ['Linux', -240, 30, 2.6], ['GitHub Actions', 20, 130, 1.6]],
      links: [[0, 1], [0, 2], [1, 3], [0, 4], [2, 5], [1, 6], [3, 7], [4, 7]]
    },
    {
      name: 'STREAMING',
      wide: [1100, 610], tall: [200, 830],
      stars: [['WebRTC', 0, 0, 3], ['HLS', -120, -50, 2.4], ['WebSockets', 120, -50, 2.4], ['RTMP', -80, 90, 2], ['SRT', 90, 90, 2], ['MPEG-DASH', -210, 40, 1.6], ['RTSP', 210, 40, 1.6]],
      links: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6], [3, 4]]
    }
  ];
  const BRIDGES = [[0, 0, 1, 2], [1, 0, 2, 2], [1, 1, 3, 0], [3, 5, 4, 2], [1, 3, 4, 0]];

  const sky = document.getElementById('sky');
  const SVG = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs) => {
    const node = document.createElementNS(SVG, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };

  function renderSky () {
    const tall = sky.clientWidth < 720;
    const [vw, vh] = tall ? [600, 1000] : [1600, 800];
    // Compress star offsets on narrow screens so clusters don't overlap.
    const k = tall ? 0.62 : 1;
    const svg = el('svg', { viewBox: `0 0 ${vw} ${vh}`, role: 'img', 'aria-label': 'Constellation of technologies grouped by area' });
    if (tall) svg.classList.add('is-compact');
    const linkLayer = el('g', {});
    const starLayer = el('g', {});
    svg.append(linkLayer, starLayer);

    const pos = CLUSTERS.map(c => {
      const [cx, cy] = tall ? c.tall : c.wide;
      return c.stars.map(([, dx, dy]) => [cx + dx * k, cy + dy * k]);
    });

    const line = ([x1, y1], [x2, y2], dashed) => {
      const l = el('line', { x1, y1, x2, y2, class: 'link' });
      if (dashed) l.setAttribute('stroke-dasharray', '3 6');
      linkLayer.append(l);
    };

    CLUSTERS.forEach((c, ci) => {
      c.links.forEach(([a, b]) => line(pos[ci][a], pos[ci][b]));

      const [cx, cy] = tall ? c.tall : c.wide;
      const minY = Math.min(...pos[ci].map(p => p[1]));
      const name = el('text', { x: cx, y: minY - 30, 'text-anchor': 'middle', class: 'cluster-name' });
      name.textContent = c.name;
      starLayer.append(name);

      c.stars.forEach(([label, , , size], si) => {
        const [x, y] = pos[ci][si];
        const g = el('g', { class: 'star', tabindex: 0, role: 'img', 'aria-label': label });
        if (si === 0) g.classList.add('is-named');
        g.append(
          el('circle', { class: 'glow', cx: x, cy: y, r: size * 4 }),
          el('circle', { class: 'core', cx: x, cy: y, r: size })
        );
        const text = el('text', { x, y: y + size * 4 + 22, 'text-anchor': 'middle' });
        text.textContent = label;
        g.append(text);
        starLayer.append(g);
      });
    });

    BRIDGES.forEach(([c1, s1, c2, s2]) => line(pos[c1][s1], pos[c2][s2], true));

    sky.replaceChildren(svg);
  }

  renderSky();
  let skyWide = sky.clientWidth >= 720;
  window.addEventListener('resize', () => {
    const wide = sky.clientWidth >= 720;
    if (wide !== skyWide) {
      skyWide = wide;
      renderSky();
    }
  });

  /* ---------- Scroll reveal ---------- */
  const targets = document.querySelectorAll('.section__head, .mission, .briefing, .principles, .module, .sky, .clusters, .archive article, .beyond, .terminal, .comms');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12 });
    targets.forEach(t => {
      t.classList.add('reveal');
      io.observe(t);
    });
  }
})();
