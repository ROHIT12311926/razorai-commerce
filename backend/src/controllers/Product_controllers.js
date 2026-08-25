const Product = require('../models/Product');

const get_All_Products= async (req,res) => {

    try {

        const products= await Product.find({});
    res.status(200).json({

        count:products.length,
        data:products,
        success:true
    });
        
    } catch (error) {

        res.status(500).json({

            success:false,
            message:"Failed to fetch",
            error:error.message
        })
        
    }

    

    
}

const product_By_Id=async (req,res) => {

    try {

        const productbid=await Product.findById(req.params.id);

        if(!productbid){

            return res.status(404).json({

                success:false,
                message:"page not found"


            })
        }

        res.status(200).json({

            success:true,
            data:productbid,
            
        })
        
    } catch (error) {

        res.status(500).json({

            error:error.message,
            success:false,
            message:"Failed to fetch product"


        })

        
        
    }
    
}

module.exports={get_All_Products,product_By_Id}