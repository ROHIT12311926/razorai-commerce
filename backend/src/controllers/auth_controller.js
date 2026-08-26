const jwt = require('jsonwebtoken');

const Merchant = require('../models/Merchant');

const login=async (req,res) => {

    try {

        const {email,password}=req.body;

        const merchant=await Merchant.findOne({email:email});
        if(!merchant){

            return res.status(402).json({

                success:false,
                message:"Check your email/password"
            })
        }

        const isPasswordCorrect=await merchant.comparePass(password);

        if(!isPasswordCorrect){

           return res.status(402).json({

                success:false,
                message:"Check your email/pass"
            })


        }

        const token=jwt.sign({
            MerchantId:merchant._id,

        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    
                
    );

    res.status(200).json({
      success: true,
      token: token,
      merchant: {
        id: merchant._id,
        name: merchant.name,
        email: merchant.email,
      },
    });


        
    } catch (error) {

        res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
        
    }
    
}

module.exports={login};