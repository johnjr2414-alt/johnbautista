/**
 * JB-ASSIST // PORTFOLIO CHATBOT v1.0
 * Cyberpunk-themed AI assistant for John Bautista's portfolio.
 * Uses a keyword-scoring engine against a built-in knowledge base.
 */

(function () {
  'use strict';

  /* ===================================================================
     KNOWLEDGE BASE — All info about John Bautista
     =================================================================== */
  const KB = [
    // Identity
    { tags: ['name', 'who', 'john', 'bautista', 'person', 'introduce', 'yourself'], answer: "I'm the digital assistant for <strong>John S. Bautista Jr.</strong> — a Computer Engineering graduate from Cavite State University, Carmona Campus. He specializes in Embedded Systems, IoT, IT Support, and Automation." },
    { tags: ['age', 'born', 'birthday', 'birth', 'old'], answer: "John was born on <strong>March 24, 2004</strong>, making him 22 years old." },
    { tags: ['location', 'where', 'based', 'live', 'address', 'place'], answer: "John is based in <strong>Sta. Rosa, Laguna, Philippines</strong>." },
    { tags: ['email', 'contact', 'mail', 'reach', 'message', 'connect'], answer: "You can reach John via email at <strong><a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a></strong> or call <strong><a href='tel:+63971727130' class='chat-link'>+63971727130</a></strong>." },
    { tags: ['phone', 'number', 'call', 'telephone', 'mobile'], answer: "John's contact number is <strong><a href='tel:+63971727130' class='chat-link'>+63971727130</a></strong>." },
    { tags: ['gender', 'sex', 'male', 'female'], answer: "John is <strong>Male</strong>." },
    { tags: ['availability', 'available', 'open', 'hiring', 'hire', 'job', 'opportunity', 'work', 'employ'], answer: "John is <strong>currently open for technical and engineering roles</strong> — particularly in Computer Engineering, Embedded Systems, IoT, IT Support, and Automation." },

    // Education
    { tags: ['education', 'degree', 'school', 'university', 'college', 'study', 'graduate', 'academic', 'course', 'program'], answer: "John holds a <strong>Bachelor of Science in Computer Engineering</strong> from <strong>Cavite State University – Carmona Campus</strong>." },
    { tags: ['cavite', 'csu', 'carmona', 'institution', 'alma mater'], answer: "John graduated from <strong>Cavite State University – Carmona Campus</strong> with a degree in Computer Engineering." },

    // Skills — Programming
    { tags: ['programming', 'language', 'code', 'coding', 'software', 'java', 'python', 'javascript', 'html', 'css', 'c++', 'script'], answer: "John's programming skills include <strong>Java, C++, Python, HTML5, CSS3, and JavaScript (ES6+)</strong>. He applies these across firmware, frontend interfaces, and automation scripts." },
    { tags: ['frontend', 'web', 'html', 'css', 'javascript', 'interface', 'ui', 'ux', 'design'], answer: "John has frontend web skills using <strong>HTML5, CSS3, and JavaScript (ES6+)</strong>, and has built touchscreen kiosk interfaces and portfolio pages." },

    // Skills — IT Support & Hardware
    { tags: ['it', 'support', 'hardware', 'diagnostic', 'pc', 'computer', 'laptop', 'desktop', 'troubleshoot', 'repair', 'assembly', 'rig'], answer: "John's IT support & hardware skills include <strong>PC Assembly & Rig Maintenance, Laptop Troubleshooting, Hardware Diagnostics, OS Deployment (Windows/Linux), Network Setup & Cabling, and Microsoft 365</strong>." },
    { tags: ['os', 'windows', 'linux', 'operating system', 'install', 'deploy'], answer: "John is experienced in <strong>OS Deployment for both Windows and Linux</strong> environments, including partitioned multi-boot setups." },
    { tags: ['network', 'networking', 'cabling', 'lan', 'wi-fi', 'wifi', 'connectivity'], answer: "John can handle <strong>Network Setup & Cabling</strong>, subnetting, and connectivity troubleshooting in enterprise environments." },

    // Skills — Automation
    { tags: ['automation', 'workflow', 'pipeline', 'zapier', 'gohighlevel', 'ghl', 'crm', 'invoice', 'sdlc', 'documentation', 'process'], answer: "John's automation skills cover <strong>GoHighLevel (CRM & Pipelines), Zapier Webhooks, Workflow Optimization, Invoice Follow-Up Automation, Technical Documentation, and SDLC Fundamentals</strong>." },
    { tags: ['zapier', 'webhook', 'trigger', 'zap'], answer: "John has practical experience building <strong>Zapier webhook automations</strong>, including invoice event triggers that automatically dispatch emails, SMS, and database updates." },
    { tags: ['gohighlevel', 'ghl', 'crm', 'pipeline', 'client', 'follow-up'], answer: "John used <strong>GoHighLevel</strong> to configure and manage CRM pipelines, automated client follow-up sequences, and invoice collection workflows during his internship at Moriroku Philippines." },

    // Skills — Embedded / IoT
    { tags: ['embedded', 'iot', 'esp32', 'arduino', 'microcontroller', 'firmware', 'sensor', 'lora', 'lorawan', 'circuit', 'solder', 'hardware', 'gpio'], answer: "John is skilled in <strong>Embedded Systems & IoT</strong>: ESP32 & Arduino platforms, Sensors & Microcontrollers, Embedded C++, IoT Hardware Prototyping, LoRaWAN / Packetworx technology, and Circuit Schematics & Soldering." },
    { tags: ['esp32', 'microcontroller', 'firmware', 'embedded c', 'c++'], answer: "John has hands-on experience with <strong>ESP32 microcontrollers</strong>, writing firmware in <strong>Embedded C++</strong> for real-time sensor interfacing, GPIO control, and wireless telemetry." },
    { tags: ['lora', 'lorawan', 'packetworx', 'telemetry', 'wireless', 'rf', 'signal'], answer: "John is trained in <strong>LoRaWAN technology through Packetworx workshops</strong>, covering gateway operations, payload formatting, and cloud data routing." },

    // Projects
    { tags: ['project', 'work', 'build', 'built', 'create', 'made', 'developed', 'engineering'], answer: "John's major projects include: 1) <strong>T.A.S.K. Digital Queuing Kiosk</strong> (capstone), 2) <strong>Smart Helmet IoT Prototype</strong>, 3) <strong>CRM & Invoice Workflow Automation</strong> at Moriroku, and 4) <strong>System Diagnostics & Rig Deployments</strong>." },
    { tags: ['task', 'kiosk', 'queuing', 'queue', 'registrar', 'touchscreen', 'ticket', 'capstone'], answer: "<strong>T.A.S.K.</strong> (Transaction and Academic Services Kiosk) is John's capstone project — a touchscreen queuing system for university registrar offices featuring hardware integration (display, microcontroller, thermal printer), automated ticket generation, and accessibility accommodations." },
    { tags: ['helmet', 'smart helmet', 'safety', 'impact', 'accelerometer', 'gyroscope', 'crash', 'wear'], answer: "The <strong>Smart Helmet IoT Prototype</strong> is an intelligent safety helmet that detects proper rider compliance and monitors real-time crash impacts using an ESP32, accelerometer/gyroscope sensors, and wireless telemetry for emergency notifications." },
    { tags: ['crm', 'moriroku', 'invoice', 'automation', 'workflow', 'pipeline', 'zapier'], answer: "John developed <strong>CRM & Invoice Workflow Automation</strong> at Moriroku Philippines using GoHighLevel and Zapier — converting manual follow-up processes into zero-touch automated event flows with email/SMS/database dispatch." },
    { tags: ['diagnostic', 'diagnostics', 'bios', 'uefi', 'post', 'ram', 'thermal', 'benchmark', 'bench', 'motherboard'], answer: "John's <strong>System Diagnostics & Rig Deployment</strong> work includes custom PC bench assembly, BIOS/UEFI firmware restoration, power rail multimeter testing, thermal profiling, driver troubleshooting, and multi-boot OS provisioning." },

    // Experience
    { tags: ['experience', 'internship', 'intern', 'job', 'work', 'career', 'company', 'employed'], answer: "John has two key experience entries: (1) <strong>IT & Systems Workflow Specialist Intern</strong> at Moriroku Philippines — handling CRM automation, IT support & SDLC documentation; (2) <strong>Lead Hardware Integrator & Developer</strong> on the T.A.S.K. capstone at Cavite State University." },
    { tags: ['moriroku', 'moriroku philippines', 'company', 'enterprise', 'corporate'], answer: "At <strong>Moriroku Philippines, Inc.</strong>, John served as an IT & Systems Workflow Specialist Intern. He configured automated invoice workflows with GoHighLevel & Zapier, provided IT systems support, wrote SDLC documentation, and collaborated with cross-functional managers." },
    { tags: ['capstone', 'university', 'academic', 'lead', 'developer', 'hardware integrator', 'cavite'], answer: "As <strong>Lead Hardware Integrator & Developer</strong> at Cavite State University – Carmona Campus, John spearheaded the T.A.S.K. queuing system and IoT prototype. He integrated physical components, engineered firmware, and conducted fault/stress testing — receiving high commendation from faculty." },

    // Certificates
    { tags: ['certificate', 'certification', 'credential', 'credentials', 'workshop', 'award', 'training'], answer: "John's verified credentials include: <strong>Packetworx IoT Workshops 1, 2 & 3</strong> (LoRaWAN & Smart Devices), <strong>AI Literacy Isn't Extra, It's Core</strong>, <strong>Think Like a Leader, Act Like a Defender</strong> (Cybersecurity), and <strong>Mastering Critical Thinking in the Age of AI</strong>." },
    { tags: ['packetworx', 'iot workshop', 'lorawan', 'smart device', 'gateway', 'payload'], answer: "John completed <strong>three Packetworx IoT Workshops</strong>: Workshop 1 (IoT architecture & LoRaWAN fundamentals), Workshop 2 (payload formatting & cloud routing), and Workshop 3 (end-to-end IoT platform engineering & data visualization)." },
    { tags: ['ai literacy', 'artificial intelligence', 'ai', 'prompt', 'ethics', 'ml', 'machine learning'], answer: "John holds a credential in <strong>AI Literacy Isn't Extra, It's Core</strong> — covering foundational AI models, prompt engineering, technical integration ethics, and workflow acceleration." },
    { tags: ['cybersecurity', 'security', 'defender', 'threat', 'incident', 'defense', 'leader'], answer: "John has a cybersecurity credential: <strong>Think Like a Leader, Act Like a Defender</strong> — covering security hygiene, incident response fundamentals, and defensive mindset in modern infrastructure." },
    { tags: ['critical thinking', 'thinking', 'reasoning', 'logic', 'bias', 'data', 'decision'], answer: "John earned the <strong>Mastering Critical Thinking in the Age of AI</strong> credential, focusing on systematic verification of AI outputs, bias identification, and data-driven decision making." },

    // Resume
    { tags: ['resume', 'cv', 'download', 'pdf', 'curriculum vitae'], answer: "You can download John's resume directly from his portfolio: <a href='resume/John%20Bautista%20Jr..pdf' target='_blank' class='chat-link'>📄 Download Resume PDF</a>" },

    // Website / Portfolio
    { tags: ['website', 'portfolio', 'site', 'page', 'section', 'navigate', 'built'], answer: "This portfolio is John's <strong>Digital Command Center</strong> — a cyberpunk-themed single-page site showcasing his About, Skills, Projects, Experience, Credentials, and Contact sections. It features a circuit board background, holographic HUD elements, and an interactive chibi companion." },
    { tags: ['chibi', 'companion', 'mascot', 'character', 'cute', 'easter egg'], answer: "The <strong>interactive chibi companion</strong> in the corner is an Easter Egg — you can click and drag it! It has idle, walk, grab, fall, and land animations." },

    // Specializations
    { tags: ['specialization', 'focus', 'domain', 'area', 'field', 'expertise', 'forte'], answer: "John's core domains are <strong>Embedded Systems, IoT, IT Support, Hardware Diagnostics, and Workflow Automation</strong>. He bridges both physical hardware engineering and software/automation solutions." },
  ];

  /* ===================================================================
     SUGGESTED QUESTIONS
     =================================================================== */
  const SUGGESTIONS = [
    "What are John's skills?",
    "Tell me about his projects",
    "What's his work experience?",
    "How can I contact John?",
    "What certifications does he have?",
    "Where did he study?",
  ];

  /* ===================================================================
     QUERY ENGINE
     =================================================================== */
  const STOP_WORDS = new Set(['the','a','an','and','or','to','of','in','on','for','with','is','are','was','what','tell','me','his','her','about','does','he','she','do','can','how','where','when','why','who','i','you','your','my','have','has','been']);

  function tokenize(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s\-\+]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOP_WORDS.has(w));
  }

  function scoreEntry(words, entry) {
    let score = 0;
    for (const w of words) {
      for (const tag of entry.tags) {
        if (tag === w) { score += 3; break; }
        if (tag.includes(w) || w.includes(tag)) { score += 1; break; }
      }
    }
    return score;
  }

  function query(userInput) {
    const words = tokenize(userInput);
    if (!words.length) return "Please ask me something about John! Try: <em>\"What are his skills?\"</em> or <em>\"How can I contact him?\"</em>";

    const ranked = KB
      .map(entry => ({ entry, score: scoreEntry(words, entry) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!ranked.length) {
      return "I'm not sure about that one. Try asking about John's <strong>skills, projects, experience, education, certificates</strong>, or how to <strong>contact him</strong>.";
    }
    return ranked[0].entry.answer;
  }

  /* ===================================================================
     UI — Build chatbot widget
     =================================================================== */
  function buildUI() {
    // ── Styles ──────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
      /* === JB CHATBOT WIDGET === */
      #jb-chat-fab {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 10000;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #071426 60%, #0a1e38);
        border: 1.5px solid #00E5FF;
        border-radius: 0;
        clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(0,229,255,0.35), 0 0 6px rgba(0,229,255,0.2);
        transition: box-shadow 0.3s, transform 0.2s;
        outline: none;
      }
      #jb-chat-fab:hover {
        box-shadow: 0 0 30px rgba(0,229,255,0.6), 0 0 10px rgba(0,229,255,0.4);
        transform: scale(1.06);
      }
      #jb-chat-fab svg { display: block; }
      #jb-chat-fab .fab-badge {
        position: absolute;
        top: -5px; right: -5px;
        width: 14px; height: 14px;
        background: #00E5FF;
        border-radius: 50%;
        animation: fabPulse 1.8s infinite;
      }
      @keyframes fabPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%       { transform: scale(1.4); opacity: 0.6; }
      }

      /* === CHAT WINDOW === */
      #jb-chat-window {
        position: fixed;
        bottom: 104px;
        right: 32px;
        z-index: 10000;
        width: 360px;
        max-height: 540px;
        display: flex;
        flex-direction: column;
        background: #071426;
        border: 1.5px solid #00E5FF;
        clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
        box-shadow: 0 0 40px rgba(0,229,255,0.25), 0 0 12px rgba(0,229,255,0.1), inset 0 0 60px rgba(0,20,60,0.5);
        transition: opacity 0.25s, transform 0.25s;
        transform-origin: bottom right;
      }
      #jb-chat-window.hidden {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.92) translateY(12px);
      }

      /* Header */
      #jb-chat-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px 10px;
        border-bottom: 1px solid rgba(0,229,255,0.2);
        background: rgba(0,20,50,0.6);
        flex-shrink: 0;
      }
      #jb-chat-header .ch-icon {
        width: 32px; height: 32px;
        background: linear-gradient(135deg, #0d2a4a, #071426);
        border: 1px solid #00E5FF;
        display: flex; align-items: center; justify-content: center;
        clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
        flex-shrink: 0;
      }
      #jb-chat-header .ch-titles { flex: 1; min-width: 0; }
      #jb-chat-header .ch-name {
        font-family: 'Orbitron', monospace;
        font-size: 10px;
        font-weight: 700;
        color: #00E5FF;
        letter-spacing: 0.08em;
        display: block;
      }
      #jb-chat-header .ch-sub {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        color: #5a8aaa;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      #jb-chat-header .ch-status-dot {
        width: 6px; height: 6px;
        background: #00E5FF;
        border-radius: 50%;
        display: inline-block;
        animation: fabPulse 2s infinite;
      }
      #jb-chat-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #5a8aaa;
        font-size: 18px;
        line-height: 1;
        padding: 2px 4px;
        border-radius: 2px;
        transition: color 0.2s;
        flex-shrink: 0;
      }
      #jb-chat-close:hover { color: #00E5FF; }

      /* Messages */
      #jb-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 14px 14px 8px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scrollbar-width: thin;
        scrollbar-color: rgba(0,229,255,0.3) transparent;
      }
      #jb-chat-messages::-webkit-scrollbar { width: 4px; }
      #jb-chat-messages::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.3); border-radius: 2px; }

      .jb-msg {
        max-width: 88%;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        line-height: 1.6;
        padding: 9px 12px;
        word-break: break-word;
      }
      .jb-msg.bot {
        align-self: flex-start;
        background: rgba(0,20,50,0.7);
        border: 1px solid rgba(0,229,255,0.25);
        color: #c8e8f8;
        clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
      }
      .jb-msg.bot::before {
        content: '> BOT: ';
        color: #00E5FF;
        font-weight: 700;
        font-size: 10px;
        display: block;
        margin-bottom: 3px;
        letter-spacing: 0.05em;
      }
      .jb-msg.user {
        align-self: flex-end;
        background: rgba(0,229,255,0.08);
        border: 1px solid rgba(0,229,255,0.35);
        color: #eaf7ff;
        clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
        text-align: right;
      }
      .jb-msg.user::after {
        content: ' :YOU <';
        color: #168BFF;
        font-weight: 700;
        font-size: 10px;
        display: block;
        margin-top: 3px;
        letter-spacing: 0.05em;
      }
      .jb-msg.typing {
        align-self: flex-start;
        background: rgba(0,20,50,0.7);
        border: 1px solid rgba(0,229,255,0.2);
        color: #5a8aaa;
        font-style: italic;
        clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
      }
      .jb-msg a.chat-link {
        color: #00E5FF;
        text-decoration: underline;
      }
      .jb-msg a.chat-link:hover { color: #fff; }

      /* Suggestions */
      #jb-suggestions {
        padding: 6px 14px 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        border-top: 1px solid rgba(0,229,255,0.1);
        flex-shrink: 0;
      }
      .jb-sug-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        color: #3a6080;
        width: 100%;
        margin-bottom: 2px;
        letter-spacing: 0.08em;
      }
      .jb-sug {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        background: rgba(0,229,255,0.06);
        border: 1px solid rgba(0,229,255,0.22);
        color: #7ab8d4;
        padding: 4px 8px;
        cursor: pointer;
        clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
        transition: background 0.2s, color 0.2s, border-color 0.2s;
        line-height: 1.3;
      }
      .jb-sug:hover {
        background: rgba(0,229,255,0.15);
        color: #00E5FF;
        border-color: rgba(0,229,255,0.5);
      }

      /* Input row */
      #jb-chat-input-row {
        display: flex;
        align-items: center;
        gap: 0;
        padding: 8px 12px 12px;
        border-top: 1px solid rgba(0,229,255,0.15);
        flex-shrink: 0;
        background: rgba(0,10,30,0.4);
      }
      #jb-chat-input {
        flex: 1;
        background: rgba(0,20,50,0.6);
        border: 1px solid rgba(0,229,255,0.3);
        border-right: none;
        color: #eaf7ff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        padding: 8px 12px;
        outline: none;
        transition: border-color 0.2s;
        clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px);
      }
      #jb-chat-input::placeholder { color: #3a6080; }
      #jb-chat-input:focus { border-color: rgba(0,229,255,0.7); }
      #jb-chat-send {
        background: linear-gradient(135deg, #0d2a4a, #071426);
        border: 1px solid rgba(0,229,255,0.4);
        color: #00E5FF;
        cursor: pointer;
        padding: 8px 14px;
        font-family: 'Orbitron', monospace;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.05em;
        transition: background 0.2s, box-shadow 0.2s;
        clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
        height: 100%;
        white-space: nowrap;
      }
      #jb-chat-send:hover {
        background: linear-gradient(135deg, #00E5FF22, #168BFF22);
        box-shadow: 0 0 10px rgba(0,229,255,0.3);
      }

      /* Scan line animation on chat window */
      #jb-chat-window::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent);
        animation: scanLine 3s linear infinite;
        pointer-events: none;
      }
      @keyframes scanLine {
        0%   { top: 0; opacity: 0.8; }
        100% { top: 100%; opacity: 0; }
      }

      /* Mobile adjustments */
      @media (max-width: 600px) {
        #jb-chat-window {
          right: 12px;
          bottom: 90px;
          width: calc(100vw - 24px);
          max-width: 360px;
        }
        #jb-chat-fab {
          right: 16px;
          bottom: 20px;
        }
      }
    `;
    document.head.appendChild(style);

    // ── FAB Button ───────────────────────────────────────────────────
    const fab = document.createElement('button');
    fab.id = 'jb-chat-fab';
    fab.setAttribute('aria-label', 'Open JB Portfolio Assistant');
    fab.title = 'Ask me anything about John!';
    fab.innerHTML = `
      <div class="fab-badge"></div>
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#00E5FF" stroke-width="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <line x1="9" y1="10" x2="15" y2="10" stroke-width="1.4"/>
        <line x1="9" y1="13" x2="13" y2="13" stroke-width="1.4"/>
      </svg>
    `;
    document.body.appendChild(fab);

    // ── Chat Window ──────────────────────────────────────────────────
    const win = document.createElement('div');
    win.id = 'jb-chat-window';
    win.className = 'hidden';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'JB Portfolio Assistant');
    win.innerHTML = `
      <div id="jb-chat-header">
        <div class="ch-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#00E5FF" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="ch-titles">
          <span class="ch-name">JB-ASSIST // PORTFOLIO BOT</span>
          <span class="ch-sub"><span class="ch-status-dot"></span>ONLINE &nbsp;|&nbsp; ASK ANYTHING</span>
        </div>
        <button id="jb-chat-close" aria-label="Close chat">&times;</button>
      </div>

      <div id="jb-chat-messages" role="log" aria-live="polite"></div>

      <div id="jb-suggestions">
        <span class="jb-sug-label">// QUICK QUERIES</span>
      </div>

      <div id="jb-chat-input-row">
        <input id="jb-chat-input" type="text" placeholder="Ask about skills, projects, experience..." autocomplete="off" maxlength="200" aria-label="Chat input">
        <button id="jb-chat-send" aria-label="Send">SEND &rsaquo;</button>
      </div>
    `;
    document.body.appendChild(win);

    // ── References ───────────────────────────────────────────────────
    const messagesEl = document.getElementById('jb-chat-messages');
    const inputEl    = document.getElementById('jb-chat-input');
    const sugEl      = document.getElementById('jb-suggestions');

    // ── Helpers ──────────────────────────────────────────────────────
    function addMessage(text, role) {
      const msg = document.createElement('div');
      msg.className = `jb-msg ${role}`;
      msg.innerHTML = text;
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return msg;
    }

    function showTyping() {
      return addMessage('Processing query...', 'typing');
    }

    function respond(userText) {
      addMessage(userText, 'user');
      const typingEl = showTyping();
      // Slight delay for realism
      setTimeout(() => {
        typingEl.remove();
        const answer = query(userText);
        addMessage(answer, 'bot');
        // Hide suggestions after first interaction
        if (sugEl.style.display !== 'none') {
          sugEl.style.display = 'none';
        }
      }, 420);
    }

    // ── Suggestions ──────────────────────────────────────────────────
    SUGGESTIONS.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'jb-sug';
      btn.textContent = s;
      btn.addEventListener('click', () => {
        sugEl.style.display = 'none';
        respond(s);
      });
      sugEl.appendChild(btn);
    });

    // ── Welcome message ──────────────────────────────────────────────
    addMessage(
      "Hello! I'm <strong>JB-Assist</strong>, John's portfolio AI. Ask me anything about his <strong>skills, projects, experience, education, certificates</strong>, or how to <strong>contact him</strong>. ⚡",
      'bot'
    );

    // ── Toggle open/close ─────────────────────────────────────────────
    let isOpen = false;
    function openChat() {
      isOpen = true;
      win.classList.remove('hidden');
      fab.querySelector('.fab-badge').style.display = 'none';
      setTimeout(() => inputEl.focus(), 50);
    }
    function closeChat() {
      isOpen = false;
      win.classList.add('hidden');
    }

    fab.addEventListener('click', () => isOpen ? closeChat() : openChat());
    document.getElementById('jb-chat-close').addEventListener('click', closeChat);

    // ── Send on Enter / button ────────────────────────────────────────
    function handleSend() {
      const text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = '';
      respond(text);
    }

    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
    document.getElementById('jb-chat-send').addEventListener('click', handleSend);

    // ── Close on Escape ──────────────────────────────────────────────
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closeChat();
    });
  }

  /* ===================================================================
     INIT
     =================================================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }

})();
