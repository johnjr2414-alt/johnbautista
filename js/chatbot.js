/**
 * JB-ASSIST // PORTFOLIO CHATBOT v2.2
 * - Integrated into the hero terminal panel
 * - Chibi speech bubble echoes bot replies
 * - Detailed, direct responses without teasers or prompting "say what?"
 * - Handles ordinal/specific queries like "first project", "second project", etc.
 */

(function () {
  'use strict';

  /* ===================================================================
     CONTEXT MEMORY
     =================================================================== */
  let lastTopic = null;
  let lastAnswer = null;

  /* ===================================================================
     GUIDED TOUR
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
      `<div style="margin-bottom:6px;">
        <a href="#${s.id}" class="chat-link" style="font-weight:700;">${s.label}</a>
        <span style="color:#8ab8d0;font-size:10px;display:block;margin-top:1px;">${s.summary}</span>
      </div>`
    ).join('');
    return `Here is a complete walkthrough of John's portfolio. You can click any section to jump directly to it:<br><br>${lines}`;
  }

  /* ===================================================================
     INDIVIDUAL PROJECT DETAILS (First, Second, Third, Fourth, or by name)
     =================================================================== */
  const DETAILED_PROJECTS = {
    task: `<strong>Project 1: T.A.S.K. Digital Queuing Kiosk (Capstone)</strong><br>
      • <em>Overview:</em> Transaction and Academic Services Kiosk created for the university registrar to eliminate congestion.<br>
      • <em>Hardware:</em> Microcontroller-based controller board interfaced with a high-durability touchscreen and thermal receipt printer.<br>
      • <em>Firmware/Software:</em> Developed responsive UI with special accessibility accommodations, queue serialization, and fault recovery.`,

    helmet: `<strong>Project 2: Smart Helmet IoT Prototype</strong><br>
      • <em>Overview:</em> An intelligent rider safety system focused on active compliance and automated crash telemetry.<br>
      • <em>Sensors & Hardware:</em> Embedded ESP32 microcontroller with 6-axis accelerometer & gyroscope.<br>
      • <em>Function:</em> Real-time impact detection and wireless emergency telemetry logging for incident dispatch.`,

    crm: `<strong>Project 3: CRM & Invoice Workflow Automation</strong><br>
      • <em>Overview:</em> Enterprise operational pipeline deployed at Moriroku Philippines.<br>
      • <em>Tech Stack:</em> GoHighLevel, Zapier webhooks, and database triggers.<br>
      • <em>Impact:</em> Transformed manual, multi-person invoice tracking into zero-touch automated follow-up communications.`,

    rigs: `<strong>Project 4: System Diagnostics & Rig Deployments</strong><br>
      • <em>Overview:</em> Component-level diagnostics, bench assembly, and OS provisioning.<br>
      • <em>Execution:</em> BIOS/UEFI firmware recovery, motherboard power rail multimeter testing, thermal profiling, and partitioned multi-boot deployments.`
  };

  const FULL_PROJECTS_LIST = `<strong>John's Engineering Projects:</strong><br><br>
    <strong>1. T.A.S.K. Digital Queuing Kiosk (Capstone)</strong><br>
    Touchscreen campus queuing system integrating microcontroller hardware, thermal printer, and accessibility features.<br><br>
    <strong>2. Smart Helmet IoT Prototype</strong><br>
    ESP32-powered rider helmet detecting proper wear and real-time crash impacts with emergency telemetry.<br><br>
    <strong>3. CRM & Invoice Workflow Automation (Moriroku)</strong><br>
    Automated zero-touch client follow-ups and invoicing using GoHighLevel and Zapier webhooks.<br><br>
    <strong>4. System Diagnostics & Rig Deployments</strong><br>
    Component-level PC diagnostics, motherboard BIOS recovery, thermal profiling, and OS provisioning.`;

  const FULL_SKILLS_LIST = `<strong>John's Technical Capabilities:</strong><br><br>
    • <strong>Programming & Scripting:</strong> Java, C++, Python, HTML5, CSS3, JavaScript (ES6+)<br>
    • <strong>IT Support & Hardware:</strong> PC assembly, laptop repair, hardware diagnostics, OS deployment (Windows & Linux), network setup & cabling, Microsoft 365<br>
    • <strong>Automation & Systems:</strong> GoHighLevel CRM, Zapier webhooks, automated invoice follow-ups, SDLC documentation<br>
    • <strong>Embedded Systems & IoT:</strong> ESP32 & Arduino platforms, embedded C++, LoRaWAN/Packetworx, sensor wiring, circuit schematics & soldering`;

  const FULL_EXPERIENCE_LIST = `<strong>Professional & Engineering Experience:</strong><br><br>
    • <strong>Moriroku Philippines, Inc.</strong> — <em>IT & Systems Workflow Specialist Intern</em><br>
    Configured automated invoice and client communication sequences using GoHighLevel and Zapier, resolved IT workstation/network incidents, and authored SDLC procedural documentation.<br><br>
    • <strong>Cavite State University – Carmona</strong> — <em>Lead Hardware Integrator & Developer</em><br>
    Spearheaded the T.A.S.K. queuing kiosk and IoT prototypes, built custom firmware, conducted stress testing, and presented an engineering defense that earned high commendation.`;

  const FULL_CERTS_LIST = `<strong>Verified Credentials & Workshops:</strong><br><br>
    • <strong>Packetworx IoT Workshop 1:</strong> LoRaWAN architecture & sensor interfacing<br>
    • <strong>Packetworx IoT Workshop 2:</strong> Payload formatting & cloud server routing<br>
    • <strong>Packetworx IoT Workshop 3:</strong> End-to-end IoT platform engineering & telemetry dashboards<br>
    • <strong>AI Literacy Isn't Extra, It's Core:</strong> Prompt engineering, model fundamentals, and ethics<br>
    • <strong>Think Like a Leader, Act Like a Defender:</strong> Cybersecurity incident response & defense<br>
    • <strong>Mastering Critical Thinking in the Age of AI:</strong> Analytical validation and bias identification`;

  /* ===================================================================
     UTILITY FUNCTIONS
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

    // 🗺️ TOUR / WALKTHROUGH
    {
      detect: (msg) => {
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

    // 🎯 SPECIFIC PROJECT BY NUMBER OR NAME (e.g. "tell me about this first project", "project 2")
    {
      detect: (msg) => {
        const lower = msg.toLowerCase();
        return (
          lower.includes('first project') ||
          lower.includes('1st project') ||
          lower.includes('project 1') ||
          lower.includes('task kiosk') ||
          lower.includes('kiosk') ||
          lower.includes('second project') ||
          lower.includes('2nd project') ||
          lower.includes('project 2') ||
          lower.includes('smart helmet') ||
          lower.includes('helmet') ||
          lower.includes('third project') ||
          lower.includes('3rd project') ||
          lower.includes('project 3') ||
          lower.includes('fourth project') ||
          lower.includes('4th project') ||
          lower.includes('project 4') ||
          lower.includes('moriroku')
        );
      },
      respond: (msg) => {
        lastTopic = 'projects';
        const lower = msg.toLowerCase();
        if (lower.includes('first') || lower.includes('1st') || lower.includes('project 1') || lower.includes('task') || lower.includes('kiosk')) {
          return DETAILED_PROJECTS.task;
        }
        if (lower.includes('second') || lower.includes('2nd') || lower.includes('project 2') || lower.includes('helmet')) {
          return DETAILED_PROJECTS.helmet;
        }
        if (lower.includes('third') || lower.includes('3rd') || lower.includes('project 3') || lower.includes('crm') || lower.includes('moriroku')) {
          return DETAILED_PROJECTS.crm;
        }
        if (lower.includes('fourth') || lower.includes('4th') || lower.includes('project 4') || lower.includes('rig') || lower.includes('diagnostic')) {
          return DETAILED_PROJECTS.rigs;
        }
        return DETAILED_PROJECTS.task;
      }
    },

    // 🎉 HIRE / JOB OFFER
    {
      detect: (msg, tokens) =>
        tokens.some(t => ['hired', 'hire', 'offer', 'offered', 'position', 'recruit', 'onboard', 'selected', 'congrats', 'congratulations', 'welcome'].includes(t)),
      respond: (msg) => {
        lastTopic = 'hire';
        const email = extractEmail(msg);
        const phone = extractPhone(msg);
        if (email && phone) {
          return `🎉 <strong>That's fantastic news!</strong> John will immediately reach out to you at <strong>${email}</strong> or <strong>${phone}</strong>. Looking forward to speaking!`;
        } else if (email) {
          return `🎉 <strong>Amazing!</strong> John is thrilled about the opportunity and will contact you directly at <strong>${email}</strong> very soon. Thank you!`;
        } else if (phone) {
          return `🎉 <strong>Wonderful!</strong> John will contact you at <strong>${phone}</strong> shortly. Thank you for connecting!`;
        } else {
          return `🎉 <strong>Thank you!</strong> John is open for technical opportunities. You can email him at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a> or call <a href='tel:+63971727130' class='chat-link'>+63971727130</a>.`;
        }
      }
    },

    // 📬 STANDALONE CONTACT DROP
    {
      detect: (msg) => {
        const hasEmail = !!extractEmail(msg);
        const hasPhone = !!extractPhone(msg);
        const lower = msg.toLowerCase();
        const isStatement = lower.includes('contact') || lower.includes('reach') || lower.includes('call') || lower.includes('email') || lower.includes('me at') || lower.includes('reach me') || lower.includes('here');
        return (hasEmail || hasPhone) && isStatement;
      },
      respond: (msg) => {
        lastTopic = 'contact';
        const email = extractEmail(msg);
        const phone = extractPhone(msg);
        const contactStr = [email, phone].filter(Boolean).join(' or ');
        return `Got it! John will follow up with you at <strong>${contactStr}</strong>. You can also reach him at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>.`;
      }
    },

    // 👋 GREETINGS
    {
      detect: (_, tokens) => tokens.some(t => ['hi', 'hello', 'hey', 'sup', 'yo', 'howdy', 'greetings', 'hiya'].includes(t)),
      respond: () => `Hey there! 👋 I'm <strong>JB-Assist</strong>, John's portfolio AI. Ask me directly about his <strong>skills, projects, experience, education, certificates</strong>, or how to <strong>contact/hire him</strong>!`
    },

    // 🙏 THANKS
    {
      detect: (_, tokens) => tokens.some(t => ['thanks', 'thank', 'thankyou', 'ty', 'thx', 'appreciate', 'cheers'].includes(t)),
      respond: () => `You're very welcome! If you'd like to get in touch with John, he's available at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>.`
    },

    // 🤖 WHO IS THE BOT (Strict exact match to avoid stealing "what are..." questions)
    {
      detect: (msg) => {
        const lower = msg.toLowerCase().trim().replace(/[?!.]/g, '');
        return (
          lower === 'who are you' ||
          lower === 'what are you' ||
          lower === 'what is this bot' ||
          lower === 'are you ai' ||
          lower === 'who made you' ||
          lower === 'bot' ||
          lower === 'ai'
        );
      },
      respond: () => `I'm <strong>JB-Assist</strong> — an AI portfolio assistant for John Bautista. I can give you thorough details on his projects, skills, education, experience, and contact info.`
    },

    // 👍 COMPLIMENTS
    {
      detect: (_, tokens) => tokens.some(t => ['great', 'awesome', 'nice', 'impressive', 'amazing', 'cool', 'excellent', 'wow'].includes(t)),
      respond: () => `Thank you! John takes great pride in engineering solid solutions. You can reach him directly at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>.`
    },
  ];

  /* ===================================================================
     KNOWLEDGE BASE (DIRECT & DETAILED BY DEFAULT)
     =================================================================== */
  const KB = [
    // PROJECTS (Directly provides the full detailed overview)
    {
      topic: 'projects',
      tags: ['project', 'projects', 'work', 'build', 'built', 'create', 'made', 'developed', 'engineering', 'portfolio'],
      answer: FULL_PROJECTS_LIST
    },

    // SKILLS (Directly provides the comprehensive technical breakdown)
    {
      topic: 'skills',
      tags: ['skill', 'skills', 'capable', 'technical', 'tech', 'toolkit', 'know', 'specialize', 'can', 'stack', 'abilities'],
      answer: FULL_SKILLS_LIST
    },
    {
      topic: 'skills',
      tags: ['programming', 'language', 'languages', 'code', 'coding', 'software', 'java', 'python', 'javascript', 'html', 'css', 'script', 'c++'],
      answer: "John's core programming stack includes <strong>Java, C++, Python, HTML5, CSS3, and modern JavaScript (ES6+)</strong>, applied across microcontroller firmware, UI development, and data automation scripts."
    },
    {
      topic: 'skills',
      tags: ['it', 'support', 'hardware', 'diagnostic', 'diagnostics', 'pc', 'computer', 'laptop', 'desktop', 'troubleshoot', 'troubleshooting', 'repair', 'assembly'],
      answer: "John is experienced in <strong>PC assembly, laptop repairs, component multimeter diagnostics, Windows/Linux OS deployment, structured network cabling</strong>, and Microsoft 365 administration."
    },
    {
      topic: 'skills',
      tags: ['automation', 'workflow', 'pipeline', 'pipelines', 'zapier', 'gohighlevel', 'ghl', 'crm', 'invoice', 'sdlc', 'process'],
      answer: "John specializes in <strong>GoHighLevel CRM pipelines and Zapier webhooks</strong> for automating customer follow-ups and billing, alongside comprehensive SDLC procedural documentation."
    },
    {
      topic: 'skills',
      tags: ['embedded', 'iot', 'esp32', 'arduino', 'microcontroller', 'microcontrollers', 'firmware', 'sensor', 'sensors', 'lora', 'lorawan', 'circuit', 'circuits', 'gpio'],
      answer: "John's embedded experience covers <strong>ESP32 & Arduino platforms, embedded C++, sensor bus integration (I2C/SPI), LoRaWAN telemetry with Packetworx</strong>, and schematic design/soldering."
    },
    {
      topic: 'skills',
      tags: ['autocad', 'cad', 'drafting', 'schematic', 'schematics', 'circuit design', 'pcb'],
      answer: "While John's core engineering domains are <strong>Embedded Systems (ESP32), Hardware Diagnostics, IT Support, and Automation</strong>, he works with <strong>circuit schematics, hardware prototyping, and technical documentation</strong>. For specific CAD modeling or drafting inquiries, feel free to contact him directly at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>."
    },

    // EXPERIENCE
    {
      topic: 'experience',
      tags: ['experience', 'timeline', 'career', 'history', 'role', 'job', 'worked', 'company', 'companies', 'intern', 'internship', 'moriroku'],
      answer: FULL_EXPERIENCE_LIST
    },

    // CREDENTIALS / CERTIFICATES
    {
      topic: 'certificates',
      tags: ['certificate', 'certificates', 'certification', 'certifications', 'credential', 'credentials', 'workshop', 'workshops', 'award', 'training', 'verified'],
      answer: FULL_CERTS_LIST
    },

    // IDENTITY & BIOGRAPHY
    {
      topic: 'identity',
      tags: ['name', 'who', 'john', 'bautista', 'person', 'introduce', 'yourself', 'about', 'bio'],
      answer: "<strong>John S. Bautista Jr.</strong> is a Computer Engineering graduate from <strong>Cavite State University – Carmona Campus</strong> (born March 24, 2004). He specializes in embedded systems, IoT architecture, IT support, and automated CRM workflows."
    },
    {
      topic: 'education',
      tags: ['education', 'degree', 'school', 'university', 'college', 'study', 'graduate', 'academic', 'course', 'program', 'csu', 'cavite', 'carmona'],
      answer: "John completed his <strong>Bachelor of Science in Computer Engineering</strong> at <strong>Cavite State University – Carmona Campus</strong>, focusing on hardware systems, microcontroller firmware, and workflow engineering."
    },

    // CONTACT & RESUME
    {
      topic: 'contact',
      tags: ['contact', 'email', 'phone', 'number', 'call', 'reach', 'message', 'connect', 'touch', 'location', 'where', 'based', 'address', 'live'],
      answer: "You can reach John through:<br>• <strong>Email:</strong> <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a><br>• <strong>Phone:</strong> <a href='tel:+63971727130' class='chat-link'>+63971727130</a><br>• <strong>Location:</strong> Sta. Rosa, Laguna, Philippines<br>• <strong>Resume:</strong> <a href='resume/John%20Bautista%20Jr..pdf' target='_blank' class='chat-link'>Download Resume PDF</a>"
    },
    {
      topic: 'contact',
      tags: ['availability', 'available', 'open', 'hiring', 'job', 'opportunity', 'work', 'employ', 'looking', 'hire'],
      answer: "John is <strong>actively open to full-time and project opportunities</strong> in Computer Engineering, Embedded Systems, IoT, IT Support, and Automation. Reach him directly at <a href='mailto:johnbautista1424@gmail.com' class='chat-link'>johnbautista1424@gmail.com</a>."
    },
    {
      topic: 'identity',
      tags: ['resume', 'cv', 'download', 'pdf'],
      answer: "You can view and download his complete resume here: <a href='resume/John%20Bautista%20Jr..pdf' target='_blank' class='chat-link'>📄 Download John Bautista Jr. Resume (PDF)</a>"
    },
    {
      topic: 'identity',
      tags: ['chibi', 'companion', 'mascot', 'character', 'easter egg'],
      answer: "The <strong>companion chibi</strong> is an interactive Easter egg! You can click and drag it around the screen to see its idle, walk, grab, fall, and landing animations."
    }
  ];

  const SUGGESTIONS = [
    "Tell me about his projects",
    "What are John's skills?",
    "What's his experience?",
    "What certifications does he have?",
    "Walk me through the portfolio",
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

    // 1. Check direct intent patterns first (hire, tour, specific project #, etc.)
    for (const intent of INTENTS) {
      if (intent.detect(userInput, tokens)) {
        const answer = intent.respond(userInput, tokens);
        lastAnswer = answer;
        return answer;
      }
    }

    // 2. Score KB
    if (!tokens.length) {
      return "Ask me anything about John's <strong>projects, technical skills, background, experience, or certifications</strong>!";
    }

    const ranked = KB
      .map(e => ({ e, sc: scoreKB(tokens, e) }))
      .filter(x => x.sc > 0)
      .sort((a, b) => b.sc - a.sc);

    if (!ranked.length) {
      return "I can provide details on John's <strong>projects, skills, experience, certifications</strong>, or how to <strong>contact him</strong>. What would you like to know?";
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
    const short = plain.length > 85 ? plain.substring(0, 85) + '…' : plain;
    bubble.innerHTML = `<span>${short}</span>`;
    bubble.classList.add('visible');
    if (chibiBubbleTimer) clearTimeout(chibiBubbleTimer);
    chibiBubbleTimer = setTimeout(() => bubble.classList.remove('visible'), 6500);
  }

  /* ===================================================================
     TERMINAL CHAT UI
     =================================================================== */
  function buildTerminalChat() {
    const panel = document.getElementById('terminal-panel');
    const screen = document.getElementById('terminal-screen');
    if (!panel || !screen) return;

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
        max-width: 95%;
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

    screen.innerHTML = '';

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

    const inputRow = document.createElement('div');
    inputRow.id = 'tc-input-row';
    inputRow.innerHTML = `
      <span id="tc-prompt-label">&gt;_</span>
      <input id="tc-input" type="text" placeholder="Ask about projects, skills, experience..." autocomplete="off" maxlength="200" aria-label="Chat input">
      <button id="tc-send" aria-label="Send">SEND ›</button>
    `;
    panel.insertBefore(inputRow, panel.querySelector('.terminal-footer'));

    const inputEl = document.getElementById('tc-input');
    document.getElementById('tc-send').addEventListener('click', () => handleSend());
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

    const titleEl = panel.querySelector('.term-title');
    if (titleEl) titleEl.textContent = 'JB-ASSIST // AI PORTFOLIO BOT';

    addSystemMsg('> Initializing JB-ASSIST v2.2...');
    setTimeout(() => addSystemMsg('> Diagnostic knowledge base online.'), 400);
    setTimeout(() => {
      const welcome = `Hey! I'm <strong>JB-Assist</strong> 👋 — John's portfolio AI. Ask directly about his <strong>projects, skills, experience, or certifications</strong>, or pick a quick query below!`;
      addBotMsg(welcome);
      showChibiReply(welcome);
    }, 800);

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
      }, 350 + Math.random() * 150);
    }
  }

  /* ===================================================================
     INIT
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
