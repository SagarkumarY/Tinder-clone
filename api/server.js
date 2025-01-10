import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';





import authRoutes from './routes/authRoutes.js';

import metchesRoutes from './routes/matcheRoutes.js';

import userRoutes from './routes/userRoutes.js';

import messagesRoutes from './routes/messageRoutes.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './socket/socket.server.js';


dotenv.config();


const app = express();

const httpServer = createServer(app);
const __dirname = path.resolve();
app.use(cors({
    origin: process.env.CLIENT_URL,  // Frontend origin
    credentials: true                 // Allow sending cookies and other credentials
}));

const PORT = process.env.PORT || 3000;

initializeSocket(httpServer)

app.use(express.json());

app.use(cookieParser());




app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)
app.use("/api/matches", metchesRoutes)
app.use("/api/messages", messagesRoutes);



if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, '/client/dist')));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    });
}



// Start server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB()
});
