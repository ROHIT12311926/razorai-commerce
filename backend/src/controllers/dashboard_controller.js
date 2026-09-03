const Order = require('../models/Order');
const AuditLog = require('../models/AuditLog');

const getDashboardSummary=async (req,res) => {

    try {

        const allOrders=await Order.find({});
        const paidOrders= allOrders.filter((order)=>order.status==='paid');

        const totalRevenue=paidOrders.reduce((sum,order)=>{

            return sum+order.total_price;
        },0)


        const totalOrdersCount = allOrders.length;
    const paidOrdersCount = paidOrders.length;
    const failedOrdersCount = allOrders.filter((order) => order.status === 'failed').length;

     const pendingApprovalCount = allOrders.filter(
      (order) => order.required_Approval && order.status === 'created'
    ).length;

    const totalAuditLogs = await AuditLog.countDocuments({});

      res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrdersCount,
        paidOrdersCount,
        failedOrdersCount,
        pendingApprovalCount,
        totalAuditLogs,
      },
    });
        
    } catch (error) {

         res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message,
    });
        
    }
    
}

const getAnalytics = async (req, res) => {
  try {
    const allOrders = await Order.find({}).sort({ createdAt: -1 });

    const totalOrders = allOrders.length;

    const paidOrders = allOrders.filter(
      (order) => order.status === 'paid'
    );

    const failedOrders = allOrders.filter(
      (order) => order.status === 'failed'
    );

    const pendingApprovals = allOrders.filter(
      (order) =>
        order.required_Approval === true &&
        order.status === 'created'
    );

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.total_price,
      0
    );

    const averageOrderValue =
      paidOrders.length > 0
        ? totalRevenue / paidOrders.length
        : 0;

    const approvalRate =
      totalOrders > 0
        ? (paidOrders.length / totalOrders) * 100
        : 0;

    const recentOrders = allOrders.slice(0, 10);

    res.status(200).json({
      success: true,

      data: {
        totalOrders,

        totalRevenue,

        paidOrders: paidOrders.length,

        failedOrders: failedOrders.length,

        pendingApprovals: pendingApprovals.length,

        approvalRate: Number(approvalRate.toFixed(1)),

        averageOrderValue: Number(
          averageOrderValue.toFixed(2)
        ),

        recentOrders,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });

  }
};

const getPendingApprovals = async (req, res) => {
  try {
    const pendingOrders = await Order.find({
      required_Approval: true,
      status: 'created',
    })
      .populate('item.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending approvals',
      error: error.message,
    });
  }
};

module.exports = { getDashboardSummary,getAnalytics,getPendingApprovals, };
