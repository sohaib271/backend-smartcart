const {Router}=require("express");
const Order=require("../models/order");

const router=Router();

router.post("/",async(req,res)=>{
  const order=await new Order(req.body);
  if(!order) return res.json({message:"Order Submittion Error"});
  await order.save();

  return res.json({status:"Order Placed!"})
  
})

router.get("/all",async(req,res)=>{
  const order=await Order.find().populate("productIdNumber");
  
  return res.json({order:order})
})

router.patch("/:id",async (req,res)=>{
  const id=req.params.id;
  const upd=await Order.findByIdAndUpdate(id,{orderStatus:req.body.status})


  if(!upd) return res.json({message:"Status not updated"})
  return res.json({status:"Order Status Updated"});
})

module.exports=router