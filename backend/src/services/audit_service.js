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
      result,
    });

}

catch (error) {
    console.log('AUDIT LOG FAILED:', error.message);
  }

}

module.exports = { logEvent };