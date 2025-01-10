import Message from '../model/Message.js'
import { getConnectedUsers, getIO } from '../socket/socket.server.js';
import mongoose from 'mongoose';

export const sendMessage = async (req, res) => {
    try {
        const { content, receiverId } = req.body;  // Get the message content and receiver's ID from the request body


        // Create a new message document with the content, sender's ID (from the logged-in user), and receiver's ID
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content,
        });

        const io = getIO();
        const connectedUsers = getConnectedUsers();
        const receiverSocketId = connectedUsers.get(receiverId);  // Get the socket ID of the receiver

        if (receiverSocketId) {
            // Emit a real-time event to the receiver's socket ID with the new message
            io.to(receiverSocketId).emit("newMessage", {
                message: newMessage,
            });
        }

        // Return the new message in the response
        res.status(200).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        // Log any errors and return a 500 (server error) response
        console.error("Error in sendMessage:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};

export const getConversation = async (req, res) => {
    const { userId } = req.params;  // Get the ID of the other user in the conversation (receiver) from request parameters
    try {
        // Find all messages where the logged-in user is either the sender or the receiver, sorted by creation date
        

        // const messages = await Message.find({
        //     $or: [
        //         { senderId: req.user._id, receiverId: userId },  // Messages sent by the logged-in user to the other user
        //         { senderId: userId, receiverId: req.user._id }   // Messages received by the logged-in user from the other user
        //     ]
        // }).sort("createdAt");  // Sort messages in ascending order by their creation time (chronological order)

        // Use ObjectId for both sender and receiver fields
       


         // Convert both sender and receiver IDs to ObjectId
         const senderId = new mongoose.Types.ObjectId(req.user.id); // Current logged-in user
         const receiverId = new mongoose.Types.ObjectId(userId);    // Other user
 
         // Query to find all messages between the two users
         const messages = await Message.find({
             $or: [
                 { sender: senderId, receiver: receiverId },
                 { sender: receiverId, receiver: senderId },
             ],
         }).sort({ createdAt: 1 }); // Sort messages by creation time (ascending)

        // Return the list of messages in the response
        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        // Log any errors and return a 500 (server error) response
        console.error("Error in getConversation:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};
