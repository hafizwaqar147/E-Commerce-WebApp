const mongoose = require('mongoose');
const Product = mongoose.model('Product', { name: String, price: Number, img: String });
mongoose.connect('mongodb://localhost:27017/shop').then(async () => {
  await Product.deleteMany();
  await Product.insertMany([
    { name: 'Neural Links v2', price: 299, img: 'https://images.unsplash.com/photo-1546435770-a3e426ca472b' },
    { name: 'Quantum Watch', price: 899, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' },
    { name: 'Glass Hub', price: 150, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f' }
  ]);
  process.exit();
});
