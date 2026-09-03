import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { sendMessageToAgent } from '../api/agent';
import { verifyPayment } from '../api/order';
import { getSessionId } from '../utils/session';

const API_BASE_URL = 'http://localhost:5000/api';

function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm RazorAI, your shopping assistant. What are you looking for today?",
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Customer confirmation state
  const [confirmation, setConfirmation] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const messagesEndRef = useRef(null);

  const sessionId = getSessionId();
  const navigate = useNavigate();

  // =====================================================
  // SCROLL CHAT
  // =====================================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // =====================================================
  // OPEN RAZORPAY
  // =====================================================

  const openRazorpayCheckout = (paymentInfo) => {
    if (!paymentInfo?.razorpayOrderId) {
      console.error('Invalid payment information:', paymentInfo);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I could not start the payment. Please try again.',
        },
      ]);

      return;
    }

    const options = {
      key: paymentInfo.razorpayKeyId,

      amount: paymentInfo.totalAmount * 100,

      currency: paymentInfo.currency || 'INR',

      name: 'RazorAI Commerce',

      description: 'TechStore Purchase',

      order_id: paymentInfo.razorpayOrderId,

      handler: async function (response) {
        try {
          const verifyResult = await verifyPayment({
            orderId: paymentInfo.orderId,
            razorpay_payment_id:
              response.razorpay_payment_id,
            razorpay_signature:
              response.razorpay_signature,
          });

          if (verifyResult.success) {
            navigate('/order-success', {
              state: {
                orderId: paymentInfo.orderId,
              },
            });
          } else {
            navigate('/order-failed', {
              state: {
                orderId: paymentInfo.orderId,
              },
            });
          }
        } catch (err) {
          console.error(
            'Payment verification error:',
            err
          );

          navigate('/order-failed', {
            state: {
              orderId: paymentInfo.orderId,
            },
          });
        }
      },

      theme: {
        color: '#2563eb',
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.open();
  };

  // =====================================================
  // CUSTOMER CONFIRMATION API
  // =====================================================

  const confirmPurchase = async () => {
  if (!confirmation?.orderId) {
    console.error('No order ID found');
    return;
  }

  setConfirming(true);

  try {
    console.log('=== CONFIRMING PURCHASE ===');
    console.log('Order ID:', confirmation.orderId);

   const response = await fetch(
  `${API_BASE_URL}/order/${confirmation.orderId}/approve`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

const rawResponse = await response.text();

console.log('APPROVE STATUS:', response.status);
console.log('APPROVE RAW RESPONSE:', rawResponse);

let data;

try {
  data = JSON.parse(rawResponse);
} catch (error) {
  throw new Error(
    `Backend returned non-JSON response (${response.status}): ${rawResponse.slice(0, 150)}`
  );
}

if (!response.ok || !data.success) {
  throw new Error(data.message || 'Purchase confirmation failed');
}

    setConfirmation(null);

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text:
          'Purchase confirmed! Opening secure Razorpay Checkout...',
      },
    ]);

    openRazorpayCheckout({
      orderId: data.data.orderId,
      razorpayOrderId: data.data.razorpayOrderId,
      totalAmount: data.data.totalAmount,
      razorpayKeyId: data.data.razorpayKeyId,
    });

  } catch (error) {

    console.error(
      '=== CONFIRM PURCHASE ERROR ==='
    );

    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text:
          `Purchase confirmation failed: ${error.message}`,
      },
    ]);

  } finally {
    setConfirming(false);
  }
};

  // =====================================================
  // CANCEL CUSTOMER CONFIRMATION
  // =====================================================

  const cancelPurchase = () => {
    setConfirmation(null);

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text:
          'No problem. I have not proceeded with the payment.',
      },
    ]);
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    const userInput = input.trim();

    const userMessage = {
      role: 'user',
      text: userInput,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput('');
    setLoading(true);

    try {
      const response =
        await sendMessageToAgent(
          userInput,
          sessionId
        );

      console.log(
        '=== AGENT RESPONSE ==='
      );

      console.log(response);

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: response.reply,
          },
        ]);

        // =================================================
        // CUSTOMER CONFIRMATION REQUIRED
        // =================================================

        if (
          response.paymentInfo
            ?.requiresConfirmation
        ) {
          setConfirmation({
            orderId:
              response.paymentInfo.orderId,

            totalAmount:
              response.paymentInfo.totalAmount,

            transactionLimit:
              response.paymentInfo
                .transactionLimit,

            reason:
              response.paymentInfo.reason,
          });
        }

        // =================================================
        // NORMAL RAZORPAY PAYMENT
        // =================================================

        else if (
          response.paymentInfo &&
          !response.paymentInfo
            .requiresConfirmation
        ) {
          openRazorpayCheckout(
            response.paymentInfo
          );
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text:
              response.message ||
              'Sorry, I had trouble responding. Please try again.',
          },
        ]);
      }
    } catch (error) {
      console.error(
        'CHAT ERROR:',
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* ================================================
          CUSTOMER CONFIRMATION MODAL
      ================================================= */}

      {confirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="border-b border-gray-200 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-xl">
                  🛒
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Confirm Your Purchase
                  </h2>

                  <p className="text-sm text-gray-500">
                    Customer confirmation required
                  </p>
                </div>

              </div>

            </div>

            {/* Body */}

            <div className="px-6 py-6">

              <p className="text-sm leading-6 text-gray-600">
                Your cart total is
                <span className="font-bold text-gray-900">
                  {' '}₹
                  {Number(
                    confirmation.totalAmount
                  ).toLocaleString('en-IN')}
                </span>
                .
              </p>

              <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 p-4">

                <p className="text-sm font-medium text-yellow-800">
                  This purchase exceeds the
                  autonomous checkout limit of
                  ₹
                  {Number(
                    confirmation.transactionLimit ||
                      2000
                  ).toLocaleString('en-IN')}
                  .
                </p>

                <p className="mt-2 text-sm text-yellow-700">
                  RazorAI needs your confirmation
                  before creating the payment order.
                </p>

              </div>

              <p className="mt-5 text-sm font-semibold text-gray-800">
                Do you want to proceed with this purchase?
              </p>

            </div>

            {/* Buttons */}

            <div className="flex gap-3 border-t border-gray-200 px-6 py-5">

              <button
                type="button"
                onClick={cancelPurchase}
                disabled={confirming}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmPurchase}
                disabled={confirming}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {confirming
                  ? 'Confirming...'
                  : 'Confirm Purchase'}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================================================
          CHAT WINDOW
      ================================================= */}

      {isOpen && (
        <div className="mb-3 flex h-[500px] w-80 flex-col rounded-xl border border-gray-200 bg-white shadow-2xl sm:w-96">

          {/* Header */}

          <div className="flex items-center justify-between rounded-t-xl bg-blue-600 px-4 py-3 text-white">

            <h2 className="font-semibold">
              Chat with RazorAI
            </h2>

            <button
              onClick={() => setIsOpen(false)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-white hover:bg-blue-700"
            >
              ✕
            </button>

          </div>

          {/* Messages */}

          <div className="flex-1 space-y-3 overflow-y-auto p-4">

            {messages.map(
              (msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'rounded-br-none bg-blue-600 text-white'
                        : 'rounded-bl-none bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>

                </div>
              )
            )}

            {loading && (
              <div className="flex justify-start">

                <div className="rounded-2xl rounded-bl-none bg-gray-100 px-4 py-2 text-gray-500">
                  Typing...
                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Input */}

          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t border-gray-200 p-3"
          >

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask about products..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={
                loading ||
                !input.trim()
              }
              className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:bg-gray-300"
            >
              Send
            </button>

          </form>

        </div>
      )}

      {/* ================================================
          CHAT BUTTON
      ================================================= */}

      <button
        onClick={() =>
          setIsOpen(!isOpen)
        }
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg transition-transform hover:scale-110 hover:bg-blue-700"
      >
        {isOpen ? '✕' : '💬'}
      </button>

    </div>
  );
}

export default ChatInterface;