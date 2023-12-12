const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
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

// get one product
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

// create new product
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
    console.log(err);
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
      console.log(err);
      res.status(400).json(err);
      return false;
    };
  };
  // if no product tags, just respond
  res.status(200).json({ product, productTags });
});

// update product
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
