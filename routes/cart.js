const {Router}  = require('express');
const Cart = require('../models/cart');
const router = Router();

router.post("/addToCart",async(req,res)=>{
  const product=await new Cart({
    productId:req.body.productId,
    cartBy:req.body.userId
  });
  await product.save();
  return res.json({message:"Product added to cart successfully"});
});

router.get("/getCart/:id",async(req,res)=>{
  const cart=await Cart.find({cartBy:req.params.id}).populate("productId");
  return res.json(cart);
});

router.delete("/deleteFromCart/:id",async(req,res)=>{
  await Cart.findByIdAndDelete(req.params.id);
  return res.json({message:"Product removed from cart successfully"});
});

router.delete("/emptycart/:id",async(req,res)=>{
  await Cart.deleteMany({cartBy:req.params.id});
  return res.json({success:"Cart emptied"});
});

router.get("/all",async(req,res)=>{
  const cart=await Cart.find().populate("productId").populate("Users");
  return res.json({cart:cart});
})

module.exports = router;