const express = require('express');
const router=express.Router();
const{get_All_Products,product_By_Id}=require("../controllers/Product_controllers")

router.get("/",get_All_Products);

router.get("/:id",product_By_Id);

module.exports=router;