import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing        from "./pages/Landing";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Dashboard      from "./pages/Dashboard";
import AskAI          from "./pages/AskAI";
import Topics         from "./pages/Topics";
import Mentors        from "./pages/Mentors";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ask"       element={<ProtectedRoute><AskAI /></ProtectedRoute>} />
          <Route path="/topics"    element={<ProtectedRoute><Topics /></ProtectedRoute>} />
          <Route path="/mentors"   element={<ProtectedRoute><Mentors /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;