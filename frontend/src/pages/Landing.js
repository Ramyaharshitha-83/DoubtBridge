import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="dark:bg-gray-950 dark:text-white transition-colors duration-500">
      <Navbar />

      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-lg bg-white/40 dark:bg-white/10 p-12 rounded-3xl shadow-2xl max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold">
            Instant Doubt Solving for <span className="text-indigo-600">Future Engineers</span>
          </h1>

          <p className="mt-6 text-gray-700 dark:text-gray-300">
            Get AI explanations or connect with verified mentors.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/ask" className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
              Ask AI Now
            </Link>
            <Link to="/register" className="bg-gray-200 dark:bg-gray-700 px-6 py-3 rounded-lg">
              Become a Mentor
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}