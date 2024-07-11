// Function to add a task
function addTask(columnId) {
    const column = document.getElementById(columnId);
    const tasksContainer = column.querySelector('.kanban-tasks');

    const taskName = prompt('Enter task name:');
    if (taskName) {
        // Add task to the database
        firebase.database().ref(`tasks/${columnId}`).push({
            name: taskName,
            status: columnId
        });
    }
}

// Firebase event listener to update UI when tasks are added
firebase.database().ref('tasks').on('child_added', snapshot => {
    const task = snapshot.val();
    const taskId = snapshot.key;
    const column = document.getElementById(task.status);
    const tasksContainer = column.querySelector('.kanban-tasks');

    // Create task element
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.textContent = task.name;

    // Append task to tasks container
    tasksContainer.appendChild(taskElement);
});
