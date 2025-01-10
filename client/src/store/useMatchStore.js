import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";


export const useMatchStore = create((set) => ({
    matches: [],
    isLoadingMyMathes: false,
    isLoadingUserProfiles: false,
    userProfiles: [],
    swipeFeedback: null,

    getMyMatches: async () => {
        try {
            set({ isLoadingMyMathes: true });
            const res = await axiosInstance.get("/matches");
            set({ matches: res.data.matches });
        } catch (error) {
            console.error("Error in getMyMatches:", error);
            set({ matches: [] });
            toast.error("Error in getMyMatches:", error);
        } finally {
            set({ isLoadingMyMathes: false });
        }
    },

    getUserProfiles: async () => {
        try {
            set({ isLoadingUserProfiles: true });
            const res = await axiosInstance.get(`/matches/user-profiles`);
            set({ userProfiles: res.data.users });
        } catch (error) {
            console.error("Error in getUserProfiles:", error);
            set({ userProfiles: [] });
            toast.error("Error in getUserProfiles:", error);
        } finally {
            set({ isLoadingUserProfiles: false });
        }
    },

    swipeLeft: async (user) => {
        try {
            set({ swipeFeedback: "passed" });
            const res = await axiosInstance.post("/matches/swipe-left/" + user._id);
         
        } catch (error) {
            toast.error("Failed to swipe left");
            console.error("Error in swipeLeft:", error);

        } finally {
            setTimeout(() => {
                set({ swipeFeedback: null });
            }, 1500);
        }
    },

    swipeRight: async (user) => {
        
        try {
            set({ swipeFeedback: "liked" });
            const res = await axiosInstance.post("/matches/swipe-right/" + user._id);
            
        } catch (error) {
            toast.error("Failed to swipe right");
            console.error("Error in swipeRight:", error);
        } finally {
            setTimeout(() => {
                set({ swipeFeedback: null });
            }, 1500);
        }
    },

    subscribeToNewMatches:() => {
        try {
            const socket = getSocket();
            socket.on("newMatch" ,(newMatche) => {
                set(state => ({
                    matches:[newMatche, ...state.matches,newMatche]
                }))
                toast.success("You got a new match!") 
            })

        } catch (error) {
            console.log(error)
        }
    },

    unSubscribeToNewMatches:() => {
        try {
            const socket = getSocket();
            socket.off("newMatch")
        } catch (error) {
            console.log(error)
        }
    },


}));