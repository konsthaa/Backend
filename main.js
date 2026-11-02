import express from 'express';
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

// Käynnistää HTTP-palvelimen kuuntelemaan porttia
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Siirretty tänne, jotta taulukko on kaikkien reittien käytettävissä
const cats = [
  {
    cat_id: 1,
    name: 'Misu',
    age: 2,
    birthdate: '2021-01-01',
    breed: 'Siamese',
    weight: 4.5,
    color: 'gray',
    gender: 'Male',
    vaccinated: true,
    neutered: true,
    microchipped: true,
    owner: 'Jack Stirling',
    image: 'https://placecats.com/300/200',
  },
  {
    cat_id: 2,
    name: 'Pörrö',
    age: 3,
    birthdate: '2020-05-15',
    breed: 'Persian',
    weight: 5.2,
    color: 'white',
    gender: 'Female',
    vaccinated: true,
    neutered: false,
    microchipped: false,
    owner: 'Emily Johnson',
    image: 'https://placecats.com/300/200',
  },
  {
    cat_id: 3,
    name: 'Söpö',
    age: 1,
    birthdate: '2022-09-10',
    breed: 'Maine Coon',
    weight: 6.8,
    color: 'brown tabby',
    gender: 'Male',
    vaccinated: false,
    neutered: false,
    microchipped: true,
    owner: 'Michael Smith',
    image: 'https://placecats.com/300/200',
  },
];

app.use(express.static('public'));

// needed for reading request body in JSON format
app.use(express.json());

app.get('/kisu', (req, res) => {
  res.send('Welcome to my REST API!!!!');
});

// Reitti kaikkien kissojen hakemiseen
app.get('/api/v1/cats', (req, res) => {
  res.json(cats);
});

// GET http://localhost:3000/api/v1/cats/:id
// Etsii ja palauttaa tietyn kissan ID:n perusteella
app.get('/api/v1/cats/:id', (req, res) => {
  console.log('path variables', req.params);

  // Muutetaan reitin parametri (merkkijono) numeroksi vertailua varten
  const catId = Number(req.params.id);
  console.log(catId);

  const cat = cats.find((cat) => cat.cat_id === catId);

  // jos kissaa ei löydy, palautetaan 404
  if (!cat) {
    return res.status(404).json({message: 'Kissaa ei löytynyt'});
  }

  //jos kissa löytyy, palautetaan sen tiedot.
  res.json(cat);
});

app.post('/api/v1/cats', (req, res) => {
  console.log('request', req.body);
  res.sendStatus(201); // Created
});

// 2. tehtävä pitäisi olla tehtynä seuraavalle tunnille.


