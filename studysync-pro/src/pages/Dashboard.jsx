// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import axios from "axios";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [newMarks, setNewMarks] = useState("");

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const addSubject = async () => {
    if (!newSubject.trim() || !newMarks) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects`,
        { name: newSubject, marks: parseInt(newMarks) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSubjects([...subjects, res.data]);
      setNewSubject("");
      setNewMarks("");
    } catch (err) {
      console.error("Error adding subject:", err);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSubjects(subjects.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting subject:", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const chartData = {
    labels: subjects.map((s) => s.name),
    datasets: [
      {
        label: "Marks",
        data: subjects.map((s) => s.marks),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-4 text-2xl font-semibold text-center text-blue-700">📊 Your Dashboard</h1>

      <div className="p-4 mb-6 bg-white shadow rounded-xl">
        <h2 className="mb-2 text-lg font-semibold">➕ Add Subject</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Subject Name"
            className="w-1/2 px-3 py-2 border rounded"
          />
          <input
            type="number"
            value={newMarks}
            onChange={(e) => setNewMarks(e.target.value)}
            placeholder="Marks"
            className="w-1/4 px-3 py-2 border rounded"
          />
          <button
            onClick={addSubject}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      <div className="p-4 mb-6 bg-white shadow rounded-xl">
        <h2 className="mb-2 text-lg font-semibold">📚 Subjects & Marks</h2>
        {subjects.length === 0 ? (
          <p className="text-gray-500">No subjects added yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2">Subject</th>
                <th className="py-2">Marks</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub) => (
                <tr key={sub._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{sub.name}</td>
                  <td className="py-2">{sub.marks}</td>
                  <td className="py-2">
                    <button
                      onClick={() => deleteSubject(sub._id)}
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {subjects.length > 0 && (
        <div className="p-4 mb-6 bg-white shadow rounded-xl">
          <h2 className="mb-3 text-xl font-semibold">📈 Performance Overview</h2>
          <Bar data={chartData} />
        </div>
      )}

      <div className="grid gap-4 mt-4 md:grid-cols-4 sm:grid-cols-2">
        <Link to="/timer" className="p-4 text-center text-white bg-blue-500 shadow rounded-xl hover:bg-blue-600">
          ⏱️ Study Timer
        </Link>
        <Link to="/scheduler" className="p-4 text-center text-white bg-green-500 shadow rounded-xl hover:bg-green-600">
          📅 Study Scheduler
        </Link>
        <Link to="/assignments" className="p-4 text-center text-white bg-yellow-500 shadow rounded-xl hover:bg-yellow-600">
          📝 Assignments
        </Link>
        <Link to="/chatbot" className="p-4 text-center text-white bg-purple-500 shadow rounded-xl hover:bg-purple-600">
          🤖 AI Assistant
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;