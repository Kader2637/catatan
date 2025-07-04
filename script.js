import { supabase } from './config.js';

const taskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskListContainer = document.getElementById('taskListContainer');
const emptyState = document.getElementById('emptyState');
const remainingCount = document.getElementById('remainingCount');
const totalCount = document.getElementById('totalCount');
const deleteCompletedBtn = document.getElementById('deleteCompletedBtn');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

addTaskBtn.addEventListener('click', async () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const { error } = await supabase.from('todos').insert([{ text, completed: false }]);
    if (!error) {
        taskInput.value = '';
        loadTasks();
    }
});

async function loadTasks() {
    document.getElementById('loadingState').style.display = 'block';
    const { data: tasks, error } = await supabase.from('todos').select('*').order('id', { ascending: false });

    document.getElementById('loadingState').style.display = 'none';
    if (error) {
        console.error(error);
        return;
    }

    displayTasks(tasks);
}

function displayTasks(tasks) {
    const list = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    const total = tasks.length;
    const remaining = tasks.filter(t => !t.completed).length;
    totalCount.textContent = total;
    remainingCount.textContent = remaining;

    taskListContainer.querySelectorAll('.task-item').forEach(el => el.remove());

    if (list.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        list.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTaskStatus(task.id, checkbox.checked));

            const text = document.createElement('div');
            text.className = 'task-text';
            text.textContent = task.text;

            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-sm btn-outline-danger';
            delBtn.innerHTML = '<i class="fas fa-trash"></i>';
            delBtn.addEventListener('click', () => deleteTask(task.id));

            const actions = document.createElement('div');
            actions.className = 'task-actions';
            actions.appendChild(delBtn);

            taskItem.appendChild(checkbox);
            taskItem.appendChild(text);
            taskItem.appendChild(actions);

            taskListContainer.appendChild(taskItem);
        });
    }

    deleteCompletedBtn.style.display = tasks.some(t => t.completed) ? 'inline-block' : 'none';
}

async function toggleTaskStatus(id, completed) {
    await supabase.from('todos').update({ completed }).eq('id', id);
    loadTasks();
}

async function deleteTask(id) {
    await supabase.from('todos').delete().eq('id', id);
    loadTasks();
}

deleteCompletedBtn.addEventListener('click', async () => {
    await supabase.from('todos').delete().eq('completed', true);
    loadTasks();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        loadTasks();
    });
});

// Load awal
document.addEventListener('DOMContentLoaded', loadTasks);
