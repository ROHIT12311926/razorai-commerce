const express = require('express');
const cors = require('cors');
const Product_roter = require('../src/routes/Product_route');
const catalogAgent = require('../src/routes/catalog_agent_router');
const auth_route = require('./routes/auth_routes');;
const{protect}=require('../src/middlewares/authorization_middleware');
const agent_route = require('../src/routes/agent_route');

const dashboardRoutes = require('./routes/dashboard_routes');

const Cart_route = require('./routes/Cart_route');

const Order_route= require('./routes/Order_route');
const auditRoutes = require('./routes/audit_routes');
const merchantRoutes = require('./routes/merchant_routes');


require('dotenv').config();

const connectDB = require('./config/db');

const app=express();

app.use(cors());
app.use(express.json());

app.use('/api/products',Product_roter);
app.use('/api/catalog/agent',catalogAgent);

app.use('/api/cart',Cart_route);
app.use('/api/audit', auditRoutes);

app.use('/api/auth',auth_route);

app.use('/api/agent',agent_route);

app.use('/api/order',Order_route);

app.use('/api/dashboard',dashboardRoutes);

app.use('/api/merchant', merchantRoutes);

app.get('/health',(req,res)=>{

    res.status(200).json({

        status:"OK",
        message: 'RazorAI Commerce backend is running',
    });

    
});

app.get('/api/merchant/profile',protect,(req,res)=>{

    res.status(200).json({

        success: true,
    message: 'You are authenticated!',
    merchantId: req.merchantId
    })
})

const Port= process.env.PORT;

connectDB().then(()=>{

    app.listen(Port,()=>{

        console.log("Server running on port:", Port);
        
    })
})