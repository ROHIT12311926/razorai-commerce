import { useState, useEffect } from 'react';
import {  get_All_Products, searchProduct  } from '../api/products';
import ProductCard from '../components/ProductCard';
import ChatInterface from '../components/ChatInterface';

import { Link } from 'react-router-dom';

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await get_All_Products();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      fetchAllProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await searchProduct(searchTerm);
      setProducts(response.data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold text-gray-800">Our Products</h1>
  <Link to="/cart" className="text-blue-600 hover:underline">
    View Cart 🛒
  </Link>
</div>

      <div className="mb-8">
        <ChatInterface />
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading && <div className="text-center text-gray-500">Loading products...</div>}

      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-500">No products found.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductListing;