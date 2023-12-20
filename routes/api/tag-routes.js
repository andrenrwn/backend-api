const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

/**
 * @name GET /api/tags?order={ASC|DESC}
 * @description Gets all tags, each including all its associated Products
 * @param {STRING} ?order = 'ASC'|'DESC' --- based on order of the string. Default: 'DESC'
 * @returns {ARRAY|JSON} array of all JSON tag objects including their associated products | error from sequelize if failed
 */
router.get('/', async (req, res) => {
  // validate GET query parameter for ordering
  let order = 'ASC'; // default
  if (req.query.hasOwnProperty('order') && req.query.order.toUpperCase() === 'DESC') {
    order = 'DESC';
  };

  // find all tags
  // be sure to include its associated Product data
  let tags_all;
  try {
    tags_all = await Tag.findAll({
      order: [
        ['tag_name', order],
        [Product, 'product_name', order]
      ],
      include: [{
        model: Product,
        // required: true
        through: {
          attributes: []
        }
      }]
    })
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json(tags_all);
});

/**
 * @name GET /api/tags/:id
 * @description Get one tag, including its associated list of products
 * @param {INTEGER} :id is the tag id (:id is specified at the end of the URI path)
 * @returns {JSON} JSON object literal of the specified tag and its products | error from sequelize if failed
  */
router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // including its associated Product data
  let a_tag;
  try {
    a_tag = await Tag.findOne({
      where: {
        id: req.params.id,
      },
      include: [{
        model: Product,
        // required: true
      }]
    })
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json(a_tag);
});

/**
 * @name POST /api/tags
 * @description Create a new category in the database. A new category id is created if successful.
 * @param {JSON} req.body JSON object literals in the POST HTTP body must contain the following key/value pairs:
 * @param {STRING} tag_name The new tag name (must be unique in the database)
 * @returns {JSON} JSON object returning the newly created tag { "id": "<newid>", "tag_name": <new tag name>" } | err message indicating what went wrong from sequelize
 */
router.post('/', async (req, res) => {
  // create a new tag
  // { "tag_name": "<A new tag name>" }

  // check to see if user posted a tag_name
  if (!req.body.hasOwnProperty('tag_name')) {
    res.status(400).json({ message: 'Please provide a "tag_name"' });
    return false;
  };

  let newtag;
  try {
    newtag = await Tag.create(req.body);
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json(newtag);
});

/**
 * @name PUT /api/tags/:id
 * @description Update an exsting category, based on the specified category :id
 * @param {INTEGER} :id is the tag id specified at the end of the URI path. ie. /api/tags/23
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {STRING} tag_name The new updated tag name (must be unique in the database)
 * @returns {JSON} "message": indicating how many successful tag entries were updated | err message indicating what went wrong from sequelize. 0 updated entries mean the entry was not updated.
*/
router.put('/:id', async (req, res) => {
  // check to see if user provided a tag_name
  if (!req.body.hasOwnProperty('tag_name')) {
    res.status(400).json({ message: `Please provide a "tag_name" for id: ${req.params.id}` });
    return false;
  };

  // update a tag's name by its `id` value
  let updatedtag;
  try {
    console.log("try", updatedtag);
    updatedtag = await Tag.update(
      {
        tag_name: req.body.tag_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  console.log("updatedtag:", updatedtag);
  res.status(200).json({ message: `Updated ${updatedtag} tag(s)` });
});


/**
 * @name DELETE /api/tags/:id
 * @description Delete tag entry specified by :id.
 * @param {INTEGER} :id is the tag id specified at the end of the URI path. ie. /api/tags/12
 * @returns {JSON} "message": indicating how many successful tag entries were deleted | err message indicating what went wrong from sequelize. 0 deleted entries means no entry was deleted.
 */
router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  let deletedone;
  try {
    deletedone = await Tag.destroy({
      where: {
        id: req.params.id,
      }
    });
  } catch (err) {
    res.status(404).json(err);
    return;
  };
  res.status(200).json({ message: `Deleted ${deletedone} tag(s)` });
});

module.exports = router;
