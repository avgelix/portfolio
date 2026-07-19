/* =========================================================
   Angela Petrone — Portfolio interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---- PostHog analytics (cookieless) ----------------------------------
     Setup (one time):
       1. Create a free project at posthog.com
       2. Paste your Project API key below — PostHog: Settings → Project →
          "Project API key" (starts with "phc_")
       3. If you chose the EU data region, change POSTHOG_HOST to
          'https://eu.i.posthog.com'
     persistence:'memory' = cookieless — nothing is stored on visitors'
     devices, so no consent banner is needed. Analytics stay off until a
     real key is pasted. -------------------------------------------------- */
  var POSTHOG_KEY = 'phc_u9F64veJFLjNdkbE76DCAsms4AP3cwuRtgsKzx3akbF6';
  var POSTHOG_HOST = 'https://us.i.posthog.com';
  if (POSTHOG_KEY.indexOf('phc_') === 0) {
    var ph = document.createElement('script');
    ph.async = true;
    ph.src = POSTHOG_HOST + '/static/array.js';
    ph.onload = function () {
      if (window.posthog) {
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          persistence: 'memory'
        });
      }
    };
    document.head.appendChild(ph);
  }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav background on scroll + scroll progress ---- */
  var nav = document.getElementById('nav');
  var bar = document.getElementById('scrollProgress');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- hero entrance ---- */
  var hero = document.getElementById('hero');
  if (hero) requestAnimationFrame(function () {
    requestAnimationFrame(function () { hero.classList.add('in'); });
  });

  /* ---- reveal on scroll ---- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- smooth anchor offset for fixed nav ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id === '#top') return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---- TOC scroll-spy (case studies + essays) ---- */
  var tocLinks = [].slice.call(document.querySelectorAll('.toc-list a, .er-toc a'));
  if (tocLinks.length) {
    var secs = [].slice.call(document.querySelectorAll('h2[id], h3[id]'));
    var trackToc = function () {
      var probe = window.innerHeight * 0.32, cur = secs[0];
      secs.forEach(function (s) { if (s.getBoundingClientRect().top <= probe) cur = s; });
      if (!cur) return;
      tocLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id); });
    };
    window.addEventListener('scroll', trackToc, { passive: true });
    trackToc();
  }

  /* ---- reading-time indicator (essay pages) ---- */
  var readMin = document.getElementById('readMin');
  var article = document.querySelector('.essay-main');
  if (readMin && article) {
    var words = ((article.innerText || article.textContent || '').trim().match(/\S+/g) || []).length;
    var total = Math.max(1, Math.round(words / 200));
    var updRead = function () {
      var top = article.getBoundingClientRect().top + window.scrollY;
      var h = article.offsetHeight || 1;
      var read = Math.min(1, Math.max(0, (window.scrollY + window.innerHeight * 0.5 - top) / h));
      readMin.textContent = '~' + Math.max(0, Math.round(total * (1 - read))) + ' MIN LEFT';
    };
    window.addEventListener('scroll', updRead, { passive: true });
    window.addEventListener('resize', updRead, { passive: true });
    updRead();
  }

  /* ---- lab project modals (only on home) ---- */
  var labModal = document.getElementById('labModal');
  if (labModal) {
    var labBody = document.getElementById('labModalBody');
    var labCloseBtn = document.getElementById('labModalClose');
    var LAB = {
      thesis: {
        title: 'From Data to Action',
        role: 'Live experiment · Solo full-stack build',
        body: '<p>Data products get measured on clicks, dwell time, and whether people say they liked the chart. Nobody measures the thing that matters: did it help someone make a better call? I wanted that benchmark to exist, so I built it. The same data and the same task, presented four ways (<b>a static table, a scrollytelling narrative, an interactive sandbox, and a conversational AI</b>), tested with real professionals.</p><p>Every participant ends by making a recommendation, and the experiment scores two things side by side: how ready people <b>say</b> they feel, and how good their recommendation <b>actually is</b> when scored blind. Confidence without correctness is exactly the trap engagement metrics fall into. Behavioral telemetry runs underneath as a third layer. 50+ professionals are enrolled so far.</p>',
        chips: ['React', 'Supabase', 'Claude API', 'Python'],
        image: 'assets/from%20data%20to%20action/data-formats.png',
        link: { href: 'https://data-experiment.vercel.app/', label: 'Take the experiment' }
      },
      voiceof: {
        title: 'Voice Of',
        role: 'Local RAG tool',
        body: '<p>I had twenty interviews full of insight and a team that kept asking what different stakeholders would think. So I made the transcripts answerable. Ask a question, and a local language model answers in the first-person voice of a stakeholder group, <b>grounded in what those people actually said</b> in the interviews.</p><p>Everything runs on the machine, because this data was too sensitive to send to a third-party API. <b>Zero API calls; the interview data never leaves the laptop.</b> When teammates wanted to try it, I exposed the app through an ngrok tunnel instead of moving the data, and every answer is labeled as a pattern across participants, never an individual.</p>',
        chips: ['RAG', 'Local LLM', 'Vector DB', 'Python'],
        video: 'assets/voice%20-of/voice-of-web.mp4'
      },
      jobfit: {
        title: 'Job Fit Analyzer',
        role: 'Chrome extension · Claude API · GitHub',
        body: '<p>Evaluating a job posting used to take me ten minutes of copy-pasting between tabs. Now it takes one click. About five seconds later, the popup shows a fit score, a short description, and tags, judged against the criteria I actually care about: <b>ownership scope, technical depth, and domain match.</b></p><p>Behind the popup, the extension keeps its own records in a GitHub repo. Every posting is saved under a unique identifier, so if I analyze the same job twice the duplicate gets caught before it burns a second Claude API call, and a detailed long-form entry sits behind each short summary.</p><p><b>Writing the eval was the point.</b> The tool is just that eval running automatically.</p>',
        chips: ['JavaScript', 'Claude API', 'GitHub API'],
        video: 'assets/job%20extension/tempus-demo-web.mp4'
      },
      dash: {
        title: 'Analysis dashboard',
        role: 'Custom build · experiment analysis',
        body: '<p>My study data had grown into a dataset with more than 30 columns: behavioral telemetry, survey answers, and coded responses, all describing the same participants. Off-the-shelf tools kept almost answering my questions, so I built the one that actually does.</p><p>Everything lands in a single dashboard: distributions, correlations, covariate balance, t-tests, NLP feature extraction, and custom slices of the data whenever a new question comes up.</p>',
        chips: ['Streamlit', 'pandas', 'TF-IDF · VADER'],
        video: 'assets/data-dashboard/dashboard-web.mp4',
        link: { href: 'https://github.com/avgelix/study-dashboard', label: 'View on GitHub' }
      }
    };
    var lastLabFocus = null;
    var labHideTimer = null;
    var openLab = function (key) {
      var d = LAB[key];
      if (!d) return;
      clearTimeout(labHideTimer);
      var L = d.link || { href: 'https://github.com/avgelix', label: 'View on GitHub' };
      labBody.innerHTML =
        '<h3>' + d.title + '</h3>' +
        '<p class="lmodal-role">' + d.role + '</p>' +
        (d.video ? '<div class="lmodal-video has-video"><video src="' + d.video + '" autoplay loop muted playsinline controls></video></div>' : d.image ? '<div class="lmodal-video has-video"><img src="' + d.image + '" alt="" loading="lazy"></div>' : '<div class="lmodal-video"><span>Demo · add video / photo</span></div>') +
        d.body +
        '<div class="lmodal-chips">' + d.chips.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>' +
        '<a class="lmodal-repo" href="' + L.href + '" target="_blank" rel="noopener">' + L.label + ' <span aria-hidden="true">↗</span></a>';
      lastLabFocus = document.activeElement;
      labModal.hidden = false;
      document.body.classList.add('lmodal-open');
      requestAnimationFrame(function () { labModal.classList.add('open'); });
      labCloseBtn.focus({ preventScroll: true });
    };
    var closeLab = function () {
      labModal.classList.remove('open');
      document.body.classList.remove('lmodal-open');
      labHideTimer = setTimeout(function () { labModal.hidden = true; }, 380);
      if (lastLabFocus) lastLabFocus.focus({ preventScroll: true });
    };
    document.querySelectorAll('.bento-card[data-modal]').forEach(function (card) {
      card.addEventListener('click', function () { openLab(card.getAttribute('data-modal')); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLab(card.getAttribute('data-modal')); }
      });
    });

    /* Voice Of — stakeholder chips (swap the first-person answer, don't open modal) */
    var vChips = document.getElementById('bvvChips');
    if (vChips) {
      var VOICE = {
        policymaker: { role: 'policymaker', a: '“To me, it’s accountability made legible — a way for the public to check the work, not just admire the chart.”' },
        engineer: { role: 'engineer', a: '“It’s a debugging surface. If I can’t see the anomaly, I can’t fix the pipeline that produced it.”' },
        researcher: { role: 'researcher', a: '“It’s an argument. Every axis is a claim, and a good chart makes that claim falsifiable.”' }
      };
      var vRole = document.getElementById('bvvRole');
      var vAns = document.getElementById('bvvAnswer');
      vChips.addEventListener('click', function (e) {
        e.stopPropagation();
        var chip = e.target.closest('.bvv-chip');
        if (!chip) return;
        var d = VOICE[chip.getAttribute('data-a')];
        if (!d) return;
        vChips.querySelectorAll('.bvv-chip').forEach(function (c) { c.classList.toggle('is-on', c === chip); });
        if (vRole) vRole.textContent = d.role;
        if (vAns) {
          vAns.style.opacity = '0';
          setTimeout(function () { vAns.textContent = d.a; vAns.style.opacity = '1'; }, reduced ? 0 : 180);
        }
      });
    }
    labCloseBtn.addEventListener('click', closeLab);
    labModal.addEventListener('click', function (e) { if (e.target === labModal) closeLab(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !labModal.hidden) closeLab(); });
  }

  /* ---- dashboard viz: segmented panes + correlation matrix ---- */
  (function () {
    var seg = document.getElementById('dashSeg');
    if (!seg) return;
    seg.addEventListener('click', function (e) {
      e.stopPropagation();
      var b = e.target.closest('button');
      if (!b) return;
      seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      ['vizDist', 'vizCorr', 'vizTtest'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.hidden = (id !== b.getAttribute('data-pane'));
      });
    });
    seg.addEventListener('keydown', function (e) { e.stopPropagation(); });

    var corr = document.getElementById('vizCorr');
    if (!corr) return;
    var vars = ['Acc', 'Conf', 'Time', 'Trust', 'Depth'];
    var M = [
      [1, .62, -.38, .55, .41],
      [.62, 1, -.21, .68, .30],
      [-.38, -.21, 1, -.12, .26],
      [.55, .68, -.12, 1, .44],
      [.41, .30, .26, .44, 1]
    ];
    var html = '<div class="corr" aria-hidden="true"><span></span>';
    vars.forEach(function (v) { html += '<span class="corr-lab corr-top">' + v + '</span>'; });
    M.forEach(function (row, i) {
      html += '<span class="corr-lab">' + vars[i] + '</span>';
      row.forEach(function (r) {
        var a = 0.06 + Math.abs(r) * 0.82;
        var light = Math.abs(r) > 0.45;
        html += '<span class="corr-cell" style="background:rgba(43,43,46,' + a.toFixed(2) + ');color:' + (light ? '#fff' : 'var(--ink-2)') + '">' + (r === 1 ? '1.0' : r.toFixed(2).replace('0.', '.')) + '</span>';
      });
    });
    corr.innerHTML = html + '</div>';
  })();

  /* ---- case figure lightbox (expand / minimize) ---- */
  (function () {
    var figs = [].slice.call(document.querySelectorAll('.fig-photo img'));
    if (!figs.length) return;
    var box = document.createElement('div');
    box.className = 'figbox';
    box.hidden = true;
    box.innerHTML = '<img alt="">' +
      '<button type="button" class="figbox-btn" aria-label="Minimize image">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14l-6 6m6-6H5m5 0v5M14 10l6-6m-6 6h5m-5 0V5"/></svg></button>';
    document.body.appendChild(box);
    var boxImg = box.querySelector('img');
    var minBtn = box.querySelector('.figbox-btn');
    var hideTimer = null;
    var openBox = function (src, alt) {
      clearTimeout(hideTimer);
      boxImg.src = src;
      boxImg.alt = alt || '';
      box.hidden = false;
      document.body.classList.add('figbox-open');
      requestAnimationFrame(function () { box.classList.add('open'); });
    };
    var closeBox = function () {
      box.classList.remove('open');
      document.body.classList.remove('figbox-open');
      hideTimer = setTimeout(function () { box.hidden = true; boxImg.removeAttribute('src'); }, 250);
    };
    figs.forEach(function (img) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fig-expand';
      btn.setAttribute('aria-label', 'Expand image');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openBox(img.currentSrc || img.src, img.alt);
      });
      img.parentElement.appendChild(btn);
    });
    box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
    minBtn.addEventListener('click', function (e) { e.stopPropagation(); closeBox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) closeBox(); });
  })();

  /* ---- violin plots (Analysis dashboard viz) ---- */
  (function () {
    var svg = document.getElementById('violinSvg');
    if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg';
    var top = 16, base = 178, maxW = 52;
    var cx = [70, 210, 350, 490];
    var groups = [
      [{ m: .44, s: .14, w: 1 }],
      [{ m: .5, s: .085, w: 1 }],
      [{ m: .38, s: .13, w: 1 }, { m: .74, s: .09, w: .7 }],
      [{ m: .56, s: .12, w: 1 }]
    ];
    var mk = function (tag, attrs) {
      var el = document.createElementNS(NS, tag);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      svg.appendChild(el); return el;
    };
    mk('line', { x1: 24, x2: 536, y1: base + 6, y2: base + 6, stroke: 'rgba(11,11,12,.12)' });
    var N = 48;
    cx.forEach(function (center, gi) {
      var dist = groups[gi], dens = [], i, t, d;
      for (i = 0; i <= N; i++) { t = i / N; d = 0; dist.forEach(function (k) { d += k.w * Math.exp(-Math.pow((t - k.m) / k.s, 2) / 2); }); dens.push(d); }
      var dmax = Math.max.apply(null, dens);
      var y = function (i) { return top + (1 - i / N) * (base - top); };
      var xr = function (i) { return center + (dens[i] / dmax) * maxW; };
      var xl = function (i) { return center - (dens[i] / dmax) * maxW; };
      var p = 'M ' + xr(0).toFixed(1) + ' ' + y(0).toFixed(1);
      for (i = 1; i <= N; i++) p += ' L ' + xr(i).toFixed(1) + ' ' + y(i).toFixed(1);
      for (i = N; i >= 0; i--) p += ' L ' + xl(i).toFixed(1) + ' ' + y(i).toFixed(1);
      p += ' Z';
      mk('path', { d: p, fill: 'rgba(11,11,12,.08)', stroke: 'rgba(11,11,12,.5)', 'stroke-width': 1.4, 'stroke-linejoin': 'round' });
      var cum = [], tot = 0; for (i = 0; i <= N; i++) { tot += dens[i]; cum.push(tot); }
      var quant = function (q) { var tg = tot * q; for (var i = 0; i <= N; i++) if (cum[i] >= tg) return i / N; return 1; };
      [[quant(.25), true], [quant(.5), false], [quant(.75), true]].forEach(function (it) {
        var tq = it[0], yy = top + (1 - tq) * (base - top), half = (dens[Math.round(tq * N)] / dmax) * maxW;
        var a = { x1: (center - half).toFixed(1), x2: (center + half).toFixed(1), y1: yy.toFixed(1), y2: yy.toFixed(1), stroke: 'rgba(11,11,12,' + (it[1] ? '.35' : '.62') + ')', 'stroke-width': it[1] ? 1 : 1.4 };
        if (it[1]) a['stroke-dasharray'] = '2 3';
        mk('line', a);
      });
    });
  })();

  /* =========================================================
     AI CHAT — local responder (no backend, runs in-browser)
     ========================================================= */
  var chat = document.getElementById('aichat');
  if (!chat) return;
  var openBtn = document.getElementById('openChat');
  var closeBtn = document.getElementById('closeChat');
  var scroller = document.getElementById('aicScroll');
  var thread = document.getElementById('aicThread');
  var form = document.getElementById('aicForm');
  var input = document.getElementById('aicInput');
  var chipBox = document.getElementById('aicChips');

  function openChat() {
    chat.hidden = false;
    document.body.classList.add('chat-open');
    requestAnimationFrame(function () { chat.classList.add('open'); });
    setTimeout(function () { if (input) input.focus(); }, 380);
  }
  function closeChat() {
    chat.classList.remove('open');
    document.body.classList.remove('chat-open');
    setTimeout(function () { chat.hidden = true; }, 480);
  }
  if (openBtn) openBtn.addEventListener('click', openChat);
  var openBtnFoot = document.getElementById('openChatFoot');
  if (openBtnFoot) openBtnFoot.addEventListener('click', openChat);
  if (closeBtn) closeBtn.addEventListener('click', closeChat);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !chat.hidden) closeChat();
  });

  /* --- cursor-following glow --- */
  var glow = document.getElementById('aicGlow');
  if (glow && !reduced) {
    var tx = window.innerWidth / 2, ty = window.innerHeight * 0.4, gx = tx, gy = ty, graf = null;
    glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
    var gloop = function () {
      gx += (tx - gx) * 0.09; gy += (ty - gy) * 0.09;
      glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
      if (chat.classList.contains('open')) { graf = requestAnimationFrame(gloop); }
      else { graf = null; }
    };
    chat.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!graf) graf = requestAnimationFrame(gloop);
    });
  }

  /* --- knowledge base --- */
  var ANSWERS = {
    'what-pm': "I'm a <strong>product builder and researcher</strong> — I combine hands-on AI development, HCI research, and design strategy to take problems nobody has scoped yet and make them tractable. My background is unusual: Computer Science &amp; Philosophy, then a master's in Human-Computer Interaction. In practice that means I build and prototype to test hypotheses, run the research that grounds the decision, and scope ruthlessly so the vital few things actually ship.",
    'intelligence': "I wrote a full essay on this (<em>Intelligence is becoming the unit of work</em>, in Writing). The short version: it's the question my philosophy degree never let me put down. I don't think intelligence is the ability to produce the right answer — models do that constantly without understanding anything. It's closer to <em>judgment</em>: knowing which question is worth asking, what a result means in context, and when to override it. That's the gap I design around. My clinical AI work taught me this directly — the model could classify, but trust came from surfacing its reasoning at the exact moment a pathologist needed to exercise <em>their</em> judgment, not replace it. In the age of AI, intelligence stops being about generating answers and starts being about deciding what to do with them.",
    'clinical': "At <strong>UChicago Medicine</strong>'s SlideFlow Labs, I owned validation for an AI diagnostic tool for thyroid pathology that had never been tested with a real pathologist. I reframed it from “does this feature work” to “does this tool earn a place in a pathologist's workflow.” Working across 12+ pathologists at 3 hospitals, we moved from a black-box output to a <em>glass-box</em> interface — and trust ratings went from scattered across the scale to the top two categories on every metric. The client productionized our recommendations and revised their go-to-market.",
    'method': "At <strong>Method</strong>, a 300-person consultancy, institutional knowledge lived in people, not systems — when someone left, their expertise left too. I owned stakeholder alignment in a room of 20+, C-suite included, and designed a DVF workshop that scored every concept <em>before</em> discussion, so the loudest voice couldn't set the roadmap. We shipped an AI knowledge platform in 3 months that cut document discovery from 5–6 hours to under 3 minutes.",
    'education': "For <strong>Education First Consulting</strong> my client is the U.S. Department of Education, on a national data program touching 500K+ students — ongoing through December 2026. I aligned 30+ federal, state, and district stakeholders on scope, and now I'm designing and building the first data visualization prototypes for government education testing, applying LLMs to surface prediction uncertainty over longitudinal data for researchers and policymakers.",
    'lab': "I build my own tools, usually to answer a question nothing off-the-shelf could. <strong>From Data to Action</strong> is a live experiment with 50+ professionals testing whether different data interfaces actually improve decision quality. <strong>Voice Of</strong> is a fully local RAG pipeline, so sensitive interview data never leaves the machine. <strong>Job Fit Analyzer</strong> is a Chrome extension that turns ten minutes of copy-pasting into a one-click fit score. The best way to understand a new technology is to make it do something useful.",
    'approach': "Three moves, mostly. <strong>Translate</strong>: I find shared language between clinicians, engineers, executives, and agencies so everyone ships the same thing. <strong>Build</strong>: when no tool fits, I make one, so I can talk to engineers with real context. <strong>Scope</strong>: run the workshop, prioritize the vital few, cut the rest — smaller, but shippable.",
    'about': "I grew up in <strong>Napoli, Italy</strong>, with the Amalfi Coast a short drive away, and moved to the U.S. six years ago. I've played classical piano for seventeen years — it taught me that the unglamorous daily work <em>is</em> the whole game. Off the clock: novels on a beach, R&amp;B concerts, squash, and building small utilities nobody asked for.",
    'synthetic': "I just wrote about this — <em>Research from non-people</em>, in the Writing section. Short version: synthetic users are fine for rehearsal and dangerous as evidence. Copies of copies lose the edges of the distribution (Shumailov et al. call it model collapse), and the edges are what research exists to find. My rule: keep provenance first-class, and protect a budget of real human contact per project. I practice what I preach — my Voice Of tool simulates stakeholders, but it's grounded in real interview transcripts.",
    'globallogic': "At <strong>GlobalLogic</strong> (Hitachi Group) I built a <strong>LangGraph-based multi-agent system</strong> for consulting sales experts — solo, in 5 weeks, from product definition through evaluation and deployment. It automates account research and draft structure while the expert's voice and judgment stay in the loop. Evaluated on citation retrieval accuracy, hallucinated metric references, and LLM-as-Judge agreement (DeepEval); user-reported time-to-draft fell from 2+ hours to about 5 minutes. There's a full case study in the Work section.",
    'last-project': "My most recent shipped work is at <strong>GlobalLogic</strong>: a LangGraph multi-agent system for sales experts, built solo in 5 weeks — time-to-draft went from 2+ hours to ~5 minutes, with quality gated by deterministic and LLM-as-Judge evals. Alongside it, the project I'm deepest in is <strong>From Data to Action</strong> — a live experiment with 50+ professionals testing whether tables, dashboards, data stories, or conversational AI actually improve <em>decision quality</em>. I built the whole eval end to end (React, Supabase, Claude API, Python); full findings publish at N=80. It's the clearest expression of how I think about data products: measure them on the decisions they enable, not on engagement.",
    'tech': "This site is hand-built — static HTML, CSS, and vanilla JavaScript, no framework. The display type is <strong>Bricolage Grotesque</strong> with <em>Instrument Serif</em> for the italic accents. This chat is a lightweight responder running entirely in your browser — nothing leaves the page. In a production build I'd wire it to the Claude API with my work as the knowledge base.",
    'contact': "I'm open to full-time roles starting <strong>January 2027</strong> — AI product, hybrid builder, and research-heavy product roles especially. The best way to reach me is <a href=\"mailto:apetrone@hawk.illinoistech.edu\">apetrone@hawk.illinoistech.edu</a> — or find me on <a href=\"https://www.linkedin.com/in/apetrone02\" target=\"_blank\" rel=\"noopener\">LinkedIn ↗</a>. Happy to talk about anything I've worked on.",
    'fallback': "That's a great question — and exactly the kind I'd love to get into properly. The short version lives across my Work, Lab, and About sections; for anything specific, the fastest path is <a href=\"mailto:apetrone@hawk.illinoistech.edu\">apetrone@hawk.illinoistech.edu</a>. What else can I tell you?"
  };
  var ROUTES = [
    { k: ['synthetic', 'simulated user', 'fake data', 'baudrillard', 'model collapse', 'simulacr'], a: 'synthetic' },
    { k: ['globallogic', 'global logic', 'langgraph', 'multi-agent', 'multi agent', 'agents', 'sales', 'hitachi', 'deepeval', 'prospecting'], a: 'globallogic' },
    { k: ['last project', 'latest project', 'recent project', 'most recent', 'working on now', 'currently working', 'last thing', 'right now'], a: 'last-project' },
    { k: ['intelligence', 'what is ai', 'agi', 'consciousness', 'understanding', 'philosophy', 'think about ai', 'define intelligence'], a: 'intelligence' },
    { k: ['patholog', 'clinical', 'uchicago', 'healthcare', 'slideflow', 'thyroid', 'medicine', 'diagnos'], a: 'clinical' },
    { k: ['method', 'knowledge', 'tribal', 'consultancy', 'institutional'], a: 'method' },
    { k: ['education', 'naep', 'govtech', 'federal', 'government', 'department', 'students', 'open data'], a: 'education' },
    { k: ['lab', 'spare', 'side project', 'build for', 'tools you', 'voice of', 'job fit', 'dashboard', 'experiment', 'rag', 'extension'], a: 'lab' },
    { k: ['technolog', 'tech ', 'stack', 'website', 'this site', 'this chat', 'built', 'framework', 'how did you make'], a: 'tech' },
    { k: ['approach', 'how do you work', 'translate', 'scope', 'process', 'method of work', 'how you work'], a: 'approach' },
    { k: ['napoli', 'italy', 'piano', 'hobby', 'hobbies', 'personal', 'yourself', 'who are you', 'about you', 'squash', 'music', 'fun'], a: 'about' },
    { k: ['contact', 'hire', 'hiring', 'available', 'availab', 'email', 'reach', 'resume', 'résum', 'linkedin', 'get in touch', 'role'], a: 'contact' },
    { k: ['pm', 'product manager', 'what kind of', 'what do you do', 'who', 'role'], a: 'what-pm' }
  ];
  function route(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < ROUTES.length; i++) {
      for (var j = 0; j < ROUTES[i].k.length; j++) {
        if (t.indexOf(ROUTES[i].k[j]) !== -1) return ROUTES[i].a;
      }
    }
    return 'fallback';
  }

  function scrollDown() {
    if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }
  function addUser(text) {
    var el = document.createElement('div');
    el.className = 'aic-q';
    el.textContent = text;
    thread.appendChild(el);
  }
  function addAnswer(key) {
    var typing = document.createElement('div');
    typing.className = 'aic-msg';
    typing.innerHTML = '<span class="aic-typing"><i></i><i></i><i></i></span>';
    thread.appendChild(typing);
    scrollDown();
    var delay = reduced ? 200 : 650 + Math.random() * 500;
    setTimeout(function () {
      typing.innerHTML = '<p>' + (ANSWERS[key] || ANSWERS.fallback) + '</p>';
      scrollDown();
    }, delay);
  }
  function ask(text, key) {
    if (!thread.classList.contains('started')) thread.classList.add('started');
    addUser(text);
    scrollDown();
    addAnswer(key || route(text));
  }

  if (chipBox) chipBox.addEventListener('click', function (e) {
    var chip = e.target.closest('.aic-chip');
    if (!chip) return;
    ask(chip.textContent.trim(), chip.getAttribute('data-q'));
  });
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = (input.value || '').trim();
    if (!v) return;
    input.value = '';
    ask(v);
  });
})();

