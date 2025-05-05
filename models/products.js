const {Schema,model}=require("mongoose");

const productSchema=new Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:"Users"
  },
  productImage:{
    type:String,
    required:true
  },
  accountNumber:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true,
  },
  category:{
    type:String,
    required:true
  },
  isFeatured:{
    type:Boolean,
    default:true
  },
  Cart:{
    type:String,
    enum:["Yes","No"],
    default:"No"
  },
  features:{
    type:String,
  },
  useCase:{
    type:String,
    
  },
  targetedAudience:{
    type:String,
    required:true,
  },
  brand:{
    type:String,
  },
  priceRange:{
    type:String,
    required:true,
  },
  currencyType:{
    type:String,
    default:"PKR"
  },
  contactNo:{
    type:String,
    required:true,
  }
},{timestamps:true})

const Product=new model("Products",productSchema);

module.exports=Product
