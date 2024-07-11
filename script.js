document.addEventListener('DOMContentLoaded', function() {
    // Enable drag and drop functionality
    initKanbanBoard('todo-programming');
    initKanbanBoard('inprogress-programming');
    initKanbanBoard('done-programming');
    initKanbanBoard('todo-manufacturing');
    initKanbanBoard('inprogress-manufacturing');
    initKanbanBoard('done-manufacturing');
    initKanbanBoard('todo-design');
    initKanbanBoard('inprogress-design');
    initKanbanBoard('done-design');
});

function initKanbanBoard(boardId) {
    const board = document.getElementById(boardId);
    board.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    board.addEventListener('drop', function(event) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('text/plain');
        const taskElement = document.getElementById(taskId);
        board.querySelector('.kanban-tasks').appendChild(taskElement);
    });
}

function addTask(boardId) {
    const taskName = prompt('Enter task name:');
    if (!taskName) return;

    const taskId = `task-${Date.now()}`;
    const taskElement = document.createElement('div');
    taskElement.id = taskId;
    taskElement.className = 'kanban-task';
    taskElement.draggable = true;
    taskElement.textContent = taskName;

    taskElement.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', taskId);
    });

    document.getElementById(boardId).querySelector('.kanban-tasks').appendChild(taskElement);
}
