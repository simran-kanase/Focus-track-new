// src/pages/Scheduler.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const Scheduler = () => {
  const [subjects, setSubjects] = useState([
    { name: "", isWeak: false, slot: "Morning" }
  ]);
  const [hours, setHours] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [useWeakPriority, setUseWeakPriority] = useState(false);

  // Load from backend on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/scheduler`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSchedule(res.data);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      }
    };

    fetchSchedule();
  }, []);

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = field === "isWeak" ? value.target.checked : value;
    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: "", isWeak: false, slot: "Morning" }]);
  };

  const generateSchedule = async () => {
    const validSubjects = subjects.filter((s) => s.name.trim() !== "");
    if (!hours || validSubjects.length === 0) return;

    const weights = validSubjects.map((s) =>
      useWeakPriority && s.isWeak ? 2 : 1
    );
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    const plan = validSubjects.map((s, i) => ({
      subject: s.name,
      time: ((weights[i] / totalWeight) * parseFloat(hours)).toFixed(2),
      slot: s.slot
    }));

    setSchedule(plan);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/scheduler`,
        { schedule: plan },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error("Error saving schedule:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-100 to-indigo-100">
      <h1 className="mb-6 text-3xl font-bold text-center text-indigo-800">
        📅 Smart Study Scheduler (Advanced)
      </h1>

      <div className="max-w-xl p-6 mx-auto space-y-4 bg-white shadow rounded-xl">
        <label className="block text-lg font-medium text-gray-700">
          Available Study Hours Today:
        </label>
        <input
          type="number"
          min="1"
          className="w-full p-2 border rounded shadow"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <label className="block mt-4 font-semibold text-gray-800 text-md">
          <input
            type="checkbox"
            checked={useWeakPriority}
            onChange={(e) => setUseWeakPriority(e.target.checked)}
            className="mr-2"
          />
          ✅ Prioritize weak subjects
        </label>

        {subjects.map((subj, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-between gap-3 mt-4 md:flex-row"
          >
            <input
              type="text"
              placeholder={`Subject ${i + 1}`}
              className="w-full p-2 border rounded shadow"
              value={subj.name}
              onChange={(e) => handleSubjectChange(i, "name", e.target.value)}
            />

            <select
              value={subj.slot}
              onChange={(e) => handleSubjectChange(i, "slot", e.target.value)}
              className="p-2 border rounded shadow"
            >
              <option>Morning</option>
              <option>Evening</option>
              <option>Sunday</option>
            </select>

            <label className="text-sm">
              <input
                type="checkbox"
                checked={subj.isWeak}
                onChange={(e) => handleSubjectChange(i, "isWeak", e)}
                className="mr-1"
              />
              Weak?
            </label>
          </div>
        ))}

        <button
          onClick={addSubject}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded shadow hover:bg-blue-600"
        >
          ➕ Add Subject
        </button>

        <button
          onClick={generateSchedule}
          className="float-right px-6 py-2 mt-4 text-white bg-green-600 rounded shadow hover:bg-green-700"
        >
          Generate Plan ✅
        </button>
      </div>

      {schedule.length > 0 && (
        <div className="max-w-xl p-6 mx-auto mt-10 bg-white shadow rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-center text-indigo-700">
            🗓️ Your Custom Study Plan
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-700 border-b">
                <th className="p-2">Subject</th>
                <th className="p-2">Time (hrs)</th>
                <th className="p-2">Slot</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, i) => (
                <tr key={i} className="text-gray-800 border-b">
                  <td className="p-2">{row.subject}</td>
                  <td className="p-2">{row.time}</td>
                  <td className="p-2">{row.slot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
