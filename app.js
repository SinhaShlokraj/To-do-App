let todos = JSON.parse(localStorage.getItem("todos")) || [];
let isDark = false;

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    if (todo.completed) li.classList.add("completed");

    li.innerHTML = `
      <div onclick="toggleComplete(${index})" style="cursor:pointer;">
        <strong>${todo.text}</strong><br/><small>${todo.timestamp}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-warning me-2" onclick="editTodo(${index})"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteTodo(${index})"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(li);
  });
}

function addTodo() {
  const input = document.getElementById("todo-input");
  const text = input.value.trim();
  if (text) {
    todos.push({ text, timestamp: new Date().toLocaleString(), completed: false });
    input.value = "";
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

function editTodo(index) {
  const newText = prompt("Edit task:", todos[index].text);
  if (newText) {
    todos[index].text = newText;
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

function exportToTxt() {
  const content = todos.map(t => `- ${t.text} (${t.timestamp})`).join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "todo-list.txt";
  a.click();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function changeTheme(theme) {
  let bg = "";
  switch (theme) {
    case "nature":
      bg = "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1500&q=80";
      break;
    case "space":
      bg = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1500&q=80";
      break;
    case "minimal":
      bg = "https://images.unsplash.com/photo-1496309732348-3627f3f040ee?auto=format&fit=crop&w=1500&q=80";
      break;
    default:
      bg = "";
  }
  if (bg) {
    document.body.style.backgroundImage = `url('${bg}')`;
  }
}

// Load saved todos on start
renderTodos();

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./serviceWorker.js')
      .then(reg => console.log('✅ Service Worker registered!', reg))
      .catch(err => console.error('❌ Service Worker registration failed:', err));
  });
}
