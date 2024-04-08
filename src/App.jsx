import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [tasks, setTasks] = useState({
    backlog: [],
    inProgress: [],
    done: []
  });

  const [newBacklogTasks, setNewBacklogTasks] = useState([]);
  const [newInProgressTasks, setNewInProgressTasks] = useState([]);
  const [newDoneTasks, setNewDoneTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (status, task, setNewTask) => {
    if (task.trim() !== '') {
      const newTask = { task, status };
      setTasks(prevState => ({
        ...prevState,
        [status]: [...prevState[status], task]
      }));
      switch (status) {
        case 'backlog':
          setNewBacklogTasks(prevState => [...prevState, task]);
          setNewBacklogTask(''); // Clear new backlog task input
          break;
        case 'inProgress':
          setNewInProgressTasks(prevState => [...prevState, task]);
          setNewInProgressTask(''); // Clear new in progress task input
          break;
        case 'done':
          setNewDoneTasks(prevState => [...prevState, task]);
          setNewDoneTask(''); // Clear new done task input
          break;
        default:
          break;
      }
      setNewTask(''); // Clear the input field after adding the task
      document.getElementById(`${status}-input`).focus(); // Focus on the input field after adding the task
    }
  };

  const resetNewTask = (status) => {
    switch (status) {
      case 'backlog':
        setNewBacklogTask('');
        break;
      case 'inProgress':
        setNewInProgressTask('');
        break;
      case 'done':
        setNewDoneTask('');
        break;
      default:
        break;
    }
  };

  const handleDeleteTask = (status, index) => {
    const newTasks = [...tasks[status]];
    newTasks.splice(index, 1);
    setTasks(prevState => ({
      ...prevState,
      [status]: newTasks
    }));
  
    // Remove the deleted task from new task state array
    switch (status) {
      case 'backlog':
        setNewBacklogTasks(prevState => prevState.filter((_, idx) => idx !== index));
        break;
      case 'inProgress':
        setNewInProgressTasks(prevState => prevState.filter((_, idx) => idx !== index));
        break;
      case 'done':
        setNewDoneTasks(prevState => prevState.filter((_, idx) => idx !== index));
        break;
      default:
        break;
    }
  };

  const handleDragStart = (status, taskIndex) => {
    localStorage.setItem('draggedTask', JSON.stringify({ status, taskIndex }));
  };

  const handleDrop = (status) => {
    const draggedTask = JSON.parse(localStorage.getItem('draggedTask'));
    if (draggedTask && draggedTask.status !== status) {
      const taskToMove = tasks[draggedTask.status][draggedTask.taskIndex];
      const newTasks = [...tasks[status], taskToMove];
      const updatedTasks = {
        ...tasks,
        [draggedTask.status]: tasks[draggedTask.status].filter((_, index) => index !== draggedTask.taskIndex),
        [status]: newTasks
      };
      setTasks(updatedTasks);
      localStorage.removeItem('draggedTask');
    }
  };

  const [newBacklogTask, setNewBacklogTask] = useState('');
  const [newInProgressTask, setNewInProgressTask] = useState('');
  const [newDoneTask, setNewDoneTask] = useState('');

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-around">
        <div className="w-full md:w-1/3 bg-gray-200 p-4 rounded-lg md:mr-2 mb-4 md:mb-0">
          <h2 className="text-lg font-bold mb-4">Backlog</h2>
          <div className="  p-2">
           
            <input
              id="backlog-input"
              type="text"
              className="  p-2 w-full"
              value={newBacklogTask}
              onChange={(e) => setNewBacklogTask(e.target.value)}
              placeholder="Add new task"
            />
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded" onClick={() => handleAddTask('backlog', newBacklogTask)}>
              Add Task
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-gray-200 p-4 rounded-lg md:mx-2 mb-4 md:mb-0">
          <h2 className="text-lg font-bold mb-4">In Progress</h2>
          <div className=" p-2">
            
            <input
              id="inProgress-input"
              type="text"
              className=" p-2 w-full"
              value={newInProgressTask}
              onChange={(e) => setNewInProgressTask(e.target.value)}
              placeholder="Add new task"
            />
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded" onClick={() => handleAddTask('inProgress', newInProgressTask)}>
              Add Task
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-gray-200 p-4 rounded-lg md:ml-2">
          <h2 className="text-lg font-bold mb-4">Done</h2>
          <div className=" p-2">
          
            <input
              id="done-input"
              type="text"
              className=" p-2 w-full"
              value={newDoneTask}
              onChange={(e) => setNewDoneTask(e.target.value)}
              placeholder="Add new task"
            />
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded" onClick={() => handleAddTask('done', newDoneTask)}>
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Render new tasks outside the border boxes */}
      <div className="flex flex-col md:flex-row justify-around mt-4">
        <div className="w-full md:w-1/3 bg-gray-200 p-4 rounded-lg mb-4 md:mb-0">
          <h2 className="text-lg font-bold mb-4">New Backlog Tasks</h2>
          {tasks.backlog.map((task, index) => (
              <div key={index} className="mb-2" draggable onDragStart={() => handleDragStart('backlog', index)}>
                {task}
                <button className="text-red-500 cursor-pointer ml-2" onClick={() => handleDeleteTask('backlog', index)}>
                  Delete
                </button>
              </div>
            ))}
        </div>
        <div className="w-full md:w-1/3 bg-gray-200 p-4 rounded-lg md:mx-2 mb-4 md:mb-0">
          <h2 className="text-lg font-bold mb-4">New In Progress Tasks</h2>
          {tasks.inProgress.map((task, index) => (
              <div key={index} className="mb-2" draggable onDragStart={() => handleDragStart('inProgress', index)}>
                {task}
                <button className="text-red-500 cursor-pointer ml-2" onClick={() => handleDeleteTask('inProgress', index)}>
                  Delete
                </button>
              </div>
            ))}
        </div>
        <div className="w-full md:w-1/3 bg-gray-200 p-4 rounded-lg md:ml-2">
          <h2 className="text-lg font-bold mb-4">New Done Tasks</h2>

            {tasks.done.map((task, index) => (
              <div key={index} className="mb-2" draggable onDragStart={() => handleDragStart('done', index)}>
                {task}
                <button className="text-red-500 cursor-pointer ml-2" onClick={() => handleDeleteTask('done', index)}>
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
