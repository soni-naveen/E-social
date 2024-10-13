const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");

// Send Friend Request
exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.id;

    const user = await User.findById(senderId);

    if (senderId === receiverId) {
      return res.status(400).json({
        sucess: false,
        message: "Cannot send friend request to yourself!",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      $and: [
        {
          $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
          ],
        },
        {
          status: { $in: ["pending", "accepted"] },
        },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists",
      });
    }

    if (!user.requested.includes(receiverId)) {
      user.requested.push(receiverId);
      await user.save();
    }

    const newRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });
    await newRequest.save();
    res.status(201).json({
      success: true,
      message: "Friend request sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending friend request",
    });
  }
};

// Accept/Reject Friend Request
exports.acceptOrRejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.params;
    const userId = req.user.id;

    const request = await FriendRequest.findById(requestId);
    if (!request)
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });

    if (request.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this request",
      });
    }

    if (status === "accepted") {
      await User.findByIdAndUpdate(request.sender, {
        $addToSet: { friends: request.receiver },
        $pull: { requested: request.receiver },
      });
      await User.findByIdAndUpdate(request.receiver, {
        $addToSet: { friends: request.sender },
        $pull: { requested: request.sender },
      });
    } else if (status === "rejected") {
      await User.findByIdAndUpdate(request.sender, {
        $pull: { requested: request.receiver },
      });

      await User.findByIdAndUpdate(request.receiver, {
        $pull: { requested: request.sender },
      });
    }

    request.status = status;
    await request.save();
    res.json({
      success: true,
      message: `Friend request ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating friend request",
    });
  }
};

// Get friend requests
exports.getFriendRequests = async (req, res) => {
  try {
    const friendRequests = await FriendRequest.find({
      receiver: req.user.id,
      status: "pending",
    }).populate("sender", "username");

    res.json(friendRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching friend requests",
    });
  }
};
