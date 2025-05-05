const stripe=require("stripe");
const {Router}=require("express");
const User=require("../models/buyer");

const router=Router();
const strip=new stripe.Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-connect-account",async(req,res)=>{
  try {
    const { userId } = req.body;

    const account = await strip.accounts.create({ type: 'express' });

    await User.findOneAndUpdate(
      { userId },
      { stripeAccountId: account.id },
    );

    const accountLink = await strip.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:8080/sellerprofile',
      return_url: 'http://localhost:8080/success',
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url,stripeAccountId: account.id  });
  } catch (error) {
    console.error('Error connecting Stripe account:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/payment",async (req,res)=>{
  const {cartItems}=req.body;
  const line_items = cartItems.map(item =>  ({
    price_data: {
      currency: 'pkr',
      product_data:{name:item.productId.title,images:[item.productId.productImage]},
      unit_amount:  Math.round(item.productId.price * 100),
    },
    quantity: item.quantity || 1,
  }));

  try {
    const session = await strip.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:8080/success',
      cancel_url: 'http://localhost:8080/cancel',
    });

    res.json({ id: session.id,url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/payment/1",async (req,res)=>{
  const {productWithQuantity}=req.body;
  const  line_items ={
    price_data: {
      currency: 'pkr',
      product_data:{name:productWithQuantity.title,images:[productWithQuantity.productImage]},
      unit_amount:  Math.round(productWithQuantity.price * 100),
    },
    quantity: productWithQuantity.quantity || 1,
  };

  try {
    const session = await strip.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [line_items], 
      mode: 'payment',
      success_url: 'http://localhost:8080/success',
      cancel_url: 'http://localhost:8080/cancel',
    });

    res.json({ id: session.id,url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports=router;
