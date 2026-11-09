import express from 'express';
import router from './api/index.js';
import requestTime from './middlewares/request-time.js';
import cors from 'cors';

const app = express();

app.use(express.static('public'));
// app.use('/images', express.static('public'));

// middlewaret, myös express on sellainen
// suoritetaan ennen reittejä
app.use(requestTime);
// needed for reading request body in JSON format
app.use(express.json());
// Parses URL-encoded form data (like HTML forms)
app.use(express.urlencoded({extended: true}));

//after creating app
app.use(cors());

export default app;

// Ohjataan kaikki /api/v1/-alkuiset pyynnöt apin router middlewarelle (api/index.js)
app.use('/api/v1', router);

