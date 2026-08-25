const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

const {get_create_cart,add_item,remove_item,calculate_total} = require('../controllers/Cart_controller');

router.get("/:session_id",get_create_cart);

router.post("/:session_id/add",add_item);

router.post("/:session_id/remove",remove_item);

router.get("/:session_id/total",calculate_total);

module.exports=router;