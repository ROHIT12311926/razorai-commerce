const express = require('express');
const router = express.Router();

const {login}=require('../controllers/auth_controller');

router.post('/login',login);

module.exports=login;