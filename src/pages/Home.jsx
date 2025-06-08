import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { convertCreatedAt } from "../utils/dateConverter";
import { MdDelete } from "react-icons/md";
import { FiMoreVertical } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaCircleUser } from "react-icons/fa6";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Date = ({ createdAt }) => {
  const formattedTime = convertCreatedAt(createdAt);
  return (
    <>
      <div>{formattedTime}</div>
    </>
  );
};

export default function Home() {
  const ENDPOINT = import.meta.env.VITE_REACT_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || token == null) {
      navigate("/login");
    } else {
      fetchUser();
      fetchPosts();
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchAllUsers();
    console.log("user fetched");
  }, []);

  // Get User Details
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ENDPOINT}/auth/getuserdetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userdetails = await response.json();
      setUser(userdetails?.user);
      await fetchPosts();
      await fetchFriendRequests();
    } catch (error) {
      console.error("Invalid token:", error);
    } finally {
      setLoading(false);
    }
  };
  // Get all feed
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/post/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        throw new Error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  // Get all friend requests
  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/friend-request/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data);
      } else {
        throw new Error("Failed to fetch friend requests");
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };
  // Handle friend request
  const handleFriendRequest = async (requestId, status) => {
    try {
      const response = await fetch(
        `${ENDPOINT}/friend-request/${requestId}/${status}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchFriendRequests();
        fetchUser();
      } else {
        throw new Error(`Failed to ${status} friend request`);
      }
    } catch (error) {
      console.error(`Error ${status}ing friend request:`, error);
    }
  };
  // Like Post
  const likePost = async (postId) => {
    try {
      const response = await fetch(`${ENDPOINT}/post/${postId}/likes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchPosts();
      } else {
        throw new Error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  // Comment on Post
  const addComment = async (postId) => {
    try {
      const response = await fetch(`${ENDPOINT}/post/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });
      if (response.ok) {
        setCommentContent("");
        fetchPosts();
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  // Delete Post with Confirmation
  const confirmDeletePost = (postId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (isConfirmed) {
      deletePost(postId);
    }
  };
  // Delete Post
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${ENDPOINT}/post/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        // fetchPosts();
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/auth/allusers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
        // console.log(allUsers);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };
  // Send friend request
  const addFriend = async (userId) => {
    try {
      const response = await fetch(
        `${ENDPOINT}/friend-request/sendRequest/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (response.ok) {
        setAllUsers((prev) => prev.filter((user) => user._id !== userId));
      } else {
        throw new Error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  // Expand Comments
  const [expandedComments, setExpandedComments] = useState({});
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Delete Post Menu
  const [openMenuPostId, setOpenMenuPostId] = useState(false);
  const toggleMenu = (post) => {
    setOpenMenuPostId(openMenuPostId === post._id ? null : post._id);
  };
  const menuRefs = useRef({});
  useEffect(() => {
    const handleClickOutside = (event) => {
      const openMenuRef = menuRefs.current[openMenuPostId];
      if (openMenuRef && !openMenuRef.contains(event.target)) {
        setOpenMenuPostId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuPostId]);

  const urlParams = new URLSearchParams(window.location.search);
  const feedtype = urlParams.get("type");
  const [feed, setFeed] = useState(`${feedtype}`);

  const handleTabClick = (tab) => {
    setFeed(tab);
    navigate(`/feed?type=${tab}`);
  };

  return (
    <>
      {token ? (
        <div className="bg-slate-50">
          <Navbar username={user?.username} fetchPost={fetchPosts} />
          {loading ? (
            <div className="grid place-items-center items-center h-screen">
              <div className="flex flex-col items-center">
                <Loader />
                <p className="text-gray-500 text-sm mt-2">Please wait...</p>
              </div>
            </div>
          ) : (
            <main className="max-w-7xl mx-auto sm:px-6 py-6">
              <div className="flex flex-col md:flex-row sm:gap-7 lg:gap-10">
                <div className="w-11/12 sm:w-3/4 mx-auto">
                  {/* Feed tab */}
                  <div className="relative inline-flex rounded-md bg-gray-100 p-1 mb-6">
                    <div
                      className={`absolute top-0 left-0 h-full w-1/2 bg-white rounded-md shadow transition-transform duration-300 ${
                        feed === "mypost" ? "translate-x-full" : "translate-x-0"
                      }`}
                    />
                    <button
                      onClick={() => handleTabClick("recent")}
                      className={`relative z-10 w-32 sm:w-40 text-sm sm:text-base font-semibold py-1 px-2 rounded-md transition-colors duration-300 ${
                        feed === "recent" ? "text-black" : "text-gray-500"
                      }`}
                    >
                      Recent updates
                    </button>
                    <button
                      onClick={() => handleTabClick("mypost")}
                      className={`relative z-10 w-32 sm:w-40 text-sm sm:text-base font-semibold py-1 px-2 rounded-md transition-colors duration-300 ${
                        feed === "mypost" ? "text-black" : "text-gray-500"
                      }`}
                    >
                      My Posts
                    </button>
                  </div>

                  {/* All Posts  */}
                  {posts.filter((post) =>
                    feed === "mypost" ? post.author._id === user._id : true
                  ).length === 0 ? (
                    <div className="text-gray-400">
                      {feed === "mypost"
                        ? "You haven't posted anything yet. Start posting now!"
                        : "Add friends to see posts!"}
                    </div>
                  ) : (
                    <>
                      {posts
                        .filter((post) =>
                          feed === "mypost"
                            ? post.author._id === user._id
                            : post.author._id !== user._id
                        )
                        .map((post) => (
                          <div
                            key={post?._id}
                            className="bg-white rounded-lg shadow border mb-6 p-6 relative"
                          >
                            {/* Post Content  */}
                            <div className="flex items-center mb-4">
                              <div>
                                <h3 className="font-semibold">
                                  {post?.author?.username}
                                </h3>
                                <div className="text-gray-500 text-xs">
                                  <Date createdAt={post?.createdAt} />
                                </div>
                              </div>
                            </div>
                            <p className="mb-4 text-sm sm:text-base">
                              {post?.content}
                            </p>

                            {/* Like, Comment and Delete post */}
                            <div className="flex items-center text-gray-500 text-sm">
                              {/* Like Button  */}
                              <button
                                className="flex items-center mr-6 hover:text-red-600"
                                onClick={() => likePost(post?._id)}
                              >
                                <svg
                                  className="w-5 h-5 mr-1"
                                  fill={
                                    post.likes.includes(user?._id)
                                      ? "red"
                                      : "none"
                                  }
                                  stroke={
                                    post.likes.includes(user?._id)
                                      ? "red"
                                      : "currentColor"
                                  }
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                                <div
                                  className={
                                    post.likes.includes(user?._id)
                                      ? "font-semibold text-red-500"
                                      : "font-normal"
                                  }
                                >
                                  {post?.likes?.length}{" "}
                                  {post?.likes?.length === 1 ? "like" : "likes"}
                                </div>
                              </button>
                              {/* Comment Button  */}
                              <button
                                className="flex items-center hover:text-teal-600"
                                onClick={() => toggleComments(post?._id)}
                              >
                                <svg
                                  className="w-5 h-5 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                                {post?.comments?.length}{" "}
                                {post?.comments?.length === 1
                                  ? "comment"
                                  : "comments"}
                              </button>
                            </div>

                            {/* Delete Button */}
                            <div className="absolute top-3 right-3">
                              {user?._id === post?.author?._id && (
                                <div
                                  className="relative"
                                  ref={(el) =>
                                    (menuRefs.current[post._id] = el)
                                  }
                                >
                                  <button onClick={() => toggleMenu(post)}>
                                    <FiMoreVertical size={20} />
                                  </button>

                                  {/* Dropdown menu */}
                                  {openMenuPostId === post._id && (
                                    <div className="absolute top-3 right-2 mt-2 bg-white border rounded shadow-md z-10">
                                      <button
                                        onClick={() =>
                                          confirmDeletePost(post._id)
                                        }
                                        className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 w-full text-sm"
                                      >
                                        <MdDelete className="mr-1 mt-0.5" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Expand comments  */}
                            <AnimatePresence>
                              {expandedComments[post?._id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                  }}
                                  className="mt-4"
                                >
                                  <h4 className="font-semibold text-xs sm:text-sm text-teal-600">
                                    Comments
                                  </h4>
                                  {post?.comments?.map((comment) => (
                                    <div
                                      key={comment?._id}
                                      className="my-2 p-2 bg-gray-100 rounded"
                                    >
                                      <p className="text-[14px] sm:text-sm">
                                        <span className="font-medium">
                                          {comment?.author?.username}:
                                        </span>{" "}
                                        {comment?.content}
                                      </p>
                                      <small className="text-gray-500 text-[10px]">
                                        <Date createdAt={comment?.createdAt} />
                                      </small>
                                    </div>
                                  ))}
                                  <div className="mt-2 flex flex-col">
                                    <textarea
                                      className="w-full p-2 border text-[14px] sm:text-sm rounded resize-none outline-gray-300"
                                      placeholder="Add a comment..."
                                      rows={3}
                                      value={commentContent}
                                      onChange={(e) =>
                                        setCommentContent(e.target.value)
                                      }
                                    />
                                    <button
                                      className="mt-2 px-4 py-2 bg-slate-200 text-black rounded text-xs hover:bg-slate-300 w-fit self-end"
                                      onClick={() => addComment(post?._id)}
                                    >
                                      Post Comment
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                    </>
                  )}

                  {/* Add new friends  */}
                  <div className="max-w-xl mt-5 bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg mb-4 font-semibold text-teal-500">
                      Add New Friends
                    </h2>
                    <div className="space-y-4">
                      {allUsers.map((user) => (
                        <div
                          key={user?._id}
                          className="flex justify-between items-center"
                        >
                          <span className="font-semibold text-sm sm:text-base">
                            {user?.username}
                          </span>
                          <button
                            className="px-3 py-1 bg-teal-500 text-white text-[12px] sm:text-sm rounded-full hover:bg-teal-600"
                            onClick={() => addFriend(user?._id)}
                          >
                            Add Friend
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="w-11/12 sm:w-3/4 md:w-1/2 md:mt-16 mx-auto">
                  {/* Your Profile  */}
                  <div className="bg-teal-50 rounded-lg shadow border p-6 mb-6">
                    <h2 className="text-center mb-2 text-teal-500">Profile</h2>
                    <div className="flex items-center justify-center text-base sm:text-lg">
                      <div>
                        <p className="text-teal-700 w-full flex items-center justify-center gap-2">
                          <FaCircleUser className="text-xl" />
                          <span className="font-semibold">
                            {user?.username}
                          </span>
                        </p>
                        <div className="flex justify-center gap-10 text-teal-700 text-xs sm:text-sm mt-2">
                          <div>
                            <p className="text-teal-700">friends</p>
                            <p className="font-bold text-center">
                              {user?.friends.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-teal-700">Posts</p>
                            <p className="font-bold text-center">
                              {
                                posts.filter(
                                  (post) => post.author._id === user._id
                                ).length
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Friend Requests  */}
                  <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg mb-4 text-gray-600">
                      New Friend Requests
                    </h2>
                    {friendRequests.length === 0 ? (
                      <div className="text-[12px] sm:text-sm text-gray-400">
                        No new request
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {friendRequests.map((request) => (
                          <div
                            key={request?._id}
                            className="flex flex-col items-start justify-between"
                          >
                            <div className="flex items-start">
                              <div>
                                <h3 className="font-semibold mb-1 text-[12px] sm:text-sm">
                                  {request?.sender?.username}
                                </h3>
                              </div>
                            </div>
                            <div className="space-x-2 flex">
                              <button
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-indigo-700"
                                onClick={() =>
                                  handleFriendRequest(request?._id, "accepted")
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
                                onClick={() =>
                                  handleFriendRequest(request?._id, "rejected")
                                }
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Your Friends  */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg mb-4 text-gray-600">Your Friends</h2>
                    {user?.friends?.length === 0 ? (
                      <div className="text-[12px] sm:text-sm text-gray-400">
                        No Friends
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {user?.friends?.map((friend) => (
                          <div key={friend._id} className="flex items-center">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mr-2 flex items-center justify-center "></div>
                            <span className="text-sm sm:text-base">
                              {friend?.username}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>
          )}
          <Footer />
        </div>
      ) : null}
    </>
  );
}
