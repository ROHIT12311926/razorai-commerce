import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { product_By_Id } from '../api/products';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await product_By_Id(id);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to Products
      </Link>

      <div className="mt-4 border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-gray-500 mt-2">{product.description}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {product.features.map((feature, index) => (
            <span
              key={index}
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <span className="text-3xl font-bold text-gray-900">
            ₹{product.price}
          </span>
          <span className="text-gray-500">
            Stock: {product.stock} units
          </span>
        </div>

        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;