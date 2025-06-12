import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { convertCreatedAt } from "../utils/dateConverter";
import { MdDelete } from "react-icons/md";
import { FiMoreVertical } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaUserFriends,
} from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

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
  const [commentContent, setCommentContent] = useState({});
  const [friendRequests, setFriendRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const feedtype = urlParams.get("type");
  const [feed, setFeed] = useState(`${feedtype}`);

  const handleTabClick = (tab) => {
    setFeed(tab);
    navigate(`/feed?type=${tab}`);
  };

  useEffect(() => {
    (async function () {
      setFeed(feedtype);
      await fetchPosts();
    })();
  }, [feedtype]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      const fetchData = async () => {
        try {
          await fetchUser();
          await fetchPosts();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [token, navigate]);

  useEffect(() => {
    const allUsers = async () => {
      await fetchAllUsers();
    };
    allUsers();
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
      if (response.ok) {
        const userdetails = await response.json();
        setUser(userdetails?.user);
        await fetchPosts();
        await fetchFriendRequests();
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
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
        await fetchFriendRequests();
        await fetchUser();
        await fetchAllUsers();
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
        body: JSON.stringify({ content: commentContent[postId] }),
      });
      if (response.ok) {
        setCommentContent((prev) => ({ ...prev, [postId]: "" }));
        fetchPosts();
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Delete Post with Confirmation
  const confirmDeletePost = async (postId) => {
    const confirmDelete = await Swal.fire({
      title: "Delete this Post?",
      text: "Are you sure you want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Confirm",
      focusCancel: true, // Set the default focus to Cancel button
    });

    if (confirmDelete.isConfirmed) {
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

  const [buttonStatus, setButtonStatus] = useState({});
  const [sending, setSending] = useState(false);
  // Send friend request
  const addFriend = async (userId) => {
    if (sending || buttonStatus[userId] === "sent") return;
    setSending(true);
    setButtonStatus((prev) => ({ ...prev, [userId]: "sent" }));

    // Wait 1 second before sending request
    await new Promise((resolve) => setTimeout(resolve, 500));
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
      if (!response.ok) throw new Error("Failed to send");

      // Wait 1 second, then remove from list
      setTimeout(() => {
        setAllUsers((prev) => prev.filter((u) => u._id !== userId));
        setButtonStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[userId]; // Clean up
          return newStatus;
        });
        setSending(false);
      }, 1000);
    } catch (error) {
      console.error("Friend request failed:", error);
      setButtonStatus((prev) => ({ ...prev, [userId]: "idle" }));
      setSending(false);
    }
  };

  // Delete Account
  const deleteAccount = async () => {
    try {
      const confirmDelete = await Swal.fire({
        title: "Are You Sure?",
        text: "⚠️This action is irreversible. All your posts, friends, and account data will be permanently removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Confirm",
        focusCancel: true, // Set the default focus to Cancel button
      });

      if (confirmDelete.isConfirmed) {
        try {
          setLoading(true);
          const response = await fetch(`${ENDPOINT}/auth/deleteAccount`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            localStorage.removeItem("token");
            console.log("Account deleted successfully");
          } else {
            throw new Error("Failed to delete account...");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {token ? (
        <div className="bg-slate-50">
          {loading ? (
            <div className="grid place-items-center items-center h-screen">
              <div className="flex flex-col items-center">
                <Loader />
                <p className="text-gray-500 text-sm mt-2">Please wait...</p>
              </div>
            </div>
          ) : (
            <>
              <Navbar username={user?.username} fetchPost={fetchPosts} />
              <div
                onClick={() => setSidebarOpen(true)}
                className="hidden lg:flex lg:absolute top-[88px] right-6 sm:right-5 p-2 lg:w-[350px] bg-white rounded-md shadow transition-shadow hover:cursor-pointer items-center gap-3"
              >
                <RxHamburgerMenu className="text-lg sm:text-xl" />
                <span>My Profile</span>
              </div>

              {/* Overlay */}
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed right-0 top-0 h-full w-[300px] sm:w-[350px] md:w-[400px] bg-white z-50 shadow-2xl overflow-y-auto"
                  >
                    {/* Close button */}
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="absolute top-2 sm:top-4 left-2 p-2 text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-5 sm:w-6 h-5 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <div className="pt-12 sm:pt-16 p-4">
                      {/* Your Profile  */}
                      <div className="bg-teal-50 rounded-lg shadow border p-6 mb-6">
                        <h2 className="text-center mb-2 text-teal-500">
                          Profile
                        </h2>
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
                            <button
                              onClick={deleteAccount}
                              className="text-xs text-red-400 text-center border border-red-400 w-full mt-5 py-1 rounded-full hover:bg-red-100 hover:border-red-100 focus:outline-red-300 transition-colors transition-all"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Friend Requests  */}
                      <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-base sm:text-lg mb-4 text-gray-600">
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
                                      handleFriendRequest(
                                        request?._id,
                                        "accepted"
                                      )
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
                                    onClick={() =>
                                      handleFriendRequest(
                                        request?._id,
                                        "rejected"
                                      )
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
                        <h2 className="text-base sm:text-lg mb-4 text-gray-600">
                          Your Friends
                        </h2>
                        {user?.friends?.length === 0 ? (
                          <div className="text-[12px] sm:text-sm text-gray-400">
                            No Friends
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {user?.friends?.map((friend) => (
                              <div
                                key={friend._id}
                                className="flex items-center"
                              >
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
                  </motion.div>
                )}
              </AnimatePresence>
              <main className="flex flex-col lg:flex-row items-center lg:items-start">
                <div className="w-full flex flex-col md:flex-row sm:gap-7 lg:gap-10">
                  <div className="w-[90%] py-6 sm:w-4/5 md:w-3/4 max-w-3xl mx-auto">
                    {/* Feed tab */}
                    <div className="flex justify-between">
                      <div className="relative inline-flex rounded-md bg-gray-100 p-1 mb-6">
                        <div
                          className={`absolute top-0 left-0 h-full w-1/2 bg-white rounded-md shadow transition-transform duration-300 ${
                            feed === "mypost"
                              ? "translate-x-full"
                              : "translate-x-0"
                          }`}
                        />
                        <button
                          onClick={() => handleTabClick("recent")}
                          className={`relative z-10 w-32 sm:w-40 text-sm sm:text-base font-semibold py-1 px-2 rounded-md transition-colors duration-300 ${
                            feed === "recent" ? "text-black" : "text-gray-500"
                          }`}
                        >
                          Recent Updates
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
                      <div className="lg:hidden">
                        <div
                          onClick={() => setSidebarOpen(true)}
                          className="p-2 bg-white rounded-md shadow transition-shadow hover:cursor-pointer flex items-center gap-2"
                        >
                          <RxHamburgerMenu className="text-lg sm:text-xl" />
                          <span className="hidden xs:inline text-sm sm:text-base">
                            My Profile
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* All Posts  */}
                    {posts.filter((post) =>
                      feed === "mypost" ? post.author._id === user._id : true
                    ).length === 0 ? (
                      <div className="text-gray-400 text-sm sm:text-base py-5 px-2">
                        {feed === "mypost"
                          ? "You haven't posted anything yet. Start posting now!"
                          : "Start adding friends to see what they’re sharing!"}
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
                                    {post?.likes?.length === 1
                                      ? "like"
                                      : "likes"}
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
                                          className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 w-full text-sm focus:outline-red-300"
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
                                          <Date
                                            createdAt={comment?.createdAt}
                                          />
                                        </small>
                                      </div>
                                    ))}
                                    <div className="mt-2 flex flex-col">
                                      <textarea
                                        className="w-full p-2 border text-[14px] sm:text-sm rounded resize-none outline-gray-300"
                                        placeholder="Add a comment..."
                                        rows={3}
                                        value={commentContent[post?._id] || ""}
                                        onChange={(e) =>
                                          setCommentContent((prev) => ({
                                            ...prev,
                                            [post?._id]: e.target.value,
                                          }))
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
                  </div>
                </div>
                <div className="w-[90%] sm:w-4/5 md:w-3/4 lg:w-fit">
                  {/* Add new friends  */}
                  <div className="lg:mt-20 lg:mr-5 w-full lg:w-[350px] bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-base sm:text-lg mb-2 font-semibold text-teal-500">
                      Add New Friends
                    </h2>
                    <div>
                      {allUsers.length === 0 ? (
                        <p className="text-gray-400 text-sm sm:text-base">
                          No new friend suggestion
                        </p>
                      ) : (
                        <>
                          {allUsers.map((user) => {
                            const status = buttonStatus[user._id] || "idle";
                            return (
                              <div
                                key={user?._id}
                                className="flex justify-between items-center border-t py-3 px-1"
                              >
                                <span className="font-semibold text-sm sm:text-base">
                                  {user?.username}
                                </span>
                                <button
                                  className="px-3 py-1 border border-teal-600 text-teal-600 text-xs sm:text-sm rounded-full hover:bg-teal-100 hover:border-teal-100 transition-colors transition-all flex items-center gap-1.5"
                                  onClick={() => addFriend(user._id)}
                                  disabled={sending || status === "sent"}
                                >
                                  {status === "idle" && (
                                    <>
                                      <FaUserFriends />
                                      Add Friend
                                    </>
                                  )}
                                  {status === "sent" && "✓ Request Sent"}
                                </button>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </main>
              <Footer />
            </>
          )}
        </div>
      ) : null}
    </>
  );
}
