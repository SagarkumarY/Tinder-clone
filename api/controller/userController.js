import cloudinary from '../config/cloudinary.js';
import User from '../model/User.js';

// Controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        // Destructure 'image' from request body and the rest of the user data
        const { image, ...otherData } = req.body;
        let updatedData = { ...otherData };  // Initialize the update data with other fields from the request

        // 1. If an image is provided, upload it to Cloudinary
        if (image && image.startsWith("data:image")) {
            try {
                // Upload the base64 image to Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    folder: 'user_profiles',  // Optional: Organize uploads in a specific folder in Cloudinary
                });

                // Add the secure URL of the uploaded image to the update data
                updatedData.image = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError);
                return res.status(400).json({
                    success: false,
                    message: "Failed to upload image",
                });
            }
        }

        // 2. Update the user in the database with the new data
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
            new: true,        // Return the updated user object
            runValidators: true, // Ensure the updated data is validated
        });

        if (!updatedUser) {
            // If no user is found, return a 404 error
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 3. Respond with the updated user data
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        // Handle any server errors
        console.error("Error in updateProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
