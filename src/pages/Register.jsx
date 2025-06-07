import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Signup() {
  const ENDPOINT = import.meta.env.VITE_REACT_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.username.trim() || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${ENDPOINT}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Signup successful!");
        setFormData({ username: "", email: "", password: "" });
        navigate("/login");
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
          <div className="flex flex-col items-center">
            <Loader />
            <p className="text-gray-500 text-sm mt-2">Please wait...</p>
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh)] flex items-center justify-center bg-gradient-to-br from-teal-100 via-cyan-100 to-white py-12 px-3 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 p-8 sm:p-10 backdrop-blur-md shadow-lg bg-slate-100/60 rounded-lg">
            <div className="pl-1 text-2xl sm:text-3xl text-teal-600">
              <p className="text-xs sm:text-sm font-semibold">E-Social</p>
              <p className="font-semibold mt-2">Create Account</p>
              <p className="text-xs sm:text-sm mt-1 text-neutral-700">
                Connect with friends, meet new ones, and share moments.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="rounded-sm space-y-4">
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    pattern="^[a-z0-9_\-]{3,10}$"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-sm focus:outline-none text-sm sm:text-base placeholder:text-neutral-300"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-sm focus:outline-none text-sm sm:text-base placeholder:text-neutral-300"
                    placeholder="Email address"
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
                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-sm focus:outline-none text-sm sm:text-base placeholder:text-neutral-300"
                    placeholder="Password"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs sm:text-sm mt-2">{error}</p>
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
                  SIGN UP
                </button>
              </div>
            </form>
            <div className="text-gray-500 text-xs sm:text-sm">
              Already have account?{" "}
              <Link to="/login" className="underline text-blue-600">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
