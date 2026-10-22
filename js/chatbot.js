/**
 * JB-ASSIST // PORTFOLIO CHATBOT v2.1
 * - Integrated into the hero terminal panel
 * - Chibi speech bubble echoes bot replies
 * - Cognitive intent engine with context memory
 * - Tour mode, clarification, follow-up "what?" handling
 */

(function () {
  'use strict';

  /* ===================================================================
     CONTEXT MEMORY — tracks last topic for follow-up questions
     =================================================================== */
  let lastTopic = null;   // e.g. 'projects', 'skills', 'experience', etc.
  let lastAnswer = null;  // full HTML of last bot reply

  /* ===================================================================
     GUIDED TOUR — sections of the portfolio with anchors
     =================================================================== */
  const TOUR_STEPS = [
    { id: 'about',        label: '01 — ABOUT',       summary: 'Background, engineering foundation & core methodology.' },
    { id: 'skills',       label: '02 — SKILLS',      summary: 'Programming, IT support, automation & embedded systems toolkit.' },
    { id: 'projects',     label: '03 — PROJECTS',    summary: 'T.A.S.K. Kiosk, Smart Helmet IoT, CRM Automation & Rig Diagnostics.' },
    { id: 'experience',   label: '04 — EXPERIENCE',  summary: 'Moriroku Philippines internship & CvSU capstone lead.' },
    { id: 'certificates', label: '05 — CREDENTIALS', summary: 'Packetworx IoT Workshops, AI Literacy, Cybersecurity & Critical Thinking certs.' },
    { id: 'contact',      label: '06 — CONTACT',     summary: 'johnbautista1424@gmail.com · +63971727130 · Sta. Rosa, Laguna.' },
  ];

  function buildTourReply() {
    lastTopic = 'tour';
    const lines = TOUR_STEPS.map(s =>
      `<div style="margin-bottom:5px;">
        <a href="#${s.id}" class="chat-link" style="font-weight:700;">${s.label}</a>
        <span style="color:#8ab8d0;font-size:10px;display:block;margin-top:1px;">${s.summary}</span>
      </div>`
    ).join('');
    return `Here's a quick tour of John's portfolio — click any section to jump there:<br><br>${lines}`;
  }

  /* ===================================================================
     DRILL-DOWN DETAIL MAP — for "tell me more" / "what?" follow-ups
     =================================================================== */
  const DRILL_DOWN = {
    projects: `<strong>Project details:</strong><br>
      <strong>① T.A.S.K. Kiosk</strong> — Capstone university queuing system. ESP32 + thermal printer + touchscreen, with accessibility support.<br>
      <strong>② Smart Helmet IoT</strong> — Crash detection & compliance monitoring via accelerometer + ESP32 + wireless telemetry.<br>
      <strong>③ CRM Automation</strong> — GoHighLevel & Zapier pipelines for invoice follow-ups at Moriroku Philippines.<br>
      <strong>④ Rig Diagnostics</strong> — BIOS/UEFI restoration, power rail testing, multi-boot OS provisioning.`,

    skills: `<strong>Skill breakdown:</strong><br>
      <strong>① Programming</strong> — Java, C++, Python, HTML5, CSS3, JavaScript (ES6+)<br>
      <strong>② IT & Hardware</strong> — PC assembly, laptop repair, OS deployment, network cabling, Microsoft 365<br>
      <strong>③ Automation & Data</strong> — GoHighLevel CRM, Zapier Webhooks, SDLC documentation<br>
      <strong>④ Embedded & IoT</strong> — ESP32, Arduino, Embedded C++, LoRaWAN, circuit schematics & soldering`,

    experience: `<strong>Experience timeline:</strong><br>
      <strong>① Moriroku Philippines Inc.</strong> — IT & Systems Workflow Specialist Intern. Configured GoHighLevel/Zapier automations, resolved workstation issues, authored SDLC docs.<br>
      <strong>② CvSU – Carmona Campus</strong> — Lead Hardware Integrator & Developer. Built the T.A.S.K. capstone system, led firmware engineering & hardware integration, received high faculty commendation.`,

    certificates: `<strong>Verified credentials:</strong><br>
      <strong>① Packetworx IoT Workshop 1</strong> — LoRaWAN & gateway fundamentals<br>
      <strong>② Packetworx IoT Workshop 2</strong> — Payload formatting & cloud routing<br>
      <strong>③ Packetworx IoT Workshop 3</strong> — End-to-end IoT platform & dashboards<br>
      <strong>④ AI Literacy Isn't Extra, It's Core</strong> — Prompt engineering & AI ethics<br>
      <strong>⑤ Think Like a Leader, Act Like a Defender</strong> — Cybersecurity seminar<br>
      <strong>⑥ Mastering Critical Thinking in the Age of AI</strong>`,

    education: `John holds a <strong>Bachelor of Science in Computer Engineering</strong> from <strong>Cavite State University – Carmona Campus</strong>. He graduated with hands-on experience in hardware systems, firmware, IoT, and enterprise automation.`,

    contact: `Contact John directly:<br>
      📧 <a href="mailto:johnbautista1424@gmail.com" class="chat-link">johnbautista1424@gmail.com</a><br>
      📞 <a href="tel:+63971727130" class="chat-link">+63971727130</a><br>
      📍 Sta. Rosa, Laguna, Philippines<br>
      📄 <a href="resume/John%20Bautista%20Jr..pdf" target="_blank" class="chat-link">Download Resume PDF</a>`,
  };

  /* ===================================================================
     UTILITY: EXTRACT EMAIL & PHONE FROM RAW USER MESSAGE
     =================================================================== */
  function extractEmail(text) {
    const m = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
    return m ? m[0] : null;
  }

  function extractPhone(text) {
    const m = text.match(/(?:\+?\d[\d\s\-().]{7,}\d)/);
    return m ? m[0].trim() : null;
  }

  /* ===================================================================
     INTENT PATTERNS
     =================================================================== */
  const INTENTS = [

    // 🗺️ TOUR / WALKTHROUGH — "walk me through", "show me", "guide me", "tour"
    {
      detect: (msg, tokens) => {
        const lower = msg.toLowerCase();
        return (
          lower.includes('walk') ||
          lower.includes('tour') ||
          lower.includes('guide me') ||
          lower.includes('show me') ||
          lower.includes('take me') ||
          lower.includes('overview') ||
          lower.includes('sections') ||
          (lower.includes('through') && (lower.includes('portfolio') || lower.includes('site') || lower.includes('this')))
        );
      },
      respond: () => buildTourReply()
    },

    // ❓ VAGUE FOLLOW-UP — "what?", "huh?", "explain", "elaborate", "more", "tell me more"
    {
      detect: (msg, tokens) => {
        const lower = msg.toLowerCase().trim();
        const vague = ['what', 'what?', 'huh', 'huh?', 'explain', 'elaborate', 'more', 'tell me more', 'details', 'detail', 'meaning', 'means', '?', 'continue', 'go on', 'and?', 'so?'];
        return vague.some(v => lower === v || lower === v + '?') || (tokens.length <= 2 && tokens.some(t => ['what', 'huh', 'explain', 'more', 'elaborate', 'detail', 'details', 'continue'].includes(t)));
      },
      respond: () => {
        if (lastTopic && DRILL_DOWN[lastTopic]) {
          return DRILL_DOWN[lastTopic];
        }
        if (lastTopic === 'tour') {
          return `Click on any section link above to jump there! You can also ask me about a specific section — like <em>"Tell me about his projects"</em> or <em>"What are his skills?"</em>`;
        }
        return `Could you clarify what you'd like to know? I can cover John's <strong>skills, projects, experience, education, certifications</strong>, or how to <strong>contact or hire him</strong>. You can also say <em>"walk me through the portfolio"</em> for a full tour!`;
      }
    },

    // 🎉 HIRE / JOB OFFER
    {
      detect: (msg, tokens) =>
        tokens.some(t => ['hired', 'hire', 'offer', 'offered', 'position', 'recruit', 'onboard', 'selected', 'congrats', 'congratulations', 'welcome', 'onboarded'].includes(t)),
      respond: (msg) => {
        lastTopic = 'hire';
        const email = extractEmail(msg);
        const phone = extractPhone(msg);
        if (email && phone) {
          return `🎉 <strong>That's incredible news!</strong> John is thrilled! He'll reach out to you at <strong>${email}</strong> or <strong>${phone}</strong> right away. Looking forward to connecting!`;
        } else if (email) {
          return `🎉 <strong>Amazing!</strong> John is excited about this opportunity! He'll get in touch at <strong>${email}</strong> very soon. Thank you so much!`;
        } else if (phone) {
          return `🎉 <strong>Fantastic!</strong> John would love to connect! He'll reach you at <strong>${phone}</strong> shortly. Really appreciate it!`;
        } else {
          return `🎉 <strong>Wow, thank you!</strong> John is genuinely excited! Please share your contact info and he'll respond ASAP at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>.`;
        }
      }
    },

    // 📬 STANDALONE CONTACT DROP (phone/email in message + context)
    {
      detect: (msg) => {
        const hasEmail = !!extractEmail(msg);
        const hasPhone = !!extractPhone(msg);
        const lower = msg.toLowerCase();
        const isStatement = lower.includes('contact') || lower.includes('reach') || lower.includes('call') || lower.includes('email') || lower.includes('me at') || lower.includes('reach me') || lower.includes('get back') || lower.includes('here');
        return (hasEmail || hasPhone) && isStatement;
      },
      respond: (msg) => {
        lastTopic = 'contact';
        const email = extractEmail(msg);
        const phone = extractPhone(msg);
        const contactStr = [email, phone].filter(Boolean).join(' or ');
        return `Got it! John will follow up with you at <strong>${contactStr}</strong>. He usually responds within 24 hours. You can also reach him directly at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>.`;
      }
    },

    // 👋 GREETINGS
    {
      detect: (_, tokens) => tokens.some(t => ['hi', 'hello', 'hey', 'sup', 'yo', 'howdy', 'greetings', 'hiya'].includes(t)),
      respond: () => {
        lastTopic = null;
        return `Hey there! 👋 I'm <strong>JB-Assist</strong>, John's portfolio bot. You can ask me about his <strong>skills, projects, experience, education</strong>, how to <strong>contact or hire him</strong>, or say <em>"walk me through the portfolio"</em> for a full tour!`;
      }
    },

    // 🙏 THANKS
    {
      detect: (_, tokens) => tokens.some(t => ['thanks', 'thank', 'thankyou', 'ty', 'thx', 'appreciate', 'cheers'].includes(t)),
      respond: () => `You're welcome! 😊 Feel free to ask anything else about John. He's <strong>open to new opportunities</strong> — don't hesitate to reach out!`
    },

    // 🤖 WHO IS THE BOT
    {
      detect: (msg, tokens) => {
        const lower = msg.toLowerCase();
        return lower.includes('who are you') || lower.includes('what are you') || (tokens.includes('bot') && tokens.length <= 4) || lower === 'ai';
      },
      respond: () => `I'm <strong>JB-Assist</strong> — an AI portfolio assistant for John Bautista. I can answer questions about his skills, projects, education, experience, certifications, and contact info. Try asking me something!`
    },

    // 👍 COMPLIMENTS
    {
      detect: (_, tokens) => tokens.some(t => ['great', 'awesome', 'nice', 'impressive', 'amazing', 'cool', 'excellent', 'wow', 'dope', 'sick'].includes(t)),
      respond: () => `Thank you! 💙 John puts a lot of effort into his craft. If you'd like to discuss a role or project, reach him at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>.`
    },
  ];

  /* ===================================================================
     KNOWLEDGE BASE
     =================================================================== */
  const KB = [
    { topic: 'identity',      tags: ['name', 'who', 'john', 'bautista', 'person', 'introduce', 'yourself', 'about you'],            answer: "I'm the digital assistant for <strong>John S. Bautista Jr.</strong> — a Computer Engineering graduate from Cavite State University – Carmona Campus, specializing in Embedded Systems, IoT, IT Support, and Automation." },
    { topic: 'identity',      tags: ['age', 'born', 'birthday', 'old', 'birth'],                                                     answer: "John was born on <strong>March 24, 2004</strong>, making him 22 years old." },
    { topic: 'contact',       tags: ['location', 'where', 'based', 'live', 'place', 'address', 'from'],                             answer: "John is based in <strong>Sta. Rosa, Laguna, Philippines</strong>." },
    { topic: 'contact',       tags: ['email', 'contact', 'reach', 'message', 'connect', 'touch'],                                   answer: "You can reach John at <strong><a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a></strong> or call <strong><a href='tel:+63971727130' class='chat-link'>+63971727130</a></strong>." },
    { topic: 'contact',       tags: ['phone', 'number', 'call', 'telephone', 'mobile'],                                             answer: "John's contact number is <strong><a href='tel:+63971727130' class='chat-link'>+63971727130</a></strong>." },
    { topic: 'contact',       tags: ['availability', 'available', 'open', 'hiring', 'job', 'opportunity', 'work', 'employ', 'looking', 'hire'], answer: "John is <strong>currently open for technical and engineering roles</strong> — Embedded Systems, IoT, IT Support, and Automation. Reach him at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>." },
    { topic: 'education',     tags: ['education', 'degree', 'school', 'university', 'college', 'study', 'graduate', 'academic', 'course', 'program', 'student'], answer: "John holds a <strong>Bachelor of Science in Computer Engineering</strong> from <strong>Cavite State University – Carmona Campus</strong>." },
    { topic: 'education',     tags: ['cavite', 'csu', 'carmona', 'institution', 'alma mater'],                                      answer: "John graduated from <strong>Cavite State University – Carmona Campus</strong> with a B.S. in Computer Engineering." },
    { topic: 'skills',        tags: ['programming', 'language', 'code', 'coding', 'software', 'java', 'python', 'javascript', 'html', 'css', 'script'], answer: "Programming stack: <strong>Java, C++, Python, HTML5, CSS3, and JavaScript (ES6+)</strong>." },
    { topic: 'skills',        tags: ['it', 'support', 'hardware', 'diagnostic', 'pc', 'computer', 'laptop', 'desktop', 'troubleshoot', 'repair', 'assembly'], answer: "IT & hardware: <strong>PC Assembly, Laptop Troubleshooting, Hardware Diagnostics, OS Deployment (Win/Linux), Network Setup, Microsoft 365</strong>." },
    { topic: 'skills',        tags: ['network', 'networking', 'cabling', 'lan', 'wifi', 'connectivity', 'subnet'],                  answer: "John handles <strong>Network Setup & Cabling</strong>, subnetting, and enterprise connectivity troubleshooting." },
    { topic: 'skills',        tags: ['automation', 'workflow', 'pipeline', 'zapier', 'gohighlevel', 'ghl', 'crm', 'invoice', 'sdlc', 'process'], answer: "Automation toolkit: <strong>GoHighLevel CRM, Zapier Webhooks, Workflow Optimization, Invoice Automation, SDLC Documentation</strong>." },
    { topic: 'skills',        tags: ['embedded', 'iot', 'esp32', 'arduino', 'microcontroller', 'firmware', 'sensor', 'lora', 'lorawan', 'circuit', 'gpio'], answer: "Embedded & IoT: <strong>ESP32 & Arduino, Sensors, Embedded C++, IoT Prototyping, LoRaWAN / Packetworx, Circuit Schematics & Soldering</strong>." },
    { topic: 'skills',        tags: ['skill', 'skills', 'capable', 'technical', 'tech', 'toolkit', 'know', 'specialize', 'can'],   answer: "John's 4 core modules: <strong>① Programming</strong> (Java, C++, Python, JS), <strong>② IT & Hardware</strong>, <strong>③ Automation & Data</strong>, <strong>④ Embedded & IoT</strong>. Say <em>\"what?\"</em> for a full breakdown!" },
    { topic: 'projects',      tags: ['project', 'work', 'build', 'built', 'create', 'made', 'developed', 'engineering', 'portfolio'], answer: "Key projects: <strong>① T.A.S.K. Queuing Kiosk</strong>, <strong>② Smart Helmet IoT</strong>, <strong>③ CRM & Invoice Automation</strong> at Moriroku, <strong>④ System Diagnostics & Rig Deployments</strong>. Say <em>\"what?\"</em> for details!" },
    { topic: 'projects',      tags: ['task', 'kiosk', 'queuing', 'queue', 'registrar', 'touchscreen', 'ticket', 'capstone'],       answer: "<strong>T.A.S.K.</strong> (Transaction and Academic Services Kiosk) — John's capstone. A university registrar touchscreen queuing system with hardware integration (microcontroller, thermal printer), automated ticket generation, and accessibility support." },
    { topic: 'projects',      tags: ['helmet', 'smart', 'safety', 'impact', 'accelerometer', 'gyroscope', 'crash', 'rider'],       answer: "<strong>Smart Helmet IoT Prototype</strong> — detects crash impacts & rider compliance using ESP32, accelerometer/gyroscope sensors, and wireless emergency telemetry." },
    { topic: 'experience',    tags: ['moriroku', 'company', 'enterprise', 'corporate', 'intern', 'internship'],                     answer: "At <strong>Moriroku Philippines, Inc.</strong> — IT & Systems Workflow Specialist Intern. Configured GoHighLevel/Zapier automations, handled IT support, authored SDLC documentation." },
    { topic: 'experience',    tags: ['experience', 'timeline', 'career', 'history', 'role', 'job', 'worked'],                      answer: "<strong>① IT & Systems Workflow Specialist Intern</strong> — Moriroku Philippines. <strong>② Lead Hardware Integrator & Developer</strong> — CvSU Carmona Capstone (high faculty commendation). Say <em>\"what?\"</em> for details!" },
    { topic: 'certificates',  tags: ['certificate', 'certification', 'credential', 'workshop', 'award', 'training', 'verified'],   answer: "Credentials: <strong>Packetworx IoT Workshops 1–3</strong>, <strong>AI Literacy</strong>, <strong>Cybersecurity Defender</strong>, <strong>Critical Thinking in the Age of AI</strong>. Say <em>\"what?\"</em> for full list!" },
    { topic: 'certificates',  tags: ['packetworx', 'lorawan', 'iot workshop', 'gateway', 'payload'],                               answer: "Completed <strong>3 Packetworx IoT Workshops</strong>: LoRaWAN basics, payload formatting & cloud routing, and end-to-end IoT platform engineering." },
    { topic: 'identity',      tags: ['resume', 'cv', 'download', 'pdf'],                                                            answer: "📄 <a href='resume/John%20Bautista%20Jr..pdf' target='_blank' class='chat-link'>Download John's Resume PDF</a>" },
    { topic: 'identity',      tags: ['website', 'portfolio', 'site', 'page', 'this', 'design'],                                    answer: "This is John's <strong>Digital Command Center</strong> — a cyberpunk-themed portfolio. Say <em>\"walk me through the portfolio\"</em> and I'll give you a guided tour!" },
    { topic: 'identity',      tags: ['chibi', 'companion', 'mascot', 'character', 'cute', 'drag'],                                 answer: "The <strong>chibi companion</strong> is an Easter Egg! Click and drag it — it has idle, walk, grab, fall, and land animations. 🎮" },
    { topic: 'skills',        tags: ['specialization', 'focus', 'domain', 'area', 'field', 'expertise', 'forte', 'main'],          answer: "Core domains: <strong>Embedded Systems, IoT, IT Support, Hardware Diagnostics, and Workflow Automation</strong>." },
    { topic: 'certificates',  tags: ['ai literacy', 'artificial intelligence', 'prompt', 'ml', 'machine learning'],                answer: "John holds an <strong>AI Literacy</strong> credential covering foundational AI, prompt engineering, and workflow acceleration. He's also certified in Critical Thinking in the Age of AI." },
    { topic: 'certificates',  tags: ['cybersecurity', 'security', 'defense', 'defender', 'threat'],                               answer: "<strong>\"Think Like a Leader, Act Like a Defender\"</strong> — John's cybersecurity credential covering incident response, security hygiene, and defensive mindset." },
  ];

  const SUGGESTIONS = [
    "Walk me through the portfolio",
    "What are John's skills?",
    "Tell me about his projects",
    "What's his experience?",
    "Is he open to hire?",
    "How do I contact John?",
  ];

  /* ===================================================================
     QUERY ENGINE
     =================================================================== */
  const STOP = new Set(['the','a','an','and','or','to','of','in','on','for','with','is','are','was','what','tell','me','his','her','about','does','he','she','do','can','how','where','when','why','who','i','you','your','my','have','has','been','its','it','this','that','those','these','at','by','please','just','so']);

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
        const answer = intent.respond(userInput, tokens);
        lastAnswer = answer;
        return answer;
      }
    }

    // 2. KB keyword scoring
    if (!tokens.length) {
      return "Could you rephrase that? Try asking about John's <strong>skills, projects, experience</strong>, or say <em>\"walk me through the portfolio\"</em>!";
    }

    const ranked = KB
      .map(e => ({ e, sc: scoreKB(tokens, e) }))
      .filter(x => x.sc > 0)
      .sort((a, b) => b.sc - a.sc);

    if (!ranked.length) {
      return `Hmm, I didn't quite catch that. Try asking about John's <strong>skills, projects, experience, certifications</strong>, or say <em>"walk me through the portfolio"</em> for a full tour!`;
    }

    const best = ranked[0].e;
    lastTopic = best.topic;
    lastAnswer = best.answer;
    return best.answer;
  }

  /* ===================================================================
     CHIBI SPEECH BUBBLE INTEGRATION
     =================================================================== */
  let chibiBubbleTimer = null;

  function showChibiReply(htmlText) {
    const bubble = document.getElementById('chibi-bubble');
    if (!bubble) return;
    const plain = htmlText.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const short = plain.length > 80 ? plain.substring(0, 80) + '…' : plain;
    bubble.innerHTML = `<span>${short}</span>`;
    bubble.classList.add('visible');
    if (chibiBubbleTimer) clearTimeout(chibiBubbleTimer);
    chibiBubbleTimer = setTimeout(() => bubble.classList.remove('visible'), 6500);
  }

  /* ===================================================================
     TERMINAL CHAT UI — injected into #terminal-panel
     =================================================================== */
  function buildTerminalChat() {
    const panel = document.getElementById('terminal-panel');
    const screen = document.getElementById('terminal-screen');
    if (!panel || !screen) return;

    // ── Styles ──────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
      .terminal-panel {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
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
      .tc-msg.bot  .tc-label  { color: #00E5FF; }
      .tc-msg.user .tc-label  { color: #168BFF; text-align: right; }

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
        color: #2a5070;
        font-style: italic;
        font-size: 10px;
        align-self: flex-start;
        border: none;
        background: none;
        padding: 0 4px;
      }
      .tc-msg a.chat-link        { color: #00E5FF; text-decoration: underline; }
      .tc-msg a.chat-link:hover  { color: #fff; }

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
        0%,80%,100% { transform: scaleY(1); opacity:0.5; }
        40%          { transform: scaleY(1.6); opacity:1; }
      }

      /* Suggestions */
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
      #tc-input:focus         { border-color: rgba(0,229,255,0.6); }
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
    `;
    document.head.appendChild(style);

    // ── Clear screen, rebuild as chat ────────────────────────────────
    screen.innerHTML = '';

    // ── Suggestions ──────────────────────────────────────────────────
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
      btn.addEventListener('click', () => { hideSuggestions(); handleSend(s); });
      sugBlock.appendChild(btn);
    });
    panel.insertBefore(sugBlock, panel.querySelector('.terminal-footer'));

    // ── Input row ────────────────────────────────────────────────────
    const inputRow = document.createElement('div');
    inputRow.id = 'tc-input-row';
    inputRow.innerHTML = `
      <span id="tc-prompt-label">&gt;_</span>
      <input id="tc-input" type="text" placeholder="Ask about John or type 'walk me through'..." autocomplete="off" maxlength="200" aria-label="Chat input">
      <button id="tc-send" aria-label="Send">SEND ›</button>
    `;
    panel.insertBefore(inputRow, panel.querySelector('.terminal-footer'));

    const inputEl = document.getElementById('tc-input');
    document.getElementById('tc-send').addEventListener('click', () => handleSend());
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

    // Update terminal header label
    const titleEl = panel.querySelector('.term-title');
    if (titleEl) titleEl.textContent = 'JB-ASSIST // AI PORTFOLIO BOT';

    // ── Boot messages ─────────────────────────────────────────────────
    addSystemMsg('> Initializing JB-ASSIST v2.1...');
    setTimeout(() => addSystemMsg('> Context engine online. Type anything or pick a quick query below.'), 500);
    setTimeout(() => {
      const welcome = `Hey! I'm <strong>JB-Assist</strong> 👋 — John's portfolio AI. Ask about his <strong>skills, projects, experience</strong>, or say <em>"walk me through the portfolio"</em> for a full tour!`;
      addBotMsg(welcome);
      showChibiReply(welcome);
    }, 1000);

    // ── Message helpers ───────────────────────────────────────────────
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

    function hideSuggestions() {
      sugBlock.style.display = 'none';
    }

    function handleSend(text) {
      const val = (text !== undefined ? text : inputEl.value).trim();
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
      }, 420 + Math.random() * 180);
    }
  }

  /* ===================================================================
     INIT — after boot overlay dismisses
     =================================================================== */
  function waitAndInit() {
    const bootOverlay = document.getElementById('boot-overlay');
    if (bootOverlay && !bootOverlay.classList.contains('hidden')) {
      setTimeout(waitAndInit, 300);
      return;
    }
    setTimeout(buildTerminalChat, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitAndInit);
  } else {
    waitAndInit();
  }

})();
