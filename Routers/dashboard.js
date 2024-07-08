import express from 'express';
import { createDashboardEntry, getUrlCounts } from '../Controllers/dashboardControllers.js';

const router = express.Router();

//router.post('/shorten', shortenUrl);
router.get('/counts',getUrlCounts );
router.post('/dashboard',createDashboardEntry);

export default router;
