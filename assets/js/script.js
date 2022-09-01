let taskIdCounter = 0;

const formEl = document.querySelector('#task-form');
const tasksToDoEl = document.querySelector('#tasks-to-do');
const tasksInProgressEl = document.querySelector('#tasks-in-progress');
const tasksCompletedEl = document.querySelector('#tasks-completed');
const pageContentEl = document.querySelector('#page-content');

// create array to hold tasks for saving
let tasks = [];

const taskFormHandler = function (event) {
    event.preventDefault();
    const taskNameInput = document.querySelector("input[name='task-name']").value;
    const taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if inputs are empty (validate)
    if (!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    }

    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = '';
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    // check if task is new or one being edited by seeing if it has a data-task-id attribute
    const isEdit = formEl.hasAttribute('data-task-id');

    if (isEdit) {
        const taskId = formEl.getAttribute('data-task-id');
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        const taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: 'to do',
        };

        createTaskEl(taskDataObj);
    }
};

const createTaskEl = function (taskDataObj) {
    const listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    listItemEl.setAttribute('data-task-id', taskIdCounter);

    const taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = `<h3 class='task-name'>${taskDataObj.name}</h3><span class='task-type'>${taskDataObj.type}</span>`;
    listItemEl.appendChild(taskInfoEl);

    const taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    switch (taskDataObj.status) {
        case 'to do':
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.append(listItemEl);
            break;
        case 'in progress':
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.append(listItemEl);
            break;
        case 'completed':
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.append(listItemEl);
            break;
        default:
            console.log('Something went wrong!');
    }

    // save task as an object with name, type, status, and id properties then push it into tasks array
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    // save tasks to localStorage
    saveTasks();

    // increase task counter for next unique task id
    taskIdCounter++;
};

const createTaskActions = function (taskId) {
    // create container to hold elements
    const actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    // create edit button
    const editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);
    actionContainerEl.appendChild(editButtonEl);
    // create delete button
    const deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    // create change status dropdown
    const statusSelectEl = document.createElement('select');
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);
    statusSelectEl.className = 'select-status';
    actionContainerEl.appendChild(statusSelectEl);
    // create status options
    const statusChoices = ['To Do', 'In Progress', 'Completed'];

    for (let i = 0; i < statusChoices.length; i++) {
        // create option element
        const statusOptionEl = document.createElement('option');
        statusOptionEl.setAttribute('value', statusChoices[i]);
        statusOptionEl.textContent = statusChoices[i];

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

const completeEditTask = function (taskName, taskType, taskId) {
    // find task list item with taskId value
    const taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);

    // set new values
    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    // loop through tasks array and task object with new content
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert('Task Updated!');

    // remove data attribute from form
    formEl.removeAttribute('data-task-id');
    // update formEl button to go back to saying "Add Task" instead of "Edit Task"
    formEl.querySelector('#save-task').textContent = 'Add Task';
    // save tasks to localStorage
    saveTasks();
};

const taskButtonHandler = function (event) {
    // get target element from event
    const targetEl = event.target;

    if (targetEl.matches('.edit-btn')) {
        console.log('edit', targetEl);
        const taskId = targetEl.getAttribute('data-task-id');
        editTask(taskId);
    } else if (targetEl.matches('.delete-btn')) {
        console.log('delete', targetEl);
        const taskId = targetEl.getAttribute('data-task-id');
        deleteTask(taskId);
    }
};

const taskStatusChangeHandler = function (event) {
    console.log(event.target.value);

    // find task list item based on event.target's data-task-id attribute
    const taskId = event.target.getAttribute('data-task-id');

    const taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);

    // convert value to lower case
    const statusValue = event.target.value.toLowerCase();

    if (statusValue === 'to do') {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    // save to localStorage
    saveTasks();
};

const editTask = function (taskId) {
    console.log(taskId);

    // get task list item element
    const taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);

    // get content from task name and type
    const taskName = taskSelected.querySelector('h3.task-name').textContent;
    console.log(taskName);

    const taskType = taskSelected.querySelector('span.task-type').textContent;
    console.log(taskType);

    // write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // set data attribute to the form with a value of the task's id so it knows which one is being edited
    formEl.setAttribute('data-task-id', taskId);
    // update form's button to reflect editing a task rather than creating a new one
    formEl.querySelector('#save-task').textContent = 'Save Task';
};

const deleteTask = function (taskId) {
    console.log(taskId);
    // find task list element with taskId value and remove it
    const taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);
    taskSelected.remove();

    // create new array to hold updated list of tasks
    const updatedTaskArr = [];

    // loop through current tasks
    for (let i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};

const saveTasks = function () {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadTasks = function () {
    let savedTasks = localStorage.getItem('tasks');
    // if there are no tasks, set tasks to an empty array and return out of the function
    if (!savedTasks) {
        return false;
    }
    console.log('Saved tasks found!');
    // else, load up saved tasks

    // parse into array of objects
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (let i = 0; i < savedTasks.length; i++) {
        // pass each task object into the `createTaskEl()` function
        createTaskEl(savedTasks[i]);
    }
};

// Create a new task
formEl.addEventListener('submit', taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener('click', taskButtonHandler);

// for changing the status
pageContentEl.addEventListener('change', taskStatusChangeHandler);

loadTasks();
