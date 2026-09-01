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

module.exports = { getDashboardSummary };
