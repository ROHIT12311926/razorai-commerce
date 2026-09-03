const FREE_DELIVERY_THRESHOLD = 1500;
const AUTONOMOUS_LIMIT = 2000;

const checkCartThresholds = (cartTotal) => {
  const result = {
    cartTotal,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    autonomousLimit: AUTONOMOUS_LIMIT,
    freeDeliveryUnlocked: cartTotal >= FREE_DELIVERY_THRESHOLD,
    autonomousCheckoutAllowed: cartTotal <= AUTONOMOUS_LIMIT,
    freeDeliveryRemaining: 0,
    autonomousLimitRemaining: 0,
    nudge: null,
  };

  // Free delivery abhi unlock nahi hui
  if (cartTotal < FREE_DELIVERY_THRESHOLD) {
    result.freeDeliveryRemaining =
      FREE_DELIVERY_THRESHOLD - cartTotal;

    result.nudge =
      `Add ₹${result.freeDeliveryRemaining} more to unlock Free Delivery while staying within your ₹${AUTONOMOUS_LIMIT} instant checkout limit!`;

    return result;
  }

  // Free delivery mil gayi, lekin autonomous limit ke andar hain
  if (cartTotal < AUTONOMOUS_LIMIT) {
    result.autonomousLimitRemaining =
      AUTONOMOUS_LIMIT - cartTotal;

    result.nudge =
      `Free Delivery is unlocked! You can still add up to ₹${result.autonomousLimitRemaining} while staying within your ₹${AUTONOMOUS_LIMIT} instant checkout limit.`;

    return result;
  }

  // Exactly ₹2000
  if (cartTotal === AUTONOMOUS_LIMIT) {
    result.nudge =
      `You've reached the ₹${AUTONOMOUS_LIMIT} autonomous checkout limit. Your order can proceed without human approval.`;

    return result;
  }

  // ₹2000 se upar
  result.autonomousCheckoutAllowed = false;

  result.nudge =
    `Your cart exceeds the ₹${AUTONOMOUS_LIMIT} autonomous checkout limit. Human approval will be required before payment can proceed.`;

  return result;
};

module.exports = {
  checkCartThresholds,
  FREE_DELIVERY_THRESHOLD,
  AUTONOMOUS_LIMIT,
};