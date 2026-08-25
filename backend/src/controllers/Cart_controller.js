const Cart = require('../models/Cart');
const Product = require('../models/Product');

const get_create_cart=async (req,res) => {

    try {

    const {session_id}=req.params;

    

        let cart=await Cart.findOne({session_id:session_id,status:"active"}).populate("item.product");

    if(!cart){

       cart=await  Cart.create({

            session_id:session_id,
            item:[]
        })
    }

    res.status(200).json({

        success:true,
        data:cart
    })
        
    } catch (error) {

        res.status(500).json({

            error:error.message,
            message:"getching from cart unsuccessfull"

        })
        
    }

    
    
}

const add_item=async (req,res) => {

    try {

        
    const{product_id,quantity}=req.body;
    const {session_id}=req.params;

    let product= await Product.findById(product_id);

    let cart= await Cart.findOne({session_id:session_id});

    if(!product){

        return res.status(404).json({

            message:"Product not found",
            success:false
        })
    }

    if(product.stock<quantity){

        return res.status(403).json({

            message:`In stock quantity is only ${product.stock}`,
            success:false
        })
    }

    if(!cart){

       cart= await Cart.create({

            session_id:session_id,
            item:[],
            
        })
    }

    const existingItemIndex=cart.item.findIndex((item)=>item.product.toString()===product_id);

    if(existingItemIndex>-1){

        cart.item[existingItemIndex].quantity+=quantity;
    }

    else{

        cart.item.push({

            product:product_id,
            quantity:quantity,
            priceAtAdd:product.price
        })
    }

    await cart.save();

    const updatedCart=await Cart.findById(cart._id).populate("item.product");

    res.status(200).json({

        success:true,
        data:updatedCart
    })
        


    } catch (error) {

        res.status(500).json({

            message:"Unsuccesful",
            error:error.message
        })
        
    }

}

    const remove_item=async(req,res)=>{

        try {

            const {session_id}=req.params;
            const {product_id}=req.body;

            const cart=await Cart.findOne({session_id:session_id});

            product=await Product.findById(product_id);

            if(!cart){

                return res.status(404).json({

                    message:"Cart not found",
                    success:false
                })
            }

            cart.item=cart.item.filter((item)=>item.product.toString()!==product_id);

            await cart.save();

            const updatedCart=await Cart.findById(cart._id).populate("item.product");

            res.status(200).json({

                success:true,
                data:updatedCart
            })


            
        } catch (error) {

            res.status(500).json({

                success:false,
            message:"removing failed"
            })
            
        }

    }

    const calculate_total=async(req,res)=>{

        try{

        const {session_id}=req.params;
        


        const cart=await Cart.findOne({ session_id: session_id }).populate("item.product");


        if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    let total=0;

        cart.item.forEach((item )=> {

            total=total+item.priceAtAdd*item.quantity;
            
        });

        res.status(200).json({
      success: true,
      data: {
        sessionId: session_id,
        items: cart.item,
        totalAmount: total,
      },
    });

    }

    catch(error){

        res.status(500).json({
      success: false,
      message: "Failed to calculate total",
      error: error.message,
    });
    }

}


    

    


module.exports={get_create_cart,add_item,remove_item,calculate_total};