'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/products').then(res => setProducts(res.data));
  }, []);

  const checkout = async () => {
    const res = await axios.post('http://localhost:5000/checkout', { items: cart });
    window.location.href = res.data.url;
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">Modern Shop</h1>
      <div className="grid grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p._id} className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:scale-105 transition">
            <img src={p.img} className="w-full h-48 object-cover rounded-lg" />
            <h2 className="text-xl mt-4">{p.name}</h2>
            <p className="text-blue-400">${p.price}</p>
            <button onClick={() => setCart([...cart, p])} className="mt-4 bg-blue-600 px-4 py-2 rounded">Add to Cart</button>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 bg-blue-700 p-6 rounded-2xl shadow-2xl">
          <p>{cart.length} items - ${cart.reduce((s, i) => s + i.price, 0)}</p>
          <button onClick={checkout} className="mt-2 bg-white text-blue-700 px-4 py-2 rounded font-bold">Checkout</button>
        </div>
      )}
    </div>
  );
}
