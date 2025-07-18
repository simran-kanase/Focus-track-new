import { useState } from "react";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I’m your StudySync AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    const payload = {
      contents: [
        {
          parts: [{ text: input }],
        },
      ],
    };

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const replyText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ No response from Gemini API.";

      setMessages([...updatedMessages, { role: "assistant", content: replyText }]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "❌ Error from Gemini API." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="max-w-2xl p-4 mx-auto bg-white shadow rounded-xl">
        <h1 className="mb-4 text-2xl font-bold text-center text-indigo-800">💬 AI Chatbot</h1>

        <div className="h-[400px] overflow-y-auto border rounded p-4 space-y-2 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-blue-200 text-right ml-auto w-fit max-w-[75%]"
                  : "bg-gray-200 text-left mr-auto w-fit max-w-[75%]"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && <p className="text-sm text-gray-400">Typing...</p>}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded shadow"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
