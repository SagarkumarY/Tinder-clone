import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set) => ({
    user: null,  // To store the user's data
    loading: false,  // To manage loading state during API calls


    updateProfile: async (data) => {
        try {
            // Set loading to true when the request starts
            set({ loading: true });
            const res = await axiosInstance.put("/user/update", data);
            useAuthStore.getState().setAuthUser(res.data.user)
            toast.success("Profile updated successfully");

        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile. Please try again");
        } finally {
            // Set loading to false when the request finishes
            set({ loading: false });
        }
    }
}));



