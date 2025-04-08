let todos = JSON.parse(localStorage.getItem('todos')) || [];
let isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
let currentTheme = localStorage.getItem('theme') || 'default';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    if (todo.completed) li.classList.add('strikethrough');

    li.innerHTML = `
      <span onclick="toggleComplete(${index})" style="cursor:pointer;">${todo.text} <small class="text-muted">[${todo.timestamp}]</small></span>
      <div>
        <button class="btn btn-sm btn-outline-warning me-1" onclick="editTodo(${index})"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteTodo(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `;
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
  if (newText) {
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
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
}

function changeTheme(theme) {
  document.body.classList.remove('nature', 'space', 'default');
  if (theme !== 'default') document.body.classList.add(theme);
  currentTheme = theme;
  localStorage.setItem('theme', theme);
}

function exportToTxt() {
  const content = todos.map(t => `${t.completed ? "[x]" : "[ ]"} ${t.text} (${t.timestamp})`).join('\n');
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "todo-list.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// Load on start
document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  if (isDarkMode) document.body.classList.add('dark-mode');
  if (currentTheme !== 'default') document.body.classList.add(currentTheme);
});
