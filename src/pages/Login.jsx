import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Login() {
  const ENDPOINT = import.meta.env.VITE_REACT_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.username.trim() || !formData.password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${ENDPOINT}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setSuccessMessage("Login successful!");
        setFormData({ username: "", password: "" });
        navigate("/?feed=recent");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server Error!");
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();

  return (
    <>
      {loading ? (
        <div className="grid place-items-center items-center h-screen">
          <div className="flex flex-col items-center">
            <Loader />
            <p className="text-gray-500 text-sm mt-2">Please wait...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-cyan-100 to-white py-12 px-3 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="max-w-md w-full space-y-8 p-8 sm:p-10 backdrop-blur-md shadow-lg bg-slate-100/80 rounded-lg"
            >
              <div className="pl-1 text-2xl sm:text-3xl text-teal-600">
                <p className="text-xs sm:text-sm font-semibold">E-Social</p>
                <p className="font-semibold mt-2">Welcome Back!</p>
                <p className="text-xs sm:text-sm mt-1 text-neutral-700">
                  Sign in to access your account.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="rounded-sm shadow-sm space-y-4">
                  <div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-sm focus:outline-none text-sm sm:text-base placeholder:text-neutral-400"
                      placeholder="Username"
                    />
                  </div>
                  <div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-sm focus:outline-none text-sm sm:text-base placeholder:text-neutral-400"
                      placeholder="Password"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs sm:text-sm mt-2">
                    {error}
                  </p>
                )}
                {successMessage && (
                  <p className="text-green-500 text-xs sm:text-sm mt-2">
                    {successMessage}
                  </p>
                )}
                <div>
                  <button
                    type="submit"
                    className="w-full mx-auto flex justify-center py-2 px-4 border border-transparent text-xs sm:text-sm font-semibold rounded-md text-white bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600"
                  >
                    LOGIN
                  </button>
                </div>
              </form>
              <div className="text-gray-500 text-xs sm:text-sm">
                Don’t have an account?{" "}
                <Link to="/register" className="underline text-blue-600">
                  Create now
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
