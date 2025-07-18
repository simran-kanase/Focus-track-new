import React, { useState, useEffect } from "react";
import axios from "axios";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const Assignments = () => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("Homework");
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [alertedToday, setAlertedToday] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/assignments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAssignments(res.data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    const today = getTodayDate();
    const dueToday = assignments.filter((task) => task.dueDate === today && !task.done);
    if (dueToday.length > 0 && !alertedToday) {
      alert(`🔔 You have ${dueToday.length} assignment(s) due today!`);
      setAlertedToday(true);
    }
  }, [assignments, alertedToday]);

  const handleAdd = async () => {
    if (!title || !dueDate) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/assignments`,
        { title, dueDate, type },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAssignments([res.data, ...assignments]);
      setTitle("");
      setDueDate("");
      setType("Homework");
    } catch (err) {
      console.error("Error adding assignment:", err);
    }
  };

  const toggleDone = async (id) => {
    try {
      const updated = assignments.map((task) =>
        task._id === id ? { ...task, done: !task.done } : task
      );
      setAssignments(updated);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/assignments/${id}`,
        { done: !assignments.find((t) => t._id === id).done },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error("Error toggling assignment:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssignments(assignments.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting assignment:", err);
    }
  };

  const deleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/assignments/clear`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAssignments([]);
      } catch (err) {
        console.error("Error deleting all assignments:", err);
      }
    }
  };

  const filtered = assignments.filter((task) => {
    if (filter === "all") return true;
    return filter === "done" ? task.done : !task.done;
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-100 to-indigo-100">
      <h1 className="mb-6 text-3xl font-bold text-center text-indigo-800">
        📝 Assignment Manager
      </h1>

      <div className="max-w-xl p-6 mx-auto space-y-4 bg-white shadow rounded-xl">
        <input
          type="text"
          placeholder="Assignment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded shadow"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded shadow"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded shadow"
        >
          <option>Homework</option>
          <option>Project</option>
          <option>Presentation</option>
          <option>Assignment</option>
          <option>Other</option>
        </select>

        <button
          onClick={handleAdd}
          className="w-full py-2 text-white bg-indigo-600 rounded shadow hover:bg-indigo-700"
        >
          ➕ Add Task
        </button>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        {["all", "pending", "done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {f === "all" ? "All" : f === "done" ? "Done" : "Pending"}
          </button>
        ))}
      </div>

      <div className="max-w-xl p-6 mx-auto mt-6 space-y-4 bg-white shadow rounded-xl">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          filtered.map((task) => (
            <div
              key={task._id}
              className={`p-4 rounded-lg flex justify-between items-center ${
                task.done ? "bg-green-100" : "bg-gray-50"
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">
                  🗓️ Due: {task.dueDate} | 📌 {task.type}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleDone(task._id)}
                  className={`px-3 py-1 text-white rounded ${
                    task.done ? "bg-gray-600" : "bg-green-600"
                  }`}
                >
                  {task.done ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  ❌
                </button>
              </div>
            </div>
          ))
        )}
        {assignments.length > 0 && (
          <button
            onClick={deleteAll}
            className="w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            🗑️ Delete All Tasks
          </button>
        )}
      </div>
    </div>
  );
};

export default Assignments;