var express = require('express');
var router = express.Router();
const Product = require('../model/product');
const Products = require('../controller/product');
const upload = require('../services/upload');

/* GET all products */
//localhost:3000/products
// router.get('/', async function(req, res, next) {
//     try {
//         const products = await Product.find();
//         res.json({
            
//             data: products
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi khi lấy danh sách sản phẩm',
//             error: error.message
//         });
//     }
// });

// /* POST - Thêm sản phẩm mới */
// //localhost:3000/products
// router.post('/', async function(req, res, next) {
//     try {
//         const product = new Product(req.body);
//         await product.save();
//         res.status(201).json({
//             success: true,
//             message: 'Thêm sản phẩm thành công',
//             data: product
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: 'Lỗi khi thêm sản phẩm',
//             error: error.message
//         });
//     }
// });

// /* POST - Seed nhiều sản phẩm cùng lúc */
// //localhost:3000/products/seed
// router.post('/seed', async function(req, res, next) {
//     try {
//         const products = req.body; // Mảng sản phẩm
//         const result = await Product.insertMany(products);
//         res.status(201).json({
//             success: true,
//             message: `Đã thêm ${result.length} sản phẩm thành công`,
//             data: result
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: 'Lỗi khi thêm sản phẩm',
//             error: error.message
//         });
//     }
// });

// /* GET product by ID */
// //localhost:3000/products/:id
// router.get('/:id', async function(req, res, next) {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Không tìm thấy sản phẩm'
//             });
//         }
//         res.json({
//             success: true,
//             data: product
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi khi lấy thông tin sản phẩm',
//             error: error.message
//         });
//     }
// });
// POST: Seed nhiều sản phẩm cùng lúc (phải đặt trước /:id)
router.post('/seed', Products.seedProducts);

// GET: Lấy tất cả sản phẩm
router.get('/', Products.getAllProducts);

// GET: Lấy sản phẩm theo ID
router.get('/:id', Products.getProductById);

// POST: Tạo sản phẩm mới (với upload ảnh)
router.post('/', upload.single('image'), Products.createProduct);

// PUT: Cập nhật sản phẩm theo ID (với upload ảnh)
router.put('/:id', upload.single('image'), Products.updateProduct);

// DELETE: Xóa sản phẩm theo ID
router.delete('/:id', Products.deleteProduct);

module.exports = router;
