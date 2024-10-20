import express from 'express';
const AIRoutes = express.Router();

import chatController from '../controller/OpenAiChat.controller.js';
import Rewrite from '../controller/Rewrite.controller.js';

AIRoutes.post('/askai', chatController);

AIRoutes.post('/Rewrite', Rewrite);


export default AIRoutes; 