document.addEventListener('DOMContentLoaded', function() {
    const terminalWindow = document.getElementById('terminal-window');
    const terminalHeader = document.getElementById('terminal-header');
    const terminal = document.getElementById('terminal-content');
    const commandInput = document.getElementById('command-input');
    const closeButton = document.getElementById('close-button');
    const minimizeButton = document.getElementById('minimize-button');
    const maximizeButton = document.getElementById('maximize-button');
    const nanoEditor = document.querySelector('.nano-editor');
    const nanoHeader = document.querySelector('.nano-header');
    const nanoTextarea = document.querySelector('.nano-textarea');

    let commandHistory = [];
    let historyIndex = -1;
    let isDragging = false;
    let isMaximized = false;
    let originalStyles = {};
    let currentEditingFile = null;

    // Window Management
    function centerWindow() {
        const windowWidth = terminalWindow.offsetWidth;
        const windowHeight = terminalWindow.offsetHeight;
        terminalWindow.style.left = `${(window.innerWidth - windowWidth) / 2}px`;
        terminalWindow.style.top = `${(window.innerHeight - windowHeight) / 2}px`;
    }

    function initializeWindowDragging() {
        terminalHeader.addEventListener('mousedown', (e) => {
            if (e.target === terminalHeader || e.target.id === 'terminal-title') {
                isDragging = true;
                const rect = terminalWindow.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;

                function handleMouseMove(e) {
                    if (isDragging && !isMaximized) {
                        const x = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - rect.width));
                        const y = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - rect.height));
                        terminalWindow.style.left = `${x}px`;
                        terminalWindow.style.top = `${y}px`;
                    }
                }

                function handleMouseUp() {
                    isDragging = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                }

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }
        });
    }

    // Terminal Functions
    function clearTerminal() {
        terminal.innerHTML = '';
    }

    function processANSIColor(text) {
        const colorCodes = {
            '\x1B[30m': 'ansi-black',
            '\x1B[31m': 'ansi-red',
            '\x1B[32m': 'ansi-green',
            '\x1B[33m': 'ansi-yellow',
            '\x1B[34m': 'ansi-blue',
            '\x1B[35m': 'ansi-magenta',
            '\x1B[36m': 'ansi-cyan',
            '\x1B[37m': 'ansi-white',
            '\x1B[1;30m': 'ansi-bright-black',
            '\x1B[1;31m': 'ansi-bright-red',
            '\x1B[1;32m': 'ansi-bright-green',
            '\x1B[1;33m': 'ansi-bright-yellow',
            '\x1B[1;34m': 'ansi-bright-blue',
            '\x1B[1;35m': 'ansi-bright-magenta',
            '\x1B[1;36m': 'ansi-bright-cyan',
            '\x1B[1;37m': 'ansi-bright-white'
        };

        let result = text;
        for (const [code, className] of Object.entries(colorCodes)) {
            result = result.replace(new RegExp(code.replace('[', '\\['), 'g'), `<span class="${className}">`);
        }
        result = result.replace(/\x1B\[0m/g, '</span>');
        return result;
    }

    function addToTerminal(text, isError = false) {
        if (text.includes('\x1B[2J\x1B[H')) {
            clearTerminal();
            return;
        }

        if (text.startsWith('NANO_OPEN|')) {
            const [_, filename, content] = text.split('|');
            openNanoEditor(filename, content);
            return;
        }

        const line = document.createElement('div');
        line.className = 'output-line' + (isError ? ' error' : '');
        line.innerHTML = processANSIColor(text);
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    async function executeCommand(command) {
        if (!command) return;

        if (command.trim().toLowerCase() !== 'clear') {
            addToTerminal('$ ' + command);
        }

        try {
            const response = await fetch('/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: command })
            });

            const data = await response.json();
            if (data.error) {
                addToTerminal(data.error, true);
            } else if (data.output) {
                addToTerminal(data.output);
            }
        } catch (error) {
            addToTerminal('Error executing command: ' + error.message, true);
        }
    }

    // Nano Editor Functions
    function openNanoEditor(filename, content) {
        nanoEditor.style.display = 'block';
        nanoHeader.textContent = `File: ${filename}`;
        nanoTextarea.value = content;
        currentEditingFile = filename;
        nanoTextarea.focus();
    }

    function closeNanoEditor() {
        nanoEditor.style.display = 'none';
        currentEditingFile = null;
        nanoTextarea.value = '';
    }

    async function saveFile() {
        if (!currentEditingFile) return;

        try {
            const response = await fetch('/save_file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: currentEditingFile,
                    content: nanoTextarea.value
                })
            });

            const data = await response.json();
            addToTerminal(data.message);
        } catch (error) {
            addToTerminal('Error saving file: ' + error.message, true);
        }
    }

    // Event Listeners
    closeButton.addEventListener('click', () => {
        terminalWindow.style.display = 'none';
    });

    minimizeButton.addEventListener('click', () => {
        terminalWindow.style.transform = 'scale(0.1)';
        terminalWindow.style.opacity = '0';
        setTimeout(() => {
            terminalWindow.style.transform = 'scale(1)';
            terminalWindow.style.opacity = '1';
        }, 2000);
    });

    maximizeButton.addEventListener('click', () => {
        if (!isMaximized) {
            originalStyles = {
                width: terminalWindow.style.width,
                height: terminalWindow.style.height,
                left: terminalWindow.style.left,
                top: terminalWindow.style.top
            };
            terminalWindow.style.width = '100%';
            terminalWindow.style.height = '100%';
            terminalWindow.style.left = '0';
            terminalWindow.style.top = '0';
            isMaximized = true;
        } else {
            Object.assign(terminalWindow.style, originalStyles);
            isMaximized = false;
        }
    });
    commandInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                await executeCommand(command);
                commandInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                commandInput.value = '';
            }
        }
    });

    // Nano editor keyboard shortcuts
    nanoTextarea.addEventListener('keydown', async (e) => {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'x':
                    e.preventDefault();
                    closeNanoEditor();
                    addToTerminal(`Exit nano`);
                    break;
                case 'o':
                    e.preventDefault();
                    await saveFile();
                    break;
                case 'w':
                    e.preventDefault();
                    addToTerminal(`Current file: ${currentEditingFile}`);
                    break;
            }
        }
    });

    // Auto-focus input when clicking terminal
    terminalWindow.addEventListener('click', (e) => {
        if (e.target !== nanoTextarea) {
            commandInput.focus();
        }
    });

    // Initial setup
    centerWindow();
    initializeWindowDragging();
    addToTerminal('Welcome to Virtual OS Terminal! Type "help" for available commands.');

    // Handle terminal resize
    const resizeObserver = new ResizeObserver(() => {
        terminal.scrollTop = terminal.scrollHeight;
    });
    resizeObserver.observe(terminalWindow);

    // Handle window resize
    window.addEventListener('resize', () => {
        if (isMaximized) {
            terminalWindow.style.width = '100%';
            terminalWindow.style.height = '100%';
        }
    });

    // Prevent terminal window from going off screen
    function keepWindowInBounds() {
        const rect = terminalWindow.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (rect.right > windowWidth) {
            terminalWindow.style.left = `${windowWidth - rect.width}px`;
        }
        if (rect.bottom > windowHeight) {
            terminalWindow.style.top = `${windowHeight - rect.height}px`;
        }
        if (rect.left < 0) {
            terminalWindow.style.left = '0px';
        }
        if (rect.top < 0) {
            terminalWindow.style.top = '0px';
        }
    }

    // Add periodic bounds checking
    setInterval(keepWindowInBounds, 100);

    // Handle copy/paste in terminal
    commandInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');
        const start = commandInput.selectionStart;
        const end = commandInput.selectionEnd;
        const current = commandInput.value;
        commandInput.value = current.substring(0, start) + text + current.substring(end);
        commandInput.selectionStart = commandInput.selectionEnd = start + text.length;
    });

    // Handle special keys
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            executeCommand('clear');
        }
    });

    // Handle terminal focus
    let isFocused = true;
    window.addEventListener('focus', () => {
        isFocused = true;
        commandInput.focus();
    });

    window.addEventListener('blur', () => {
        isFocused = false;
    });

    // Cursor blink effect
    let cursorVisible = true;
    setInterval(() => {
        if (isFocused && document.activeElement === commandInput) {
            cursorVisible = !cursorVisible;
            commandInput.style.opacity = cursorVisible ? '1' : '0.7';
        } else {
            commandInput.style.opacity = '1';
        }
    }, 600);

    // Handle mobile devices
    if ('ontouchstart' in window) {
        terminalWindow.style.width = '100%';
        terminalWindow.style.height = '100%';
        terminalWindow.style.left = '0';
        terminalWindow.style.top = '0';
        isMaximized = true;
    }
});