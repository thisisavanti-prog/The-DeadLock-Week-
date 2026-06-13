/* =========================================
   DEADLOCK.WEEK // SYSTEM TELEMETRY ENGINE
   VANTAGE WORKS ARCHITECTURE
   ========================================= */

// Default DeadLock Quest Baseline
const defaultTasks = [
    { id: 1, text: "Pray 5 times a day", completed: false },
    { id: 2, text: "No Fap", completed: false },
    { id: 3, text: "Complete Block-1 exam syllabi", completed: false },
    { id: 4, text: "Exercise everyday (Progressive Overload)", completed: false },
    { id: 5, text: "Complete academic projects/assignments", completed: false }
];

// Fetch from LocalStorage or load defaults
let tasks = JSON.parse(localStorage.getItem('deadlock_db')) || defaultTasks;

// DOM Element Anchors
const taskListEl = document.getElementById('task-list');
const formEl = document.getElementById('task-form');
const inputEl = document.getElementById('new-task-input');
const readoutEl = document.getElementById('telemetry-readout');
const barEl = document.getElementById('telemetry-bar');

// Color Anchors for Linear Interpolation (Lerp)
const cStart = { r: 74, g: 65, b: 42 };     // Pantone 448C (The Sludge)
const cEnd = { r: 0, g: 229, b: 255 };      // Vantage Cobalt Blue (The Horizon)

function saveAndRender() {
    localStorage.setItem('deadlock_db', JSON.stringify(tasks));
    renderTasks();
    updateTelemetry();
}

function renderTasks() {
    taskListEl.innerHTML = '';
    tasks.forEach(task => {
        const row = document.createElement('div');
        row.className = `task-row ${task.completed ? 'completed' : ''}`;
        
        row.innerHTML = `
            <div class="checkbox-container">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            </div>
            <div class="task-text">${task.text}</div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
        `;
        taskListEl.appendChild(row);
    });
}

// Global functions for inline HTML event handlers
window.toggleTask = function(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
};

window.deleteTask = function(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
};

formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });
    
    inputEl.value = '';
    saveAndRender();
});

function updateTelemetry() {
    if (tasks.length === 0) {
        applyGradient(0);
        return;
    }

    const completed = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completed / tasks.length) * 100);

    readoutEl.innerText = `${percentage}% ACCRETED`;
    barEl.style.width = `${percentage}%`;

    applyGradient(percentage);
}

function applyGradient(percent) {
    const ratio = percent / 100;
    
    // Mathematical Blending of RGB values
    const currentR = Math.round(cStart.r + (cEnd.r - cStart.r) * ratio);
    const currentG = Math.round(cStart.g + (cEnd.g - cStart.g) * ratio);
    const currentB = Math.round(cStart.b + (cEnd.b - cStart.b) * ratio);

    // Apply directly to the document body background
    document.body.style.background = `linear-gradient(135deg, rgb(${currentR}, ${currentG}, ${currentB}), var(--void-bg))`;
}

// Initialize System Engine on Boot
saveAndRender();
  
