
const chatSocketServices = require('../services/chatSocketServices');
const authServices = require('../services/authServices');

module.exports = function(io) {

    io.on('connection', async (socket) => {

        const auth0Id = socket.user.sub;
        const user = await authServices.getUserWithAuth0(auth0Id);
        const username = user.username;

        console.log("User connected:", auth0Id);

        socket.on("chat:send", async (data) => {

            const {message} = data;

            if (!message || message.trim() === '') return;
            
            const savedMessage = await chatSocketServices.saveChat({auth0Id, message, username});

            io.emit("chat:receive", savedMessage);

        });
    });
};