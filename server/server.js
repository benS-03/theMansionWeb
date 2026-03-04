const express = require('express');
const pool = require('./src/db/db');
require('dotenv').config();

const PORT = process.env.PORT || 3001;


//Start Express Server
const app = express();

//Start HTTPS server to attach chat socket
const http = require("http");
const {Server} = require("socket.io");

const server = http.createServer(app)
const socketLoader = require('./src/sockets')
const io = new Server(server, {
    cors: {
        origin: "*" // change to my domain eventualy
    }
});

socketLoader(io);

//Midleware
app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});


//Route files

const bandPostRoutes = require('./src/routes/bandPostsRoutes');
const donationsRouts = require('./src/routes/donationsRoutes');
const musicPostRoutes = require('./src/routes/musicPostsRoutes');
const reviewsRoutes = require('./src/routes/reviewsRoutes')
const showsRoutes = require('./src/routes/showsRoutes')

app.use('/bandPosts', bandPostRoutes);
app.use('/donations', donationsRouts);
app.use('/musicPosts', musicPostRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/shows', showsRoutes);

//Start Server

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});