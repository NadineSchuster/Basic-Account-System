"use strict";
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

// module.exports = function (req, res, next) {
//     const token = req.header('auth-token');
//     if (!token) return res.status(401).send('Access denied');

//     try {
//         const verified = jwt.verify(token, process.env.TOKEN_SECRET);
//         req.user = verified;
//         next();
//     } catch (err) {
//         res.status(400).send('Wrong token')
//     }
// }