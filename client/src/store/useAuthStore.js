import { create } from 'zustand';
import axios from '../lib/axios'
import toast from 'react-hot-toast';
import { disconnectSocket, initialzeSocket } from '../socket/socket.client';



export const useAuthStore = create((set) => ({
    authUser: null,  // To store the authenticated user's data
    checkingAuth: true,  // To track whether we are checking the user's authentication status
    loading: false,  // To manage loading state during API calls



    // Signup method
    signup: async (signupData) => {

        try {
            // Set loading to true when the request starts
            set({ loading: true });

            // Make the API call to register a new user
            const res = await axios.post("/auth/signup", signupData);

            if (res.data.success) {
                // Update the authUser with the returned user data
                set({ authUser: res.data.user });
                initialzeSocket(res.data.user._id)
                // Show success toast
                toast.success("Account created successfully");
            } else {
                // Handle the case when signup fails but the request succeeds
                toast.error(res.data.message || "Failed to create account. Please try again.");
            }
        } catch (error) {
            // Log and show specific error message
            console.error("Error in signup:", error);
            const errorMessage = error.response?.data?.message || "Failed to create account. Please try again.";
            toast.error(errorMessage);
        } finally {
            // Set loading to false when the request ends
            set({ loading: false });
        }
    },

    // Login 
    login: async (loginData) => {
        try {
            set({ loading: true });
            const res = await axios.post("/auth/login", loginData);
            if (res.data.success) {
                set({ authUser: res.data.user });
                initialzeSocket(res.data.user._id)
                toast.success("Logged in successfully");
            } else {
                toast.error(res.data.message || "Failed to login. Please try again.");
            }
        } catch (error) {
            console.error("Error in login:", error);
            toast.error(error.response?.data?.message || "Failed to login. Please try again.");
        } finally {
            set({ loading: false });
        }
    },



    // logout 
    logout: async () => {
        try {
            const res = await axios.post("/auth/logout");
            if (res.status === 200) set({ authUser: null });
            disconnectSocket()
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Error in logout:", error);
            toast.error("Failed to log out. Please try again.");
        }
    },


    // check Auth
    checkAuth: async () => {
        try {
            const res = await axios.get("/auth/me");
            if (res.data.user) {
                set({ authUser: res.data.user });
                initialzeSocket(res.data.user._id)
            } else {
                set({ authUser: null });
            }
        } catch (error) {
            set({ authUser: null });
            console.error("Error in checkAuth:", error);
        } finally {
            set({ checkingAuth: false });
        }
    },

    setAuthUser: (user) => set({ authUser: user }),

}));