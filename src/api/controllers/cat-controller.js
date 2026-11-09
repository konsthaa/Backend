import {
  addCat,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat,
  listCatsByOwnerId,
} from '../models/cat-model.js';

const getAllCats = async (req, res) => {
  //const cats = [{cat_id: 1, name: 'Misu'}];
  console.log('Ollaan nyt controllerissa');
  // res.json(listAllCats());
  const cats = await listAllCats();

  // esimerkki siitä että middleware on muokannut req-objektia
  res.json({
    message: 'Cats reittiin lisätty aikaleima',
    time: req.requestTime,
    data: cats,
  });
};

const getCatById = async (req, res, next) => {
  //console.log(req);
  // PALAUTTAKAA VAIN YKSI KISSA req.params.id haulla
  // 1. Haetaan ID URL-parametrista ja muunnetaan numeroksi
  const id = Number(req.params.id);
  //console.log(id);
  // 2. Haetaan kissa modelilta
  const cat = await findCatById(id);
  // 3. Jos kissaa ei löydy, palautetaan 404
  if (!cat) {
    const error = new Error('Cat not found.');
    error.status = 404;
    return next(error);
  }
  // 4. Jos kissa löytyy, palautetaan sen tiedot
  res.json(cat);
};

const postCat = async (req, res, next) => {
  console.log('request', req.body);
  console.log(req.file);
  if (!req.file) {
    const error = new Error('Invalid or missing image file.');
    error.status = 400;
    return next(error);
  }
  //const id = addCat(req.body);
  //res.status(201).json({cat_id: id});
  req.body = {
    ...(req.body ?? {}),
    filename: req.file.filename,
    owner: res.locals.user.user_id,
  };
  const result = await addCat(req.body);
  if (result) {
    res.status(201).json({
      message: 'New cat added.',
      result,
      upload: {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        ...(req.file.mimetype.startsWith('image/')
          ? {thumbnailUrl: `/uploads/${req.file.filename}_thumb.png`}
          : {}),
      },
    });
  } else {
    const error = new Error('Cat could not be created.');
    error.status = 500;
    return next(error);
  }
};

const deleteCat = async (req, res, next) => {
  const result = await removeCat(Number(req.params.id), res.locals.user);
  if (result) {
    res.json({message: 'Cat removed!'});
  } else {
    const error = new Error(
      'Cat not found or you are not allowed to modify it.'
    );
    error.status = 404;
    return next(error);
  }
};

const putCat = async (req, res, next) => {
  // in real life, all input data (req.body) should be validated before using it
  const result = await modifyCat(
    req.body,
    Number(req.params.id),
    res.locals.user
  );
  if (result) {
    res.json({message: 'Cat updated!'});
  } else {
    const error = new Error(
      'Cat not found or you are not allowed to modify it.'
    );
    error.status = 404;
    return next(error);
  }
};

const getCatsByUserId = async (req, res, next) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId) || userId < 1) {
    const error = new Error('Invalid user ID.');
    error.status = 400;
    return next(error);
  }

  const cats = await listCatsByOwnerId(userId);
  res.json(cats);
};

export {getAllCats, getCatById, postCat, deleteCat, putCat, getCatsByUserId};
