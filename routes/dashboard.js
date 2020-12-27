"use strict";

const router = require('express').Router();

router.get('/dashboard', (req, res) => res.send('Welcome'));

module.exports = router;