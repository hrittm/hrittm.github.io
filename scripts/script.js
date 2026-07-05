// Terminal State Management
let cmdHistory = [];
let historyIndex = -1;
let soundEnabled = true;
let crtEnabled = true;
let isSudoPasswordState = false;
let canvasAnimationId = null;
let currentVizType = 'matrix';

// Command list for autocomplete
const COMMANDS = ['help', 'about', 'skills', 'projects', 'contact', 'math', 'theme', 'crt', 'clicks', 'clear', 'gui', 'exit', 'sudo'];
const THEMES = ['dracula', 'matrix', 'nord', 'vaporwave', 'dos'];

// DOM Elements
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const inputDisplay = document.getElementById('input-display');
const customCaret = document.getElementById('custom-caret');
const inputLineContainer = document.getElementById('input-line-container');
const terminalScreen = document.getElementById('terminal-screen');
const canvasContainer = document.getElementById('canvas-container');
const mathCanvas = document.getElementById('math-canvas');
const closeCanvasBtn = document.getElementById('close-canvas');

// Sound Synthesis using Web Audio API
let audioCtx = null;

function playKeySound(isSpecial = false) {
  if (!soundEnabled) return;
  
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    
    // Synthesize Mechanical click (Transient Noise + Tone)
    // 1. Oscillator Tone sweep
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isSpecial ? 140 : 260, now);
    osc.frequency.exponentialRampToValueAtTime(isSpecial ? 70 : 130, now + 0.03);
    
    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.03);

    // 2. High Frequency Snap (Noise)
    const bufferSize = audioCtx.sampleRate * 0.008; // 8ms noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = isSpecial ? 1200 : 3500;
    filter.Q.value = 8;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.04, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    noise.start(now);
    noise.stop(now + 0.008);
  } catch (e) {
    console.error("Audio synthesis error", e);
  }
}

// Autofocus & Cursor Management
function focusInput() {
  terminalInput.focus();
}

// Click anywhere on screen to focus input
document.addEventListener('click', (e) => {
  if (e.target !== canvasContainer && !canvasContainer.contains(e.target) && e.target !== closeCanvasBtn) {
    focusInput();
  }
});

terminalInput.addEventListener('input', (e) => {
  if (isSudoPasswordState) {
    inputDisplay.textContent = '•'.repeat(terminalInput.value.length);
  } else {
    inputDisplay.textContent = terminalInput.value;
  }
});

// Helper to write lines to terminal
function writeOutputRow(cmd, outputHtml, isCommandInput = false) {
  const row = document.createElement('div');
  row.className = 'command-history-row';
  
  if (isCommandInput) {
    row.innerHTML = `
      <div class="command-line">
        <span class="prompt">${isSudoPasswordState ? '[sudo] password for hrittm:' : 'hrittm@dev:~$'}</span>
        <span class="entered-cmd">${escapeHtml(cmd)}</span>
      </div>
    `;
  } else {
    row.innerHTML = `<div class="output-content">${outputHtml}</div>`;
  }
  
  terminalOutput.appendChild(row);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

// Welcome Screen Init
function showWelcome() {
  const banner = `
 __    __  .______       __  .___________.___________. ___  ______   __  ___ 
|  |  |  | |   _  \\     |  | |           |           |/   |/      | |  |/  / 
|  |__|  | |  |_)  |    |  | \`---|  |----\`---|  |----/  /|  ,----' |  '  /  
|   __   | |      /     |  |     |  |        |  |   /  /_|  |      |    <   
|  |  |  | |  |\\  \\----.|  |     |  |        |  |  /  /  |  \`----. |  .  \\  
|__|  |__| | _| \`._____||__|     |__|        |__| /__/   |_______| |__|\\__\\ 
                                                                            
`;
  
  const bio = `
Welcome to hrittick.is-a.dev (Linux x86_64)

* Portfolio:   https://hrittick.vercel.app (Visual Showcase)
* Status:      Undefined (student)
* Core Tech:   Python, C, Bash Scripting, React & TypeScript
* Passions:    Problem Solving (not nerd), Football, Photography

Type <span class="command-highlight">help</span> to view available shell commands. Try <span class="command-highlight">math viz</span> to launch math canvas animations.
`;
  
  writeOutputRow("", `<pre class="welcome-banner">${banner}</pre>`);
  writeOutputRow("", `<div class="welcome-bio">${bio}</div>`);
}

// Command Processing
function processCommand(cmdLine) {
  const trimmed = cmdLine.trim();
  if (trimmed === '') return;

  // Sudo Password Check
  if (isSudoPasswordState) {
    isSudoPasswordState = false;
    inputLineContainer.querySelector('.prompt-symbol').textContent = 'hrittm@dev:~$';
    
    writeOutputRow("", "<span class=" + '"warning-text"' + ">nice try, guest. This incident has been reported to the math gods.</span>");
    return;
  }

  cmdHistory.push(cmdLine);
  historyIndex = cmdHistory.length;

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'help':
      executeHelp();
      break;
    case 'about':
      executeAbout();
      break;
    case 'skills':
      executeSkills();
      break;
    case 'projects':
      executeProjects();
      break;
    case 'contact':
      executeContact();
      break;
    case 'clear':
      terminalOutput.innerHTML = '';
      break;
    case 'crt':
      executeCrt();
      break;
    case 'clicks':
      executeClicks();
      break;
    case 'gui':
      writeOutputRow("", "Opening main graphical site in new tab... (<a href='https://hrittick.vercel.app' target='_blank' class='link-highlight'>https://hrittick.vercel.app</a>)");
      window.open('https://hrittick.vercel.app', '_blank');
      break;
    case 'exit':
      writeOutputRow("", "Terminating terminal session. Redirecting to vercel app...");
      setTimeout(() => {
        window.location.href = 'https://hrittick.vercel.app';
      }, 800);
      break;
    case 'theme':
      executeTheme(args);
      break;
    case 'math':
      executeMath(args);
      break;
    case 'sudo':
      executeSudo();
      break;
    default:
      writeOutputRow("", `shell: command not found: <span class="warning-text">${escapeHtml(command)}</span>. Type <span class="command-highlight">help</span> to view commands.`);
  }
}

