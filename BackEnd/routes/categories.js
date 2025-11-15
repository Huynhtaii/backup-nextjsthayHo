var express = require('express');
var router = express.Router();
const categories = require('../controller/categories');
const upload = require('../services/upload');

/* GET all products */
//localhost:3000/products
// router.get('/', async function(req, res, next) {
//     try {
//         const products = await Product.find();
//         res.json({
            
//             data: category
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi khi lấy danh sách sản phẩm',
//             error: error.message
//         });
//     }
// });

/* POST - Thêm sản phẩm mới */
//localhost:3000/products
// router.post('/', async function(req, res, next) 

//     try {
//         const category = new category(req.body);
//         await category.save();
//         res.status(201).json({
//             success: true,
//             message: 'Thêm danh mục thành công',
//             data: category
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: 'Lỗi khi thêm danh mục',
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
//localhost:3000/categories => post (với upload ảnh)
router.post('/', upload.single('image'), categories.createCategory);

//localhost:3000/categories/:id => get by id
router.get('/:id', categories.getCategoryById);

//put localhost:3000/categories/123 (với upload ảnh)
router.put('/:id', upload.single('image'), categories.updateCategories);

//localhost:3000/categories => get all
router.get('/' ,categories.getAllCategories);

//localhost:3000/categories/123 => delete
router.delete('/:id', categories.deleteCategory);

module.exports = router;