/* --- margin footnotes: align to their reference marks, avoid overlap --- */
(function(){
  function layoutFnotes(){
    if (window.innerWidth <= 1120) return;
    var paras = document.querySelectorAll('.essay-main p');
    var last = {};
    paras.forEach(function(p){
      var notes = p.querySelectorAll(':scope > .fnote');
      notes.forEach(function(n){
        var sup = n.previousElementSibling;
        var top = 0;
        if (sup && sup.matches('sup.fn')) top = sup.offsetTop;
        n.style.top = top + 'px';
      });
    });
    // global collision pass (notes share the right margin column)
    var all = Array.prototype.slice.call(document.querySelectorAll('.essay-main .fnote'));
    all.sort(function(a,b){ return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
    var prevBottom = -Infinity;
    all.forEach(function(n){
      var r = n.getBoundingClientRect();
      var top = r.top + window.scrollY;
      if (top < prevBottom + 14) {
        var shift = (prevBottom + 14) - top;
        var cur = parseFloat(n.style.top || 0);
        n.style.top = (cur + shift) + 'px';
        top += shift;
      }
      prevBottom = top + n.offsetHeight;
    });
  }
  if (document.querySelector('.essay-main')) {
    window.addEventListener('load', layoutFnotes);
    window.addEventListener('resize', layoutFnotes);
    setTimeout(layoutFnotes, 300);
  }
})();

/* --- exact-match cutout color: sample the real rendered background --- */
(function(){
  function bgOf(el){
    while(el){
      var c=getComputedStyle(el).backgroundColor;
      if(c && c!=='transparent' && c!=='rgba(0, 0, 0, 0)') return c;
      el=el.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor || '#fff';
  }
  function apply(){
    document.querySelectorAll('.case').forEach(function(card){
      card.style.setProperty('--cut', bgOf(card.parentElement));
    });
  }
  if(document.querySelector('.case')){ apply(); window.addEventListener('load',apply); }
})();
