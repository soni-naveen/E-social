import React, { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Navbar({ username }) {
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
    addPost(postContent);
    setIsModalOpen(false);
    setTimeout(()=>{
      navigate("/home");
    },1000);
  };

  return (
    <div className="mx-auto sticky top-0 z-10 bg-white px-4 sm:px-6 lg:px-8 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold text-teal-500 sm:text-2xl cursor-pointer">
        E-Social
      </h1>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full text-teal-600 hover:bg-teal-100"
        >
          <IoMdAddCircleOutline className="text-2xl" />
        </button>
        <button className="flex items-center space-x-2 text-gray-500">
          <FaCircleUser className="text-2xl" />
          <span className="hidden sm:flex text-black font-bold">
            {username}
          </span>
        </button>
        <button
          className="p-2 rounded-full bg-red-50 hover:bg-red-100"
          onClick={handleLogout}
        >
          <FiLogOut className="text-xl text-red-600" />
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white w-[80%] md:w-1/2 p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold text-teal-700 mb-4">
              Create a Post
            </h2>
            <form onSubmit={handlePostSubmit}>
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 py-1.5 px-3 text-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-3 bg-teal-500 text-white rounded"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
