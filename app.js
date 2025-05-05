const express=require("express");
const cors=require("cors");
const cluster=require("node:cluster");
const os=require("os");
const totalCPUs=os.cpus().length;
const bodyParser = require("body-parser");
const BuyerRouter=require("./routes/buyer");
const mongoose=require("mongoose");
const CustomerSupport=require("./routes/customersupport");
const CartRouter=require("./routes/cart");
const ReviewRouter=require("./routes/review");
const ProductRouter=require("./routes/product")
const OrderRouter=require("./routes/order");
const Payment=require("./routes/payment")

mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Database Connected"));

if(cluster.isPrimary){
  for(let i=0;i<totalCPUs;i++){
    cluster.fork();
  }
}else{
  const app=express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,}))
app.use(bodyParser.json());

app.use("/user",BuyerRouter);
app.use("/product",ProductRouter);
app.use("/order",OrderRouter);
app.use("/",CustomerSupport);
app.use("/cart",CartRouter);
app.use("/review",ReviewRouter);
app.use("/stripe",Payment);


const Port=process.env.PORT || 8000;
app.listen(Port,()=>console.log("Server Started"));
}

