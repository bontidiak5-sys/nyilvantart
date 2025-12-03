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
let draggedTaskId = null;
function dragStart(e) {
    draggedTaskId = +e.target.dataset.id;
    e.target.classList.add('dragging');
}
function dragEnd(e) {
    e.target.classList.remove('dragging');
    draggedTaskId = null;
}
columns.forEach(col => {
    const columnDiv = document.getElementById(col.key);
    columnDiv.addEventListener('dragover', e => {
        e.preventDefault();
        columnDiv.classList.add('drag-over');
    });
    columnDiv.addEventListener('dragleave', () => {
        columnDiv.classList.remove('drag-over');
    });
    columnDiv.addEventListener('drop', () => {
        columnDiv.classList.remove('drag-over');
        if (draggedTaskId !== null) {
            const task = tasks.find(t => t.id === draggedTaskId);
            if (task) {
                task.status = col.key;
                saveTasks();
                renderTasks();
            }
        }
    });
});
const addBtn = document.getElementById('add-task-btn');
const input = document.getElementById('task-input');
addBtn.onclick = () => {
    addTask(input.value);
    input.value = '';
    input.focus();
};
input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});
loadTasks();
renderTasks();