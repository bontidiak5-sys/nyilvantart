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
