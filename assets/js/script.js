const formEl = document.querySelector('#task-form');
const tasksToDoEl = document.querySelector('#tasks-to-do');

const taskFormHandler = function (event) {
    event.preventDefault();
    const taskNameInput = document.querySelector("input[name='task-name'").value;
    const taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if inputs are empty (validate)
    if (taskNameInput === '' || taskTypeInput === '') {
        alert('You need to fill out the task form!');
        return false;
    }

    formEl.reset();

    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = '';
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    const taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
    };

    createTaskEl(taskDataObj);
};

const createTaskEl = function (taskDataObj) {
    // create list item
    const listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    // create div to hold task info and add to list item
    const taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = `<h3 class='task-name'>${taskDataObj.name}</h3><span class='task-type'>${taskDataObj.type}</span>`;
    listItemEl.appendChild(taskInfoEl);

    console.dir(listItemEl);

    // add list item to list
    tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener('submit', taskFormHandler);
