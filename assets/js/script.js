const formEl = document.querySelector('#task-form');
const tasksToDoEl = document.querySelector('#tasks-to-do');

const createTaskHandler = function (event) {
    event.preventDefault();
    const taskNameInput = document.querySelector("input[name='task-name']").value;
    const taskTypeInput = document.querySelector("select[name='task-type']").value;

    // create list item
    const listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    // create div to hold task info and add to list item
    const taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';

    // add HTML content to div
    taskInfoEl.innerHTML = `<h3 class='task-name'>${taskNameInput}</h3><span class='task-type'>${taskTypeInput}</span>`;
    listItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener('submit', createTaskHandler);
