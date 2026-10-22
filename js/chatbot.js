/**
 * JB-ASSIST // PORTFOLIO CHATBOT v2.0
 * - Integrated into the hero terminal panel (replaces typewriter after boot)
 * - Chibi speech bubble echoes bot replies
 * - Cognitive intent engine: detects hire offers, contact extraction, greetings, etc.
 */

(function () {
  'use strict';

  /* ===================================================================
     INTENT PATTERNS — Checked before KB lookup
     =================================================================== */
  const INTENTS = [

    // 🎉 HIRE / JOB OFFER — extract contact info from the message itself
    {
      detect: (msg, tokens) =>
        tokens.some(t => ['hired', 'hire', 'offer', 'offered', 'position', 'opportunity', 'recruit', 'onboard', 'selected', 'congrats', 'congratulations'].includes(t)),
      respond: (msg) => {
        const email = extractEmail(msg);
        const phone = extractPhone(msg);
        if (email && phone) {
          return `🎉 <strong>That's incredible news!</strong> John is thrilled to hear about the opportunity! He'll reach out to you promptly at <strong>${email}</strong> or <strong>${phone}</strong>. Looking forward to connecting!`;
        } else if (email) {
          return `🎉 <strong>Amazing!</strong> John is excited about this opportunity! He'll get in touch with you at <strong>${email}</strong> very soon. Thank you!`;
        } else if (phone) {
          return `🎉 <strong>Fantastic!</strong> John would love to connect! He'll reach you at <strong>${phone}</strong> shortly. Really appreciate the opportunity!`;
        } else {
          return `🎉 <strong>Wow, thank you!</strong> John is genuinely excited about this opportunity! Please drop your contact at <strong><a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a></strong> and he'll respond ASAP!`;
        }
      }
    },

    // 📬 STANDALONE contact info drop (email and/or phone, no hire keyword needed)
    {
      detect: (msg) => {
        const hasEmail = !!extractEmail(msg);
        const hasPhone = !!extractPhone(msg);
        const lower = msg.toLowerCase();
        // Not a question, more of a statement providing contact
        const isStatement = lower.includes('contact') || lower.includes('reach') || lower.includes('call') || lower.includes('email') || lower.includes('message') || lower.includes('me at') || lower.includes('reach me') || lower.includes('get back');
        return (hasEmail || hasPhone) && isStatement;
      },
      respond: (msg) => {
        const email = extractEmail(msg);
        const phone = extractPhone(msg);
        const contactStr = [email, phone].filter(Boolean).join(' or ');
        return `Got it! John will follow up with you at <strong>${contactStr}</strong>. He usually responds within 24 hours. You can also reach him directly at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>.`;
      }
    },

    // 👋 GREETINGS
    {
      detect: (_, tokens) => tokens.some(t => ['hi', 'hello', 'hey', 'sup', 'yo', 'howdy', 'greetings', 'hiya', 'good morning', 'good afternoon', 'good evening'].includes(t)),
      respond: () => `Hey there! 👋 I'm <strong>JB-Assist</strong>, John's portfolio bot. Ask me anything — his <strong>skills, projects, experience, education</strong>, or how to <strong>contact him</strong>. I'm online and ready!`
    },

    // 🙏 THANKS
    {
      detect: (_, tokens) => tokens.some(t => ['thanks', 'thank', 'thankyou', 'ty', 'thx', 'appreciate', 'appreciated', 'cheers'].includes(t)),
      respond: () => `You're welcome! 😊 If you have any more questions about John, feel free to ask. He's <strong>open to opportunities</strong> — don't hesitate to reach out!`
    },

    // 🤖 What is the bot / who are you
    {
      detect: (_, tokens) => tokens.some(t => ['bot', 'assistant', 'ai', 'chatbot', 'are you', 'who are you', 'you are'].includes(t)),
      respond: () => `I'm <strong>JB-Assist</strong> — an AI portfolio assistant built for John Bautista's portfolio. I can answer questions about his skills, projects, education, experience, certifications, and contact info. What would you like to know?`
    },

    // 👍 Positive feedback / compliments
    {
      detect: (_, tokens) => tokens.some(t => ['great', 'awesome', 'nice', 'impressive', 'amazing', 'good', 'cool', 'excellent', 'wow', 'sick', 'dope'].includes(t)),
      respond: () => `Thank you! 💙 John puts a lot of effort into his craft. If you'd like to discuss a project or role, you can reach him at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>.`
    },
  ];

  /* ===================================================================
     KNOWLEDGE BASE
     =================================================================== */
  const KB = [
    { tags: ['name', 'who', 'john', 'bautista', 'person', 'introduce', 'yourself', 'about you'], answer: "I'm the digital assistant for <strong>John S. Bautista Jr.</strong> — a Computer Engineering graduate from Cavite State University, Carmona Campus, specializing in Embedded Systems, IoT, IT Support, and Automation." },
    { tags: ['age', 'born', 'birthday', 'old', 'birth'], answer: "John was born on <strong>March 24, 2004</strong>, making him 22 years old." },
    { tags: ['location', 'where', 'based', 'live', 'place', 'address', 'from'], answer: "John is based in <strong>Sta. Rosa, Laguna, Philippines</strong>." },
    { tags: ['email', 'contact', 'reach', 'message', 'connect', 'get in touch'], answer: "You can reach John at <strong><a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a></strong> or call <strong><a href='tel:+63971727130' class='chat-link'>+63971727130</a></strong>." },
    { tags: ['phone', 'number', 'call', 'telephone', 'mobile'], answer: "John's contact number is <strong><a href='tel:+63971727130' class='chat-link'>+63971727130</a></strong>." },
    { tags: ['availability', 'available', 'open', 'hiring', 'job', 'opportunity', 'work', 'employ', 'looking'], answer: "John is <strong>currently open for technical and engineering roles</strong> — particularly in Computer Engineering, Embedded Systems, IoT, IT Support, and Automation. Reach him at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>." },
    { tags: ['education', 'degree', 'school', 'university', 'college', 'study', 'graduate', 'academic', 'course', 'program', 'student'], answer: "John holds a <strong>Bachelor of Science in Computer Engineering</strong> from <strong>Cavite State University – Carmona Campus</strong>." },
    { tags: ['cavite', 'csu', 'carmona', 'institution', 'alma mater'], answer: "John graduated from <strong>Cavite State University – Carmona Campus</strong> with a B.S. in Computer Engineering." },
    { tags: ['programming', 'language', 'code', 'coding', 'software', 'java', 'python', 'javascript', 'html', 'css', 'script'], answer: "John's programming stack: <strong>Java, C++, Python, HTML5, CSS3, and JavaScript (ES6+)</strong> — applied across firmware, web interfaces, and automation scripts." },
    { tags: ['it', 'support', 'hardware', 'diagnostic', 'pc', 'computer', 'laptop', 'desktop', 'troubleshoot', 'repair', 'assembly', 'rig'], answer: "IT & hardware skills: <strong>PC Assembly, Laptop Troubleshooting, Hardware Diagnostics, OS Deployment (Win/Linux), Network Setup & Cabling, Microsoft 365</strong>." },
    { tags: ['network', 'networking', 'cabling', 'lan', 'wifi', 'connectivity', 'subnet'], answer: "John handles <strong>Network Setup & Cabling</strong>, subnetting, and enterprise connectivity troubleshooting." },
    { tags: ['automation', 'workflow', 'pipeline', 'zapier', 'gohighlevel', 'ghl', 'crm', 'invoice', 'sdlc', 'process'], answer: "Automation toolkit: <strong>GoHighLevel CRM, Zapier Webhooks, Workflow Optimization, Invoice Automation, SDLC Documentation</strong>." },
    { tags: ['embedded', 'iot', 'esp32', 'arduino', 'microcontroller', 'firmware', 'sensor', 'lora', 'lorawan', 'circuit', 'gpio'], answer: "Embedded & IoT: <strong>ESP32 & Arduino, Sensors, Embedded C++, IoT Prototyping, LoRaWAN / Packetworx, Circuit Schematics & Soldering</strong>." },
    { tags: ['skill', 'skills', 'can', 'capable', 'technical', 'tech', 'toolkit', 'know', 'specialize'], answer: "John's 4 core skill modules: <strong>① Programming</strong> (Java, C++, Python, JS), <strong>② IT & Hardware</strong>, <strong>③ Automation & Data</strong> (Zapier, GHL), and <strong>④ Embedded Systems & IoT</strong> (ESP32, LoRaWAN)." },
    { tags: ['project', 'work', 'build', 'built', 'create', 'made', 'developed', 'engineering', 'portfolio'], answer: "Key projects: <strong>① T.A.S.K. Queuing Kiosk</strong> (capstone), <strong>② Smart Helmet IoT</strong>, <strong>③ CRM & Invoice Automation</strong> at Moriroku, <strong>④ System Diagnostics & Rig Deployments</strong>." },
    { tags: ['task', 'kiosk', 'queuing', 'queue', 'registrar', 'touchscreen', 'ticket', 'capstone'], answer: "<strong>T.A.S.K.</strong> (Transaction and Academic Services Kiosk) — John's capstone. A university registrar touchscreen queuing system with hardware integration (microcontroller, thermal printer, display), automated ticket generation, and accessibility support." },
    { tags: ['helmet', 'smart', 'safety', 'impact', 'accelerometer', 'gyroscope', 'crash', 'wear', 'rider'], answer: "The <strong>Smart Helmet IoT Prototype</strong> — detects crash impacts and rider compliance in real time using ESP32, accelerometer/gyroscope sensors, and wireless emergency telemetry." },
    { tags: ['moriroku', 'company', 'enterprise', 'corporate', 'intern', 'internship'], answer: "At <strong>Moriroku Philippines, Inc.</strong>, John was an IT & Systems Workflow Specialist Intern — configuring GoHighLevel/Zapier automations, handling IT support, and authoring SDLC documentation." },
    { tags: ['experience', 'timeline', 'career', 'history', 'role', 'job', 'worked'], answer: "Experience: <strong>① IT & Systems Workflow Specialist Intern</strong> at Moriroku Philippines (CRM automation, IT ops, SDLC docs). <strong>② Lead Hardware Integrator & Developer</strong> at CvSU – Carmona (T.A.S.K. capstone, received high faculty commendation)." },
    { tags: ['certificate', 'certification', 'credential', 'workshop', 'award', 'training', 'verified'], answer: "John's credentials: <strong>Packetworx IoT Workshops 1–3</strong>, <strong>AI Literacy Isn't Extra It's Core</strong>, <strong>Think Like a Leader Act Like a Defender</strong> (Cybersecurity), <strong>Mastering Critical Thinking in the Age of AI</strong>." },
    { tags: ['packetworx', 'lorawan', 'iot workshop', 'gateway', 'payload'], answer: "John completed <strong>3 Packetworx IoT Workshops</strong>: LoRaWAN basics, payload formatting & cloud routing, and end-to-end IoT platform engineering." },
    { tags: ['resume', 'cv', 'download', 'pdf'], answer: "Download John's resume here: <a href='resume/John%20Bautista%20Jr..pdf' target='_blank' class='chat-link'>📄 Resume PDF</a>" },
    { tags: ['website', 'portfolio', 'site', 'page', 'this', 'design'], answer: "This is John's <strong>Digital Command Center</strong> — a cyberpunk-themed portfolio featuring his background, projects, skills, experience, and credentials. Built with HTML5, CSS3 & JavaScript." },
    { tags: ['chibi', 'companion', 'mascot', 'character', 'cute', 'drag'], answer: "The <strong>interactive chibi companion</strong> is an Easter Egg! You can click and drag it. It has idle, walk, grab, fall, and land animations. 🎮" },
    { tags: ['specialization', 'focus', 'domain', 'area', 'field', 'expertise', 'forte', 'main'], answer: "John's core domains: <strong>Embedded Systems, IoT, IT Support, Hardware Diagnostics, and Workflow Automation</strong> — bridging physical hardware engineering with software solutions." },
    { tags: ['ai', 'artificial intelligence', 'machine learning', 'prompt', 'ml'], answer: "John holds an <strong>AI Literacy</strong> credential and actively uses AI tools for workflow acceleration. He's also certified in Critical Thinking in the Age of AI." },
    { tags: ['cybersecurity', 'security', 'defense', 'defender', 'threat'], answer: "John has a <strong>Cybersecurity seminar credential</strong>: 'Think Like a Leader, Act Like a Defender' — covering security hygiene, incident response, and defensive mindset." },
  ];

  const SUGGESTIONS = [
    "What are John's skills?",
    "Tell me about his projects",
    "What's his experience?",
    "How do I contact John?",
    "What certifications does he have?",
    "Is he open to hire?",
  ];

  /* ===================================================================
     UTILITY: EXTRACT EMAIL & PHONE FROM RAW USER MESSAGE
     =================================================================== */
  function extractEmail(text) {
    const m = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
    return m ? m[0] : null;
  }

  function extractPhone(text) {
    // Matches international formats, local PH numbers, etc.
    const m = text.match(/(?:\+?\d[\d\s\-().]{7,}\d)/);
    return m ? m[0].trim() : null;
  }

  /* ===================================================================
     QUERY ENGINE
     =================================================================== */
  const STOP = new Set(['the','a','an','and','or','to','of','in','on','for','with','is','are','was','what','tell','me','his','her','about','does','he','she','do','can','how','where','when','why','who','i','you','your','my','have','has','been','its','it','this','that','those','these','at','by','please']);

  function tokenize(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s\-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOP.has(w));
  }

  function scoreKB(tokens, entry) {
    let score = 0;
    for (const w of tokens) {
      for (const tag of entry.tags) {
        if (tag === w) { score += 3; break; }
        if (tag.length > 3 && (tag.includes(w) || w.includes(tag))) { score += 1; break; }
      }
    }
    return score;
  }

  function query(userInput) {
    const tokens = tokenize(userInput);

    // 1. Try intent detection first
    for (const intent of INTENTS) {
      if (intent.detect(userInput, tokens)) {
        return intent.respond(userInput, tokens);
      }
    }

    // 2. Fall back to KB keyword scoring
    if (!tokens.length) {
      return "Ask me anything about John! Try: <em>\"What are his skills?\"</em> or <em>\"How do I contact him?\"</em>";
    }

    const ranked = KB
      .map(e => ({ e, sc: scoreKB(tokens, e) }))
      .filter(x => x.sc > 0)
      .sort((a, b) => b.sc - a.sc);

    if (!ranked.length) {
      return "Hmm, I'm not sure about that. Try asking about John's <strong>skills, projects, experience, certifications</strong>, or how to <strong>contact him</strong>.";
    }
    return ranked[0].e.answer;
  }

  /* ===================================================================
     CHIBI SPEECH BUBBLE INTEGRATION
     =================================================================== */
  let chibiBubbleTimer = null;

  function showChibiReply(htmlText) {
    const bubble = document.getElementById('chibi-bubble');
    if (!bubble) return;
    // Strip HTML tags for chibi bubble (keep it short & clean)
    const plainText = htmlText.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 90);
    bubble.innerHTML = `<span>${plainText}${plainText.length >= 90 ? '…' : ''}</span>`;
    bubble.classList.add('visible');
    if (chibiBubbleTimer) clearTimeout(chibiBubbleTimer);
    chibiBubbleTimer = setTimeout(() => bubble.classList.remove('visible'), 6000);
  }

  /* ===================================================================
     TERMINAL CHAT UI — injected into #terminal-panel
     =================================================================== */
  function buildTerminalChat() {
    const panel = document.getElementById('terminal-panel');
    const screen = document.getElementById('terminal-screen');
    if (!panel || !screen) return;

    // ── Extra styles ─────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
      /* === TERMINAL CHAT MODE === */
      .terminal-panel {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* Chat log replaces the typewriter screen */
      #terminal-screen {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px 12px;
        scrollbar-width: thin;
        scrollbar-color: rgba(0,229,255,0.3) transparent;
      }
      #terminal-screen::-webkit-scrollbar { width: 3px; }
      #terminal-screen::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.3); }

      /* Message rows */
      .tc-msg {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        line-height: 1.65;
        display: flex;
        flex-direction: column;
        gap: 2px;
        animation: tcFadeIn 0.2s ease;
      }
      @keyframes tcFadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .tc-label {
        font-size: 9px;
        letter-spacing: 0.1em;
        font-weight: 700;
      }
      .tc-msg.bot .tc-label  { color: #00E5FF; }
      .tc-msg.user .tc-label { color: #168BFF; text-align: right; }

      .tc-bubble {
        padding: 7px 10px;
        max-width: 92%;
        word-break: break-word;
      }
      .tc-msg.bot .tc-bubble {
        background: rgba(0,229,255,0.06);
        border: 1px solid rgba(0,229,255,0.2);
        color: #c8e8f8;
        clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%);
        align-self: flex-start;
      }
      .tc-msg.user .tc-bubble {
        background: rgba(22,139,255,0.08);
        border: 1px solid rgba(22,139,255,0.25);
        color: #eaf7ff;
        clip-path: polygon(7px 0, 100% 0, 100% 100%, 0 100%, 0 7px);
        align-self: flex-end;
        text-align: right;
      }
      .tc-msg.system .tc-bubble {
        color: #3a6080;
        font-style: italic;
        font-size: 10px;
        align-self: flex-start;
        border: none;
        background: none;
        padding: 0 4px;
      }
      .tc-msg a.chat-link {
        color: #00E5FF;
        text-decoration: underline;
      }
      .tc-msg a.chat-link:hover { color: #fff; }

      /* Typing indicator */
      .tc-typing {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
      }
      .tc-typing span {
        width: 5px; height: 5px;
        background: #00E5FF;
        border-radius: 50%;
        animation: tcBounce 0.9s infinite;
        display: inline-block;
      }
      .tc-typing span:nth-child(2) { animation-delay: 0.15s; }
      .tc-typing span:nth-child(3) { animation-delay: 0.30s; }
      @keyframes tcBounce {
        0%, 80%, 100% { transform: scaleY(1); opacity: 0.5; }
        40%            { transform: scaleY(1.6); opacity: 1; }
      }

      /* Suggestion chips */
      #tc-suggestions {
        padding: 5px 12px 4px;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        border-top: 1px solid rgba(0,229,255,0.08);
        flex-shrink: 0;
      }
      #tc-sug-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 8px;
        color: #2a4060;
        width: 100%;
        letter-spacing: 0.1em;
        margin-bottom: 2px;
      }
      .tc-sug {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        background: rgba(0,229,255,0.04);
        border: 1px solid rgba(0,229,255,0.18);
        color: #6a9ab4;
        padding: 3px 7px;
        cursor: pointer;
        clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
        transition: background 0.18s, color 0.18s;
        line-height: 1.4;
      }
      .tc-sug:hover {
        background: rgba(0,229,255,0.12);
        color: #00E5FF;
        border-color: rgba(0,229,255,0.4);
      }

      /* Input row */
      #tc-input-row {
        display: flex;
        align-items: center;
        padding: 6px 10px 8px;
        border-top: 1px solid rgba(0,229,255,0.12);
        background: rgba(0,8,24,0.5);
        gap: 0;
        flex-shrink: 0;
      }
      #tc-prompt-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #00E5FF;
        margin-right: 6px;
        flex-shrink: 0;
        user-select: none;
      }
      #tc-input {
        flex: 1;
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(0,229,255,0.25);
        color: #eaf7ff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        padding: 2px 4px;
        outline: none;
        transition: border-color 0.2s;
        min-width: 0;
      }
      #tc-input::placeholder { color: #2a4060; }
      #tc-input:focus { border-color: rgba(0,229,255,0.6); }
      #tc-send {
        background: none;
        border: none;
        color: #00E5FF;
        cursor: pointer;
        font-family: 'Orbitron', monospace;
        font-size: 9px;
        font-weight: 700;
        padding: 2px 0 2px 10px;
        letter-spacing: 0.06em;
        opacity: 0.7;
        transition: opacity 0.2s;
        flex-shrink: 0;
        white-space: nowrap;
      }
      #tc-send:hover { opacity: 1; }

      /* Update terminal bar title */
      .term-title { font-size: 10px; }
    `;
    document.head.appendChild(style);

    // ── Clear auto-typewriter content, rebuild as chat ───────────────
    screen.innerHTML = '';

    // ── Suggestions block ────────────────────────────────────────────
    const sugBlock = document.createElement('div');
    sugBlock.id = 'tc-suggestions';
    const sugLabel = document.createElement('div');
    sugLabel.id = 'tc-sug-label';
    sugLabel.textContent = '// QUICK QUERIES';
    sugBlock.appendChild(sugLabel);

    SUGGESTIONS.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'tc-sug';
      btn.textContent = s;
      btn.addEventListener('click', () => {
        hideSuggestions();
        handleSend(s);
      });
      sugBlock.appendChild(btn);
    });
    panel.insertBefore(sugBlock, panel.querySelector('.terminal-footer'));

    // ── Input row ─────────────────────────────────────────────────────
    const inputRow = document.createElement('div');
    inputRow.id = 'tc-input-row';
    inputRow.innerHTML = `
      <span id="tc-prompt-label">&gt;_</span>
      <input id="tc-input" type="text" placeholder="Ask about John..." autocomplete="off" maxlength="200" aria-label="Chat input">
      <button id="tc-send" aria-label="Send">SEND ›</button>
    `;
    panel.insertBefore(inputRow, panel.querySelector('.terminal-footer'));

    // ── Wire input ─────────────────────────────────────────────────────
    const inputEl = document.getElementById('tc-input');
    document.getElementById('tc-send').addEventListener('click', () => handleSend());
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

    // Update terminal bar label
    const titleEl = panel.querySelector('.term-title');
    if (titleEl) titleEl.textContent = 'JB-ASSIST // AI PORTFOLIO BOT';

    // ── Boot message (replaces typewriter) ────────────────────────────
    addSystemMsg('> Initializing JB-ASSIST v2.0...');
    setTimeout(() => addSystemMsg('> Knowledge base loaded. Ask me anything.'), 500);
    setTimeout(() => {
      addBotMsg("Hey! I'm <strong>JB-Assist</strong> 👋 — John's portfolio AI. Ask me about his <strong>skills, projects, experience, certifications</strong>, or how to <strong>contact/hire him</strong>!");
      showChibiReply("Hi! I'm JB-Assist. Ask me anything about John!");
    }, 1000);

    // ── Helpers ───────────────────────────────────────────────────────
    function hideSuggestions() {
      if (sugBlock.style.display !== 'none') sugBlock.style.display = 'none';
    }

    function addMsg(html, role) {
      const wrap = document.createElement('div');
      wrap.className = `tc-msg ${role}`;
      if (role === 'system') {
        wrap.innerHTML = `<div class="tc-bubble">${html}</div>`;
      } else {
        const label = role === 'bot' ? 'JB-ASSIST' : 'YOU';
        wrap.innerHTML = `<div class="tc-label">${label}</div><div class="tc-bubble">${html}</div>`;
      }
      screen.appendChild(wrap);
      screen.scrollTop = screen.scrollHeight;
      return wrap;
    }

    function addBotMsg(html)    { return addMsg(html, 'bot'); }
    function addUserMsg(text)   { return addMsg(text, 'user'); }
    function addSystemMsg(text) { return addMsg(text, 'system'); }

    function showTyping() {
      const el = document.createElement('div');
      el.className = 'tc-msg bot';
      el.innerHTML = `<div class="tc-label">JB-ASSIST</div><div class="tc-bubble tc-typing"><span></span><span></span><span></span></div>`;
      screen.appendChild(el);
      screen.scrollTop = screen.scrollHeight;
      return el;
    }

    function handleSend(text) {
      const val = (text || inputEl.value).trim();
      if (!val) return;
      if (inputEl) inputEl.value = '';
      hideSuggestions();

      addUserMsg(val);
      const typingEl = showTyping();

      setTimeout(() => {
        typingEl.remove();
        const answer = query(val);
        addBotMsg(answer);
        showChibiReply(answer);
      }, 450 + Math.random() * 200);
    }
  }

  /* ===================================================================
     INIT — wait for terminal panel to be ready
     =================================================================== */
  // We hook AFTER main.js's boot + terminal init, so we wait for
  // the terminal to be visible before taking over.
  function waitAndInit() {
    // Poll until the boot overlay is gone
    const bootOverlay = document.getElementById('boot-overlay');
    if (bootOverlay && !bootOverlay.classList.contains('hidden')) {
      setTimeout(waitAndInit, 300);
      return;
    }
    // Give terminal typewriter ~500ms head start then take over
    setTimeout(buildTerminalChat, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitAndInit);
  } else {
    waitAndInit();
  }

})();
