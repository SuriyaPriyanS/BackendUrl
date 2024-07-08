import mongoose from 'mongoose';

const dashboardSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalUrlsCreated: { type: Number, required: true },
}, { timestamps: true });

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

export default Dashboard;
