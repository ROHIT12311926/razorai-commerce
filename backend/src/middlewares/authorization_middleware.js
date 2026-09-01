const jwt = require('jsonwebtoken');

const protect=async (req,res,next) => {

    try {

        const auth_header=req.headers.authorization;

        if(!auth_header || !auth_header.startsWith('Bearer ')){

           return res.status(402).json({

                success:false,
                message:"Invalid token"
            })
        }

        const token=auth_header.split(' ')[1];

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        req.merchantId=decoded.MerchantId;

        next();
        
    } catch (error) {

        return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
        
    }


    
}

module.exports={protect};