import User from "../model/User.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";




// Function to get matches for the logged-in user
export const getMatches = async (req, res) => {
    try {
        // Fetch the user by ID from the request and populate the "matches" field
        // The "populate" function retrieves details (name and image) of matched users
        const user = await User.findById(req.user.id).populate("matches", "name image");


        // Return the user's matches in the response
        res.json({
            success: true,
            matches: user.matches
        });
    } catch (error) {
        // Log any errors and return a 500 (server error) response
        console.error("Error in getMatches:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};




// Function to get potential user profiles (users to like or dislike)
export const getUserProfiles = async (req, res) => {
    try {
        // Fetch the current user from the database using the ID from the request
        const currentUser = await User.findById(req.user.id);

        // Query to find users that the current user hasn't interacted with yet
        // $and condition ensures all criteria are met:
        // 1. Exclude the current user's profile (_id: {$ne: currentUser.id})
        // 2. Exclude users the current user has already liked (not in currentUser.likes)
        // 3. Exclude users the current user has already disliked (not in currentUser.dislikes)
        // 4. Exclude users already matched with the current user (not in currentUser.matches)
        // 5. Match gender based on the current user's gender preference ("both" for either male/female, or specific)
        // 6. Ensure potential users' genderPreference includes the current user's gender or "both"
        const users = await User.find({
            $and: [
                { _id: { $ne: currentUser.id } },  // Exclude current user's profile
                { _id: { $nin: currentUser.likes } },  // Exclude users already liked
                { _id: { $nin: currentUser.dislikes } },  // Exclude users already disliked
                { _id: { $nin: currentUser.matches } },  // Exclude users already matched
                {
                    gender: currentUser.genderPreference === "both"
                        ? { $in: ["male", "female"] }  // If current user prefers "both", include all genders
                        : currentUser.gender  // Otherwise, match the preferred gender
                },
                { genderPreference: { $in: [currentUser.gender, "both"] } }  // Ensure the potential user accepts current user's gender or both
            ]
        });

        // Return the list of potential users
        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        // Log any errors and return a 500 (server error) response
        console.error("Error in getUserProfiles:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



export const swipeRight = async (req, res) => {

    try {
        const { likedUserId } = req.params;  // Get the ID of the user that is being liked
        //  from the request parameters

        const currentUser = await User.findById(req.user.id);  // Fetch the current user from the database using their ID

        const likedUser = await User.findById(likedUserId);  // Fetch the user that is being liked by the current user

        // Check if the liked user exists
        if (!likedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if the current user hasn't already liked the likedUser
        if (!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId);  // Add the liked user's ID to the current user's likes array
            await currentUser.save();  // Save the updated current user

            // Check if the liked user has already liked the current user (i.e., it's a mutual match)
            if (likedUser.likes.includes(currentUser.id)) {
                // Add each other's IDs to the matches array of both users
                currentUser.matches.push(likedUser.id);
                likedUser.matches.push(currentUser.id);

                // Save both users asynchronously
                await Promise.all([
                    currentUser.save(),
                    likedUser.save()
                ]);

                

                // send a notification in realtime with socket.io

                const connectedUsers = getConnectedUsers();
                const io = getIO();
                const likedUserSocketId = connectedUsers.get(likedUserId);
                if (likedUserSocketId) {
                    io.to(likedUserSocketId).emit("newMatch", {
                        _id: currentUser._id,
                        name: currentUser.name,
                        image: currentUser.image
                    });
                }

                const currentSocketId = connectedUsers.get(currentUser._id.toString());
                if (currentSocketId) {
                    io.to(currentSocketId).emit("newMatch", {
                        _id: likedUser._id,
                        name: likedUser.name,
                        image: likedUser.image
                    })
                }

            }

        }

        // Respond with the updated current user data
        res.status(200).json({
            success: true,
            user: currentUser
        });

    } catch (error) {
        console.error("Error in swipeRight:", error);  // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


export const swipeLeft = async (req, res) => {

    try {
        const { dislikedUserId } = req.params;  // Get the ID of the disliked user from the request parameters
        const currentUser = await User.findById(req.user.id);  // Fetch the current user from the database

        // Check if the current user hasn't already disliked the dislikedUser
        if (!currentUser.dislikes.includes(dislikedUserId)) {
            currentUser.dislikes.push(dislikedUserId);  // Add the disliked user's ID to the current user's dislikes array
            await currentUser.save();  // Save the updated current user
        }

        // Respond with the updated current user data
        res.status(200).json({
            success: true,
            user: currentUser
        });
    } catch (error) {
        console.error("Error in swipeLeft:", error);  // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
