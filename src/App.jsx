  import React, { useState, useEffect } from 'react';
  import './index.css';

  const App = () => {
    const [tasks, setTasks] = useState({
      backlog: [],
      inProgress: [],
      done: []
    });

    useEffect(() => {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    }, []);

    useEffect(() => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = (status, task) => {
      if (task.trim() !== '') {
        // Update tasks state immediately
        const updatedTasks = {
          ...tasks,
          [status]: [...tasks[status], task]
        };
        setTasks(updatedTasks);
    
        // Save updated tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
        // Clear input field based on status
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
      }
    };
    

    const handleDeleteTask = (status, index) => {
      const newTasks = [...tasks[status]];
      newTasks.splice(index, 1);
      setTasks(prevState => ({
        ...prevState,
        [status]: newTasks
      }));
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

    const handleChangeStatus = (e, taskIndex, status) => {
      const newStatus = e.target.value;
      const taskToMove = tasks[status][taskIndex];
      const newTasks = [...tasks[newStatus], taskToMove];
      const updatedTasks = {
        ...tasks,
        [status]: tasks[status].filter((_, index) => index !== taskIndex),
        [newStatus]: newTasks
      };
      setTasks(updatedTasks);
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
                  <select value="backlog" onChange={(e) => handleChangeStatus(e, index, 'backlog')}>
                    <option value="backlog">Backlog</option>
                    <option value="inProgress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button className="text-red-500  cursor-pointer ml-2" onClick={() => handleDeleteTask('backlog', index)}>
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
                  <select value="inProgress" onChange={(e) => handleChangeStatus(e, index, 'inProgress')}>
                    <option value="backlog">Backlog</option>
                    <option value="inProgress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
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
                  <select value="done" onChange={(e) => handleChangeStatus(e, index, 'done')}>
                    <option value="backlog">Backlog</option>
                    <option value="inProgress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
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
