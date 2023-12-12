const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

/**
 * @name GET /api/categories
 * @description Gets all categories, each including all its associated Products
 * @memberof path:/api/categories
 * @returns {ARRAY of JSON object literals|err JSON error message} array of all categories objects including their products | error from sequelize if failed
 */
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

/**
 * @name GET /api/categories/:id
 * @description Get one category, including its associated list of products
 * @memberof path:/api/categories
 * @param {INTEGER} :id is the category id (:id is specified at the end of the URI path)
 * @returns {JSON object literal|err JSON error message} JSON object literal of the specified category and its products | error from sequelize if failed
  */
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

/**
 * @name POST /api/categories
 * @description Create a new category in the database. A new category id is created if successful.
 * @memberof path:/api/categories
 * @param {JSON} req.body JSON object literals in the POST HTTP body must contain the following key/value pairs:
 * @param {STRING} category_name The new category name (must be unique in the database)
 * @returns {JSON|err} JSON object returning the newly created category { "id": "<newid>", "category_name": <new category name>" } | err message indicating what went wrong from sequelize
 */
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

/**
 * @name PUT /api/categories/:id
 * @description Update an exsting category, based on the specified category :id
 * @memberof path:/api/categories
 * @param {INTEGER} :id is the category id specified at the end of the URI path. ie. /api/products/23
 * 
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {STRING} category_name The new updated category name (must be unique in the database)
 * @returns {JSON|err} message indicating how many successful category entries were updated | err message indicating what went wrong from sequelize. 0 updated entries mean the entry was not updated.
*/
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

/**
 * @name DELETE /api/categories/:id
 * @description Delete category entry specified by :id.
 * @memberof path:/api/categories
 * @param {INTEGER} :id is the category id specified at the end of the URI path. ie. /api/category/12
 * @returns {JSON|err} message indicating how many successful categories were deleted | err message indicating what went wrong from sequelize. 0 deleted entries means no entry was deleted.
 */
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
