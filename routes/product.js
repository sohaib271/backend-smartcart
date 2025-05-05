const {Router}=require("express");
const Product=require("../models/products")
const {upload}=require("./bucket/config")
const router=Router();

router.post("/form",upload.single("productImage"),async(req,res)=>{
  const {title,description,createdBy,accountNumber,price,category,features,useCase,targetedAudience,brand,priceRange,contactNo}=req.body;

  if(!req.file) return res.json({error:"Image upload failed"});
  
  const image=req.file.path;

  const product=await new Product({
    title,
    description,
    createdBy,
    accountNumber,
    price,
    category,
    productImage:image,
    features,
    useCase,
    targetedAudience,
    brand,
    priceRange,
    contactNo,
  });

  await product.save();

  if(!product) return res.json({message:"Product not uploaded"});

  return res.json({success:"Product uploaded successfully"})
})

// router.get("/:id",async(req,res)=>{
//   const product=await Product.find({createdBy:req.params.id}).populate("createdBy");

//   console.log(product)

//   return res.json({product:product})
// })

router.get("/allProducts",async(req,res)=>{
  const product=await Product.find().populate("createdBy");

  if(!product) return res.json({error:"No product available"});

  return res.json({product:product})
});

module.exports=router;