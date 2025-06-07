import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { convertCreatedAt } from "../utils/dateConverter";
import { MdDelete } from "react-icons/md";

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
      const response = await fetch(`${ENDPOINT}/auth/getuserdetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userdetails = await response.json();
      setUser(userdetails?.user);
      fetchPosts();
      fetchFriendRequests();
    } catch (error) {
      console.error("Invalid token:", error);
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

  const [expandedComments, setExpandedComments] = useState({});

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <>
      {token ? (
        <div className="bg-slate-50">
          <Navbar username={user?.username} fetchPost={fetchPosts} />
          <main className="max-w-7xl mx-auto px-2 sm:px-6 py-6">
            <div className="flex flex-col md:flex-row sm:gap-7 lg:gap-10">
              {/* Feed */}
              <div className="w-11/12 sm:w-3/4 mx-auto">
                <h2 className="sm:text-lg font-semibold mb-4">Recent updates</h2>
                {posts?.length === 0 ? (
                  <div className="text-gray-400">Add friends to see posts!</div>
                ) : (
                  <>
                    {posts.map((post) => (
                      <div
                        key={post?._id}
                        className="bg-white rounded-lg shadow border mb-6 p-6"
                      >
                        <div className="flex items-center mb-4">
                          <div>
                            <h3 className="font-semibold">
                              {post?.author?.username}
                            </h3>
                            <div className="text-gray-500 sm:mt-0.5 text-xs">
                              <Date createdAt={post?.createdAt} />
                            </div>
                          </div>
                        </div>
                        <p className="mb-4 text-sm sm:text-base">
                          {post?.content}
                        </p>
                        <div className="flex items-center text-gray-500 text-sm">
                          <button
                            className="flex items-center mr-6 hover:text-red-600"
                            onClick={() => likePost(post?._id)}
                          >
                            <svg
                              className="w-5 h-5 mr-1"
                              fill={
                                post.likes.includes(user?._id) ? "red" : "none"
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
                              {post?.likes?.length} Likes
                            </div>
                          </button>
                          <button
                            className="flex items-center hover:text-indigo-600"
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
                            {post?.comments?.length} Comments
                          </button>
                          {/* Only show delete button if the logged-in user is the post author */}
                          {user?._id === post?.author?._id && (
                            <button
                              className="ml-auto text-sm text-red-600 hover:text-red-700 hover:bg-red-100 hover:rounded-full"
                              onClick={() => confirmDeletePost(post?._id)}
                            >
                              <MdDelete className="text-3xl p-1" />
                            </button>
                          )}
                        </div>
                        {expandedComments[post?._id] && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2 text-sm sm:text-base">
                              Comments
                            </h4>
                            {post?.comments?.map((comment) => (
                              <div
                                key={comment?._id}
                                className="mb-2 p-2 bg-gray-100 rounded"
                              >
                                <p className="text-[14px] sm:text-sm">
                                  <strong>{comment?.author?.username}:</strong>{" "}
                                  {comment?.content}
                                </p>
                                <small className="text-gray-500 text-[10px] sm:text-sm">
                                  <Date createdAt={comment?.createdAt} />
                                </small>
                              </div>
                            ))}
                            <div className="mt-4">
                              <textarea
                                className="w-full p-2 border text-[14px] sm:text-sm rounded"
                                placeholder="Add a comment..."
                                value={commentContent}
                                onChange={(e) =>
                                  setCommentContent(e.target.value)
                                }
                              />
                              <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-[13px] sm:text-sm hover:bg-blue-600"
                                onClick={() => addComment(post?._id)}
                              >
                                Post Comment
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {/* Add new friends  */}
                <div className="max-w-xl mt-5 bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg mb-4 font-semibold text-teal-400">
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
              <div className="w-11/12 sm:w-3/4 md:w-1/2 mt-2 md:mt-10 mx-auto">
                {/* Your Profile  */}
                <div className="bg-teal-50 rounded-lg shadow p-6 mb-6">
                  <h2 className="font-semibold mb-4 text-teal-500 text-lg">
                    Your Profile
                  </h2>
                  <div className="flex items-center mb-4 text-sm sm:text-base">
                    <div>
                      <p className="text-teal-700">
                        username :{" "}
                        <span className="font-semibold">{user?.username}</span>
                      </p>
                      <p className="text-gray-500 text-teal-700">
                        email : {user?.email}
                      </p>
                      <p className="text-teal-700">
                        friends : <span>{user?.friends.length}</span>
                      </p>
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
                      No Requests
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
                              className="px-3 py-1 bg-blue-600 text-white text-[12px] sm:text-sm rounded-md hover:bg-indigo-700"
                              onClick={() =>
                                handleFriendRequest(request?._id, "accepted")
                              }
                            >
                              Accept
                            </button>
                            <button
                              className="px-3 py-1 bg-gray-200 text-gray-800 text-[12px] sm:text-sm rounded-md hover:bg-gray-300"
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
          <Footer />
        </div>
      ) : null}
    </>
  );
}
