// niinsanottu tyhmä oma middleware
// next() siirtää käsittelyn seuraavaan sopivaan middlewareen
// tai reitin käsittelijä

// Mitä tapahtuu jos next() jää pois? Vastaus: pyyntö jää jumiin, eikä mitään tapahdu

const logger = (req, res, next) => {
  console.log('Middleware suoritettiin');
  next();
};

export default logger;
