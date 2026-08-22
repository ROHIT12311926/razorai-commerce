const express = require('express');
const cors = require('cors');

require('dotenv').config();

const connectDB = require('./config/db');

const app=express();

app.use(cors());
app.use(express.json());

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