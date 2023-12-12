const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint


/**
 * @name GET /api/products
 * @description Gets all products, including their associated Category and Tag data
 * @returns {ARRAY|JSON} array of JSON objects of all products | error in JSON from sequelize if failed
 */
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  let product_all;
  try {
    product_all = await Product.findAll({
      include: [{
        model: Category,
        // required: true
      },
      {
        model: Tag,
        through: {
          attributes: []
        },
        // required: true
      }]
    })
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json(product_all);
});

/**
 * @name GET /api/products/:id
 * @description Get one product, including its associated Category and Tag data
 * @param {INTEGER} :id is the product id specified at the end of the URI path
 * @returns {JSON} JSON object literal of the specified product | error in JSON from sequelize if failed
  */
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  let a_product;
  try {
    a_product = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Category,
          // required: true
        },
        {
          model: Tag,
          through: {
            attributes: []
          },
          // required: true
        }
      ]
    })
  } catch (err) {
    res.status(404).json(err);
    return;
  };

  res.status(200).json(a_product);
});

/**
 * @name POST /api/products
 * @description Create a new product in the database, including its associated Category and Tag data.
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {STRING} product_name The new product name (must be unique in the database)
 * @param {DECIMAL} price listed price of the product
 * @param {INTEGER} stock number of items left in stock
 * @param {INTEGER} category_id specifies the category identifier of the product
 * @param {ARRAY} tagIds An array of INTEGER tag IDs. ie. If a product has white (tag ID:1) and blue (tag ID: 5), it becomes: "tagId": [1,5]
 * @returns {{JSON,ARRAY}} JSON object returning the newly created product {{ "id": "<newid>", "product_name": <new category name>", ... }, ARRAY } and ARRAY JSON tag objects that was created | error in JSON indicating what went wrong from sequelize
 */
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 6,
      tagIds: [1, 2, 3, 4]
    }
  */
  let product;
  try {
    product = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id
    });
  } catch (err) {
    console.log(err); // debug logs
    res.status(400).json(err);
    return false;
  };

  // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  let productTagIdArr = [];
  let productTags;
  // check if tagIds exist first to prevent a crash
  if (req.body.hasOwnProperty('tagIds') && req.body.tagIds.length) {
    productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: product.id,
        tag_id,
      };
    });
    try {
      await ProductTag.bulkCreate(productTagIdArr);
    } catch (err) {
      console.log(err); // debug logs
      res.status(400).json(err);
      return false;
    };
  };
  // if no product tags, just respond
  res.status(200).json({ product, productTags });
});

/**
 * @name PUT /api/products/:id
 * @description Update product, including its associated Category and Tag data. Tags data is updated after.
 * @param {INTEGER} :id is the product id specified at the end of the URI path. ie. /api/products/23
 * 
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * 
 * @param {STRING} product_name The new product name (must be unique in the database)
 * @param {DECIMAL} price listed price of the product
 * @param {INTEGER} stock number of items left in stock
 * @param {INTEGER} category_id specifies the category identifier of the product
 * @param {ARRAY} tagIds An array of INTEGER tag IDs. ie. If a product has white (tag ID:1) and blue (tag ID: 5), it becomes: "tagId": [1,5]
 * @returns {JSON} "message": indicating how many successful product and tag entries were updated | err message indicating what went wrong from sequelize.
 *                     0 updated entries mean no entry was not updated. */
router.put('/:id', async (req, res) => {
  // update product data

  // console.log(req.body, req.params.id); // debug log

  let result;
  let tagresults = [0, []];

  try {
    result = await Product.update(req.body, {
      where: {
        id: req.params.id
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
    return false;
  };

  // ensure user posts 'tagIds', not null or others like 'tagIDs' to prevent a crash
  if (req.body.hasOwnProperty('tagIds')) {

    let productTags;
    try {
      productTags = await ProductTag.findAll({
        where: { product_id: req.params.id }
      });

      // create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      // run both actions
      tagresults = await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
      // console.log("Promise.all tag results: ", tagresults); // debug log
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
      return false;
    };
  };

  // successful update so far
  const resultmessage = `Updated ${result} product record(s), deleted ${tagresults[0]} tag(s), added ${tagresults[1].length} new tags`;
  res.status(200).json({ message: resultmessage, status: 200 });
  return true;
});

/**
 * @name DELETE /api/products/:id
 * @description Delete product entry specified by :id.
 * @param {INTEGER} :id is the product id specified at the end of the URI path. ie. /api/products/23
 * @returns {JSON} "message": indicating how many successful product entries were deleted | err message indicating what went wrong from sequelize.
 *                 0 deleted entries means no entry were deleted.
 */
router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value

  console.log(req.body, req.params.id);

  let product;

  try {
    result = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (result > 0) {
      res.status(200).json({ message: `Deleted ${result} record(s)`, status: 200 });
    } else {
      res.status(404).json({ message: `Deleted ${result} record(s)`, status: 404 });
    };
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  };
});

module.exports = router;
