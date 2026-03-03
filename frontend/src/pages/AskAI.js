import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  const handleAsk = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://YOUR_BACKEND_URL/ask-doubt",
        { question, language: "English" },
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );

      setResponse(res.data.answer.problem_understanding);
    } catch (err) {
      alert("Error asking doubt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Ask AI</h2>
        <button onClick={logout} className="text-red-500">Logout</button>
      </div>

      <textarea
        className="w-full p-4 border rounded-xl"
        rows="4"
        placeholder="Ask your programming doubt..."
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAsk}
        className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {response && (
        <div className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
          {response}
        </div>
      )}
    </div>
  );
}