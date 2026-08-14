// Task data structure
// { id: number, text: string, createdAt: Date, completedAt: Date | null, completed: boolean }

// Application state
let tasks = [];
let nextId = 1;

// DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const searchInput = document.getElementById('search-input');
const pendingTasksList = document.getElementById('pending-tasks');
const completedTasksList = document.getElementById('completed-tasks');
const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        // Find the highest ID to continue from there
        if (tasks.length > 0) {
            nextId = Math.max(...tasks.map(task => task.id)) + 1;
        }
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Add a new task
function addTask(text) {
    // Validate input
    const trimmedText = text.trim();
    if (!trimmedText) {
        alert('Please enter a task.');
        return;
    }
    
    // Create task object
    const newTask = {
        id: nextId++,
        text: trimmedText,
        createdAt: new Date().toISOString(),
        completedAt: null,
        completed: false
    };
    
    // Add to array and save
    tasks.unshift(newTask);
    saveTasks();
    
    // Clear input and render
    taskInput.value = '';
    renderTasks();
}

// Mark task as complete
function completeTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = true;
        task.completedAt = new Date().toISOString();
        saveTasks();
        renderTasks();
    }
}

// Delete a task permanently
function deleteTask(id, confirm = true) {
    if (confirm) {
        showConfirmDialog('Are you sure you want to delete this task?', () => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        });
    } else {
        tasks = tasks.filter(t => t.id === id);
        saveTasks();
        renderTasks();
    }
}

// Edit task text
function startEditTask(id) {
    const taskItem = document.querySelector(`[data-task-id="${id}"]`);
    const taskText = taskItem.querySelector('.task-text');
    const taskActions = taskItem.querySelector('.task-actions');
    
    // Store original text for cancel
    const originalText = taskText.textContent;
    
    // Make text editable
    taskText.contentEditable = true;
    taskText.classList.add('editing');
    taskText.focus();
    
    // Replace action buttons
    taskActions.innerHTML = `
        <button class="task-btn save-btn" data-action="save">Save</button>
        <button class="task-btn cancel-btn" data-action="cancel">Cancel</button>
    `;
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(taskText);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Save button click handler
    const saveBtn = taskActions.querySelector('[data-action="save"]');
    saveBtn.addEventListener('click', () => {
        saveEditTask(id, taskText.textContent, originalText);
    });
    
    // Cancel button click handler
    const cancelBtn = taskActions.querySelector('[data-action="cancel"]');
    cancelBtn.addEventListener('click', () => {
        cancelEditTask(id, originalText);
    });
    
    // Handle Enter key to save
    taskText.addEventListener('keydown', function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEditTask(id, taskText.textContent, originalText);
            taskText.removeEventListener('keydown', handleKeyDown);
        } else if (e.key === 'Escape') {
            cancelEditTask(id, originalText);
            taskText.removeEventListener('keydown', handleKeyDown);
        }
    });
}

// Save edited task
function saveEditTask(id, newText, originalText) {
    const trimmedText = newText.trim();
    
    if (!trimmedText) {
        // If empty, revert to original
        cancelEditTask(id, originalText);
        return;
    }
    
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.text = trimmedText;
        saveTasks();
        renderTasks();
    }
}

// Cancel edit
function cancelEditTask(id, originalText) {
    const taskItem = document.querySelector(`[data-task-id="${id}"]`);
    const taskText = taskItem.querySelector('.task-text');
    
    taskText.textContent = originalText;
    taskText.contentEditable = false;
    taskText.classList.remove('editing');
    
    renderTasks();
}

// Clear all completed tasks
function clearCompletedTasks() {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) {
        return;
    }
    
    showConfirmDialog(`Delete ${completedTasks.length} completed task(s)?`, () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });
}

