import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const closeMenu = () => setOpen(false);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow"
          : ""
      }`}
    >
      <div className="flex justify-between items-center px-8 py-4">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 font-semibold text-xl"
        >
          ⚡ DoubtBridge
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">

          {isAuthenticated && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {userEmail}
            </span>
          )}

          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
          >
            Dashboard
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Get Started
              </Link>
            </>
          )}

          <button
            onClick={() => setDark(!dark)}
            className="ml-2"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-8 pb-6 flex flex-col gap-4 bg-white dark:bg-gray-900">

          {isAuthenticated && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {userEmail}
            </span>
          )}

          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            onClick={closeMenu}
          >
            Dashboard
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-center"
              >
                Get Started
              </Link>
            </>
          )}

          <button
            onClick={() => setDark(!dark)}
            className="text-left"
          >
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      )}
    </nav>
  );
}