const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  let tags_all;
  try {
    tags_all = await Tag.findAll({
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
