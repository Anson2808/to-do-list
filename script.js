// ===== Task Manager Application =====

// DOM Elements
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskDueDate = document.getElementById('task-due-date');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const filterCategory = document.getElementById('filter-category');
const filterPriority = document.getElementById('filter-priority');
const sortBy = document.getElementById('sort-by');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const actionsBar = document.getElementById('actions-bar');

// Stats Elements
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');
const progressBar = document.getElementById('progress-bar');

// Modal Elements
const editModal = document.getElementById('edit-modal');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const modalSave = document.getElementById('modal-save');
const editTaskText = document.getElementById('edit-task-text');
const editTaskCategory = document.getElementById('edit-task-category');
const editTaskPriority = document.getElementById('edit-task-priority');
const editTaskDueDate = document.getElementById('edit-task-due-date');

// State
let tasks = [];
let currentFilter = 'all';
let currentEditId = null;

// ===== Local Storage =====
const STORAGE_KEY = 'taskflow-tasks';

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        tasks = JSON.parse(stored);
    }
}

// ===== Task Operations =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.focus();
        shakeElement(taskInput);
        return;
    }

    const task = {
        id: generateId(),
        text: text,
        category: taskCategory.value,
        priority: taskPriority.value,
        dueDate: taskDueDate.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(task);
    saveTasks();
    clearInputs();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    const taskEl = document.querySelector(`[data-id="${id}"]`);
    if (taskEl) {
        taskEl.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
            updateStats();
        }, 300);
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        currentEditId = id;
        editTaskText.value = task.text;
        editTaskCategory.value = task.category;
        editTaskPriority.value = task.priority;
        editTaskDueDate.value = task.dueDate;
        openModal();
    }
}

function saveEditedTask() {
    if (!currentEditId) return;

    const task = tasks.find(t => t.id === currentEditId);
    if (task) {
        const newText = editTaskText.value.trim();
        if (!newText) {
            shakeElement(editTaskText);
            return;
        }

        task.text = newText;
        task.category = editTaskCategory.value;
        task.priority = editTaskPriority.value;
        task.dueDate = editTaskDueDate.value;

        saveTasks();
        closeModal();
        renderTasks();
    }
}

function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;

    // Add removing animation to all completed tasks
    const completedEls = document.querySelectorAll('.task-card.completed');
    completedEls.forEach(el => el.classList.add('removing'));

    setTimeout(() => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateStats();
    }, 300);
}

// ===== UI Helpers =====
function clearInputs() {
    taskInput.value = '';
    taskCategory.value = '';
    taskPriority.value = 'low';
    taskDueDate.value = '';
    taskInput.focus();
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Add shake animation dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

function openModal() {
    editModal.classList.add('active');
    editTaskText.focus();
}

function closeModal() {
    editModal.classList.remove('active');
    currentEditId = null;
}

// ===== Filtering and Sorting =====
function getFilteredTasks() {
    let filtered = [...tasks];

    // Filter by status
    if (currentFilter === 'pending') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    // Filter by category
    const categoryFilter = filterCategory.value;
    if (categoryFilter) {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Filter by priority
    const priorityFilter = filterPriority.value;
    if (priorityFilter) {
        filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    // Search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.text.toLowerCase().includes(searchTerm) ||
            t.category.toLowerCase().includes(searchTerm)
        );
    }

    // Sorting
    const sortValue = sortBy.value;
    switch (sortValue) {
        case 'dueDate':
            filtered.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
            break;
        case 'priority':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        case 'name':
            filtered.sort((a, b) => a.text.localeCompare(b.text));
            break;
        case 'created':
        default:
            // Already sorted by creation (newest first)
            break;
    }

    return filtered;
}

// ===== Rendering =====
function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    return due < today;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
        return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function getCategoryLabel(category) {
    const labels = {
        work: '💼 Work',
        personal: '🏠 Personal',
        shopping: '🛒 Shopping',
        health: '💪 Health',
        study: '📚 Study'
    };
    return labels[category] || category;
}

function getPriorityLabel(priority) {
    const labels = {
        high: '🔴 High',
        medium: '🟡 Medium',
        low: '🟢 Low'
    };
    return labels[priority] || priority;
}

function createTaskElement(task) {
    const isTaskOverdue = !task.completed && isOverdue(task.dueDate);
    
    const taskEl = document.createElement('div');
    taskEl.className = `task-card priority-${task.priority}`;
    taskEl.dataset.id = task.id;
    
    if (task.completed) {
        taskEl.classList.add('completed');
    }
    if (isTaskOverdue) {
        taskEl.classList.add('overdue');
    }

    taskEl.innerHTML = `
        <label class="task-checkbox">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="checkmark"></span>
        </label>
        <div class="task-content">
            <div class="task-text">${escapeHtml(task.text)}</div>
            <div class="task-meta">
                ${task.category ? `<span class="task-tag category-${task.category}">${getCategoryLabel(task.category)}</span>` : ''}
                <span class="task-tag priority-${task.priority}">${getPriorityLabel(task.priority)}</span>
                ${task.dueDate ? `<span class="task-tag due-date ${isTaskOverdue ? 'overdue' : ''}">📅 ${formatDate(task.dueDate)}</span>` : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="action-btn edit-btn" title="Edit task">✏️</button>
            <button class="action-btn delete-btn" title="Delete task">🗑️</button>
        </div>
    `;

    // Event listeners
    const checkbox = taskEl.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const editBtn = taskEl.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => editTask(task.id));

    const deleteBtn = taskEl.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    return taskEl;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderTasks() {
    const filtered = getFilteredTasks();
    
    // Clear existing tasks (keep empty state)
    const existingTasks = tasksContainer.querySelectorAll('.task-card');
    existingTasks.forEach(el => el.remove());

    // Show/hide empty state
    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        if (tasks.length === 0) {
            emptyState.querySelector('h3').textContent = 'No tasks yet';
            emptyState.querySelector('p').textContent = 'Add your first task to get started!';
        } else {
            emptyState.querySelector('h3').textContent = 'No matching tasks';
            emptyState.querySelector('p').textContent = 'Try adjusting your filters';
        }
    } else {
        emptyState.classList.add('hidden');
        filtered.forEach(task => {
            const taskEl = createTaskElement(task);
            tasksContainer.appendChild(taskEl);
        });
    }

    // Show/hide clear completed button
    const hasCompleted = tasks.some(t => t.completed);
    actionsBar.classList.toggle('hidden', !hasCompleted);
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    progressBar.style.width = `${percentage}%`;
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Add task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Filter dropdowns
    filterCategory.addEventListener('change', renderTasks);
    filterPriority.addEventListener('change', renderTasks);
    sortBy.addEventListener('change', renderTasks);

    // Search
    searchInput.addEventListener('input', debounce(renderTasks, 300));

    // Clear completed
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Modal
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalSave.addEventListener('click', saveEditedTask);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape to close modal
        if (e.key === 'Escape' && editModal.classList.contains('active')) {
            closeModal();
        }
        // Enter to save in modal
        if (e.key === 'Enter' && editModal.classList.contains('active')) {
            e.preventDefault();
            saveEditedTask();
        }
    });
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Initialize App =====
function init() {
    loadTasks();
    renderTasks();
    updateStats();
    setupEventListeners();
    
    // Set min date for date picker to today
    const today = new Date().toISOString().split('T')[0];
    taskDueDate.min = today;
    editTaskDueDate.min = today;
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
