import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, removeFromCart } from '../api/cart';
import { getSessionId } from '../utils/session';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = getSessionId();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart(sessionId);
      setCart(response.data);
    } catch (err) {
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(sessionId, productId);
      fetchCart();
    } catch (err) {
      setError('Failed to remove item.');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.item) return 0;
    return cart.item.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  const isEmpty = !cart || !cart.item || cart.item.length === 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-6">Your Cart</h1>

      {isEmpty ? (
        <div className="text-center text-gray-500 py-10">
          Your cart is empty. Start chatting with RazorAI to find products!
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.item.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border border-gray-200 rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.product?.name || 'Product'}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.priceAtAdd} × {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.product?._id || item.product)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-gray-900">₹{calculateTotal()}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default CartPage;