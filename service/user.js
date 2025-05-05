
const jwt=require("jsonwebtoken");
const secret=process.env.JWT_SECRET;

const setUser=(user)=>{
  const payload={
    _id:user?._id,
    role:user?.role,
    name:user?.name,
    storeName:user?.storeName,
    storeLogo:user?.storeLogo,
    email:user?.email
  }
 return jwt.sign(payload,secret,{expiresIn:process.env.JWT_EXPIRES_IN});
}

const getUser=(token)=>{
  try {
    if(token) return jwt.verify(token,secret);
   
  } catch (error) {
   throw new Error("Invalid Token");
  }
}

module.exports={setUser,getUser}