const mongoose = require('mongoose');
const connectDB=async () => {

    try {

         await mongoose.connect(process.env.MONGODB_URI);
         console.log("Connection with MDBATLAS succesfull");

         
         
        
    } catch (error) {

        console.log("Not succesfull Mdbatlas",error);
        process.exit(1);
        
    }

   
    
};

module.exports=connectDB;