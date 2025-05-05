const {Router}=require("express");
const Review=require("../models/review");

const router=Router();

router.post("/add",async(req,res)=>{
  const review=await new Review(req.body).save();

  const existingReview=await Review.findOne({productId:req.body.productId});
  if(existingReview) return res.json({error:"You have already reviewed this product"});
  if(review) return res.json({message:"Review added successfully"});
});

router.get("/allReviews",async(req,res)=>{
  const review=await Review.find().populate("reviewedBy");

  if(!review) return res.json({error:"No review available"});

  return res.json({review:review});
});

module.exports=router;