import { useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { FaCircleUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ username, fetchPost }) {
  const ENDPOINT = import.meta.env.VITE_REACT_BASE_URL;
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const addPost = async (postContent) => {
    try {
      const response = await fetch(`${ENDPOINT}/post/createPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: postContent }),
      });
      if (response.ok) {
        setPostContent("");
      } else {
        throw new Error("Failed to create post!");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim() === "") {
      alert("Please write something to post!");
      return;
    }
    addPost(postContent);
    setIsModalOpen(false);
    fetchPost();
  };

  return (
    <div className="mx-auto sticky top-0 z-50 bg-white px-4 sm:px-6 lg:px-8 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-semibold text-teal-500 sm:text-2xl cursor-pointer">
        E-Social
      </h1>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-1 px-3 rounded-full flex items-center gap-1 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white"
        >
          <HiPencilSquare className="text-lg" />
          <span className="text-sm">Post</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500">
          <FaCircleUser className="text-2xl" />
          <span className="hidden sm:flex text-black font-semibold">
            {username}
          </span>
        </button>
        <button
          className="p-2 rounded-full bg-red-50 hover:bg-red-100"
          onClick={handleLogout}
          title="Logout"
        >
          <FiLogOut className="text-xl text-red-600" />
        </button>
      </div>
      <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white w-[85%] max-w-3xl p-6 sm:p-8 rounded-2xl shadow-md"
          >
            <h2 className="text-lg font-semibold text-teal-700 mb-4">
              Create a Post
            </h2>
            <form onSubmit={handlePostSubmit}>
              <textarea
                className="w-full h-40 p-2 border border-gray-300 rounded mb-4 outline-gray-400"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 py-1 px-3 text-gray-600 rounded hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1 px-3 bg-teal-500 text-white rounded"
                >
                  Post
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
