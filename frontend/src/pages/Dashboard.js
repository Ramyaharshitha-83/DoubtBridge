import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Ask AI</h2>
          <p className="text-gray-500 mt-2">
            Get instant explanations for your doubts.
          </p>
          <Link
            to="/ask"
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Start Asking →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Daily Limit</h2>
          <p className="text-gray-500 mt-2">
            You can ask 5 questions per day.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Upgrade</h2>
          <p className="text-gray-500 mt-2">
            Unlock unlimited AI access.
          </p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}