// Command Implementations
function executeHelp() {
  const helpHtml = `
Available shell commands:
  <span class="command-highlight">about</span>       - Bio information of @hrittm
  <span class="command-highlight">skills</span>      - Ascii chart of skills & languages
  <span class="command-highlight">projects</span>    - Open source software works (EdVault, dotfiles)
  <span class="command-highlight">contact</span>     - Social platforms, e-mail contacts
  <span class="command-highlight">math</span>        - Execute calculations or launch visualizers
                Usage:
                  <span class="command-highlight">math fib [n]</span>        - Calculate Fibonacci numbers
                  <span class="command-highlight">math prime [n]</span>      - Find prime numbers up to n
                  <span class="command-highlight">math viz [type]</span>     - Start canvas animation overlay
                                        (types: <span class="command-highlight">matrix</span>, <span class="command-highlight">tree</span>, <span class="command-highlight">lorenz</span>)
  <span class="command-highlight">theme</span>       - Switch color theme
                Usage: <span class="command-highlight">theme [name]</span>   (Themes: matrix, dracula, nord, vaporwave, dos)
  <span class="command-highlight">crt</span>         - Toggle retro scanlines and monitor flicker effect
  <span class="command-highlight">clicks</span>      - Toggle mechanical keyboard click sound effects
  <span class="command-highlight">clear</span>       - Clear shell console buffer
  <span class="command-highlight">gui</span>         - Open graphical portfolio website (hrittick.vercel.app)
  <span class="command-highlight">exit</span>        - Close terminal and return to Vercel page
  <span class="command-highlight">sudo</span>        - Request admin permissions
`;
  writeOutputRow("", helpHtml);
}

function executeAbout() {
  const aboutHtml = `
Hi, I'm Hrittick (@hrittm)! 👋

I am a student from Bangladesh. I enjoy writing code, customizing my Linux system, solving challenging problems, playing football, and taking photos.
I love exploring how math, physics, and computer systems work together, but I try to keep it fun and practical.
`;
  writeOutputRow("", aboutHtml);
}

function executeSkills() {
  const skillsHtml = `
<span class="title-text">Skills Registry:</span>
/home/hrittick/skills
├── languages
│   ├── Python (Core, scripting & automation)
│   ├── C (Problem solving & algorithms)
│   ├── Bash (System scripting & utilities)
│   └── JavaScript / TypeScript (React & Web development)
├── tools-and-ops
│   ├── Linux (Custom setups, window managers & dotfiles)
│   └── Git & GitHub (Open-source collaboration)
└── core-interests
    ├── Math & Logic
    ├── Physics
    ├── Football
    └── Photography
`;
  writeOutputRow("", skillsHtml);
}

