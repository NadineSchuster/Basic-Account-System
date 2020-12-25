"use strict";

const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../database');

let refreshTokens = [];

// Register new user
router.post('/register', async (req, res) => {
    // check if name already exists in database or wg

    console.log(req.body.username,req.body.password);

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let user = {
            name: req.body.username,
            password: hashedPassword
        };

        let sql = "INSERT INTO registeredUsers SET ?";

        let insertion = connection.query(sql, user, (err, result) => {
            if (err) throw err;
            console.log(result);
        });
        // Header cannot set after... res kann nicht zweimal gesetzt werden! O.O
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
    
})

// Halt dann später mit Name und WG oder so
router.post('/login', async (req, res) => {
    
    // Das, nur mit dem username und wg
    let sql = `SELECT * FROM registeredUsers WHERE name = "${req.body.username}"`;
    
    let query = connection.query(sql, async (err, result) => {
        if (err) throw err;

        console.log("result: " + result);

        if (result == null) {
            return res.status(400).send('Cannot find user');
        }

        // console.log(req.body.password);
        // console.log("From result: " + result[0].password);

        // console.log(req.body);
        // console.log(req.body.username);
        // console.log(req.body.password);
        // console.log(result);

        // console.log(result[0].password);
        // console.log(req.body.password);

        try {
            
            let pswIsValid = await bcrypt.compare(req.body.password, result[0].password);
            
            console.log(pswIsValid);
            
            if (pswIsValid) {
                const username = req.body.name;
                const user = {
                    name: username
                };

                const token = generateToken(user);
                const refreshToken = jwt.sign(user, process.env.Refresh_Token_Secret);
                refreshTokens.push(refreshToken);

                res.json({
                    token: token,
                    refreshToken: refreshToken
                });
                //res.header('auth-token', tokens).send(token);
                //res.send('Logged in!' + token);
            } else {
                res.send({
                    message: 'Access denied'
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send();
        }
    })
})

let generateToken = function (user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: '30s'
    });
}

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;

    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.Refresh_Token_Secret, (err, user) => {
        if (err){
            console.log(err);
            return res.sendStatus(403);
        }
        const accessToken = generateToken( { name: user.username })
        res.json({ accessToken: accessToken });
        console.log("entered method 2");
    })
})

router.delete('/logout', (req, res) => {
    // delete refreshTokens from database
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

module.exports = router;