import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/feed" element={<Home />} />
        <Route path="/" element={<Navigate to="/feed?type=recent" replace />} />
        <Route path="/home" element={<Navigate to="/feed?type=recent" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
