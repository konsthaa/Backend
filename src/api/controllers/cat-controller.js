import {cats} from '../models/cat-model.js';

const getAllCats = (req, res) => {
  //const cats = [{cat_id: 1, name: 'Misu'}];
  res.json(cats);
}

const getCatById = (req, res) => {
  //console.log(req);
  // PALAUTTAKAA VAIN YKSI KISSA req.params.id haulla
  // 1. Haetaan ID URL-parametrista ja muunnetaan numeroksi
  const id = Number(req.params.id);
  console.log(id);
  // 2. Etsitään kissa taulukosta
  // find palauttaa ensimmäisen löytyneen olion tai undefined
  const cat = cats.find((cat) => cat.cat_id === id);
  // 3. Jos kissaa ei löydy, palautetaan 404
  if (!cat) {
    return res.status(404).json({message: 'Kissaa ei löytynyt'});
  }
  // 4. Jos kissa löytyy, palautetaan sen tiedot
  res.json(cat);
};

const postCat = (req, res) => {
  console.log('request', req.body);
  res.sendStatus(201);
};

export {getAllCats, getCatById, postCat};
