import { useEffect, useState } from "react";
import "./App.css";

/* 🔗 BACKEND API URL (Render) */
const API_URL = "https://task-tracker-backend-75cj.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [view, setView] = useState("All");

  /* 📥 Fetch all tasks */
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ➕ Add new task */
  const addTask = async () => {
    if (!title || !dueDate) {
      alert("Title and Due Date required");
      return;
    }

    try {
      await fetch(`${API_URL}/api/tasks/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          priority,
          dueDate,
          status: "Pending",
        }),
      });

      setTitle("");
      setPriority("Low");
      setDueDate("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  /* 🔄 Toggle Pending / Completed */
  const toggleStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status === "Pending" ? "Completed" : "Pending",
        }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  /* 🗑 Delete task */
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  /* 🔍 Filter tasks */
  const visibleTasks = tasks.filter((task) => {
    if (view === "Pending") return task.status === "Pending";
    if (view === "Completed") return task.status === "Completed";
    return true;
  });

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Task Tracker</h2>
        <ul>
          <li
            className={view === "All" ? "active" : ""}
            onClick={() => setView("All")}
          >
            All Tasks
          </li>
          <li
            className={view === "Pending" ? "active" : ""}
            onClick={() => setView("Pending")}
          >
            Pending
          </li>
          <li
            className={view === "Completed" ? "active" : ""}
            onClick={() => setView("Completed")}
          >
            Completed
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="header">
          <h1>{view} Tasks</h1>

          <div className="add-task">
            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button onClick={addTask}>+ Add Task</button>
          </div>
        </div>

        <div className="task-list">
          {visibleTasks.length === 0 && (
            <p className="empty">No tasks found</p>
          )}

          {visibleTasks.map((task) => (
            <div
              key={task._id}
              className={`task-card ${
                task.status === "Completed" ? "completed" : ""
              }`}
            >
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>Priority: {task.priority}</p>
                <p>Status: {task.status}</p>
                <p>Due: {task.dueDate?.slice(0, 10)}</p>
              </div>

              <div className="actions">
                <button onClick={() => toggleStatus(task._id, task.status)}>
                  {task.status === "Pending"
                    ? "Mark Completed"
                    : "Mark Pending"}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
