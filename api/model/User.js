import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// Define the user schema
const userSchema = mongoose.Schema({
    name: {
        type: String,        // Name is a required string
        required: true
    },
    email: {
        type: String,        // Email is required and must be unique
        required: true,
        unique: true
    },
    password: {
        type: String,        // Password is a required string
        required: true
    },
    age: {
        type: Number,        // Age is a required number
        required: true
    },
    gender: {
        type: String,        // Gender must be either 'male' or 'female'
        required: true,
        enum: ['male', 'female']
    },
    genderPreference: {
        type: String,        // Gender preference must be 'male', 'female', or 'both'
        required: true,
        enum: ['male', 'female', 'both']
    },
    bio: {
        type: String,        // Bio is optional, defaults to an empty string
        default: ""
    },
    image: {
        type: String,        // Image URL is optional, defaults to an empty string
        default: ""
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,  // Array of references to other User objects
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,  // Array of references to other User objects
            ref: "User"
        }
    ],
    matches: [
        {
            type: mongoose.Schema.Types.ObjectId,  // Array of references to other User objects
            ref: "User"
        }
    ],
}, { timestamps: true });  // Automatically add createdAt and updatedAt fields



// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {   // Only hash if password has been modified or is new
        this.password = await bcrypt.hash(this.password, 10);  // Hash with salt factor of 10
    }
    next();  // Call the next middleware
});

// Method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

export default User;
