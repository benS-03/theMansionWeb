
const chatSocketServices = require('../services/chatSocketServices');

module.exports = function(io) {

    io.on('connection', (socket) => {

        const auth0Id = socket.user.sub;
        console.log("User connected:", auth0UId);

        socket.on("chat:send", async (data) => {

            const {message} = data;

            if (!message || message.trim() === '') return;
            
            const savedMessage = await chatSocketServices.saveChat({auth0Id, message});

            io.emit("chat:receive", savedMessage);

        });
    });
};