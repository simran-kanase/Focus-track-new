// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import StudyTimer from "./pages/StudyTimer";
import Scheduler from "./pages/Scheduler";
import Assignments from "./pages/Assignments";
import Landing from "./pages/LandingPage";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ✅ Navbar Component
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-3 text-white bg-indigo-600 shadow-md">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <h1 className="text-lg font-bold">🚀 FocusTrack</h1>
        <button onClick={() => setOpen(!open)} className="text-xl text-white md:hidden">
          ☰
        </button>
        <div className="hidden gap-4 text-sm md:flex">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/timer" className="hover:underline">Study Timer</Link>
          <Link to="/scheduler" className="hover:underline">Scheduler</Link>
          <Link to="/assignments" className="hover:underline">Assignments</Link>
          <Link to="/chatbot" className="hover:underline">Chatbot</Link>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="flex flex-col gap-2 mt-2 text-sm md:hidden">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/timer" className="hover:underline">Study Timer</Link>
          <Link to="/scheduler" className="hover:underline">Scheduler</Link>
          <Link to="/assignments" className="hover:underline">Assignments</Link>
          <Link to="/chatbot" className="hover:underline">Chatbot</Link>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

// ✅ Wrapper to use useLocation for Navbar Logic
const LayoutWithNavbar = () => {
  const location = useLocation();
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/timer" element={<StudyTimer />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </>
  );
};

// ✅ Main App Component
function App() {
  return (
    <Router>
      <LayoutWithNavbar />
    </Router>
  );
}

export default App;
