const express = require('express');
const cors = require('cors');
const Product_roter = require('../src/routes/Product_route');
const catalogAgent = require('../src/routes/catalog_agent_router');

const Cart_route = require('./routes/Cart_route');

require('dotenv').config();

const connectDB = require('./config/db');

const app=express();

app.use(cors());
app.use(express.json());

app.use('/api/products',Product_roter);
app.use('/api/catalog/agent',catalogAgent);

app.use('/api/cart',Cart_route);

app.get('/health',(req,res)=>{

    res.status(200).json({

        status:"OK",
        message: 'RazorAI Commerce backend is running',
    });

    
});

const Port= process.env.PORT;

connectDB().then(()=>{

    app.listen(Port,()=>{

        console.log("Server running on port:", Port);
        
    })
})