import Url from '../Models/dashboardSchema.js';

export const getUrlCounts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const conditions = {};
    
    if (startDate && endDate) {
      conditions.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const urlCounts = await Url.aggregate([
      { $match: conditions },
      { $group: { 
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }  // Optional: Sort by date
    ]);

    res.status(200).json(urlCounts);
  } catch (error) {
    console.error('Error in getUrlCounts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createDashboardEntry = async (totalUrlsCreated) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Check if there's already an entry for today
    let dashboardEntry = await Dashboard.findOne({ date: startOfDay });

    if (dashboardEntry) {
      // Update existing entry
      dashboardEntry.totalUrlsCreated += totalUrlsCreated;
    } else {
      // Create new entry
      dashboardEntry = new Dashboard({
        date: startOfDay,
        totalUrlsCreated
      });
    }

    // Save/update dashboard entry
    await dashboardEntry.save();

    console.log('Dashboard entry updated successfully.');
  } catch (error) {
    console.error('Error creating dashboard entry:', error);
  }
};