import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export default function Signup() {
  const ENDPOINT = import.meta.env.VITE_REACT_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

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

    if (
      !formData.username.trim() ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      if (formData.password.length < 8) {
        setError("Password must have at least 8 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Password and Confirm Password does not match!");
        return;
      }
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
        setSuccessMessage(true);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
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
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-cyan-100 to-white px-3 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="max-w-md w-full space-y-8 p-8 sm:p-10 backdrop-blur-md shadow-lg bg-slate-100/80 rounded-lg"
            >
              {successMessage ? (
                <div className="text-green-500 text-xl sm:text-2xl grid place-items-center font-semibold h-[200px]">
                  <div className="flex items-center gap-2">
                    <IoIosCheckmarkCircleOutline size={30} />{" "}
                    <span>Signup Successful!</span>
                  </div>
                </div>
              ) : (
                <>
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
                          pattern="^[a-z0-9_\-]{3,20}$"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-gray-900 rounded-sm focus:outline-none text-sm sm:text-base placeholder:text-neutral-400"
                          placeholder="Username"
                          autoComplete="off"
                          required
                        />
                      </div>
                      <div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-gray-900 rounded-sm focus:outline-none text-sm sm:text-base placeholder:text-neutral-400"
                          placeholder="Email address"
                          autoComplete="off"
                          required
                        />
                      </div>
                      <div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-gray-900 rounded-sm focus:outline-none text-sm sm:text-base placeholder:text-neutral-400"
                          placeholder="Password"
                          required
                        />
                      </div>
                      <div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-gray-900 rounded-sm focus:outline-none text-sm sm:text-base placeholder:text-neutral-400"
                          placeholder="Confirm Password"
                          required
                        />
                      </div>
                    </div>
                    {error && (
                      <div className="text-red-500 text-xs sm:text-sm mt-2">
                        {error}
                      </div>
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
                      Login here
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
