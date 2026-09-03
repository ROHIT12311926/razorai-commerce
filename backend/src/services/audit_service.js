const AuditLog=require('../models/AuditLog');

const logEvent = async ({
  action,
  actor,
  amount = null,
  reason = '',
  relatedProduct = null,
  relatedOrder = null,
  sessionId = null,
  approvalStatus = 'not_required',
  reasoningTrace = '',
decisionType = null,
  result,
}) => {
  try {
    await AuditLog.create({
      action,
      actor,
      amount,
      reason,
      relatedProduct,
      relatedOrder,
      sessionId,
      approvalStatus,
      reasoningTrace,
decisionType,
      result,
    });

}

catch (error) {
    console.log('AUDIT LOG FAILED:', error.message);
  }

}

module.exports = { logEvent };