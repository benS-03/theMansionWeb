const chatSocket = require('./chatSocket');
const socketAuth = require('./socketAuth');

module.export = function(io){

    socketAuth(io);

    chatSocket(io);
};