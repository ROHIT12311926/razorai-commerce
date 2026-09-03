import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToAgent } from '../api/agent';
import { verifyPayment } from '../api/order';
import { getSessionId } from '../utils/session';

function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [approvalRequest, setApprovalRequest] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hey! I'm RazorAI 👋\nYour personal AI shopping assistant. What are you looking for today?",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const sessionId = getSessionId();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 50);
    }
  }, [messages, loading, isOpen, approvalRequest]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const openRazorpayCheckout = (paymentInfo) => {
    if (!window.Razorpay) {
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: 'Payment system is not loaded. Please refresh the page and try again.',
        },
      ]);
      return;
    }

    if (
      !paymentInfo?.razorpayOrderId ||
      !paymentInfo?.razorpayKeyId
    ) {
      return;
    }

    const options = {
      key: paymentInfo.razorpayKeyId,
      amount: Number(paymentInfo.totalAmount) * 100,
      currency: 'INR',
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
        } catch (error) {
          console.error('Payment verification error:', error);

          navigate('/order-failed', {
            state: {
              orderId: paymentInfo.orderId,
            },
          });
        }
      },

      modal: {
        ondismiss: function () {
          setMessages((previous) => [
            ...previous,
            {
              role: 'assistant',
              text: 'Payment window closed. Your order is still available if you want to try again.',
            },
          ]);
        },
      },

      theme: {
        color: '#2563eb',
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };

  const processAgentMessage = async (message) => {
    if (!message || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: 'user',
        text: message,
      },
    ]);

    setLoading(true);

    try {
      const response = await sendMessageToAgent(
        message,
        sessionId
      );

      if (!response.success) {
        setMessages((previous) => [
          ...previous,
          {
            role: 'assistant',
            text:
              response.message ||
              'Sorry, I could not process that request. Please try again.',
          },
        ]);

        return;
      }

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text:
            response.reply ||
            'Done! How else can I help you?',
        },
      ]);

      const paymentInfo = response.paymentInfo;

      if (
        paymentInfo?.requiresConfirmation === true
      ) {
        setApprovalRequest(paymentInfo);
        return;
      }

      if (
        paymentInfo &&
        paymentInfo.requiresConfirmation !== true &&
        paymentInfo.razorpayOrderId &&
        paymentInfo.razorpayKeyId
      ) {
        openRazorpayCheckout(paymentInfo);
      }
    } catch (error) {
      console.error('AI Agent Error:', error);

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (event) => {
    event?.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setInput('');

    await processAgentMessage(message);
  };

  const handleConfirmOrder = async () => {
    if (loading || !approvalRequest) {
      return;
    }

    setApprovalRequest(null);

    await processAgentMessage(
      'Yes, I confirm this order. Please proceed with the purchase.'
    );
  };

  const handleCancelOrder = () => {
    if (loading) {
      return;
    }

    setApprovalRequest(null);

    setMessages((previous) => [
      ...previous,
      {
        role: 'assistant',
        text: 'No problem. I have not proceeded with the payment. Your cart is still available.',
      },
    ]);
  };

  const handleSuggestion = (text) => {
    setInput(text);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const suggestions = [
    'Find a gaming keyboard',
    'Best mouse under ₹1500',
    'Show me headphones',
  ];

  const renderMessage = (text) => {
    if (!text) {
      return null;
    }

    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (
        part.startsWith('**') &&
        part.endsWith('**')
      ) {
        return (
          <strong key={index}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className="mb-4 flex h-[620px] max-h-[calc(100vh-110px)] w-[calc(100vw-32px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)] sm:w-[430px]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-5 py-5 text-white">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />

            <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-xl shadow-lg backdrop-blur-md">
                  ✦
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold tracking-tight">
                      RazorAI
                    </h2>

                    <span className="rounded-full bg-blue-400/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-blue-100">
                      AI
                    </span>
                  </div>

                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-blue-100/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    Online & ready to help
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-y-auto bg-slate-50 px-4 py-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm text-white shadow-sm">
                    ✦
                  </div>
                )}

                <div
                  className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.role === 'user'
                      ? 'rounded-2xl rounded-br-md bg-blue-600 text-white'
                      : 'rounded-2xl rounded-bl-md border border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {renderMessage(message.text)}
                  </div>

                  <div
                    className={`mt-1.5 text-[9px] ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-slate-400'
                    }`}
                  >
                    {message.role === 'assistant'
                      ? 'RazorAI'
                      : 'You'}
                  </div>
                </div>
              </div>
            ))}

            {messages.length === 1 && !loading && (
              <div className="mt-5">
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Try asking
                </p>

                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() =>
                        handleSuggestion(suggestion)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="mb-4 flex justify-start">
                <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm text-white">
                  ✦
                </div>

                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />

                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />

                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Ask RazorAI anything..."
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !input.trim()
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                ↑
              </button>
            </form>

            <div className="mt-2 text-center text-[9px] text-slate-400">
              Powered by RazorAI • Secure AI commerce
            </div>
          </div>
        </div>
      )}

      {approvalRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.3)]">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                🛡️
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Confirmation required
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                This purchase is above RazorAI's autonomous checkout limit. Your confirmation is required before payment can proceed.
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Order total
                  </span>

                  <span className="text-2xl font-bold text-slate-900">
                    ₹
                    {Number(
                      approvalRequest.totalAmount || 0
                    ).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xs text-slate-500">
                    Autonomous limit
                  </span>

                  <span className="text-xs font-semibold text-slate-700">
                    ₹
                    {Number(
                      approvalRequest.transactionLimit ||
                        2000
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                By confirming, you are explicitly asking RazorAI to proceed with this purchase.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? 'Processing...'
                    : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open RazorAI"
        className="group relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-2xl text-white shadow-[0_12px_35px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_18px_45px_rgba(37,99,235,0.45)]"
      >
        {!isOpen && (
          <span className="absolute inset-0 animate-ping rounded-[22px] bg-blue-400/30 opacity-30" />
        )}

        <span className="relative z-10 transition-transform duration-300 group-hover:rotate-12">
          {isOpen ? '✕' : '✦'}
        </span>
      </button>
    </div>
  );
}

export default ChatInterface;