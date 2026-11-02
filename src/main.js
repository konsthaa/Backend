import express from 'express';
import router from './api/index.js';
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.use(express.static('public'));
// app.use('/images', express.static('public'));

// needed for reading request body in JSON format
app.use(express.json());

// express kutsuu reitin callback-funktiota
// req sisältää pyyntöä koskevat tiedot ja res vastaustoiminnot
app.get('/kissa', (req, res) => {
  res.send('Welcome to my REST API mororo!');
});

// Ohjataan kaikki /api/v1/-alkuiset pyynnöt apin router middlewarelle (api/index.js)
app.use('/api/v1', router);

// käynnistään HTTP- palvelimen kuuntelemaan porttia
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
