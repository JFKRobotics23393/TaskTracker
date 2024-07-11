// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
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

function loadTasks() {
    const columns = ['todo-programming', 'inprogress-programming', 'done-programming',
                     'todo-manufacturing', 'inprogress-manufacturing', 'done-manufacturing',
                     'todo-design', 'inprogress-design', 'done-design'];

    columns.forEach(columnId => {
        database.ref('tasks/' + columnId).on('child_added', function(snapshot) {
            const task = snapshot.val();
            addTaskToColumn(columnId, task.id, task.name, task.description);
        });

        database.ref('tasks/' + columnId).on('child_removed', function(snapshot) {
            const task = snapshot.val();
            document.getElementById(task.id).remove();
        });

        database.ref('tasks/' + columnId).on('child_changed', function(snapshot) {
            const task = snapshot.val();
            const taskElement = document.getElementById(task.id);
            taskElement.querySelector('span').textContent = task.name;
        });
    });
}

function addTask(boardId) {
    const taskName = prompt('Enter task name:');
    const taskDescription = prompt('Enter task description:');
    if (!taskName) return;

    const taskId = `task-${Date.now()}`;
    const task = { id: taskId, name: taskName, description: taskDescription };

    database.ref('tasks/' + boardId + '/' + taskId).set(task);
}

function addTaskToColumn(columnId, taskId, taskName, taskDescription) {
    const taskElement = document.createElement('div');
    taskElement.id = taskId;
    taskElement.className = 'kanban-task';
    taskElement.draggable = true;

    const taskText = document.createElement('span');
    taskText.textContent = taskName;
    taskElement.appendChild(taskText);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = function() {
        const newName = prompt('Edit task name:', taskName);
        const newDescription = prompt('Edit task description:', taskDescription);
        if (newName) {
            taskText.textContent = newName;
            database.ref('tasks/' + columnId + '/' + taskId).update({ name: newName, description: newDescription });
        }
    };
    taskElement.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        taskElement.remove();
        database.ref('tasks/' + columnId + '/' + taskId).remove();
    };
    taskElement.appendChild(deleteButton);

    taskElement.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', task
