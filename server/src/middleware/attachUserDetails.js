
const authSerices = require('../services/authServices');


async function attachUserDetails(req, res, next) {
    try {
        const auth0Id = req.auth?.payload?.sub; // ← req.auth.sub should be req.auth.payload.sub

        if (!auth0Id)
            return res.status(401).json({ error: "Unauthorized" });

        const user = await authSerices.getUserWithAuth0(auth0Id);

        if (!user)
            return res.status(401).json({ error: "User not found in database" });

        req.user = {
            id: user.id,
            username: user.username,
            role: user.user_role,
            email: user.email,
            auth0Id: user.auth0_id
        };

        next();
    } catch (err) {
        console.error("attachUserDetails error:", err);
        return res.status(500).json({ error: err.message });
    }
}


module.exports = attachUserDetails