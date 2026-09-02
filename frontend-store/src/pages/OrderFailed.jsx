import { useLocation, Link } from 'react-router-dom';

function OrderFailed() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="max-w-md mx-auto p-6 mt-16 text-center">
      <div className="text-6xl mb-4">❌</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Couldn't Be Completed</h1>
      <p className="text-gray-500 mb-6">
        Your cart has been preserved and no order was created. You can retry the payment anytime.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          to="/cart"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Retry Payment
        </Link>
        <Link
          to="/"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderFailed;