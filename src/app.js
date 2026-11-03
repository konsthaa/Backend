import express from 'express';
import router from './api/index.js';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use('/api/v1', router);

export default app;