function executeProjects() {
  const projectsHtml = `
<span class="title-text">Developer Projects:</span>

1. <span class="command-highlight">EdVault</span>
   An open-source educational platform designed to provide personalized learning experiences using AI.
   Link: <a href="https://github.com/hrittm/EdVault" target="_blank" class="link-highlight">github.com/hrittm/EdVault</a>

2. <span class="command-highlight">Dotfiles</span>
   Minimalist and highly efficient custom configs for Linux window managers (keybindings, setups, styling).
   Link: <a href="https://github.com/hrittm/dotfiles" target="_blank" class="link-highlight">github.com/hrittm/dotfiles</a>

3. <span class="command-highlight">hrittick.vercel.app</span>
   My main visual page showcasing portfolio milestones.
   Link: <a href="https://hrittick.vercel.app" target="_blank" class="link-highlight">hrittick.vercel.app</a>
`;
  writeOutputRow("", projectsHtml);
}

function executeContact() {
  const contactHtml = `
<span class="title-text">Networking Channels:</span>

• Email:       <a href="mailto:thathrimondal@gmail.com" class="link-highlight">thathrimondal@gmail.com</a>
• GitHub:      <a href="https://github.com/hrittm" target="_blank" class="link-highlight">github.com/hrittm</a>
• Twitter:     <a href="https://x.com/hrittm" target="_blank" class="link-highlight">x.com/hrittm</a>
• Instagram:   <a href="https://www.instagram.com/0xhrit/" target="_blank" class="link-highlight">instagram.com/0xhrit</a>
`;
  writeOutputRow("", contactHtml);
}

function executeTheme(args) {
  if (args.length === 0) {
    writeOutputRow("", `Usage: <span class="command-highlight">theme [name]</span>. Themes: ${THEMES.map(t => `<span class="command-highlight">${t}</span>`).join(', ')}`);
    return;
  }

  const selectedTheme = args[0].toLowerCase();
  if (THEMES.includes(selectedTheme)) {
    THEMES.forEach(t => document.body.classList.remove(`theme-${t}`));
    document.body.classList.add(`theme-${selectedTheme}`);
    writeOutputRow("", `Color theme updated to <span class="success-text">${selectedTheme}</span>.`);
  } else {
    writeOutputRow("", `Theme <span class="warning-text">${escapeHtml(selectedTheme)}</span> not found. Choose from: ${THEMES.join(', ')}`);
  }
}

function executeCrt() {
  crtEnabled = !crtEnabled;
  if (crtEnabled) {
    document.body.classList.add('crt-active');
  } else {
    document.body.classList.remove('crt-active');
  }
  writeOutputRow("", `Retro CRT Scanline Filter: <span class="success-text">${crtEnabled ? 'ENABLED' : 'DISABLED'}</span>`);
}

function executeClicks() {
  soundEnabled = !soundEnabled;
  writeOutputRow("", `Mechanical Keyboard Sound Effects: <span class="success-text">${soundEnabled ? 'ENABLED' : 'DISABLED'}</span>`);
}

function executeSudo() {
  isSudoPasswordState = true;
  inputLineContainer.querySelector('.prompt-symbol').textContent = '[sudo] password for hrittm:';
  inputDisplay.textContent = '';
  terminalInput.value = '';
}

// Math Solver
function executeMath(args) {
  if (args.length === 0) {
    writeOutputRow("", "Usage:<br>  <span class=" + '"command-highlight"' + ">math fib [n]</span> - Calculate fibonacci sequence up to element n (max 100)<br>  <span class=" + '"command-highlight"' + ">math prime [n]</span> - List prime numbers up to n (max 5000)<br>  <span class=" + '"command-highlight"' + ">math viz [matrix|tree|lorenz]</span> - Open HTML5 canvas math animation");
    return;
  }

  const subCommand = args[0].toLowerCase();
  const val = args[1];

  if (subCommand === 'fib') {
    let n = parseInt(val) || 10;
    if (n < 1) n = 1;
    if (n > 100) {
      writeOutputRow("", "<span class=" + '"warning-text"' + ">Fibonacci is capped at 100 for output readability.</span>");
      n = 100;
    }
    
    let fib = [0, 1];
    for (let i = 2; i <= n; i++) {
      if (i > 75) {
        fib.push(BigInt(fib[i-1]) + BigInt(fib[i-2]));
      } else {
        fib.push(fib[i-1] + fib[i-2]);
      }
    }
    
    let result = `<span class="title-text">Fibonacci Sequence up to ${n}:</span><br>`;
    const displayArr = fib.slice(0, n + 1);
    result += displayArr.map((v, idx) => `F(${idx}) = ${v.toString()}`).join('<br>');
    writeOutputRow("", result);
    
  } else if (subCommand === 'prime') {
    let limit = parseInt(val) || 100;
    if (limit < 2) limit = 2;
    if (limit > 5000) {
      writeOutputRow("", "<span class=" + '"warning-text"' + ">Primes capped at 5000 for output bounds.</span>");
      limit = 5000;
    }
    
    let sieve = Array(limit + 1).fill(true);
    sieve[0] = sieve[1] = false;
    for (let i = 2; i * i <= limit; i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= limit; j += i) {
          sieve[j] = false;
        }
      }
    }
    
    let primes = [];
    sieve.forEach((isPrime, num) => {
      if (isPrime) primes.push(num);
    });
    
    let result = `<span class="title-text">Primes up to ${limit} (Total: ${primes.length}):</span><br>`;
    result += primes.join(', ');
    writeOutputRow("", result);
    
  } else if (subCommand === 'viz') {
    let vizType = val ? val.toLowerCase() : 'matrix';
    if (!['matrix', 'tree', 'lorenz'].includes(vizType)) {
      writeOutputRow("", `Unknown visualization: <span class="warning-text">${escapeHtml(vizType)}</span>. Initializing matrix.`);
      vizType = 'matrix';
    }
    startVisualization(vizType);
  } else {
    writeOutputRow("", `math: unknown operator: <span class="warning-text">${escapeHtml(subCommand)}</span>. Options: fib, prime, viz.`);
  }
}

