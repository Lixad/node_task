const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/products');

const router = express.Router();

router.get('/', getProducts);
router.get('/:productID', getProduct);
router.post('/', createProduct);
router.put('/:productID', updateProduct);
router.delete('/:productID', deleteProduct);

module.exports = router;
