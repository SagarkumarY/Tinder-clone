import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast'
import { getSocket } from '../socket/socket.client';
import { useAuthStore } from './useAuthStore';

export const useMessageStore = create((set) => ({
    messages: [],
    loading: true,



    sendMessage: async (receiverId, content) => {
        const tempMessage = { _id: Date.now(), sender: useAuthStore.getState().authUser._id, content };
        try {
            set((state) => ({
                messages: [...state.messages, tempMessage],
            }));
        // try {
        //   // mockup a message, show it in the chat immediately
		// 	set((state) => ({
		// 		messages: [
		// 			...state.messages,
		// 			{ _id: Date.now(), sender: useAuthStore.getState().authUser._id, content },
		// 		],
		// 	}));
            const res = await axiosInstance.post('/messages/send', { receiverId, content });
            console.log("send message:", res.data)
        } catch (error) {
            console.error("Error in sendMessage:", error);
            toast.error("Failed to send message. Please try again.");

        }
    },


    getMessages: async (userId) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.get(`/messages/conversation/${userId}`);
            set({ messages: res.data.messages });
            console.log("Get Messages",res.data.messages)
        } catch (error) {
            console.error("Error in getMessages:", error);
            set({ messages: [] });
        } finally {
            set({ loading: false });
        }
    },


    subcribeToMessages: () => {
        const socket = getSocket();
        socket.on('newMessage', (message) => {
            set((state) => ({
                messages: [...state.messages, message],
            }));
        });
    },

    unsubscribeFromMessages: () => {
        const socket = getSocket();
        socket.off('newMessage');
    },



}));