// Show confirmation dialog
function showConfirmDialog(message, onConfirm) {
    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
        <div class="confirm-box">
            <h3>Confirm Action</h3>
            <p>${message}</p>
            <div class="confirm-actions">
                <button class="confirm-btn confirm-yes">Yes</button>
                <button class="confirm-btn confirm-no">No</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Add active class after small delay for animation
    setTimeout(() => dialog.classList.add('active'), 10);
    
    // Yes button handler
    const yesBtn = dialog.querySelector('.confirm-yes');
    yesBtn.addEventListener('click', () => {
        dialog.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(dialog);
            onConfirm();
        }, 300);
    });
    
    // No button handler
    const noBtn = dialog.querySelector('.confirm-no');
    noBtn.addEventListener('click', () => {
        dialog.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(dialog);
        }, 300);
    });
    
    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(dialog);
            }, 300);
        }
    });
}

// Render tasks based on search filter
function renderTasks(filter = '') {
    const filterLower = filter.toLowerCase();
    
    // Filter tasks based on search
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(filterLower)
    );
    
    // Separate pending and completed tasks
    const pendingTasks = filteredTasks.filter(t => !t.completed);
    const completedTasks = filteredTasks.filter(t => t.completed);
    
    // Clear current lists
    pendingTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';
    
    // Render pending tasks
    if (pendingTasks.length === 0) {
        pendingEmpty.style.display = 'block';
    } else {
        pendingEmpty.style.display = 'none';
        pendingTasks.forEach(task => {
            const taskElement = createTaskElement(task, false);
            pendingTasksList.appendChild(taskElement);
        });
    }
    
    // Render completed tasks
    if (completedTasks.length === 0) {
        completedEmpty.style.display = 'block';
    } else {
        completedEmpty.style.display = 'none';
        completedTasks.forEach(task => {
            const taskElement = createTaskElement(task, true);
            completedTasksList.appendChild(taskElement);
        });
    }
    
    // Update counters
    updateCounters();
}

// Create task element
function createTaskElement(task, isCompleted) {
    const li = document.createElement('li');
    li.className = `task-item ${isCompleted ? 'completed' : ''}`;
    li.dataset.taskId = task.id;
    
    const timestamp = isCompleted ? task.completedAt : task.createdAt;
    
    li.innerHTML = `
        <span class="task-text">${escapeHtml(task.text)}</span>
        <span class="task-timestamp">${formatDate(timestamp)}</span>
        <div class="task-actions">
            ${isCompleted ? `
                <button class="task-btn delete-btn" data-action="delete">Delete</button>
            ` : `
                <button class="task-btn complete-btn" data-action="complete">Complete</button>
                <button class="task-btn edit-btn" data-action="edit">Edit</button>
                <button class="task-btn delete-btn" data-action="delete">Delete</button>
            `}
        </div>
    `;
    
    // Add event listeners to buttons
    const actionsDiv = li.querySelector('.task-actions');
    
    if (isCompleted) {
        const deleteBtn = actionsDiv.querySelector('[data-action="delete"]');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
    } else {
        const completeBtn = actionsDiv.querySelector('[data-action="complete"]');
        completeBtn.addEventListener('click', () => completeTask(task.id));
        
        const editBtn = actionsDiv.querySelector('[data-action="edit"]');
        editBtn.addEventListener('click', () => startEditTask(task.id));
        
        const deleteBtn = actionsDiv.querySelector('[data-action="delete"]');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
    }
    
    return li;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update task counters
function updateCounters() {
    const pendingCountValue = tasks.filter(t => !t.completed).length;
    const completedCountValue = tasks.filter(t => t.completed).length;
    
    pendingCount.textContent = pendingCountValue;
    completedCount.textContent = completedCountValue;
}

// Event listeners

// Add task button click
addTaskBtn.addEventListener('click', () => {
    addTask(taskInput.value);
});

// Enter key to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

// Search input
searchInput.addEventListener('input', (e) => {
    renderTasks(e.target.value);
});

// Clear completed button
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// Initialize the app
function init() {
    loadTasks();
    renderTasks();
}

// Start the application
init();
