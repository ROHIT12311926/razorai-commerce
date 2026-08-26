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

const searchProduct=async (req,res) => {

    try {

        const {keyword}=req.query;

        if(!keyword){

            req.status(402).json({

                success:false,
                message:"cant search"
            })
        }

        const products=await Product.find({

            $or:[

                {name:{ $regex:keyword, $options:'i'}},
                {description:{$regex:keyword,$options:'i'}},
                { category: { $regex: keyword, $options: 'i' } }
            ]
        });

         res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
        
        
    } catch (error) {

        res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message})
        
    }
    
}

module.exports={get_All_Products,product_By_Id,searchProduct};