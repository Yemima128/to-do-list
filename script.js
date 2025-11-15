// Simple beginner-friendly JS for the todo app
// Features: add, validate, display, filter (all/active/completed), delete, toggle complete
// Data stored in localStorage so page refresh tetap menyimpan

// --- Helper: get elements ---
const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const todoBody = document.getElementById('todo-body');
const emptyMsg = document.getElementById('empty-msg');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter');

let todos = []; // array penyimpanan {id, text, date, completed}

// Load from localStorage when mulai
loadFromStorage();
renderTodos();

// ---------- Event listeners ----------
form.addEventListener('submit', function(e){
  e.preventDefault();
  addTodo();
});

searchInput.addEventListener('input', renderTodos);

// filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTodos();
  });
});

// ---------- Functions ----------
function addTodo(){
  const text = taskInput.value.trim();
  const date = dateInput.value; // empty string jika tidak diisi

  // Simple validation (pemula friendly)
  if (!text) {
    alert('Tolong isi nama tugas terlebih dahulu.');
    return;
  }

  // Create todo object
  const todo = {
    id: Date.now(), // simple unique id
    text,
    date, 
    completed: false
  };

  todos.push(todo);
  saveToStorage();
  renderTodos();

  // reset form
  taskInput.value = '';
  dateInput.value = '';
}

// Render function: read filter + search text
function renderTodos(){
  const search = searchInput.value.trim().toLowerCase();
  const activeFilter = document.querySelector('.filter.active').dataset.filter;

  // apply search & filter
  let list = todos.filter(t => t.text.toLowerCase().includes(search));

  if (activeFilter === 'active') {
    list = list.filter(t => !t.completed);
  } else if (activeFilter === 'completed') {
    list = list.filter(t => t.completed);
  }

  // clear table
  todoBody.innerHTML = '';

  if (list.length === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
    // add rows
    list.forEach(item => {
      const tr = document.createElement('tr');

      // task cell
      const tdTask = document.createElement('td');
      tdTask.textContent = item.text;
      if (item.completed) tdTask.classList.add('completed');

      // date cell
      const tdDate = document.createElement('td');
      tdDate.textContent = item.date ? item.date : '-';

      // action cell
      const tdAction = document.createElement('td');

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'action-btn btn-toggle';
      toggleBtn.textContent = item.completed ? 'Undo' : 'Done';
      toggleBtn.addEventListener('click', () => {
        toggleComplete(item.id);
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'action-btn btn-delete';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        if (confirm('Hapus tugas ini?')) deleteTodo(item.id);
      });

      tdAction.appendChild(toggleBtn);
      tdAction.appendChild(delBtn);

      tr.appendChild(tdTask);
      tr.appendChild(tdDate);
      tr.appendChild(tdAction);
      todoBody.appendChild(tr);
    });
  }
}

// toggle complete boolean
function toggleComplete(id){
  const idx = todos.findIndex(t => t.id === id);
  if (idx > -1) {
    todos[idx].completed = !todos[idx].completed;
    saveToStorage();
    renderTodos();
  }
}

// delete todo
function deleteTodo(id){
  todos = todos.filter(t => t.id !== id);
  saveToStorage();
  renderTodos();
}

// localStorage helpers
function saveToStorage(){
  localStorage.setItem('my_todos_simple', JSON.stringify(todos));
}

function loadFromStorage(){
  const raw = localStorage.getItem('my_todos_simple');
  if (raw) {
    try {
      todos = JSON.parse(raw);
    } catch(e) {
      todos = [];
    }
  } else {
    todos = [];
  }
}
