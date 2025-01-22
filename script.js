document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

const sampleTasks = [
    { id: 1, title: 'Review code changes', priority: 'medium', dueDate: '2024-04-16', completed: false },
    { id: 2, title: 'Update documentation', priority: 'low', dueDate: '2024-04-17', completed: true },
    { id: 3, title: 'Team meeting preparation', priority: 'high', dueDate: '2024-04-15', completed: false }
];

function updateTaskStats() {
    const total = sampleTasks.length;
    const completed = sampleTasks.filter(task => task.completed).length;
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = total - completed;
}

function renderTasks(taskFilter = 'all', priorityFilter = 'all') {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear existing tasks

    const filteredTasks = sampleTasks.filter(task => {
        const matchesTaskFilter =
            taskFilter === 'all' || (taskFilter === 'completed' && task.completed) || (taskFilter === 'pending' && !task.completed);
        const matchesPriorityFilter =
            priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesTaskFilter && matchesPriorityFilter;
    });

    filteredTasks.forEach(task => addTaskToDOM(task));
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('taskList');
    const taskElement = document.createElement('div');
    taskElement.className = 'flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow';
    taskElement.setAttribute('data-task-id', task.id); // Store task ID in the DOM
    taskElement.innerHTML = `
        <div class="flex items-center gap-4">
            <input type="checkbox" class="rounded text-custom focus:ring-custom" ${task.completed ? 'checked' : ''}>
            <div>
                <h3 class="font-medium">${task.title}</h3>
                <p class="text-sm text-gray-600">Due: ${task.dueDate}</p>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <span class="px-2 py-1 text-xs font-medium rounded-full bg-${getPriorityColor(task.priority)}-100 text-${getPriorityColor(task.priority)}-800">${capitalizeFirstLetter(task.priority)}</span>
            <button class="text-gray-400 hover:text-red-600 delete-task-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;
    taskList.appendChild(taskElement);

    // Add delete event listener
    taskElement.querySelector('.delete-task-btn').addEventListener('click', function () {
        deleteTask(task.id);
    });
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'high': return 'red';
        case 'medium': return 'yellow';
        case 'low': return 'green';
        default: return 'gray';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function deleteTask(taskId) {
    // Remove task from the sampleTasks array
    const taskIndex = sampleTasks.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
        sampleTasks.splice(taskIndex, 1);

        // Re-render tasks and update stats
        const taskFilter = document.getElementById('filterTasks').value;
        const priorityFilter = document.getElementById('filterPriority').value;
        renderTasks(taskFilter, priorityFilter);
        updateTaskStats();
    }
}

document.getElementById('addTaskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const taskTitleInput = this.querySelector('input[type="text"]');
    const taskPriorityInput = this.querySelector('select');
    const taskDueDateInput = this.querySelector('input[type="date"]');

    const title = taskTitleInput.value.trim();
    const priority = taskPriorityInput.value;
    const dueDate = taskDueDateInput.value;

    if (!title || !dueDate) {
        alert('Please fill in all fields.');
        return;
    }

    const newTask = {
        id: Date.now(), // Use unique ID for each task
        title,
        priority,
        dueDate,
        completed: false
    };

    sampleTasks.push(newTask);

    const taskFilter = document.getElementById('filterTasks').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    renderTasks(taskFilter, priorityFilter); // Re-render tasks
    updateTaskStats();

    // Reset the form
    this.reset();
});

document.getElementById('filterTasks').addEventListener('change', function () {
    const taskFilter = this.value;
    const priorityFilter = document.getElementById('filterPriority').value;
    renderTasks(taskFilter, priorityFilter);
});

document.getElementById('filterPriority').addEventListener('change', function () {
    const taskFilter = document.getElementById('filterTasks').value;
    const priorityFilter = this.value;
    renderTasks(taskFilter, priorityFilter);
});

updateTaskStats();
renderTasks();
