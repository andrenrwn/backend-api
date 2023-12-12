const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // including its associated Products
  let categories_all;
  try {
    categories_all = await Category.findAll({
      include: [{
        model: Product,
        // required: true
      }]
    })
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json(categories_all);
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // including its associated Products
  let category;
  try {
    category = await Category.findOne({
      include: [{
        model: Product,
        // required: true
      }]
    })
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json(category);
});

router.post('/', async (req, res) => {
  // create a new category
  // { "category_name": "<A new category name>" }

  // check to see if user posted a category_name
  if (!req.body.hasOwnProperty('category_name')) {
    res.status(400).json({ message: 'Please provide a "category_name"' });
    return false;
  };

  let newcategory;
  try {
    newcategory = await Category.create(req.body);
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json(newcategory);
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  let updatedcategory;
  try {
    updatedcategory = await Category.update(
      req.body,
      {
        where: {
          id: req.params.id
        },
      }
    );
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json({ message: `Updated ${updatedcategory} record(s)` });
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  let deletedone;
  try {
    deletedone = await Category.destroy({
      where: {
        id: req.params.id,
      }
    });
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json({ message: `Deleted ${deletedone} record(s)` });
});

module.exports = router;
