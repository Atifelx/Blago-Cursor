import express from 'express';
const AIRoutes = express.Router();

// import chatController from '../controller/OpenAiChat.controller.js';
import chatController from '../controller/OpenAiChat.controller.js';

AIRoutes.post('/askai', chatController);

export default AIRoutes; 