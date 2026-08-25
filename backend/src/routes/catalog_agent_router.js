const express = require('express');
const router=express.Router();

const {catalog_for_agent}=require('../controllers/catalog_controllers')

router.get('/',catalog_for_agent);

module.exports=router;