const AuditLog=require('../models/AuditLog');

const getAllLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .sort({ createdAt: -1 })
      .populate('relatedProduct')
      .populate('relatedOrder');

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message,
    });
  }

}

  module.exports={getAllLogs};