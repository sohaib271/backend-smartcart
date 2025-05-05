const {Schema,model}=require("mongoose");

const reviewSchema=new Schema({
  productId:{
    type:Schema.Types.ObjectId,
    ref:"Product",
    required:true
  },
  reviewedBy:{
    type:Schema.Types.ObjectId,
    ref:"Users",
    required:true
  },
  rating:{
    type:Number,
    required:true
  },
  review:{
    type:String,
    required:true
  }
});

const Review=new model("Review",reviewSchema);

module.exports=Review;