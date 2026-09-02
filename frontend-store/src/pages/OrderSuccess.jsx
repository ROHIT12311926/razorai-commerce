import { useLocation, Link } from 'react-router-dom';

function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="max-w-md mx-auto p-6 mt-16 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
      <p className="text-gray-500 mb-6">
        Your order has been placed successfully.
        {orderId && <span className="block text-sm mt-1">Order ID: {orderId}</span>}
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderSuccess;