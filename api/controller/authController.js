import User from "../model/User.js";
import jwt from 'jsonwebtoken';


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const signup = async (req, res) => {

    const { name, email, password, age, bio, gender, genderPreference } = req.body;



    try {
        // check if  filds are empty
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // check if age is at least 18 or above 
        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: "Age must be at least 18"
            });
        };

        // check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        };

        // check if password is at least 8 characters long
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        };

        // check if email already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        };

        // create new user
        const newUser = new User({
            name,
            email,
            password,
            age,
            bio,
            gender,
            genderPreference
        });

        const token = signToken(newUser._id);

		res.cookie("jwt", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
			httpOnly: true, // prevents XSS attacks
			sameSite: "strict", // prevents CSRF attacks
			secure: process.env.NODE_ENV === "production",
		});

        // // save user to database
        await newUser.save();

        res.json({
            success: true,
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ======================= LOGIN =======================
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if email and password were provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // 2. Check if user exists by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Compare entered password with the user's hashed password
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Generate a new JWT token
        const token = signToken(user._id);

        // 5. Set the token in the cookie
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        // 6. Send success response with user details
        res.json({
            success: true,
            message: "Logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                genderPreference: user.genderPreference,
                bio: user.bio,
                image: user.image
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};




// ======================= LOGOUT =======================
export const logout = async (req, res) => {
    try {
        // Clear the JWT token cookie to log the user out
        res.clearCookie("jwt");

        res.json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};