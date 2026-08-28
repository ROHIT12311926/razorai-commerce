const {chatWithAgent} =require('../controllers/agent_controller');

const express = require('express');
const router=express.Router();

router.post('/chat',chatWithAgent);

module.exports=router;