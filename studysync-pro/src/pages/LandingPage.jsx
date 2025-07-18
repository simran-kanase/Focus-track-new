import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Static quotes or use an API later
const quotes = [
  "Push yourself, because no one else is going to do it for you.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Study now, shine later."
];

const getRandomQuote = () => {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
};

const LandingPage = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(getRandomQuote()); 
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-100 to-purple-200">
      {/* App Title */}
      <motion.h1 
        className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        FocusTrack
      </motion.h1>

      {/* Motivational Quote */}
      <motion.p 
        className="max-w-xl mb-8 text-xl italic text-center text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        “{quote}”
      </motion.p>

      
      <div className="mt-6 space-x-4">
  <Link to="/login" className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">
    Login
  </Link>
  <Link to="/register" className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
    Register
  </Link>
</div>
    </div>
  );
};

export default LandingPage;
