import React, { useState, useEffect } from 'react';
import './App.css';

// Компонент для представления отдельной задачи
const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const { id, text, completed } = task;

  return (
    <div className="task-cont">
      <div
        className="task-text"
        style={{ textDecoration: completed ? 'line-through' : 'none' }}
        onClick={() => onToggle(id)}
      >
        {text}
      </div>
      <div className="task-buttons">
        <button className="glow-on-hover1" onClick={() => onDelete(id)}>Удалить</button>
      </div>
      <div className="task-buttons1">
      <button className={`glow-on-hover ${completed ? 'completed' : ''}`} onClick={() => onEdit(id)}>Редактировать</button>
      </div>
    </div>
  );
};




// Компонент для отображения списка задач
const TaskList = ({ tasks, onToggle, onDelete, onEdit, filterStatus }) => {
  // Фильтруем задачи в соответствии с текущим статусом фильтра
  const filteredTasks = filterStatus === "all" ? tasks : tasks.filter(task => (filterStatus === "completed" ? task.completed : !task.completed));

  return (
    <div>
      {filteredTasks.map((task) => (
        <div key={task.id} className="task-contain">
          <TaskItem
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
};

// Компонент для добавления и редактирования задачи
const TaskForm = ({ onSubmit, taskToEdit }) => {
  const [text, setText] = useState(taskToEdit ? taskToEdit.text : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') {
      return;
    }

    onSubmit({ text });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <input
        type="text"
        placeholder="Введите задачу"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '90%',
          padding: '10px',
          borderRadius: '10px', // Добавьте закругление краев
        }} 
      />
      <button className="glow-on-hover2" type="submit" 
        style={{
          padding: '18px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {taskToEdit ? 'Редактировать' : 'Добавить'}
      </button>
    </form>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem('tasks')) || []
  );
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Эффект для загрузки задач из локального хранилища при старте
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Эффект для сохранения задач в локальном хранилище, когда они изменяются
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);



  const addTask = (newTask) => {
    const newTaskWithId = { ...newTask, id: Date.now(), completed: false };
    setTasks([...tasks, newTaskWithId]);
  };

  const toggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTaskToEdit(taskToEdit);
  };

  const updateTask = (editedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskToEdit.id ? { ...task, ...editedTask } : task
      )
    );
    setTaskToEdit(null);
  };
return (
    <div className="container">
      <h1>Список задач</h1>
      <div class="qq">
        <button class="qwerty" onClick={() => setFilterStatus("all")}>Все</button>
        <button class="qwerty1" onClick={() => setFilterStatus("completed")}>Завершенные</button>
        <button class="qwerty1" onClick={() => setFilterStatus("uncompleted")}>Незавершенные</button>
      </div>
      <TaskForm onSubmit={taskToEdit ? updateTask : addTask} taskToEdit={taskToEdit} />
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} filterStatus={filterStatus} />
    </div>
  );
}