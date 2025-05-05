const {Router}=require("express")
const User=require("../models/buyer");
const {upload}=require("./bucket/config")
const router=Router();
const path=require("path");
const {setUser}=require("../service/user")
const restrictToUserOnly=require("../middlewares/user")


  router.post("/signup", upload.single("storeLogo"), async (req, res) => {
      const { name, email, password, role, storeName, address, payment } = req.body;
    
      const storeLogoUrl = req.file ? req.file.path : undefined;
      const newUser = new User({
        name,
        email,
        password,
        role,
        address:role==="Seller"?address:undefined,
        storeName: role === "Seller" ? storeName : undefined,
        storeLogo:role==="Seller"? storeLogoUrl:undefined,
        payment:role==="Seller"?payment:undefined,
      });
      const token=setUser(newUser._doc)
      await newUser.save();
      res.status(201).json({token:token, message: "Signup successful!"});
  });

  router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user=await User.matchedPassword(email,password);
    
    if(!user || !user._doc) return res.json({error:"Wrong Email or Password"});

    const token=setUser(user._doc);   
    if(!token) return res.json({error:"Invalid User"})
 
    return res.json({token:token,role:user?._doc?.role});


  });

  router.get("/jwt",restrictToUserOnly,async(req,res)=>{
    return res.json({user:req.user})
  })

  router.get("/all",async(req,res)=>{
    const user=await User.find();

    if(!user) return res.json({error:"Failed to fetch users"});

    return res.json({user:user})
  })

module.exports=router;