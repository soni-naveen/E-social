import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        navigate("/home");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="grid place-items-center items-center h-screen">
          Loading...
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-sm w-full space-y-8">
            <h2 className="mt-6 text-center text-3xl font-bold text-teal-600">
              Login
            </h2>

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
                    className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {successMessage && (
                <p className="text-green-500 text-sm mt-2">{successMessage}</p>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full mx-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600"
                >
                  LOGIN
                </button>
              </div>
            </form>
            <div className="text-gray-500 text-sm">
              New User?{" "}
              <Link to="/register" className="underline text-blue-600">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
