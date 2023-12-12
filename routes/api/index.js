const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');

// https://expressjs.com/en/api.html#req
// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function (req, res, next) {
    console.log('%s %s %s === ROUTE LOG ===', req.method, req.url, req.path);
    next();
});

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
