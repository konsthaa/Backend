// mock data
const cats = [
  {
    cat_id: 8,
    name: 'Miukuuuuuu',
    birthdate: '2026-10-10',
    weight: 78,
    owner: 'Matti',
    image: 'https://placecats.com/310/240',
  },
  {
    cat_id: 3,
    name: 'Kisu',
    birthdate: '2023-10-08',
    weight: 6,
    owner: 'Ulla',
    image: 'https://placecats.com/320/240',
  },
  {
    cat_id: 1,
    name: 'Misu',
    birthdate: '2021-11-18',
    weight: 7,
    owner: 'Ulla',
    image: 'https://placecats.com320/240',
  },
];

const listAllCats = () => {
  return cats;
};

const findCatById = (id) => {
  // 2. Etsitään kissa taulukosta
  // find palauttaa ensimmäisen löytyneen olion tai undefined
  return cats.find((item) => item.cat_id == id);
};

const addCat = (cat) => {
  const newId = Math.max(...cats.map((item) => item.cat_id)) + 1;
  cats.unshift({...cat, cat_id: newId});
  return newId;
};

export {listAllCats, findCatById, addCat};
