const {chatWithAgent} =require('../controllers/agent_controller');

const {
  catalog_for_agent
} = require('../controllers/catalog_controllers');

const { transact } = require('../controllers/agent_transact_controller');

const express = require('express');
const router=express.Router();

router.get('/catalog', catalog_for_agent);

router.post('/chat',chatWithAgent);
router.post('/transact', transact);


module.exports=router;