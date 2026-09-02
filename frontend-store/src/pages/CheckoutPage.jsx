import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateCheckout, approveOrder, verifyPayment } from '../api/order';
import { getSessionId } from '../utils/session';

function CheckoutPage() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const sessionId = getSessionId();
  const navigate = useNavigate();

  useEffect(() => {
    startCheckout();
  }, []);

  const startCheckout = async () => {
    try {
      setLoading(true);
      const response = await initiateCheckout(sessionId);

      if (!response.success) {
        setError(response.message || 'Checkout failed');
        return;
      }

      setCheckoutData(response.data);
    } catch (err) {
      setError('Something went wrong during checkout.');
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayCheckout = (razorpayOrderId, keyId, amount, orderId) => {
    const options = {
      key: keyId,
      amount: amount * 100,
      currency: 'INR',
      name: 'RazorAI Commerce',
      description: 'TechStore Purchase',
      order_id: razorpayOrderId,
      handler: async function (response) {
        setProcessing(true);
        try {
          const verifyResult = await verifyPayment({
            orderId: orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyResult.success) {
            navigate('/order-success', { state: { orderId } });
          } else {
            navigate('/order-failed', { state: { orderId } });
          }
        } catch (err) {
          navigate('/order-failed', { state: { orderId } });
        } finally {
          setProcessing(false);
        }
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
        },
      },
      theme: {
        color: '#2563eb',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleApprove = async () => {
    try {
      setProcessing(true);
      const response = await approveOrder(checkoutData.orderId);

      if (response.success) {
        openRazorpayCheckout(
          response.data.razorpayOrderId,
          response.data.razorpayKeyId,
          response.data.totalAmount,
          response.data.orderId
        );
      } else {
        setError('Approval failed');
      }
    } catch (err) {
      setError('Something went wrong during approval.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayNow = () => {
    openRazorpayCheckout(
      checkoutData.razorpayOrderId,
      checkoutData.razorpayKeyId,
      checkoutData.totalAmount,
      checkoutData.orderId
    );
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Preparing checkout...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Checkout Summary</h1>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">₹{checkoutData.totalAmount}</span>
        </div>

        {checkoutData.requiresApproval ? (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3 mb-4">
              ⚠️ {checkoutData.reason}
            </div>
            <button
              onClick={handleApprove}
              disabled={processing}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 disabled:bg-gray-300"
            >
              {processing ? 'Processing...' : 'Approve Payment'}
            </button>
          </div>
        ) : (
          <button
            onClick={handlePayNow}
            disabled={processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;