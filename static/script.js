// Constants
const DEFAULT_BORDER_COLOR = '#333333';
const USERNAME = 's1z1-balance';
const UTC_OFFSET = 1; // UTC+1 offset in hours

// DOM Elements
const borderMode = document.getElementById('borderMode');
const frame = document.getElementById('frame');
const customControls = document.getElementById('customControls');
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const commandInput = document.getElementById('commandInput');
const output = document.getElementById('output');
const terminal = document.querySelector('.terminal');
const terminalHeader = document.querySelector('.terminal-header');
const terminalContent = document.querySelector('.terminal-content');

// Dragging functionality
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Selected files storage
let selectedFiles = new Set();

// Function to format date in YYYY-MM-DD HH:MM:SS format with UTC+1
function formatDate(date) {
    // Add UTC_OFFSET hours to the current time
    const utcPlusOne = new Date(date.getTime() + (UTC_OFFSET * 60 * 60 * 1000));
    
    const year = utcPlusOne.getUTCFullYear();
    const month = String(utcPlusOne.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utcPlusOne.getUTCDate()).padStart(2, '0');
    const hours = String(utcPlusOne.getUTCHours()).padStart(2, '0');
    const minutes = String(utcPlusOne.getUTCMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Function to get current UTC+1 time
function getCurrentUTCPlusOneTime() {
    return formatDate(new Date());
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateBorderStyle('solid');
    commandInput.focus();
    
    const welcomeMessage = 
`Current Time: ${getCurrentUTCPlusOneTime()}
User's Login: ${USERNAME}

Welcome to the terminal. Type 'help' for available commands...`;
    
    output.innerHTML = `<p>${welcomeMessage}</p>`;
});

// Command handling
const commands = {
    help: () => ({
        status: 'success',
        output: `Available commands:
  help   - Show this help message
  clear  - Clear terminal
  echo   - Echo the input
  date   - Show current date and time (UTC+1)
  whoami - Show current user
  border - Show current border settings`
    }),
    clear: () => {
        output.innerHTML = '';
        return { status: 'success', customAction: 'clear' };
    },
    echo: (args) => ({
        status: 'success',
        output: args.join(' ')
    }),
    date: () => ({
        status: 'success',
        output: getCurrentUTCPlusOneTime()
    }),
    whoami: () => ({
        status: 'success',
        output: USERNAME
    }),
    border: () => ({
        status: 'success',
        output: `Current border settings:
Mode: ${borderMode.value}
Color 1: ${color1.value}
Color 2: ${color2.value}`
    })
};
// Command execution
function executeCommand(commandStr) {
    const args = commandStr.trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    
    const commandElement = document.createElement('div');
    commandElement.textContent = `$ ${commandStr}`;
    output.appendChild(commandElement);
    
    if (commands[command]) {
        const result = commands[command](args);
        
        if (result.customAction !== 'clear') {
            const outputElement = document.createElement('div');
            outputElement.classList.add(result.status);
            outputElement.textContent = result.output;
            output.appendChild(outputElement);
            
            const spacerElement = document.createElement('div');
            spacerElement.style.height = '5px';
            output.appendChild(spacerElement);
        }
    } else {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error');
        errorElement.textContent = `Command not found: ${command}`;
        output.appendChild(errorElement);
    }
    
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

// Command history
let commandHistory = [];
let historyIndex = -1;

// Input handling
commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command) {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            executeCommand(command);
            commandInput.value = '';
        }
        e.preventDefault();
    } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            commandInput.value = commandHistory[historyIndex];
            setTimeout(() => {
                commandInput.selectionStart = commandInput.selectionEnd = commandInput.value.length;
            }, 0);
        }
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            commandInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            commandInput.value = '';
        }
        e.preventDefault();
    }
});

// Border style management
function updateBorderStyle(mode) {
    let gradient;
    
    switch(mode) {
        case 'solid':
            gradient = `linear-gradient(${color1.value || DEFAULT_BORDER_COLOR}, ${color1.value || DEFAULT_BORDER_COLOR})`;
            customControls.style.display = 'none';
            break;
        case 'rainbow':
            gradient = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)';
            customControls.style.display = 'none';
            break;
        case 'custom':
            gradient = `linear-gradient(90deg, ${color1.value}, ${color2.value})`;
            customControls.style.display = 'flex';
            break;
    }
    
    frame.style.setProperty('--gradient-colors', gradient);
}



// Event listeners for border controls
borderMode.addEventListener('change', (e) => {
    updateBorderStyle(e.target.value);
});

color1.addEventListener('input', () => {
    if (borderMode.value === 'custom' || borderMode.value === 'solid') {
        updateBorderStyle(borderMode.value);
    }
});

color2.addEventListener('input', () => {
    if (borderMode.value === 'custom') {
        updateBorderStyle(borderMode.value);
    }
});

// Dragging functionality
function setTranslate(xPos, yPos) {
    terminal.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

function dragStart(e) {
    if (e.target.tagName.toLowerCase() === 'select' || 
        e.target.classList.contains('control-button')) {
        return;
    }
    
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === terminalHeader || e.target.parentElement === terminalHeader) {
        isDragging = true;
        terminalHeader.style.cursor = 'grabbing';
    }
}

function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    terminalHeader.style.cursor = 'grab';
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        setTranslate(currentX, currentY);
    }
}

// Mouse event listeners for dragging
terminalHeader.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

// Double click to center
terminalHeader.addEventListener('dblclick', () => {
    xOffset = 0;
    yOffset = 0;
    setTranslate(0, 0);
});

// Prevent terminal focus stealing
[color1, color2, borderMode, customControls].forEach(element => {
    element.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Keep focus on input unless selecting text
terminal.addEventListener('click', (e) => {
    if (!window.getSelection().toString() && 
        !e.target.closest('#customControls') && 
        !e.target.closest('#borderMode')) {
        commandInput.focus();
    }
});