// Canvas Visualizer Engine
function startVisualization(type) {
  currentVizType = type;
  canvasContainer.style.display = 'flex';
  
  if (canvasAnimationId) {
    cancelAnimationFrame(canvasAnimationId);
  }
  
  resizeCanvas();
  
  if (type === 'matrix') {
    initMatrixRain();
  } else if (type === 'tree') {
    initFractalTree();
  } else if (type === 'lorenz') {
    initLorenzAttractor();
  }
}

function stopVisualization() {
  canvasContainer.style.display = 'none';
  if (canvasAnimationId) {
    cancelAnimationFrame(canvasAnimationId);
    canvasAnimationId = null;
  }
  focusInput();
}

closeCanvasBtn.addEventListener('click', stopVisualization);

function resizeCanvas() {
  if (canvasContainer.style.display === 'flex') {
    mathCanvas.width = window.innerWidth;
    mathCanvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', resizeCanvas);

// Dynamic theme color getters
function getThemeColor() {
  const style = getComputedStyle(document.body);
  return style.getPropertyValue('--cursor-color').trim() || '#00ff41';
}

function getThemeAccent() {
  const style = getComputedStyle(document.body);
  return style.getPropertyValue('--accent-color').trim() || '#00ff41';
}

// VISUALIZATION 1: Matrix Code Rain
function initMatrixRain() {
  const ctx = mathCanvas.getContext('2d');
  const width = mathCanvas.width;
  const height = mathCanvas.height;
  
  const fontSize = 14;
  const columns = Math.floor(width / fontSize);
  const drops = Array(columns).fill(1);
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ数学πΩΣ√∫λ";
  
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = getThemeColor();
    ctx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    
    canvasAnimationId = requestAnimationFrame(draw);
  }
  
  draw();
}

// VISUALIZATION 2: Fractal Tree
function initFractalTree() {
  const ctx = mathCanvas.getContext('2d');
  let angle = 0;
  let offset = 0;
  
  function draw() {
    const width = mathCanvas.width;
    const height = mathCanvas.height;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = getThemeColor();
    ctx.lineWidth = 2;
    
    ctx.translate(width / 2, height);
    offset += 0.015;
    angle = (Math.PI / 4) + Math.sin(offset) * 0.08;
    
    drawBranch(Math.min(height * 0.28, 120));
    
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
    canvasAnimationId = requestAnimationFrame(draw);
  }
  
  function drawBranch(len) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();
    ctx.translate(0, -len);
    
    if (len > 8) {
      ctx.save();
      ctx.rotate(angle);
      drawBranch(len * 0.72);
      ctx.restore();
      
      ctx.save();
      ctx.rotate(-angle);
      drawBranch(len * 0.72);
      ctx.restore();
    }
  }
  
  draw();
}

