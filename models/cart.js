const {Schema,model}=require("mongoose");

const CartSchema=new Schema({
  productId:{
    type:Schema.Types.ObjectId,
    ref:"Products",
  },
  cartBy:{
    type:Schema.Types.ObjectId,
    ref:"Users",
  },
});

const Cart=new model("Cart",CartSchema);
module.exports=Cart;