const chatSocket = require('./chatSocket');
const socketAuth = require('./socketAuth');

module.exports = function(io){

    socketAuth(io);

    chatSocket(io);
};