// VISUALIZATION 3: Lorenz Attractor
function initLorenzAttractor() {
  const ctx = mathCanvas.getContext('2d');
  
  let x = 0.1, y = 0, z = 0;
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;
  const dt = 0.01;
  
  let points = [];
  const maxPoints = 1200;
  
  function draw() {
    const width = mathCanvas.width;
    const height = mathCanvas.height;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, width, height);
    
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    
    x += dx;
    y += dy;
    z += dz;
    
    points.push({ x, y, z });
    if (points.length > maxPoints) {
      points.shift();
    }
    
    ctx.beginPath();
    ctx.strokeStyle = getThemeColor();
    ctx.lineWidth = 1.5;
    
    const scale = Math.min(width, height) / 60;
    
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      
      const angle = Date.now() * 0.0003;
      const rx1 = p1.x * Math.cos(angle) - p1.y * Math.sin(angle);
      const ry1 = p1.z - 25;
      const rx2 = p2.x * Math.cos(angle) - p2.y * Math.sin(angle);
      const ry2 = p2.z - 25;
      
      const screenX1 = width / 2 + rx1 * scale;
      const screenY1 = height / 2 - ry1 * scale;
      const screenX2 = width / 2 + rx2 * scale;
      const screenY2 = height / 2 - ry2 * scale;
      
      if (i === 1) ctx.moveTo(screenX1, screenY1);
      ctx.lineTo(screenX2, screenY2);
    }
    
    ctx.stroke();
    
    if (points.length > 0) {
      const latest = points[points.length - 1];
      const angle = Date.now() * 0.0003;
      const rx = latest.x * Math.cos(angle) - latest.y * Math.sin(angle);
      const ry = latest.z - 25;
      
      ctx.beginPath();
      ctx.arc(width / 2 + rx * scale, height / 2 - ry * scale, 4, 0, 2 * Math.PI);
      ctx.fillStyle = getThemeAccent();
      ctx.fill();
    }
    
    canvasAnimationId = requestAnimationFrame(draw);
  }
  
  draw();
}

// Input Key Events
terminalInput.addEventListener('keydown', (e) => {
  const inputVal = terminalInput.value;
  
  // 1. Enter Key - Submit
  if (e.key === 'Enter') {
    playKeySound(true);
    writeOutputRow(inputVal, "", true);
    
    processCommand(inputVal);
    
    terminalInput.value = '';
    inputDisplay.textContent = '';
    return;
  }
  
  // 2. Tab Key - Autocomplete
  if (e.key === 'Tab') {
    e.preventDefault();
    if (isSudoPasswordState) return;
    
    const parts = inputVal.split(/\s+/);
    const lastWord = parts[parts.length - 1];
    
    if (parts.length === 1 && lastWord.length > 0) {
      const match = COMMANDS.find(c => c.startsWith(lastWord.toLowerCase()));
      if (match) {
        terminalInput.value = match;
        inputDisplay.textContent = match;
        playKeySound(true);
      }
    } else if (parts.length === 2 && parts[0].toLowerCase() === 'theme' && lastWord.length > 0) {
      const match = THEMES.find(t => t.startsWith(lastWord.toLowerCase()));
      if (match) {
        terminalInput.value = `theme ${match}`;
        inputDisplay.textContent = `theme ${match}`;
        playKeySound(true);
      }
    } else if (parts.length === 3 && parts[0].toLowerCase() === 'math' && parts[1].toLowerCase() === 'viz' && lastWord.length > 0) {
      const match = ['matrix', 'tree', 'lorenz'].find(v => v.startsWith(lastWord.toLowerCase()));
      if (match) {
        terminalInput.value = `math viz ${match}`;
        inputDisplay.textContent = `math viz ${match}`;
        playKeySound(true);
      }
    }
    return;
  }
  
  // 3. Arrow Up - History Back
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (cmdHistory.length > 0 && historyIndex > 0) {
      historyIndex--;
      terminalInput.value = cmdHistory[historyIndex];
      inputDisplay.textContent = cmdHistory[historyIndex];
      playKeySound(true);
    }
    return;
  }
  
  // 4. Arrow Down - History Forward
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
      historyIndex++;
      terminalInput.value = cmdHistory[historyIndex];
      inputDisplay.textContent = cmdHistory[historyIndex];
      playKeySound(true);
    } else if (historyIndex === cmdHistory.length - 1) {
      historyIndex = cmdHistory.length;
      terminalInput.value = '';
      inputDisplay.textContent = '';
      playKeySound(true);
    }
    return;
  }
  
  // 5. Sound Effects
  if (e.key.length === 1) {
    playKeySound(e.key === ' ');
  } else if (e.key === 'Backspace') {
    playKeySound(true);
  }
});

// Escape key closes visualizer
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && canvasContainer.style.display === 'flex') {
    stopVisualization();
  }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('crt-active');
  showWelcome();
  focusInput();
});
