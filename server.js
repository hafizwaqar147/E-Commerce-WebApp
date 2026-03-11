require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shop');

const Product = mongoose.model('Product', { name: String, price: Number, img: String });
const User = mongoose.model('User', { email: String, pass: String });

app.post('/register', async (req, res) => {
  const pass = await bcrypt.hash(req.body.pass, 10);
  const user = await User.create({ email: req.body.email, pass });
  res.json({ token: jwt.sign({ id: user._id }, 'secret') });
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.pass, user.pass)) {
    res.json({ token: jwt.sign({ id: user._id }, 'secret') });
  } else res.status(401).send();
});

app.get('/products', async (req, res) => res.json(await Product.find()));

app.post('/checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body.items.map(i => ({
      price_data: { currency: 'usd', product_data: { name: i.name }, unit_amount: i.price * 100 },
      quantity: 1
    })),
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  });
  res.json({ url: session.url });
});

app.listen(5000, () => console.log('Server on 5000'));
