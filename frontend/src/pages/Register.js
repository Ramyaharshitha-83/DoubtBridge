import Navbar from "../components/Navbar";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Navbar />

      <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl w-[400px] mt-20">
        <h2 className="text-2xl font-semibold text-center">Create your account</h2>
        <p className="text-center text-gray-500 mt-2">Choose your role and get started</p>

        <div className="flex gap-4 mt-6">
          <div className="border-2 border-indigo-600 p-4 rounded-xl flex-1 text-center">
            🎓 Student
          </div>
          <div className="border p-4 rounded-xl flex-1 text-center">
            👨‍🏫 Mentor
          </div>
        </div>

        <input className="w-full mt-6 p-3 border rounded-lg" placeholder="Full Name" />
        <input className="w-full mt-4 p-3 border rounded-lg" placeholder="Email" />
        <input className="w-full mt-4 p-3 border rounded-lg" type="password" placeholder="Password" />

        <button className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg">
          Create Account
        </button>
      </div>
    </div>
  );
}