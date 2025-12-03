const columns = [
    { key: 'todo', listId: 'todo-list' },
    { key: 'inprogress', listId: 'inprogress-list' },
    { key: 'done', listId: 'done-list' }
];

let tasks = [];

function saveTasks() {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const data = localStorage.getItem('kanbanTasks');
    tasks = data ? JSON.parse(data) : [];
}
function renderTasks() {
    columns.forEach(col => {
        const list = document.getElementById(col.listId);
        list.innerHTML = '';
        tasks.filter(t => t.status === col.key).forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';
            taskDiv.draggable = true;
            taskDiv.dataset.id = task.id;
            taskDiv.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-btn" title="Törlés">×</button>
            `;
            // Törlés gomb
            taskDiv.querySelector('.delete-btn').onclick = (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            };
            // Drag events
            taskDiv.addEventListener('dragstart', dragStart);
            taskDiv.addEventListener('dragend', dragEnd);
            list.appendChild(taskDiv);
        });
    });
}
function addTask(text) {
    if (!text.trim()) return;
    tasks.push({ id: Date.now(), text, status: 'todo' });
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}
