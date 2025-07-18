import React, { useState, useEffect, useRef } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

// Register chart components
ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const beepSound = "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg";

const StudyTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [alarmMinutes, setAlarmMinutes] = useState("");
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("studyHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const timerRef = useRef(null);
  const alarmTimeoutRef = useRef(null);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    if (time > 0) {
      const now = new Date();
      const date = now.toLocaleDateString();
      const timeStr = formatTime(time);
      const newEntry = {
        date,
        seconds: time,
        label: timeStr,
        timestamp: now.toISOString()
      };

      const updated = [...history, newEntry];
      setHistory(updated);
      localStorage.setItem("studyHistory", JSON.stringify(updated));
    }

    setIsRunning(false);
    setTime(0);
    setAlarmTriggered(false);
    clearTimeout(alarmTimeoutRef.current);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("studyHistory");
  };

  const triggerAlarm = () => {
    setAlarmTriggered(true);
    new Audio(beepSound).play();
    alert("⏰ Time's up! Take a break or change subject.");
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      if (alarmMinutes && !alarmTriggered) {
        alarmTimeoutRef.current = setTimeout(triggerAlarm, alarmMinutes * 60 * 1000);
      }
    } else {
      clearInterval(timerRef.current);
      clearTimeout(alarmTimeoutRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(alarmTimeoutRef.current);
    };
  }, [isRunning]);

  // Group weekly data
  const getWeeklyData = () => {
    const map = {};
    history.forEach((entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      if (!map[date]) map[date] = 0;
      map[date] += entry.seconds;
    });
    const labels = Object.keys(map);
    const data = labels.map((d) => (map[d] / 60).toFixed(2));
    return { labels, data };
  };

  const weekly = getWeeklyData();

  const barData = {
    labels: history.map((h) => h.date),
    datasets: [
      {
        label: "Study Duration (min)",
        data: history.map((h) => (h.seconds / 60).toFixed(2)),
        backgroundColor: "#6366f1"
      }
    ]
  };

  const lineData = {
    labels: weekly.labels,
    datasets: [
      {
        label: "Total Study Time / Day (min)",
        data: weekly.data,
        fill: false,
        borderColor: "#10b981",
        tension: 0.2
      }
    ]
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-br from-blue-100 to-purple-100">
      <h1 className="mb-4 text-3xl font-bold text-blue-800">⏱️ Study Timer + History</h1>

      <div className="px-10 py-4 mb-6 font-mono text-4xl text-gray-800 bg-white shadow rounded-xl">
        {formatTime(time)}
      </div>

      <div className="flex flex-col items-center gap-2 mb-6">
        <label className="text-lg font-semibold">⏰ Alarm (minutes):</label>
        <input
          type="number"
          placeholder="E.g., 25"
          className="w-32 px-4 py-2 text-center border rounded-md shadow"
          value={alarmMinutes}
          onChange={(e) => setAlarmMinutes(e.target.value)}
          disabled={isRunning}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={toggleTimer}
          className={`px-6 py-3 rounded-xl text-white shadow ${
            isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={resetTimer}
          className="px-6 py-3 text-white bg-gray-600 shadow rounded-xl hover:bg-gray-700"
        >
          Reset & Log
        </button>

        <button
          onClick={clearHistory}
          className="px-6 py-3 text-white bg-red-500 shadow rounded-xl hover:bg-red-600"
        >
          Clear History
        </button>
      </div>

      {/* Chart: Bar */}
      {history.length > 0 && (
        <div className="w-full p-6 mb-8 bg-white shadow md:w-2/3 rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-center text-indigo-700">
            📊 Session Log (Bar Chart)
          </h2>
          <Bar data={barData} />
        </div>
      )}

      {/* Chart: Line */}
      {weekly.labels.length > 0 && (
        <div className="w-full p-6 mb-8 bg-white shadow md:w-2/3 rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-center text-green-700">
            📈 Weekly Trends (Line Chart)
          </h2>
          <Line data={lineData} />
        </div>
      )}

      {/* Table */}
      {history.length > 0 && (
        <div className="w-full p-6 bg-white shadow md:w-2/3 rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
            📝 Study Sessions (Table)
          </h2>
          <table className="w-full text-left border">
            <thead>
              <tr className="text-sm bg-gray-100">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Duration</th>
              </tr>
            </thead>
            <tbody>
              {history.map((session, i) => (
                <tr key={i} className="text-sm border-t">
                  <td className="p-2 border">{session.date}</td>
                  <td className="p-2 border">{session.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;
