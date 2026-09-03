const Merchant =  require('../models/Merchant');

const {logEvent} = require('../services/audit_service');
const checkTransactionLimit=async (totalAmount,sessionId) => {

    const merchant=await Merchant.findOne({});

    if (!merchant) {
    throw new Error('Merchant not found');
  }

  const requiresApproval = totalAmount > merchant.transaction_limit;

  const reason=requiresApproval? `Amount ₹${totalAmount} exceeds autonomous limit of ₹${merchant.transaction_limit}`
    : `Amount ₹${totalAmount} is within autonomous limit of ₹${merchant.transaction_limit}`;


  await logEvent({
  action: 'limit_check',
  actor: 'system',
  amount: totalAmount,
  reason: reason,

  reasoningTrace: requiresApproval
    ? `Transaction amount ₹${totalAmount} exceeds the autonomous limit of ₹${merchant.transaction_limit}. Human approval is required.`
    : `Transaction amount ₹${totalAmount} is within the autonomous limit of ₹${merchant.transaction_limit}. Autonomous payment is allowed.`,

  decisionType: requiresApproval
    ? 'ESCALATED_HUMAN_APPROVAL'
    : 'AUTONOMOUS_APPROVED',

  sessionId: sessionId,
  approvalStatus: requiresApproval ? 'pending' : 'not_required',
  result: 'success',
});

  return {
    requiresApproval,
    transactionLimit: merchant.transaction_limit,
    totalAmount: totalAmount,
    reason: reason
  };
    
}

module.exports={checkTransactionLimit};