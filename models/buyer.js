const {Schema,model}=require("mongoose");
const {createHmac,randomBytes}=require("crypto");


const UserSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  role: {
    type: String,
    enum: ["Buyer", "ADMIN","Seller"],
    default: "Buyer",
  },
  password:{
    type:String,
    required:true
  },
  salt:{
    type:String,
  },
  storeLogo:{
    type:String,
  },
  storeName:{
    type:String,
  },
  address:{
    type:String
  },
  payment:{
    type:String
  }
})

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt
  this.password = hashedPassword;

  next();
});

UserSchema.static("matchedPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) return ({error:"User not found"});

  const salt = user.salt;
  const hashedPassword = user.password;

  const checkHashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== checkHashedPassword) return ({error:"Incorrect Password"});

  return {...user};
});

const User=new model("Users",UserSchema);

module.exports=User;