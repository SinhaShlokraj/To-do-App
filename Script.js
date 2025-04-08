let todos = JSON.parse(localStorage.getItem('todos')) || [];
let isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
let currentTheme = localStorage.getItem('theme') || 'default';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function saveTheme() {
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  localStorage.setItem('theme', currentTheme);
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row ${todo.completed ? 'task-completed' : ''}`;

    const text = document.createElement('div');
    text.innerHTML = `
      <strong>${todo.text}</strong>
      <div class='timestamp'>🕒 ${todo.timestamp}</div>`;

    const buttons = document.createElement('div');
    buttons.className = 'mt-2 mt-md-0';
    buttons.innerHTML = `
      <button class="btn btn-sm btn-outline-success me-2 btn-custom" onclick="toggleComplete(${index})" title="Mark Complete"><i class="fas fa-check"></i></button>
      <button class="btn btn-sm btn-outline-warning me-2 btn-custom" onclick="editTodo(${index})" title="Edit Task"><i class="fas fa-edit"></i></button>
      <button class="btn btn-sm btn-outline-danger btn-custom" onclick="deleteTodo(${index})" title="Delete Task"><i class="fas fa-trash"></i></button>
    `;

    li.appendChild(text);
    li.appendChild(buttons);
    list.appendChild(li);
  });
}

function addTodo() {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (text !== '') {
    const timestamp = new Date().toLocaleString();
    todos.push({ text, timestamp, completed: false });
    saveTodos();
    renderTodos();
    input.value = '';
  }
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

function editTodo(index) {
  const newText = prompt("Edit your task:", todos[index].text);
  if (newText !== null && newText.trim() !== '') {
    todos[index].text = newText.trim();
    todos[index].timestamp = new Date().toLocaleString();
    saveTodos();
    renderTodos();
  }
}

function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  document.getElementById('todo-card').classList.toggle('dark-mode', isDarkMode);
  saveTheme();
}

function changeTheme(theme) {
  currentTheme = theme;
  document.body.className = `${theme}-theme`;
  if (isDarkMode) document.body.classList.add('dark-mode');
  saveTheme();
}

function loadTheme() {
  document.body.className = `${currentTheme}-theme`;
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('todo-card').classList.add('dark-mode');
  }
}

function exportToTxt() {
  let content = todos.map(t => `• ${t.text} (added on ${t.timestamp})`).join('\n');
  let blob = new Blob([content], { type: "text/plain" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "todo-list.txt";
  a.click();
}

loadTheme();
renderTodos();
