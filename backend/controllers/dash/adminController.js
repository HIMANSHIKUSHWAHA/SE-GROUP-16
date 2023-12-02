const User = require('../models/User'); // Update the path as per your setup

exports.getUserMetrics = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    // Other metrics can be calculated here

    res.json({ userCount /*, other metrics*/ });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
