const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.getPublicKey();
        callback(null, signingKey)
    })
}

module.exports = function(io) {
    io.use((socket, next) => {
        try{
            const token = socket.handshake.auth.token;

            if (!token) {
                return next (new Error("Unauthorized"));
            }

            jwt.verify(
                token,
                getKey,
                {
                    audience: process.env.AUTH0_AUDIENCE,
                    issuer: `https://${process.env.AUTH0_DOMAIN}`,
                    algorithms: ["RS256"]
                },
                (err, decoded) => {
                    if (err) {
                        return next(new Error("unathorized"))
                    }

                    socket.user = decoded;

                    next();
                }

            )
        } catch (err) {
            next(err);
        }
    })
}