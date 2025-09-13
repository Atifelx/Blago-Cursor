import express from 'express';
import { scrapeUrl } from '../controller/scraper.controller.js';

const scraperRoutes = express.Router();

// POST /api/scraper/scrape
scraperRoutes.post('/scrape', scrapeUrl);

export default scraperRoutes;
