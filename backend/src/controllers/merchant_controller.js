const Merchant = require('../models/Merchant');

const getMerchantSettings = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.merchantId).select('-password');

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found',
      });
    }

    res.status(200).json({
      success: true,
      data: merchant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message,
    });
  }
};

const updateMerchantSettings = async (req, res) => {
  try {
    const { transaction_limit, max_Discount_percent } = req.body;

    const merchant = await Merchant.findById(req.merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found',
      });
    }

    if (transaction_limit !== undefined) {
      merchant.transaction_limit = transaction_limit;
    }

    if (max_Discount_percent !== undefined) {
      merchant.max_Discount_percent = max_Discount_percent;
    }

    await merchant.save();

     res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: merchant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message,
    });
  }
};


module.exports = { getMerchantSettings, updateMerchantSettings };