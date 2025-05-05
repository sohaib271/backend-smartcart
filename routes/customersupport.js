const dotenv = require("dotenv");
const { Router } = require("express");
const axios = require("axios");
const Product = require("../models/products");

dotenv.config();

const router = Router();

router.post("/customersupport", async (req, res) => {
  const products = await Product.find().populate("createdBy");
  const { userMessage } = req.body;

  const productContext = `Here are some products available in the store: ${products.map(p => `${p.title} - ${p.description} (PKR ${p.price}) (Available at ${p.createdBy.storeName}) (${p.category})`).join("; ")}.`;

  try {
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-tiny",
        messages: [
          { role: "system", content: "You are a helpful assistant that suggests products based on user needs. Your only aim is to suggest products to users that are available in the database. If you don't find anything that the user is asking for, just excuse them politely. If user thanked you it means he liked your product and he/she does not want anymore suggestions. Also mention seller's store name  the product is available. If you have already suggested the user's mean product. Don't suggest any other product." },
          { role: "system", content: productContext },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

  

    res.json({ botResponse: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

module.exports = router;
